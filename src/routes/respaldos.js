require('dotenv').config()
const router = require("express").Router();
const Respaldo = require("../models/respaldo");
const VENTASPORDIA = require("../models/registroventaspordia");
const { DateTime } = require("luxon");
const { google } = require("googleapis")
const stream = require("stream")
const BSON = require('bson');
const nodemailer = require("nodemailer");
const { send } = require('process');

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);
oauth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });
const service = google.drive({ version: 'v3', auth: oauth2Client });

router.get("/", async (req, res) => {
  res.render("respaldos");
});

router.post("/mandarcorreo", async (req, res) => {
  try {
    let html = `<h1>Que bonito es lo bonito</h1>
    <br>
    Ha habido cambios en la pagina http://localhost:3000/registrarventas/3-4-2023
    <br>
    <img src="cid:logo">`
    const accessToken = await oauth2Client.getAccessToken();
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        type: "OAuth2",
        user: "purificadoralaceibita@gmail.com",
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken,
      },
    });
    const mailOptions = {
      from: "Se han agregado cosas nuevas a la página <purificadoralaceibita@gmail.com>",
      to: "purificadoralaceibita@gmail.com",
      subject: "Se pudo",
      html,
      attachments: [{
        filename: "ceibitalogo.png",
        path: "./src/public/images/ceibitalogo.png",
        cid: "logo"
      }]
    }

    const result = await transporter.sendMail(mailOptions)
    if(result.accepted)
      res.send("Correo enviado")
    else 
      res.send("No se pudo mandar :(")
  } catch (e) {
    res.status(400).send(`No se pudo enviar el correo ${e}`);
  }
});

router.post("/respaldarGoogleDrive", async (req, res) => {
  try {
    var fechaiso = DateTime.fromFormat("29-01-2023", "d-M-y").toISODate();
    let ventaspordia = await VENTASPORDIA.find().where("fecha").equals(fechaiso);
    const buffer = new stream.PassThrough()
    let i = 0
    for (; i < ventaspordia.length - 1; i++) {
      buffer.write(BSON.serialize(ventaspordia[i]))
    }
    buffer.end(BSON.serialize(ventaspordia[i]))

    const folder = await service.files.create({
      requestBody: {
        name: "folderconcosasdentro2",
        mimeType: "application/vnd.google-apps.folder",
      }
    });
    console.log('Folder:', folder);


    const archivo = await service.files.create({
      media: {
        mimeType: "application/bson",
        body: buffer
      },
      requestBody: {
        name: `respaldo con fecha de hoy.bson`,
        parents: [folder.data.id]
      },
      fields: "id, name"
    })
    console.log(archivo)
    console.log(`Se subio el archivo con el nombre ${archivo.data.name} y el id ${archivo.data.id} `)

    res.send("Subido")
  } catch (e) {
    res.status(400).send(`No se pudo restaurar ${e}`);
  }
});


router.post("/restaurarregistro", async (req, res) => {
  try {
    let registrorecuperado = await Respaldo.findById(req.body.id);
    let fecha = registrorecuperado.ventaspordia.fecha;
    let registroanterior = await VENTASPORDIA.findOne({ fecha });
    let ahora = new Date();
    let ventas = new VENTASPORDIA({
      fecha, usuario: req.user?.usuario ?? "", fechacreacion: registrorecuperado.ventaspordia.fechacreacion,
      fechaultimocambio: ahora, camiones: registrorecuperado.ventaspordia.camiones
    });

    //si ya existe un registro anterior lo guarda en la parte de respaldos
    if (registroanterior) {
      const respaldo = new Respaldo();
      respaldo.ventaspordia = registroanterior;
      respaldo.fechaeliminacion = ahora;
      await respaldo.save();
      await registroanterior.remove();
    }
    await ventas.save();
    await registrorecuperado.delete();

    res.send("Se ha restaurado con éxito");
  } catch {
    res.status(400).send("No se pudo restaurar");
  }
});

router.delete("/borrarregistro", async (req, res, next) => {
  try {
    let registro = await Respaldo.findById(req.body.id);
    await registro.delete();
    res.send("Se ha borrado con éxito");
  } catch {
    res.status(400).send("No se pudo restaurar");
  }
});

router.delete("/borrarregistrosseleccionados", async (req, res) => {
  try {
    let registros = req.body.registros;
    console.log(registros)
    registros.forEach(async el => {
      let registro = await Respaldo.findById(el);
      await registro.delete();
    });
    res.send("Se ha borrado con éxito");
  } catch {
    res.status(400).send("No se pudo restaurar");
  }
});

router.get("/:buscarpor&entre&:fecha1&y&:fecha2&:pag", async (req, res) => {
  try {
    let { buscarpor, fecha1, fecha2, pag } = req.params;
    if (buscarpor != "fecha" && buscarpor != "fechaeliminacion")
      res.send("búsqueda inválida");
    else if ((/^pag[0-9]+$/.test(pag)))
      res.send("página inválida");
    else {
      var fechaiso1 = DateTime.fromFormat(fecha1, "d-M-y").toISODate();
      var fechaiso2 = DateTime.fromFormat(fecha2, "d-M-y").toISODate();
      if (buscarpor === "fecha") {
        buscarpor = "ventaspordia.fecha";
        resultado = await Respaldo.where(buscarpor).gte(fechaiso1).lte(fechaiso2).sort(buscarpor);
      }
      else
        resultado = await Respaldo.where(buscarpor).gte(fechaiso1).lte(fechaiso2.endOf("day")).sort(buscarpor);

      console.log(resultado)
      mostrarPagina(resultado, req, res);
    }
  } catch (error) {
    res.send("búsqueda inválida");
  }
});


router.get("/:buscarpor&:rango&:fecha&:pag", async (req, res) => {
  try {
    let { buscarpor, rango, fecha, pag } = req.params;
    if (buscarpor != "fecha" && buscarpor != "fechaeliminacion")
      res.send("búsqueda inválida");
    else if (rango != "igual" && rango != "mayor" && rango != "menor")
      res.send("rango inválido");
    else if ((/^pag[0-9]+$/.test(pag)))
      res.send("página inválida");
    else {
      let resultado;
      if (buscarpor === "fecha") {
        var fechaiso = DateTime.fromFormat(fecha, "d-M-y").toISODate();
        buscarpor = "ventaspordia.fecha";
        if (rango === "igual")
          resultado = await Respaldo.where(buscarpor).equals(fechaiso).sort(buscarpor);
        else if (rango === "menor")
          resultado = await Respaldo.where(buscarpor).lte(fechaiso).sort(buscarpor);
        else
          resultado = await Respaldo.where(buscarpor).gte(fechaiso).sort(buscarpor);

      } else {
        var fechaiso = DateTime.fromFormat(fecha, "d-M-y", { zone: "America/Guatemala" });
        if (rango === "igual")
          resultado = await Respaldo.where(buscarpor).gte(fechaiso).lte(fechaiso.endOf("day")).sort(buscarpor);
        else if (rango === "menor")
          resultado = await Respaldo.where(buscarpor).lte(fechaiso.endOf("day")).sort(buscarpor);
        else resultado = await Respaldo.where(buscarpor).gte(fechaiso).sort(buscarpor);
      }
      mostrarPagina(resultado, req, res);
    }
  } catch (error) {
    res.send("búsqueda inválida");
  }
});

function mostrarPagina(resultado, req, res) {
  let limite = 10;
  let pagina = parseInt(req.params.pag.split('pag=')[1]);
  let totalPaginas = Math.ceil(resultado.length / limite);
  if (totalPaginas === 0)
    res.send("no hay ningún registro");
  else if (pagina > totalPaginas || pagina < 1)
    res.send("numero de búsqueda inválido");
  else {
    datostablas = [];
    for (var i = (pagina - 1) * limite; i < pagina * limite; i++) {
      if (resultado[i])
        datostablas.push(resultado[i]);
      else
        break;
    }
  }
  res.render("vistarespaldos", { datostablas, pagina, totalPaginas, DateTime });
}

module.exports = router;

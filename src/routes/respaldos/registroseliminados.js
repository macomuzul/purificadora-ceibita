require('dotenv').config()
const router = require("express").Router();
const RegistrosEliminados = require("../../models/registroseliminados");
const RegistroVentas = require("../../models/registroventas");
const { DateTime } = require("luxon");
let vencerEn = 900 //quince minutos

//TODO hacer esto de los reroutes 
router.get("/", async (req, res) => {
  res.render("registroseliminados");
});


//TODO este tal vez se pueda mezclar con el de registrarventas
router.post("/restaurarregistro", async (req, res) => {
  try {
    let { id, fecha, sobreescribir } = req.body;
    let registrorecuperado = await RegistrosEliminados.findById(id);
    if (registrorecuperado == null)
      return res.status(400).send("Registro no existe");

    let registroanterior = await RegistroVentas.findById(fecha) //si ya existe un registro anterior lo guarda en la parte de respaldos
    let { tablas } = registrorecuperado.registro
    let ahora = new Date()
    let usuario = req.user?.usuario ?? "usuariodesconocido"
    let nuevosDatos = { usuario, ultimocambio: ahora, tablas }
    if (registroanterior) {
      if (!sobreescribir)
        return res.send(registroanterior);

      await new RegistrosEliminados({ registro: registroanterior, borradoEl: ahora, usuario, motivo: 2 }).save()
      Object.assign(registroanterior, nuevosDatos)
      await registroanterior.save()
    } else {
      await new RegistroVentas({ _id: fecha, ...nuevosDatos }).save();
    }
    await registrorecuperado.deleteOne();
    res.send("Se ha restaurado con éxito");
  } catch (e) {
    console.log(e)
    res.status(400).send("No se pudo restaurar");
  }
});

router.delete("/borrarregistros", async (req, res) => {
  try {
    let { registros } = req.body;
    let contador = 0;
    await Promise.all(registros.map(async el => {
      let borrado = await RegistrosEliminados.findByIdAndDelete(el)
      if (!borrado)
        contador++
    }));
    if (contador !== 0)
      res.status(400).send("Error");
    else
      res.send("Se ha borrado con éxito");
  } catch {
    res.status(400).send("No se pudo eliminar uno o más de los registros");
  }
});

router.get("/masrecientes&:pag", validarPagina, async (req, res) => {
  await masRecientesYMasAntiguos(req, res, 1);
});

router.get("/masantiguos&:pag", validarPagina, async (req, res) => {
  await masRecientesYMasAntiguos(req, res, 2);
});

function validarPagina(req, res, next) {
  let { pag } = req.params;
  if (!(/^pag=[0-9]+$/.test(pag)))
    return res.send("página inválida");
  return next();
}

async function devuelveRegistroRedis(url) {
  let resultado = await redis.get(devuelveURL(url));
  return resultado;
}
async function guardarRegistroRedis(url, resultado) {
  await redis.setEx(devuelveURL(url), vencerEn, JSON.stringify(resultado))
}
let devuelveURL = url => `registroseliminados:${url.split("pag")[0]}`;

async function masRecientesYMasAntiguos(req, res, opcion) {
  try {
    let resultado = await devuelveRegistroRedis(req.url);
    if (!resultado) {
      resultado = await RegistrosEliminados.find()
      if (opcion === 1)
        resultado.reverse();
      await guardarRegistroRedis(req.url, resultado);
    }
    else
      resultado = JSON.parse(resultado).map(el => new RegistrosEliminados(el));
    mostrarPagina(resultado, req, res);
  } catch (error) {
    res.send("búsqueda inválida");
    console.log(error)
  }
}

router.get("/:buscarpor&:rango&:fechaP&:pag", validarPagina, async (req, res) => {
  try {
    let resultado = await devuelveRegistroRedis(req.url);
    if (!resultado) {
      let { buscarpor, rango, fechaP } = req.params;
      let [fecha, fecha2] = fechaP.split("y")
      if (!["fecha", "fechaeliminacion"].includes(buscarpor))
        return res.send("búsqueda inválida");
      if (!["igual", "mayor", "menor", "entre"].includes(rango))
        return res.send("rango inválido");
      if (buscarpor === "fecha") {
        let fechaiso = fecha.aFechaUTC()
        buscarpor = "registro._id"
        if (rango === "igual")
          resultado = await RegistrosEliminados.where(buscarpor).equals(fechaiso).sort(buscarpor)
        else if (rango === "menor")
          resultado = (await RegistrosEliminados.where(buscarpor).lte(fechaiso).sort(buscarpor)).reverse()
        else if (rango === "mayor")
          resultado = await RegistrosEliminados.where(buscarpor).gte(fechaiso).sort(buscarpor)
        else
          resultado = await RegistrosEliminados.where(buscarpor).gte(fechaiso).lte(fecha2.aFechaUTC()).sort(buscarpor)
      } else {
        let fechaiso = fecha.aFechaGuatemala()
        buscarpor = "borradoEl";
        if (rango === "igual")
          resultado = await RegistrosEliminados.where(buscarpor).gte(fechaiso).lte(fechaiso.endOf("day")).sort(buscarpor)
        else if (rango === "menor")
          resultado = (await RegistrosEliminados.where(buscarpor).lte(fechaiso.endOf("day")).sort(buscarpor)).reverse()
        else if (rango === "mayor")
          resultado = await RegistrosEliminados.where(buscarpor).gte(fechaiso).sort(buscarpor)
        else
          resultado = await RegistrosEliminados.where(buscarpor).gte(fechaiso).lte(fecha2.aFechaGuatemala().endOf("day")).sort(buscarpor)
      }
      await guardarRegistroRedis(req.url, resultado);
    }
    else
      resultado = JSON.parse(resultado).map(el => new RegistrosEliminados(el));
    mostrarPagina(resultado, req, res);
  } catch (error) {
    res.send("búsqueda inválida");
  }
});

function mostrarPagina(resultado, req, res) {
  let limite = 10;
  let [url, pagina] = req.originalUrl.split('pag=');
  pagina = parseInt(pagina);
  let totalPaginas = Math.ceil(resultado.length / limite);
  if (totalPaginas === 0)
    return res.send("no hay ningún registro");
  else if (pagina < 1)
    return res.send("numero de búsqueda inválido");
  else if (pagina > totalPaginas)
    return res.redirect(url + "pag=" + totalPaginas)
  let datostablas = resultado.slice(limite * (pagina - 1), limite * pagina);
  res.render("mostrarregistroseliminados", { datostablas, pagina, totalPaginas, DateTime });
}

String.prototype.aFechaUTC = function () { return DateTime.fromFormat(this, "d-M-y") }
String.prototype.aFechaGuatemala = function () { return DateTime.fromFormat(this, "d-M-y", { zone: "America/Guatemala" }) }

module.exports = router;

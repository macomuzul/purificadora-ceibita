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
    let nuevosDatos = { usuario: req.user?.usuario ?? "usuariodesconocido", ultimocambio: ahora, tablas }
    if (registroanterior) {
      if (!sobreescribir)
        return res.send(registroanterior);

      const respaldo = new RegistrosEliminados({ registro: registroanterior, borradoEl: ahora });
      await respaldo.save();
      Object.assign(registroanterior, nuevosDatos)
      await registroanterior.save()
    } else {
      let registroNuevo = new RegistroVentas({ _id: fecha, ...nuevosDatos });
      await registroNuevo.save();
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
      if (opcion === 1)
        resultado = (await RegistrosEliminados.find()).reverse();
      else
        resultado = await RegistrosEliminados.find();
      await guardarRegistroRedis(req.url, resultado);
    }
    else {
      resultado = JSON.parse(resultado)
      resultado = resultado.map(el => new RegistrosEliminados(el));
    }
    mostrarPagina(resultado, req, res);
  } catch (error) {
    res.send("búsqueda inválida");
    console.log(error)
  }
}

router.get("/:buscarpor&entre&:fecha1&y&:fecha2&:pag", validarPagina, async (req, res) => {
  try {
    let resultado = await devuelveRegistroRedis(req.url);
    if (!resultado) {
      let { buscarpor, fecha1, fecha2 } = req.params;
      if (buscarpor !== "fecha" && buscarpor !== "fechaeliminacion")
        return res.send("búsqueda inválida");
      if (buscarpor === "fecha") {
        buscarpor = "registro.fecha";
        let fechaiso1 = DateTime.fromFormat(fecha1, "d-M-y").toISODate();
        let fechaiso2 = DateTime.fromFormat(fecha2, "d-M-y").toISODate();
        resultado = await RegistrosEliminados.where(buscarpor).gte(fechaiso1).lte(fechaiso2).sort(buscarpor);
      }
      else {
        buscarpor = "borradoEl";
        let fechaiso1 = DateTime.fromFormat(fecha1, "d-M-y", { zone: "America/Guatemala" }).toISO();
        let fechaiso2 = DateTime.fromFormat(fecha2, "d-M-y", { zone: "America/Guatemala" }).endOf("day").toISO();
        resultado = await RegistrosEliminados.where(buscarpor).gte(fechaiso1).lte(fechaiso2).sort(buscarpor);
      }
      await guardarRegistroRedis(req.url, resultado);
    }
    else {
      resultado = JSON.parse(resultado)
      resultado = resultado.map(el => new RegistrosEliminados(el));
    }
    mostrarPagina(resultado, req, res);
  } catch (error) {
    res.send("búsqueda inválida");
  }
});


router.get("/:buscarpor&:rango&:fecha&:pag", validarPagina, async (req, res) => {
  try {
    let resultado = await devuelveRegistroRedis(req.url);
    if (!resultado) {
      let { buscarpor, rango, fecha } = req.params;
      if (buscarpor !== "fecha" && buscarpor !== "fechaeliminacion")
        return res.send("búsqueda inválida");
      if (rango !== "igual" && rango !== "mayor" && rango !== "menor")
        return res.send("rango inválido");
      if (buscarpor === "fecha") {
        let fechaiso = DateTime.fromFormat(fecha, "d-M-y").toISODate();
        buscarpor = "registro.fecha";
        if (rango === "igual")
          resultado = await RegistrosEliminados.where(buscarpor).equals(fechaiso).sort(buscarpor);
        else if (rango === "menor")
          resultado = await RegistrosEliminados.where(buscarpor).lte(fechaiso).sort(buscarpor);
        else
          resultado = await RegistrosEliminados.where(buscarpor).gte(fechaiso).sort(buscarpor);
      } else {
        let fechaiso = DateTime.fromFormat(fecha, "d-M-y", { zone: "America/Guatemala" });
        buscarpor = "borradoEl";
        if (rango === "igual")
          resultado = await RegistrosEliminados.where(buscarpor).gte(fechaiso).lte(fechaiso.endOf("day")).sort(buscarpor);
        else if (rango === "menor")
          resultado = await RegistrosEliminados.where(buscarpor).lte(fechaiso.endOf("day")).sort(buscarpor);
        else
          resultado = await RegistrosEliminados.where(buscarpor).gte(fechaiso).sort(buscarpor);
      }
      await guardarRegistroRedis(req.url, resultado);
    }
    else {
      resultado = JSON.parse(resultado)
      resultado = resultado.map(el => new RegistrosEliminados(el));
    }
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

module.exports = router;

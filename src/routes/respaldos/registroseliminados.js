require('dotenv').config()
const router = require("express").Router();
const RegistrosEliminados = require("../../models/registroseliminados");
const VENTASPORDIA = require("../../models/registroventaspordia");
const { DateTime } = require("luxon");
const redis = require('../../redis');
let vencerEn = 7200 //dos horas

router.get("/", async (req, res) => {
  res.render("registroseliminados");
});

router.post("/restaurarregistro", async (req, res) => {
  try {
    let registrorecuperado = await RegistrosEliminados.findById(req.body.id);
    let fecha = registrorecuperado.ventaspordia.fecha;
    let registroanterior = await VENTASPORDIA.findOne({ fecha });
    let ahora = new Date();
    let ventas = new VENTASPORDIA({
      fecha, usuario: req.user?.usuario ?? "", fechacreacion: registrorecuperado.ventaspordia.fechacreacion,
      fechaultimocambio: ahora, camiones: registrorecuperado.ventaspordia.camiones
    });

    //si ya existe un registro anterior lo guarda en la parte de respaldos
    if (registroanterior) {
      const respaldo = new RegistrosEliminados();
      respaldo.ventaspordia = registroanterior;
      respaldo.fechaeliminacion = ahora;
      await respaldo.save();
      await registroanterior.deleteOne();
    }
    await ventas.save();
    await registrorecuperado.deleteOne();

    res.send("Se ha restaurado con éxito");
  } catch {
    res.status(400).send("No se pudo restaurar");
  }
});

router.delete("/borrarregistro", async (req, res, next) => {
  try {
    let registro = await RegistrosEliminados.findById(req.body.id);
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
      let registro = await RegistrosEliminados.findById(el);
      await registro.delete();
    });
    res.send("Se ha borrado con éxito");
  } catch {
    res.status(400).send("No se pudo restaurar");
  }
});

router.get("/:buscarpor&entre&:fecha1&y&:fecha2&:pag", async (req, res) => {
  try {
    let urlRedis = "registroseliminados:" + req.url;
    let resultado = await redis.get(urlRedis);
    if (!resultado) {
      let { buscarpor, fecha1, fecha2, pag } = req.params;
      if (buscarpor != "fecha" && buscarpor != "fechaeliminacion")
        return res.send("búsqueda inválida");
      else if ((/^pag[0-9]+$/.test(pag)))
        return res.send("página inválida");
      if (buscarpor === "fecha") {
        buscarpor = "ventaspordia.fecha";
        var fechaiso1 = DateTime.fromFormat(fecha1, "d-M-y").toISODate();
        var fechaiso2 = DateTime.fromFormat(fecha2, "d-M-y").toISODate();
        resultado = await RegistrosEliminados.where(buscarpor).gte(fechaiso1).lte(fechaiso2).sort(buscarpor);
      }
      else {
        var fechaiso1 = DateTime.fromFormat(fecha1, "d-M-y", { zone: "America/Guatemala" }).toISO();
        var fechaiso2 = DateTime.fromFormat(fecha2, "d-M-y", { zone: "America/Guatemala" }).endOf("day").toISO();
        resultado = await RegistrosEliminados.where(buscarpor).gte(fechaiso1).lte(fechaiso2).sort(buscarpor);
      }
      await redis.setEx(urlRedis, vencerEn, JSON.stringify(resultado))
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


router.get("/:buscarpor&:rango&:fecha&:pag", async (req, res) => {
  try {
    let urlRedis = "registroseliminados:" + req.url;
    let resultado = await redis.get(urlRedis);
    if (!resultado) {
      let { buscarpor, rango, fecha, pag } = req.params;
      if (buscarpor != "fecha" && buscarpor != "fechaeliminacion")
        return res.send("búsqueda inválida");
      else if (rango != "igual" && rango != "mayor" && rango != "menor")
        return res.send("rango inválido");
      else if ((/^pag[0-9]+$/.test(pag)))
        return res.send("página inválida");
      if (buscarpor === "fecha") {
        let fechaiso = DateTime.fromFormat(fecha, "d-M-y").toISODate();
        buscarpor = "ventaspordia.fecha";
        if (rango === "igual")
          resultado = await RegistrosEliminados.where(buscarpor).equals(fechaiso).sort(buscarpor);
        else if (rango === "menor")
          resultado = await RegistrosEliminados.where(buscarpor).lte(fechaiso).sort(buscarpor);
        else
          resultado = await RegistrosEliminados.where(buscarpor).gte(fechaiso).sort(buscarpor);

      } else {
        let fechaiso = DateTime.fromFormat(fecha, "d-M-y", { zone: "America/Guatemala" });
        if (rango === "igual")
          resultado = await RegistrosEliminados.where(buscarpor).gte(fechaiso).lte(fechaiso.endOf("day")).sort(buscarpor);
        else if (rango === "menor")
          resultado = await RegistrosEliminados.where(buscarpor).lte(fechaiso.endOf("day")).sort(buscarpor);
        else
          resultado = await RegistrosEliminados.where(buscarpor).gte(fechaiso).sort(buscarpor);
      }
      await redis.setEx(urlRedis, vencerEn, JSON.stringify(resultado))
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
  let pagina = parseInt(req.params.pag.split('pag=')[1]);
  let totalPaginas = Math.ceil(resultado.length / limite);
  if (totalPaginas === 0)
    return res.send("no hay ningún registro");
  else if (pagina > totalPaginas || pagina < 1)
    return res.send("numero de búsqueda inválido");
  let datostablas = resultado.slice(limite * (pagina - 1), limite * pagina);
  res.render("mostrarregistroseliminados", { datostablas, pagina, totalPaginas, DateTime });
}

let borrarLlaves = require("../../utilities/borrarLlavesRedis")
const changeStream = RegistrosEliminados.watch();
changeStream.on('change', borrarLlaves("registroseliminados"));

module.exports = router;

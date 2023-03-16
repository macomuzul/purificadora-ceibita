const router = require("express").Router();
const Respaldo = require("../models/respaldo");
const ventaspordia = require("../models/registroventaspordia");
const { DateTime } = require("luxon");

router.get("/", async (req, res) => {
  res.render("respaldos");
});

router.post("/restaurarregistro", async (req, res) => {
  try {
    let registrorecuperado = await Respaldo.findById(req.body.id);
    let fecha = registrorecuperado.ventaspordia.fecha;
    let registroanterior = await ventaspordia.findOne({ fecha });
    let ahora = new Date();
    let ventas = new ventaspordia({
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
    let buscarpor = req.params.buscarpor;
    let fecha1 = req.params.fecha1;
    let fecha2 = req.params.fecha2;
    if (buscarpor != "fecha" && buscarpor != "fechaeliminacion")
      res.send("búsqueda inválida");
    else if ((/^pag[0-9]+$/.test(req.params.pag)))
      res.send("página inválida");
    else {
      var fechaiso1 = DateTime.fromFormat(fecha1, "d-M-y").toISODate();
      var fechaiso2 = DateTime.fromFormat(fecha2, "d-M-y").toISODate();
      if (buscarpor === "fecha")
      {
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
    let buscarpor = req.params.buscarpor;
    let rango = req.params.rango;
    let fecha = req.params.fecha;
    if (buscarpor != "fecha" && buscarpor != "fechaeliminacion")
      res.send("búsqueda inválida");
    else if (rango != "igual" && rango != "mayor" && rango != "menor")
      res.send("rango inválido");
    else if ((/^pag[0-9]+$/.test(req.params.pag)))
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

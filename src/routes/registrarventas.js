const router = require("express").Router();
const VentasPorDia = require("../models/registroventaspordia");
const plantilla = require("../models/plantillas");
const Respaldo = require("../models/registroseliminados");
const Camioneros = require("../models/camioneros");
const { DateTime } = require("luxon");
const _ = require("underscore");

router.post("/guardar", async (req, res) => {
  try {
    let ventasNuevo = new VentasPorDia(req.body);
    ventasNuevo.usuario = req.user?.usuario ?? "yoquese";
    let ventasAnterior = await VentasPorDia.findOne({ fecha: ventasNuevo.fecha });
    if (ventasAnterior) { //si ya existe un registro anterior lo guarda en la parte de respaldos
      let respaldo = new Respaldo({ ventaspordia: ventasAnterior, fechaeliminacion: new Date() });
      await respaldo.save();
      _.extend(ventasAnterior, _.pick(ventasNuevo, ["usuario", "fechaultimocambio", "camiones"]));
      await ventasAnterior.save();
    }
    else
      await ventasNuevo.save();
    res.send("Se ha guardado con exito");

  } catch (e) {
    res.status(400).send("Error al guardar");
    console.log(e)
  }
});


router.route("/:id").get(async (req, res) => {
  try {
    let {id} = req.params;
    let datos = id.split("-");
    if (datos.length !== 3)
      return res.send("página inválida");
    let fecha = DateTime.fromFormat(id, "d-M-y");
    let ventaspordia = await VentasPorDia.findOne({ fecha: fecha.toISODate() });
    let plantillas = await plantilla.find().sort("orden");
    let plantillaDefault = await plantilla.findOne({ esdefault: true });
    let listaCamioneros = await Camioneros.findOne();
    let camioneros = listaCamioneros.camioneros.map(el => el.nombre);
    let fechastr = fecha.toLocaleString(DateTime.DATE_HUGE);
    res.render("registrarventas", { fecha: fecha.toFormat("d/M/y"), ventaspordia, plantillas, plantillaDefault, fechastr, camioneros, DateTime });
  } catch (e) {
    console.log(e)
    res.status(400).send("página inválida");
  }
}).delete(async (req, res) => {
  try {
    let {id} = req.params;
    let datos = id.split("-");
    if (datos.length !== 3)
      return
    let fecha = DateTime.fromFormat(id, "d-M-y");
    let ventaspordia = await VentasPorDia.findOne({ fecha: fecha.toISODate() });
    let respaldo = new Respaldo({ ventaspordia, fechaeliminacion: new Date() });
    await respaldo.save();
    ventaspordia.deleteOne();
    res.send("Exito");
  } catch (e) {
    console.log(e)
    res.send("página inválida");
  }
});


module.exports = router;
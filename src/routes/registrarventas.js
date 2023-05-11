const router = require("express").Router();
const ventaspordia = require("../models/registroventaspordia");
const plantilla = require("../models/plantillas");
const Respaldo = require("../models/registroseliminados");
const Camioneros = require("../models/camioneros");
const { DateTime } = require("luxon");

router.post("/guardar", async (req, res) => {
  try {
    console.log(req.body)
    console.log(req.body.camiones[0].nombretrabajador)
    let ventas = new ventaspordia(req.body);
    console.log(ventas.camiones[0].nombretrabajador)
    ventas.usuario = req.user?.usuario ?? "yoquese";
    console.log(ventas.usuario)
    let registroanterior = await ventaspordia.findOne({fecha: ventas.fecha});
    if (registroanterior) { //si ya existe un registro anterior lo guarda en la parte de respaldos
      console.log("yaexiste")
      let respaldo = new Respaldo();
      respaldo.ventaspordia = registroanterior;
      respaldo.fechaeliminacion = new Date();
      await respaldo.save();
      await registroanterior.deleteOne();
    }
    console.log("uuu")
    await ventas.save();
    console.log("weco")
    
    res.send("Se ha guardado con exito");
  } catch(e) {
    res.status(400).send("Error al guardar");
    console.log(e)
  }
});


router.get("/:id", async (req, res) => {
  try {
    id = req.params.id;
    var datos = id.split("-");
    if (datos.length !== 3)
      return res.send("página inválida");
    const fecha = DateTime.fromFormat(id, "d-M-y",{zone: "utc"}).setLocale("es");
    const datostablas = await ventaspordia.findOne({ fecha });
    const plantillas = await plantilla.find().sort("orden");
    const plantillaDefault = await plantilla.findOne({ esdefault: true });
    let camioneros = await Camioneros.findOne();
    let nombresCamioneros = camioneros.camioneros.map(el => el.nombre)
    let fechastr = fecha.weekdayLong + ", " + fecha.toLocaleString(DateTime.DATE_FULL);
    res.render("registrarventas", { fecha: fecha.toFormat("d/M/y"), ventaspordia: datostablas, plantillas, plantillaDefault, fechastr, DateTime, camioneros: nombresCamioneros});
  } catch (e) {
    res.send("página inválida");
  }
});
module.exports = router;
const express = require("express");
const router = express.Router();
const path = require("path");
const ventaspordia = require("../models/registroventaspordia");
const plantilla = require("../models/plantillas");
const Respaldo = require("../models/respaldo");
const estaAutenticado = require("../passport/autenticado");
const { DateTime } = require("luxon");

router.use(express.static(path.join(__dirname, "../public")));

//TODO colocar ultima modificacion de la tabla en la vista ventaspordia
router.post("/guardar", async (req, res) => {
  try {
    let ventas = new ventaspordia(req.body);
    if (req.user) {
      ventas.usuario = req.user.usuario;
    }
    let registroanterior = await ventaspordia.findOne({fecha: ventas.fecha});
    if (registroanterior) { //si ya existe un registro anterior lo guarda en la parte de respaldos
      let respaldo = new Respaldo();
      respaldo.ventaspordia = registroanterior;
      respaldo.fechaeliminacion = new Date();
      await respaldo.save();
      await registroanterior.delete();
    }
    await ventas.save();
    
    res.send("Se ha guardado con exito");
  } catch(e) {
    res.status(400).send("Error al guardar");
    console.log(e)
  }
});

router.post("/prueba", (req, res) =>{
  console.log("exito")
  console.log(req.body)
  res.send("recibido");
})



router.get("/:id", async (req, res) => {
  try {
    id = req.params.id;
    var datos = id.split("-");
    if (datos.length !== 3) {
      res.send("página inválida");
      return;
    }
    const fecha = DateTime.fromFormat(id, "d-M-y",{zone: "utc"}).setLocale("es");
    const datostablas = await ventaspordia.findOne({ fecha });
    const plantillas = await plantilla.find().sort("orden");
    const datosplantilla = await plantilla.findOne({ esdefault: true });
    res.render("registrarventas", { fecha: fecha.toFormat("d/M/y"), ventaspordia: datostablas, plantillas, datosplantilla, fechastr: fecha.weekdayLong + ", " + fecha.toLocaleString(DateTime.DATE_FULL)});
  } catch (e) {
    res.send("página inválida");
  }
});
module.exports = router;
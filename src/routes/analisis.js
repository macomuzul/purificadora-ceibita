const router = require('express').Router();
const ResumenDia = require("../models/resumenDia");
const { DateTime } = require("luxon");

router.get('/', async (req, res) => {
  // const plantillas = await mPlantilla.find().sort("orden");
  res.render('analisis');
});

router.get("/:unidadTiempo&:cantidad&:rango&:fecha1&y&fecha2", async (req, res) => {
});

router.get("/:unidadTiempo&:cantidad&:rango&:fecha", async (req, res) => {
  let { unidadTiempo, cantidad, rango, fecha } = req.params;
  if (!["dias", "semanas", "meses", "años"].includes(unidadTiempo))
    return res.send("búsqueda inválida");
  if (cantidad !== "uno")
    return res.send("búsqueda inválida");
  if (!["mayor", "menor"].includes(rango))
    return res.send("rango inválido");
  let fechaISO = DateTime.fromFormat(fecha, "d-M-y").toISODate();
  let datos;
  if (unidadTiempo === "dias") {
    datos = await ResumenDia.find().where("_id").gte(fechaISO);
  }
  if (unidadTiempo === "semanas") {
    let fechaInicio = DateTime.fromISO(fechaISO).startOf("week");
    let fechaFin = fechaInicio.endOf("week");
    datos = await ResumenDia.where("_id").gte(fechaInicio).lte(fechaFin);
  } if (unidadTiempo === "meses") {
    let fechaInicio = DateTime.fromISO(fechaISO).startOf("month");
    let fechaFin = fechaInicio.endOf("month");
    datos = await ResumenDia.where("_id").gte(fechaInicio).lte(fechaFin);
  }
  // res.send(datos)
  datos = JSON.stringify(datos)
  res.render("mostraranalisis", { datos })
});

router.get("/:unidadTiempo&:cantidad&:fecha", async (req, res) => {
  let { unidadTiempo, cantidad, fecha } = req.params;
  if (!["dias", "semanas", "meses", "años"].includes(unidadTiempo))
    return res.send("búsqueda inválida");
  if (cantidad !== "uno")
    return res.send("búsqueda inválida");
  let fechaISO = DateTime.fromFormat(fecha, "d-M-y").toISODate();
  let datos;
  if (unidadTiempo === "dias") {
    datos = await ResumenDia.findById(fechaISO);
  }
  if (unidadTiempo === "semanas") {
    let fechaInicio = DateTime.fromISO(fechaISO).startOf("week");
    let fechaFin = fechaInicio.endOf("week");
    datos = await ResumenDia.where("_id").gte(fechaInicio).lte(fechaFin);
  } if (unidadTiempo === "meses") {
    let fechaInicio = DateTime.fromISO(fechaISO).startOf("month");
    let fechaFin = fechaInicio.endOf("month");
    datos = await ResumenDia.where("_id").gte(fechaInicio).lte(fechaFin);
  }
  // res.send(datos)
  datos = JSON.stringify(datos)
  res.render("mostraranalisis", { datos })
});



module.exports = router;
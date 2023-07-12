const router = require('express').Router();
const ResumenDia = require("../models/resumenDia");
const ResumenSemana = require("../models/resumenSemana");
const ResumenMes = require("../models/resumenMes");
const { DateTime } = require("luxon");
const devuelveValoresSumados = require("../utilities/devuelveValoresSumados")

String.prototype.normalizarPrecio = function () { return parseFloat(this).toFixed(2).replace(/[.,]00$/, "") }
Number.prototype.normalizarPrecio = function () { return this.toFixed(2).replace(/[.,]00$/, "") }
router.get('/', async (req, res) => {
  // const plantillas = await mPlantilla.find().sort("orden");
  res.render('analisis');
});

async function actualizarSiHuboCambios(fechas, tiempo) {
  const promises = []
  for (const fecha of fechas) {
    let { c, f, _id } = fecha
    if (c) {
      let dias
      if (tiempo === "week")
        dias = await ResumenDia.where("_id").gte(_id).lte(f)
      else if (tiempo === "month")
        dias = await ResumenDia.where("_id").gte(_id).lte(f)
      else if (tiempo === "year")
        dias = await ResumenMes.where("_id").gte(_id).lte(f)

      let { prods, vt, it } = devuelveValoresSumados(dias)
      promises.push(fecha.updateOne({ prods, vt, it, c: false }))
    }
  }
  await Promise.all(promises)
}

devuelveDiasSueltosSumados = arr => arr.length > 0 ? [{ _id: arr[0]._id, ...devuelveValoresSumados(arr), f: arr.slice(-1)._id }] : []

async function rangoMayor(fecha, tiempo, resumen) {
  let fin = fecha.endOf(tiempo)
  let datosSueltos = [], fechas = []
  if (fecha.valueOf() === fecha.startOf(tiempo).valueOf())
    fechas = await resumen.where("_id").gte(fecha)
  else {
    let dias = await ResumenDia.where("_id").gte(fecha).lte(fin).sort("_id")
    datosSueltos = devuelveDiasSueltosSumados(dias)
    fechas = await resumen.where("_id").gt(fin)
  }
  await actualizarSiHuboCambios(fechas, tiempo)
  return [...datosSueltos, ...fechas]
}
async function rangoMenor(fecha, tiempo, resumen) {
  let inicio = fecha.startOf(tiempo)
  let datosSueltos = [], fechas = []
  if (fecha.valueOf() === fecha.endOf(tiempo).startOf("day").valueOf())
    fechas = await resumen.where("_id").lte(fecha)
  else {
    let dias = await ResumenDia.where("_id").gte(inicio).lte(fecha).sort("_id")
    datosSueltos = devuelveDiasSueltosSumados(dias)
    fechas = await resumen.where("_id").lt(inicio)
  }
  await actualizarSiHuboCambios(fechas, tiempo)
  return [...datosSueltos, ...fechas]
}

router.get("/:agruparPor&:rango&:fecha", async (req, res) => {
  try {
    let { rango: rangoP, agruparPor: agruparPorP, fecha: fechaP } = req.params;
    let [, rango] = rangoP.split("rango=")
    let [, agruparPor] = agruparPorP.split("agruparpor=")
    let [, fecha] = fechaP.split("dias=")

    if (!rango || !agruparPor || !fecha)
      return res.send("búsqueda inválida");
    if (!["dias", "semanas", "meses", "años"].includes(agruparPor))
      return res.send("búsqueda inválida");
    if (!["mayor", "menor", "libre"].includes(rango))
      return res.send("búsqueda inválida");
    let fechas
    if (rango === "libre")
      fechas = fecha.split(",").map(x => DateTime.fromFormat(x, "d-M-y"))
    else
      fecha = DateTime.fromFormat(fecha, "d-M-y")
    let datos;
    if (agruparPor === "dias") {
      if (rango === "mayor")
        datos = await ResumenDia.where("_id").gte(fecha);
      else if (rango === "menor")
        datos = await ResumenDia.where("_id").lte(fecha);
      else
        datos = await ResumenDia.find({ _id: { $in: fechas } })
    }
    if (agruparPor === "semanas") {
      if (rango === "mayor")
        datos = await rangoMayor(fecha, "week", ResumenSemana)
      else if (rango === "menor")
        datos = await rangoMenor(fecha, "week", ResumenSemana)
      else
        datos = await agrupar(fechas, "week")
    } if (agruparPor === "meses") {
      if (rango === "mayor")
        datos = await rangoMayor(fecha, "month", ResumenMes)
      else if (rango === "menor")
        datos = await rangoMenor(fecha, "month", ResumenMes)
      else
        datos = await agrupar(fechas, "month")
    }
    // res.send(datos)
    datos = JSON.stringify(datos)
    res.render("mostraranalisis", { datos })
  } catch (error) {
    console.log(error)
    res.send("Error, página inválida")
  }
});


async function agrupar(fechas, tiempo) {
  let fechasEncontradas = await fechaInicio.find({ _id: { $in: object[fechas] } }, { c: 0 })
  let agrupados = _.groupBy(fechasEncontradas, x => DateTime.fromJSDate(x._id).startOf(tiempo).toISO())
  let dias = Object.entries(agrupados).map(([k, v]) => ({ _id: DateTime.fromISO(k).startOf("tiempo"), ...devuelveValoresSumados(v), f: DateTime.fromISO(k).endOf("tiempo") }))
  return dias.sort((a, b) => a - b)
}


router.get("/:unidadTiempo&:cantidad&:rango&:fecha1&y&fecha2", async (req, res) => {
});

// router.get("/:unidadTiempo&:cantidad&:rango&:fecha", async (req, res) => {
//   let { unidadTiempo, cantidad, rango, fecha } = req.params;
//   if (!["dias", "semanas", "meses", "años"].includes(unidadTiempo))
//     return res.send("búsqueda inválida");
//   if (cantidad !== "uno")
//     return res.send("búsqueda inválida");
//   if (!["mayor", "menor"].includes(rango))
//     return res.send("rango inválido");
//   let fechaISO = DateTime.fromFormat(fecha, "d-M-y").toISODate();
//   let datos;
//   if (unidadTiempo === "dias") {
//     datos = await ResumenDia.find().where("_id").gte(fechaISO);
//   }
//   if (unidadTiempo === "semanas") {
//     let fechaInicio = DateTime.fromISO(fechaISO).startOf("week");
//     let fechaFin = fechaInicio.endOf("week");
//     datos = await ResumenDia.where("_id").gte(fechaInicio).lte(fechaFin);
//   } if (unidadTiempo === "meses") {
//     let fechaInicio = DateTime.fromISO(fechaISO).startOf("month");
//     let fechaFin = fechaInicio.endOf("month");
//     datos = await ResumenDia.where("_id").gte(fechaInicio).lte(fechaFin);
//   }
//   // res.send(datos)
//   datos = JSON.stringify(datos)
//   res.render("mostraranalisis", { datos })
// });

// router.get("/:unidadTiempo&:cantidad&:fecha", async (req, res) => {
//   let { unidadTiempo, cantidad, fecha } = req.params;
//   if (!["dias", "semanas", "meses", "años"].includes(unidadTiempo))
//     return res.send("búsqueda inválida");
//   if (cantidad !== "uno")
//     return res.send("búsqueda inválida");
//   let fechaISO = DateTime.fromFormat(fecha, "d-M-y").toISODate();
//   let datos;
//   if (unidadTiempo === "dias") {
//     datos = await ResumenDia.findById(fechaISO);
//   }
//   if (unidadTiempo === "semanas") {
//     let fechaInicio = DateTime.fromISO(fechaISO).startOf("week");
//     let fechaFin = fechaInicio.endOf("week");
//     datos = await ResumenDia.where("_id").gte(fechaInicio).lte(fechaFin);
//   } if (unidadTiempo === "meses") {
//     let fechaInicio = DateTime.fromISO(fechaISO).startOf("month");
//     let fechaFin = fechaInicio.endOf("month");
//     datos = await ResumenDia.where("_id").gte(fechaInicio).lte(fechaFin);
//   }
//   // res.send(datos)
//   datos = JSON.stringify(datos)
//   res.render("mostraranalisis", { datos })
// });



module.exports = router;
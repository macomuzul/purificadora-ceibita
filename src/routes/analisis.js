const router = require('express').Router();
const ResumenDia = require("../models/resumenDia");
const ResumenSemana = require("../models/resumenSemana");
const ResumenMes = require("../models/resumenMes");
const ResumenAño = require("../models/resumenAño");
const { DateTime } = require("luxon");
const devuelveValoresSumados = require("../utilities/devuelveValoresSumados")

String.prototype.normalizarPrecio = function () { return parseFloat(this).toFixed(2).replace(/[.,]00$/, "") }
Number.prototype.normalizarPrecio = function () { return this.toFixed(2).replace(/[.,]00$/, "") }
router.get('/', async (req, res) => res.render('analisis'))

async function actualizarSiHuboCambiosSemanaOMes(tiempo) {
  let resumenSemanaOMes
  if (tiempo === "week")
    resumenSemanaOMes = await ResumenSemana.find({ c: true })
  else if (tiempo === "month")
    resumenSemanaOMes = await ResumenMes.find({ c: true })

  if (resumenSemanaOMes.length > 0) {
    let grupodias = resumenSemanaOMes.map(x => {
      const fecha = DateTime.fromJSDate(x);
      return fecha.until(fecha.endOf(tiempo)).splitBy({ days: 1 }).map(x => x.start.toISO());
    });

    let resumenDias = await ResumenDia.find({ _id: { $in: grupodias } })
    let agrupados = _.groupBy(resumenDias, x => DateTime.fromJSDate(new Date(x._id)).startOf(tiempo).toISO())
    resumenSemanaOMes.forEach(async x => await x.updateOne({ ...devuelveValoresSumados(agrupados[x._id.toISOString()]), c: false }))
    //TODO despues mejorarlo para hacerlo con bulkwrite
    //ResumenSemana.bulkWrite()
  }
}
async function actualizarSiHuboCambiosAño() {
  let resumenAño = await ResumenAño.find({ c: true })
  if (resumenAño.length > 0) {
    await actualizarSiHuboCambiosSemanaOMes("month")
    let grupoMeses = resumenAño.map(x => {
      const fecha = DateTime.fromJSDate(x);
      return fecha.until(fecha.endOf("year")).splitBy({ months: 1 }).map(x => x.start.toISO());
    });
    let resumenMeses = await ResumenMes.find({ _id: { $in: grupoMeses } })
    let agrupados = _.groupBy(resumenMeses, x => DateTime.fromJSDate(new Date(x._id)).startOf("year").toISO())
    resumenAño.forEach(async x => await x.updateOne({ ...devuelveValoresSumados(agrupados[x._id.toISOString()]), c: false }))
    //TODO despues mejorarlo para hacerlo con bulkwrite
    //ResumenSemana.bulkWrite()
  }
}

let BuscaYDevuelveDiasSueltos = async (inicio, fin) => devuelveObjDiasSueltos(await ResumenDia.where("_id").gte(inicio).lte(fin), inicio, fin)
let devuelveObjDiasSueltos = (arr, _id, f) => arr.length > 0 ? [{ _id, f, ...devuelveValoresSumados(arr) }] : []

async function rangoMayor(fecha, tiempo, resumen) {
  let diasSueltos = []
  if (!fecha.equals(fecha.startOf(tiempo))) {
    let fin = fecha.endOf(tiempo)
    diasSueltos = await BuscaYDevuelveDiasSueltos(fecha, fin)
    fecha = fin.plus(1)
  }
  return [...diasSueltos, ...await resumen.where("_id").gte(fecha).sort("_id")]
}
async function rangoMenor(fecha, tiempo, resumen) {
  let diasSueltos = []
  if (!fecha.equals(fecha.endOf(tiempo).startOf("day"))) {
    let inicio = fecha.startOf(tiempo)
    diasSueltos = await BuscaYDevuelveDiasSueltos(inicio, fecha)
    fecha = inicio.minus(1)
  }
  return [...await resumen.where("_id").lte(fecha).sort("_id"), ...diasSueltos]
}
async function rangoEntre(fecha1, fecha2, tiempo, resumen) {
  let diasAlPrincipio = [], diasAlFinal = []
  if (!fecha1.equals(fecha1.startOf(tiempo))) {
    let fin = fecha1.endOf(tiempo)
    diasAlPrincipio = await BuscaYDevuelveDiasSueltos(fecha1, fin)
    fecha1 = fin.plus(1)
  }
  if (!fecha2.equals(fecha2.endOf(tiempo).startOf("day"))) {
    let inicio = fecha2.startOf(tiempo)
    diasAlFinal = await BuscaYDevuelveDiasSueltos(inicio, fecha2)
    fecha2 = inicio.minus(1)
  }
  return [...diasAlPrincipio, ...await resumen.where("_id").gte(fecha1).lte(fecha2).sort("_id"), ...diasAlFinal]
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
    if (!["mayor", "menor", "libre", "entre"].includes(rango))
      return res.send("búsqueda inválida");

    let fechas, fecha1, fecha2
    if (rango === "libre")
      fechas = fecha.split(",").map(x => DateTime.fromFormat(x, "d-M-y"))
    else if (rango === "entre")
      [fecha1, fecha2] = fecha.split("y").map(x => DateTime.fromFormat(x, "d-M-y"))
    else
      fecha = DateTime.fromFormat(fecha, "d-M-y")
    let datos;
    if (["semanas", "meses"].includes(agruparPor))
      await actualizarSiHuboCambiosSemanaOMes(agruparPor === "semanas" ? "week" : "month")
    if (agruparPor === "años")
      await actualizarSiHuboCambiosAño()
    if (agruparPor === "dias") {
      if (rango === "mayor")
        datos = await ResumenDia.where("_id").gte(fecha).sort("_id")
      else if (rango === "menor")
        datos = await ResumenDia.where("_id").lte(fecha).sort("_id")
      else if (rango === "igual")
        datos = await ResumenDia.find({ _id: { $in: fechas } }).sort("_id")
      else
        datos = await ResumenDia.where("_id").gte(fecha1).lte(fecha2).sort("_id")
    } else if (agruparPor === "semanas") {
      if (rango === "mayor")
        datos = await rangoMayor(fecha, "week", ResumenSemana)
      else if (rango === "menor")
        datos = await rangoMenor(fecha, "week", ResumenSemana)
      else if (rango === "igual")
        datos = await agrupar(fechas, "week")
      else
        datos = await rangoEntre(fecha1, fecha2, "week", ResumenSemana)
    } else if (agruparPor === "meses") {
      if (rango === "mayor")
        datos = await rangoMayor(fecha, "month", ResumenMes)
      else if (rango === "menor")
        datos = await rangoMenor(fecha, "month", ResumenMes)
      else if (rango === "igual")
        datos = await agrupar(fechas, "month")
      else
        datos = await rangoEntre(fecha1, fecha2, "month", ResumenMes)
    } else if (agruparPor === "años") {
      if (rango === "mayor") {
        let inicio = fecha.startOf("day")
        let diasSueltos = [], mesesSueltos = [], diasYMesesSueltos = []
        if (!fecha.equals(fecha.startOf("month"))) {
          let finMes = fecha.endOf("month")
          diasSueltos = await ResumenDia.where("_id").gte(fecha).lte(finMes)
          fecha = finMes.plus(1)
        }
        if (!fecha.equals(fecha.startOf("year"))) {
          let finAño = fecha.endOf("year")
          mesesSueltos = await ResumenMes.where("_id").gte(fecha).lte(finAño)
          fecha = finAño.plus(1)
        }
        if (diasSueltos.length > 0 || mesesSueltos.length > 0)
          diasYMesesSueltos = devuelveObjDiasSueltos([...diasSueltos, ...mesesSueltos], inicio, fecha)
        datos = [...diasYMesesSueltos, ...await ResumenAño.where("_id").gte(fecha).sort("_id")]
      }
      else if (rango === "menor") {
        let fin = fecha.startOf("day")
        let diasSueltos = [], mesesSueltos = [], diasYMesesSueltos = []
        if (!fecha.equals(fecha.endOf("month"))) {
          let inicioMes = fecha.startOf("month")
          diasSueltos = await ResumenDia.where("_id").gte(inicioMes).lte(fecha)
          fecha = inicioMes.minus(1)
        }
        if (!fecha.equals(fecha.endOf("year"))) {
          let inicioAño = fecha.startOf("year")
          mesesSueltos = await ResumenMes.where("_id").gte(inicioAño).lte(fecha)
          fecha = inicioAño.minus(1)
        }
        if (diasSueltos.length > 0 || mesesSueltos.length > 0)
          diasYMesesSueltos = devuelveObjDiasSueltos([...diasSueltos, ...mesesSueltos], fecha, fin)
        datos = [...await ResumenAño.where("_id").lte(fecha).sort("_id"), ...diasYMesesSueltos]
      }
      else if (rango === "igual")
        datos = await agrupar(fechas, "month")
      else {
        let inicio = fecha1.startOf("day"), fin = fecha2.startOf("day")
        let diasSueltos1 = [], mesesSueltos1 = [], diasSueltos2 = [], mesesSueltos2 = [], diasYMesesSueltosInicio = [], diasYMesesSueltosFin = []
        if (!fecha1.equals(fecha1.startOf("month"))) {
          let finMes = fecha1.endOf("month")
          diasSueltos1 = await ResumenDia.where("_id").gte(fecha1).lte(finMes)
          fecha1 = finMes.plus(1)
        }
        if (!fecha1.equals(fecha1.startOf("year"))) {
          let finAño = fecha1.endOf("year")
          mesesSueltos1 = await ResumenMes.where("_id").gte(fecha1).lte(finAño)
          fecha1 = finAño.plus(1)
        }
        if (diasSueltos1.length > 0 || mesesSueltos1.length > 0)
          diasYMesesSueltosInicio = devuelveObjDiasSueltos([...diasSueltos1, ...mesesSueltos1], inicio, fecha1)
        if (!fecha2.equals(fecha2.endOf("month"))) {
          let inicioMes = fecha2.startOf("month")
          diasSueltos2 = await ResumenDia.where("_id").gte(inicioMes).lte(fecha2)
          fecha2 = inicioMes.minus(1)
        }
        if (!fecha2.equals(fecha2.endOf("year"))) {
          let inicioAño = fecha2.startOf("year")
          mesesSueltos2 = await ResumenMes.where("_id").gte(inicioAño).lte(fecha2)
          fecha2 = inicioAño.minus(1)
        }
        if (diasSueltos2.length > 0 || mesesSueltos2.length > 0)
          diasYMesesSueltosFin = devuelveObjDiasSueltos([...diasSueltos2, ...mesesSueltos2], fecha2, fin)
        datos = [...diasYMesesSueltosInicio, ...await ResumenAño.where("_id").lte(fecha).sort("_id"), ...diasYMesesSueltosFin]
      }
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
  let fechasEncontradas = await ResumenDia.find({ _id: { $in: fechas } })
  let agrupados = _.groupBy(fechasEncontradas, x => DateTime.fromJSDate(new Date(x._id)).startOf(tiempo).toISO())
  let dias = Object.entries(agrupados).map(([k, v]) => ({ _id: DateTime.fromISO(k).startOf(tiempo), ...devuelveValoresSumados(v), f: DateTime.fromISO(k).endOf(tiempo) }))
  return dias.sort((a, b) => a - b)
}

module.exports = router;
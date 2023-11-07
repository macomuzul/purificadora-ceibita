const router = require('express').Router()
const ResumenDia = require("../models/resumenDia")
const { ResumenSemana, ResumenMes, ResumenAño } = require("../models/resumenes")
const { DateTime } = require("luxon");
const devuelveValoresSumados = require("../utilities/devuelveValoresSumados")

String.prototype.normalizarPrecio = function () { return parseFloat(this).toFixed(2).replace(/[.,]00$/, "") }
Number.prototype.normalizarPrecio = function () { return this.toFixed(2).replace(/[.,]00$/, "") }
router.get('/', async (req, res) => res.render('analisis', { esAdmin: esAdmin(req) }))
let objResumenes = { day: ResumenDia, week: ResumenSemana, month: ResumenMes, year: ResumenAño }

async function actualizarSiHuboCambios(tiempo) {
  let resumenModelo = objResumenes[tiempo]
  let resumen = await resumenModelo.find({ c: true })
  let buscar = tiempo === "year" ? ResumenMes : ResumenDia
  for (const x of resumen) {
    let dias = devuelveValoresSumados(await buscar.entre(x._id, x.f))
    await resumenModelo.findByIdAndUpdate(x._id, { ...dias, c: false })
  }
}

let devuelveObjDiasSueltos = (arr, _id, f) => arr.length > 0 ? [{ _id: _id.toJSDate(), f: f.toJSDate(), ...devuelveValoresSumados(arr) }] : []
let BuscaYDevuelveDiasSueltos = async (inicio, fin) => devuelveObjDiasSueltos(await ResumenDia.entre(inicio, fin), inicio, fin)

async function rangoMayor(fecha, tiempo, resumen) {
  let diasSueltos = !fecha.equals(fecha.startOf(tiempo)) ? await BuscaYDevuelveDiasSueltos(fecha, fecha.endOf(tiempo)) : []
  return [...diasSueltos, ...await resumen.mayor(fecha)]
}

async function rangoMenor(fecha, tiempo, resumen) {
  fecha = fecha.endOf("day")
  let esFin = fecha.equals(fecha.endOf(tiempo))
  let diasSueltos = !esFin ? await BuscaYDevuelveDiasSueltos(fecha.startOf(tiempo), fecha) : []
  if (!esFin) fecha = fecha.startOf(tiempo).minus(1)
  return [...await resumen.menor(fecha), ...diasSueltos]
}

async function rangoMayorAños(tiempo, fecha, Resumen) {
  let fin = fecha.endOf(tiempo)
  return [await Resumen.entre(fecha, fin), fin.plus(1)]
}

async function rangoMenorAños(tiempo, fecha, Resumen) {
  let inicio = fecha.startOf(tiempo)
  return [await Resumen.entre(inicio, fecha), inicio.minus(1)]
}

async function añoDatosSueltos(mayor, fecha) {
  let diasSueltos = [], mesesSueltos = []
  let inFin = mayor ? "startOf" : "endOf"
  let rango = mayor ? rangoMayorAños : rangoMenorAños
  if (!fecha.equals(fecha[inFin]("month"))) [diasSueltos, fecha] = await rango("month", fecha, ResumenDia)
  if (!fecha.equals(fecha[inFin]("year"))) [mesesSueltos, fecha] = await rango("year", fecha, ResumenMes)
  return [[...diasSueltos, ...mesesSueltos], fecha]
}

async function rangoEntre(fecha1, fecha2, tiempo, resumen) {
  let diasInicio = !fecha1.equals(fecha1.startOf(tiempo)) ? await BuscaYDevuelveDiasSueltos(fecha1, fecha1.endOf(tiempo)) : []
  fecha2 = fecha2.endOf("day")
  let esFin = fecha2.equals(fecha2.endOf(tiempo))
  let diasFin = !esFin ? await BuscaYDevuelveDiasSueltos(fecha2.startOf(tiempo), fecha2) : []
  if (!esFin) fecha2 = fecha2.startOf(tiempo).minus(1)
  return [...diasInicio, ...await resumen.entreOrdenado(fecha1, fecha2), ...diasFin]
}

async function rangoEntreAños(fecha1, fecha2) {
  let diasYMesesSueltosInicio = [], diasYMesesSueltosFin = []
  let inicio = fecha1.startOf("day"), fin = fecha2.startOf("day")
  if (inicio.hasSame(fin, "year")) {
    let año = await rangoEntre(fecha1, fecha2, "month", ResumenMes)
    return [({ _id: fecha1, ...devuelveValoresSumados(año), f: fecha2 })]
  } else {
    ;[diasYMesesSueltosInicio, fecha1] = await añoDatosSueltos(1, fecha1)
      ;[diasYMesesSueltosFin, fecha2] = await añoDatosSueltos(0, fecha2)
    if (diasYMesesSueltosInicio.length > 0) diasYMesesSueltosInicio = devuelveObjDiasSueltos(diasYMesesSueltosInicio, inicio, fecha1.minus(1))
    if (diasYMesesSueltosFin.length > 0) diasYMesesSueltosFin = devuelveObjDiasSueltos(diasYMesesSueltosFin, fecha2.plus(1), fin)
    return [...diasYMesesSueltosInicio, ...await ResumenAño.entreOrdenado(fecha1, fecha2), ...diasYMesesSueltosFin]
  }
}

router.get("/:agruparPorP(agruparpor=(dias|semanas|meses|a%C3%B1os))&:rangoP(rango=(mayor|menor|libre|entre))&:fechaP", tcrutas(async (req, res) => {
  let { rangoP, agruparPorP, fechaP } = req.params
  if (!/^(dias|semanas|meses|años)=.*/.test(fechaP)) throw new Error()

  let [, rango] = rangoP.split("=")
  let [, agruparPor] = agruparPorP.split("=")
  let [unidadTiempo, fecha] = fechaP.split("=")
  let valorIngles = x => ({ dias: "day", semanas: "week", meses: "month", "años": "year" }[x])
  agruparPor = valorIngles(agruparPor)
  unidadTiempo = valorIngles(unidadTiempo)
  let resumen = objResumenes[agruparPor]

  let fechas, fecha1, fecha2, datos
  let devuelveDateTime = x => DateTime.fromFormat(x, "d-M-y")
  if (rango === "libre") fechas = fecha.split(",").map(x => devuelveDateTime(x))
  else if (rango === "entre") [fecha1, fecha2] = fecha.split("&y&").map(x => devuelveDateTime(x))
  else fecha = devuelveDateTime(fecha)

  if (agruparPor !== "day") {
    if (agruparPor === "year") {
      await actualizarSiHuboCambios("month")
      await actualizarSiHuboCambios("year")
    } else
      await actualizarSiHuboCambios(agruparPor)
  }
  if (unidadTiempo === agruparPor && rango === "libre") {
    datos = await resumen.ordenado().in(fechas)
    datos = await agrupar(datos, agruparPor)
  } else if (unidadTiempo !== "day" && rango === "libre") {
    let rangoFunc = agruparPor === "year" ? rangoEntreAños : rangoEntre
    datos = await Promise.all(fechas.map(async x => await rangoFunc(x.startOf(unidadTiempo), x.endOf(unidadTiempo), agruparPor, resumen)))
    datos = datos.flat()
    // datos = await agrupar(datos, agruparPor)
    datos = await agruparMultiple(datos, agruparPor)
  }
  else {
    if (agruparPor === "day") {
      let regs = ResumenDia.ordenado()
      let funcs = {
        mayor: q => regs.gte(fecha),
        menor: q => regs.lte(fecha),
        entre: q => regs.gte(fecha1).lte(fecha2)
      }
      datos = await funcs[rango]()
    }
    else if (agruparPor === "year") {
      if (rango === "mayor") {
        let inicio = fecha.startOf("day")
          ;[diasYMesesSueltos, fecha] = await añoDatosSueltos(1, fecha)
        if (diasYMesesSueltos.length > 0) diasYMesesSueltos = devuelveObjDiasSueltos(diasYMesesSueltos, inicio, fecha.minus(1))
        datos = [...diasYMesesSueltos, ...await ResumenAño.mayor(fecha)]
      }
      else if (rango === "menor") {
        let fin = fecha.startOf("day")
          ;[diasYMesesSueltos, fecha] = await añoDatosSueltos(0, fecha)
        if (diasYMesesSueltos.length > 0) diasYMesesSueltos = devuelveObjDiasSueltos(diasYMesesSueltos, fecha.plus(1), fin)
        datos = [...await ResumenAño.menor(fecha), ...diasYMesesSueltos]
      }
      else datos = await rangoEntreAños(fecha1, fecha2)
    } else {
      let funcsSemanasMeses = {
        mayor: (...d) => rangoMayor(fecha, ...d),
        menor: (...d) => rangoMenor(fecha, ...d),
        entre: (...d) => rangoEntre(fecha1, fecha2, ...d)
      }
      datos = await funcsSemanasMeses[rango](agruparPor, resumen)
    }
  }

  res.render("mostraranalisis", { datos, esAdmin: esAdmin(req) })
}, "Página inválida"))

async function agrupar(fechas, tiempo) {
  let agrupados = _.groupBy(fechas, x => DateTime.fromJSDate(x._id).startOf(tiempo).toISO())
  let dias = Object.entries(agrupados).map(([k, v]) => ({ _id: DateTime.fromISO(k).startOf(tiempo), ...devuelveValoresSumados(v), f: DateTime.fromISO(k).endOf(tiempo) }))
  return dias.sort((a, b) => a._id - b._id)
}
async function agruparMultiple(fechas, tiempo) {
  let agrupados = _.groupBy(fechas, x => DateTime.fromJSDate(x._id).startOf(tiempo).toISO())
  let dias = Object.entries(agrupados).map(([k, v]) => v.length > 1 ? ({ _id: DateTime.fromISO(k).startOf(tiempo), ...devuelveValoresSumados(v), f: DateTime.fromISO(k).endOf(tiempo) }) : v[0])
  return dias.sort((a, b) => a._id - b._id)
}

router.get("/comofunciona", (req, res) => res.render("comofuncionaanalisis", { esAdmin: esAdmin(req) }))

module.exports = router
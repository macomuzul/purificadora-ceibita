const RegistroVentas = require("./models/registroventas")
const ResumenDia = require("./models/resumenDia")
const { ResumenSemana, ResumenMes, ResumenAño } = require("./models/resumenes")
const sumaResumenDias = require("./utilities/sumaResumenDias")
const { DateTime } = require("luxon")
const { LogsGraves } = require("./models/loggers")

let actualizarResumenesEnDelete = async (Resumen, tipo, id) => await Resumen.findByIdAndUpdate(DateTime.fromJSDate(id).startOf(tipo), { c: true })
let errorListener = (f, listener) => async cambio => {
  try {
    await f(cambio)
  } catch (e) {
    let msg = `Error en el listener ${listener}`
    await LogsGraves.log(msg, { error: e })
  }
}

RegistroVentas.watch().on('change', errorListener(async cambio => {
  let { operationType, documentKey: { _id } } = cambio
  if (operationType === "delete") await ResumenDia.deleteOne({ _id })
  else if (operationType === "insert" || "tablas" in cambio.updateDescription.updatedFields) {
    let venta = await RegistroVentas.buscarPorID(_id)
    await ResumenDia.findByIdAndUpdate(venta._id, sumaResumenDias(venta), { upsert: true })
  }
}, "registro ventas"))

ResumenDia.watch().on('change', errorListener(async cambio => {
  let { _id } = cambio.documentKey
  let promesas = [[ResumenSemana, "week"], [ResumenMes, "month"], [ResumenAño, "year"]]
  let res = await Promise.allSettled(promesas.map(async p => cambio.operationType === "delete" ? await actualizarResumenesEnDelete(...p, _id) : await verificarResumenes(...p, await ResumenDia.findById(_id).lean())))
  if (res.some(p => p.status === "rejected")) await Promise.all(promesas.filter((_, i) => res[i].status === "rejected"))
}, "resumen dia"))

async function verificarResumenes(Resumen, tipo, resumenDia) {
  let id = DateTime.fromJSDate(resumenDia._id)
  let inicio = id.startOf(tipo)
  let resumen = await Resumen.buscarPorID(inicio).select("c -_id")
  if (!resumen) await Resumen.create({ ...resumenDia, _id: inicio, f: id.endOf(tipo), c: false })
  else if (!resumen.c) await Resumen.findByIdAndUpdate(inicio, { c: true })
}
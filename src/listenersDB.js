const RegistroVentas = require("./models/registroventas")
const ResumenDia = require("./models/resumenDia")
const { ResumenSemana, ResumenMes, ResumenAño } = require("./models/resumenes")
const sumaResumenDias = require("./utilities/sumaResumenDias")
const { DateTime } = require("luxon")

let actualizarResumenesEnDelete = async (Resumen, tipo, id) => await Resumen.findByIdAndUpdate(DateTime.fromJSDate(id).startOf(tipo), { c: true })

//v es vendidos, i es ingresos, p es productoDesnormalizado, vt es ventasTotales, it es ingresosTotales, prods es productos
RegistroVentas.watch().on('change', async cambio => {
  try {
    let { operationType, documentKey: { _id } } = cambio
    if (operationType === "delete") await ResumenDia.deleteOne({ _id })
    else if (operationType === "insert" || "tablas" in cambio.updateDescription.updatedFields) {
      let venta = await RegistroVentas.buscarPorID(_id)
      await ResumenDia.findByIdAndUpdate(venta._id, sumaResumenDias(venta), { upsert: true })
    }
  } catch (error) {
    console.log(error)
  }
})

ResumenDia.watch().on('change', async cambio => {
  try {
    let { _id } = cambio.documentKey
    let promesas = [[ResumenSemana, "week"], [ResumenMes, "month"], [ResumenAño, "year"]]
    let res = await Promise.allSettled(promesas.map(async p => cambio.operationType === "delete" ? await actualizarResumenesEnDelete(...p, _id) : await verificarResumenes(...p, await ResumenDia.findById(_id).lean())))
    if (res.some(p => p.status === "rejected")) await Promise.all(promesas.filter((_, i) => res[i].status === "rejected"))
  } catch (error) {
    console.log(error)
  }
})

async function verificarResumenes(Resumen, tipo, resumenDia) {
  let id = DateTime.fromJSDate(resumenDia._id)
  let inicio = id.startOf(tipo)
  let resumen = await Resumen.buscarPorID(inicio).select("c -_id")
  if (!resumen) await Resumen.create({ ...resumenDia, _id: inicio, f: id.endOf(tipo), c: false })
  else if (!resumen.c) await Resumen.findByIdAndUpdate(inicio, { c: true })
}
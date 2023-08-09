const RegistroVentas = require("./models/registroventas");
const ResumenDia = require("./models/resumenDia");
const ResumenSemana = require("./models/resumenSemana");
const ResumenMes = require("./models/resumenMes");
const ResumenAño = require("./models/resumenAño");
const sumaResumenDias = require("./utilities/sumaResumenDias")
const RegistrosEliminados = require("./models/registroseliminados");
let borrarLlaves = require("./utilities/borrarLlavesRedis")
const { DateTime } = require("luxon");

RegistroVentas.watch().on('change', async (cambio) => {
  try {
    console.log('Change detected:', cambio);
    if (["insert", "update"].includes(cambio.operationType)) {
      let objcambiado = await RegistroVentas.findById(cambio.documentKey._id);
      if (cambio.operationType === "insert" || "tablas" in cambio.updateDescription.updatedFields)
        await calcularResumenPorDia(objcambiado);
    } else if (cambio.operationType === "delete")
      await ResumenDia.findById(cambio.documentKey._id).deleteOne()
  } catch (error) {
    console.log(error)
  }
})

//v es vendidos, i es ingresos, p es productoDesnormalizado, vt es ventasTotales, it es ingresosTotales, prods es productos 
async function calcularResumenPorDia(venta) {
  try {
    let { _id } = venta;
    let { prods, vt, it } = sumaResumenDias(venta)
    let resumenDia = await ResumenDia.findOne({ _id })
    resumenDia ? await resumenDia.updateOne({ prods, vt, it }) : await ResumenDia.create({ _id, prods, vt, it })
  } catch (e) {
    console.log(e)
  }
}

RegistrosEliminados.watch().on('change', borrarLlaves("registroseliminados"));
ResumenDia.watch().on('change', async cambio => {
  let { _id } = cambio.documentKey
  let id = DateTime.fromJSDate(_id)
  let { prods, vt, it } = await ResumenDia.findById(_id)
  let datosDia = { id, prods, vt, it }
  let promesas = [verificarResumenes(ResumenSemana, "week", datosDia), verificarResumenes(ResumenMes, "month", datosDia), verificarResumenes(ResumenAño, "year", datosDia)]
  let res = await Promise.allSettled(promesas)
  if(res.some(p => p.status === "rejected")) await Promise.all(res.filter((_, i) => res[i].status === "rejected"))
})

async function verificarResumenes(Resumen, tipo, datosDia) {
  let { id, prods, vt, it } = datosDia
  let inicio = id.startOf(tipo)
  let resumen = await Resumen.findById(inicio, { c: 1 })
  if (!resumen) await Resumen.create({ _id: inicio, f: id.endOf(tipo), prods, vt, it, c: false })
  else if (!resumen.c) await resumen.updateOne({ c: true })
}
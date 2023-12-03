const { google } = require("googleapis")
const { DateTime } = require("luxon")
const cron = require('node-cron')
const redis = require("../redis")
const CambiosVentas = require("../models/cambiosventas")
const RegistroVentas = require("../models/registroventas")

cron.schedule('0 0 1 * *', tccron(async () => {
  let folderRespaldoMensual = process.env.FOLDER_RESPALDO_MENSUAL
  let registros = await RegistroVentas.find().lean()
  let fecha = DateTime.now().minus({ days: 1 })
  await crearArchivo(`Respaldo mensual del mes de ${fecha.monthLong} del ${fecha.year}`, folderRespaldoMensual, registros, "ambos")
  await crearMesGoogleSheets()
  await crearMesGoogleDocs()
  await diaCron()
}, "Ocurrió un error al crear el respaldo mensual"), { timezone: "America/Guatemala" })


cron.schedule('0 0 * * *', tccron(async () => {
  if (DateTime.now().day !== 1) {
    await crearDiaGoogleSheets()
    await diaCron()
  }
}, "Ocurrió un error al crear el respaldo diario"), { timezone: "America/Guatemala" })


global.diaCron = async function () {
  await redis.set("hubocambioshoy", "0")
  await redis.set("sobreescribirfilagsheets", "0")
  let cambiosVentas = await CambiosVentas.find().lean()
  let cambios = {}
  cambiosVentas.forEach(x => {
    let { _id, motivo, fecha2 } = x
    cambios[_id] = { motivo, fecha2 }
    if (fecha2) cambios[fecha2] = { motivo: motivo * 100, fecha1: _id }
  })
  let creadosOModificados = []
  let borrados = []
  Object.entries(cambios).forEach(([key, value]) => {
    if ([1, 3, 4, 5, 6].includes(value.motivo)) creadosOModificados.push({ _id: key, ...cambios[key] })
    if ([2, 400].includes(value.motivo)) borrados.push({ _id: key, ...cambios[key] })
  })
  await Promise.all(creadosOModificados.map(async x => x.venta = await RegistroVentas.findById((new Date(x._id)).valueOf())))
  if (await guardarRespaldoDiario(creadosOModificados, "ambos", borrados)) await CambiosVentas.deleteMany()
  else throw new Error("Ocurrió un error al guardar los registros cambiados en google drive")
}
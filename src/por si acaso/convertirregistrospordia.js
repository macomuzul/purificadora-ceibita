const VentasPorDia = require("../models/registroventaspordia");
const RegistroVentas = require("../models/registroventas");
const devuelveNuevasTablas = require("./devuelveNuevasTablas");

async function convertirRegistrosPorDia() {
  let ventaspordia = await VentasPorDia.find().sort("_id")
  await RegistroVentas.insertMany(ventaspordia.map(venta => {
    let tablas = devuelveNuevasTablas(venta)
    return { _id: venta.fecha, usuario: venta.usuario || "usuariodesconocido", ultimocambio: venta.fechaultimocambio, tablas }
  }))
}

module.exports = convertirRegistrosPorDia
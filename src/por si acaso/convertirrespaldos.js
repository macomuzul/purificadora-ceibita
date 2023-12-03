const RegistrosEliminados = require("../models/registroseliminados");
const Respaldos = require("../models/respaldos");
const devuelveNuevasTablas = require("./devuelveNuevasTablas");

async function convertirRespaldos() {
  let registrosEliminados = await Respaldos.find()
  await RegistrosEliminados.insertMany(registrosEliminados.map(registro => {
    let venta = registro.ventaspordia
    let tablas = devuelveNuevasTablas(venta)
    let usuario = venta.usuario || "usuariodesconocido"
    let nuevoRegistro = { _id: venta.fecha, usuario, ultimocambio: venta.fechaultimocambio, tablas }
    return { registro: nuevoRegistro, borradoEl: registro.fechaeliminacion, usuario, motivo: 0 }
  }))
}

module.exports = convertirRespaldos
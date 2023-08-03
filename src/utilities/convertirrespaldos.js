const RegistrosEliminados = require("../models/registroseliminados");
const Respaldos = require("../models/respaldos");
const RegistroVentas = require("../models/registroventas");
const devuelveNuevasTablas = require("./devuelveNuevasTablas");

async function convertirRespaldos() {
  let registrosEliminados = await Respaldos.find()
  for (const registro of registrosEliminados) {
    let venta = registro.ventaspordia
    let tablas = devuelveNuevasTablas(venta)
    let nuevoRegistro = new RegistroVentas({ _id: venta.fecha, usuario: venta.usuario || "usuariodesconocido", ultimocambio: venta.fechaultimocambio, tablas })
    await new RegistrosEliminados({ registro: nuevoRegistro, borradoEl: registro.fechaeliminacion, usuario: venta.usuario || "usuariodesconocido", motivo: 0 }).save()
  }
}

module.exports = convertirRespaldos
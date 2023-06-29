const RegistrosEliminados = require("../models/registroseliminados");
const Respaldos = require("../models/respaldos");
const RegistroVentas = require("../models/registroventas");
const devuelveNuevasTablas = require("./devuelveNuevasTablas");

async function convertirRespaldos(){
  let registrosEliminados = await Respaldos.find()
  registrosEliminados.forEach(async registro => {
    let venta = registro.ventaspordia
    let tablas = devuelveNuevasTablas(venta)
    let nuevoRegistro = new RegistroVentas({_id: venta.fecha, usuario: venta.usuario || "asdfasdf", ultimocambio: venta.fechaultimocambio, tablas })

    let nuevoRegistroEliminado = new RegistrosEliminados({borradoEl: registro.fechaeliminacion, registro: nuevoRegistro })
    await nuevoRegistroEliminado.save()
  });
}

module.exports = convertirRespaldos
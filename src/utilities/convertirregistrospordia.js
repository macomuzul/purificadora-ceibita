const VentasPorDia = require("../models/registroventaspordia");
const RegistroVentas = require("../models/registroventas");
const devuelveNuevasTablas = require("./devuelveNuevasTablas");

async function convertirRegistrosPorDia(){
  let ventaspordia = await VentasPorDia.find()
  ventaspordia.forEach(async venta => {
    let tablas = devuelveNuevasTablas(venta)
    let nuevoRegistro = new RegistroVentas({_id: venta.fecha, usuario: venta.usuario || "usuariodesconocido", ultimocambio: venta.fechaultimocambio, tablas })
    await nuevoRegistro.save()
  });
}

module.exports = convertirRegistrosPorDia
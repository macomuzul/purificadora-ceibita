const RegistroVentas = require("../models/registroventas");
const ResumenDia = require("../models/resumenDia");
const sumaResumenDias = require("../utilities/sumaResumenDias")

async function calcularTodosLosResumenesPorDia() {
  let ventas = await RegistroVentas.ordenado()
  await ResumenDia.insertMany(ventas.map(venta => ({ _id: venta._id, ...sumaResumenDias(venta) })))
}

module.exports = calcularTodosLosResumenesPorDia
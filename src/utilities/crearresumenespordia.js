const RegistroVentas = require("../models/registroventas");
const ResumenDia = require("../models/resumenDia");
const sumaResumenDias = require("../utilities/sumaResumenDias")

async function calcularTodosLosResumenesPorDia() {
  let ventas = await RegistroVentas.find().sort("_id");
  let resumenDiaArr = ventas.map(x => calcularResumenPorDia(x));
  await ResumenDia.insertMany(resumenDiaArr);
}

function calcularResumenPorDia(venta) {
  try {
    let { _id } = venta;
    let { prods, vt, it } = sumaResumenDias(venta)
    return new ResumenDia({ _id, prods, vt, it })
  } catch (e) {
    console.log(e)
  }
}

module.exports = calcularTodosLosResumenesPorDia
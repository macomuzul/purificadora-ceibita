const RegistroVentas = require("../models/registroventas");
const ResumenDia = require("../models/resumenDia");

async function calcularTodosLosResumenesPorDia() {
  let ventas = await RegistroVentas.find();
  ventas.forEach(async venta => await calcularResumenPorDia(venta));
}

async function calcularResumenPorDia(venta) {
  try {
    let { _id } = venta;
    let listaTablasValores = venta.tablas.map(tabla => tabla.productos.map(producto => ({ producto: producto.nombre.normalizar(), v: producto.vendidos, i: producto.ingresos, p: producto.nombre })));
    let prods = listaTablasValores.reduce((acc, table) => {
      table.forEach(prod => {
        if (acc[prod.producto]) {
          acc[prod.producto].v += prod.v;
          acc[prod.producto].i += prod.i;
        } else {
          acc[prod.producto] = { v: prod.v, i: prod.i, p: prod.p };
        }
      });
      return acc;
    }, {});
    let vt = 0;
    let it = 0;
    for (const key in prods) {
      vt += prods[key].v;
      it += prods[key].i;
    }
    it = it.normalizarPrecio()
    let resumenDia = await ResumenDia.findOne({ _id });
    if (resumenDia)
      Object.assign(resumenDia, { prods, vt, it });
    else
      resumenDia = new ResumenDia({ _id, prods, vt, it });
    await resumenDia.save();
  } catch (e) {
    console.log(e)
  }
}

String.prototype.normalizar = function () { return this.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, "") }
Number.prototype.normalizarPrecio = function () { return this.toFixed(2).replace(/[.,]00$/, "") }


module.exports = calcularTodosLosResumenesPorDia
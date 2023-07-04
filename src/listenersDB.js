const RegistroVentas = require("./models/registroventas");
const ResumenDia = require("./models/resumenDia");
const ResumenMes = require("./models/resumenMes");
const CalendarioCamioneros = require("./models/calendarioCamioneros");
const RegistrosEliminados = require("./models/registroseliminados");
let borrarLlaves = require("./utilities/borrarLlavesRedis")
const { DateTime } = require("luxon");


RegistroVentas.watch().on('change', async (cambio) => {
  try {
    console.log('Change detected:', cambio);
    if (["insert", "update"].includes(cambio.operationType)) {
      let objcambiado = await RegistroVentas.findById(cambio.documentKey._id);
      if (cambio.operationType === "insert" || cambio.updateDescription.updatedFields.hasOwnProperty("tablas")) {
        await calcularResumenPorDia(objcambiado);
      }
    } else if (cambio.operationType === "delete") {
      let objcambiado = await RegistroVentas.findById(cambio.documentKey._id);
      console.log(objcambiado)
    }
  } catch (error) {
    console.log(error)
  }
});

// async function actualizarCamioneros(venta) {
//   let _id = venta.fecha;
//   let ultimoCambio = venta.fechaultimocambio;
//   console.log(ultimoCambio)
//   let camioneros = venta.camiones.map(el => el.nombretrabajador);
//   let usuario = venta.usuario;
//   let idMes = DateTime.fromJSDate(_id).toFormat("y/M");
//   let calendarioCamioneros = await CalendarioCamioneros.findById(idMes);
//   if (calendarioCamioneros) {
//     let dia = calendarioCamioneros.dias.find(el => el._id.toString() === _id.toString());
//     if (dia)
//       Object.assign(dia, { camioneros, ultimoCambio, usuario });
//     else
//       calendarioCamioneros.dias.push({ _id, camioneros, ultimoCambio, usuario })
//     calendarioCamioneros.save();
//   } else {
//     let dias = [{ _id, camioneros, ultimoCambio, usuario }];
//     let nuevo = new CalendarioCamioneros({ _id: idMes, dias});
//     nuevo.save();
//   }
// }

function calcularTodosLosResumenesPorDia() {
  let ventas = RegistroVentas.find();
}

//v es vendidos, i es ingresos, p es productoDesnormalizado, vt es ventasTotales, it es ingresosTotales, prods es productos 
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

String.prototype.normalizar = function () {
  return this.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
}


RegistrosEliminados.watch().on('change', borrarLlaves("registroseliminados"));

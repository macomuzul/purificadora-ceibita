const VentasPorDia = require("./models/registroventaspordia");
const ResumenDia = require("./models/resumenDia");
const ResumenMes = require("./models/resumenMes");
const CalendarioCamioneros = require("./models/calendarioCamioneros");
const RegistrosEliminados = require("./models/registroseliminados");
let borrarLlaves = require("./utilities/borrarLlavesRedis")
const redis = require('./redis');
const { DateTime } = require("luxon");


VentasPorDia.watch().on('change', async (cambio) => {
  console.log('Change detected:', cambio);
  if (cambio.operationType === "insert" || cambio.operationType === "update") {
    await calcularResumenPorDia(await VentasPorDia.findById(cambio.documentKey._id))
  }
});

function calcularTodosLosResumenesPorDia() {
  let ventas = VentasPorDia.find();
}

async function calcularResumenPorDia(venta) {
  try {
    // let fecha = DateTime.fromJSDate(venta.fecha).setZone("utc").toFormat("y/M/d");
    listaTablasValores = [];
    venta.camiones.forEach(camion => {
      listaValores = [];
      camion.filas.forEach(fila => {
        let valor = { producto: fila.nombreproducto.normalizar(), vendidos: fila.vendidos, ingresos: fila.ingresos, productoDesnormalizado: fila.nombreproducto }
        listaValores.push(valor);
      });
      listaTablasValores.push(listaValores);
    });

    let productos = listaTablasValores.reduce((acc, table) => {
      table.forEach(fila => {
        if (acc[fila.producto]) {
          acc[fila.producto].vendidos += fila.vendidos;
          acc[fila.producto].ingresos += fila.ingresos;
        } else {
          acc[fila.producto] = { vendidos: fila.vendidos, ingresos: fila.ingresos, productoDesnormalizado: fila.productoDesnormalizado };
        }
      });
      return acc;
    }, {});
    let vendidosTotal = 0;
    let ingresosTotal = 0;
    for (const key in productos) {
      vendidosTotal += productos[key].vendidos;
      ingresosTotal += productos[key].ingresos;
    }
    let resumenDia = await ResumenDia.findOne({ _id: venta.fecha });
    console.log(resumenDia)
    if (resumenDia) {
      console.log("opa")
      Object.assign(resumenDia, { productos, vendidosTotal, ingresosTotal });
    }
    else {
      console.log("ayayay")
      resumenDia = new ResumenDia({ _id: venta.fecha, productos, vendidosTotal, ingresosTotal });
    }
    await resumenDia.save();
    console.log("guardado")
  } catch (e) {
    console.log(e)
  }
}

String.prototype.normalizar = function () {
  return this.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
}


const changeStream = RegistrosEliminados.watch();
changeStream.on('change', borrarLlaves("registroseliminados"));

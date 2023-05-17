const VentasPorDia = require("./models/registroventaspordia");
const ResumenDia = require("./models/resumenDia");
const ResumenMes = require("./models/resumenMes");
const CalendarioCamioneros = require("./models/calendarioCamioneros");
const RegistrosEliminados = require("./models/registroseliminados");
let borrarLlaves = require("./utilities/borrarLlavesRedis")
const redis = require('./redis');
const { DateTime } = require("luxon");


VentasPorDia.watch().on('change', async (cambio) => {
  try {
    console.log('Change detected:', cambio);
    if (cambio.operationType === "insert" || cambio.operationType === "update") {
      let objcambiado = await VentasPorDia.findById(cambio.documentKey._id);
      await actualizarCamioneros(objcambiado);
      if(cambio.updateDescription.updatedFields.hasOwnProperty("camiones"))
        await calcularResumenPorDia(objcambiado);
    }
  } catch (error) {
    console.log(error)
  }
});

async function actualizarCamioneros(venta) {
  let _id = venta.fecha;
  let fechaultimocambio = venta.fechaultimocambio;
  let camioneros = venta.camiones.map(el => el.nombretrabajador);
  let usuario = venta.usuario;
  let idMes = DateTime.fromJSDate(_id).toFormat("y/M");
  let calendarioCamioneros = await CalendarioCamioneros.findById(idMes);
  if (calendarioCamioneros) {
    let dia = calendarioCamioneros.dias.find(el => el._id.toString() === _id.toString());
    if (dia)
      Object.assign(dia, { camioneros, fechaultimocambio, usuario });
    else
      calendarioCamioneros.dias.push({ _id, camioneros, fechaultimocambio, usuario })
    calendarioCamioneros.save();
  } else {
    let dias = [{ _id, camioneros, fechaultimocambio }];
    let nuevo = new CalendarioCamioneros({ _id: idMes, dias, usuario });
    nuevo.save();
  }
}

function calcularTodosLosResumenesPorDia() {
  let ventas = VentasPorDia.find();
}

async function calcularResumenPorDia(venta) {
  try {
    let _id = venta.fecha;
    let listaTablasValores = [];
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
    let resumenDia = await ResumenDia.findOne({ _id });
    if (resumenDia)
      Object.assign(resumenDia, { productos, vendidosTotal, ingresosTotal });
    else
      resumenDia = new ResumenDia({ _id, productos, vendidosTotal, ingresosTotal });
    await resumenDia.save();
  } catch (e) {
    console.log(e)
  }
}

String.prototype.normalizar = function () {
  return this.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
}


const changeStream = RegistrosEliminados.watch();
changeStream.on('change', borrarLlaves("registroseliminados"));

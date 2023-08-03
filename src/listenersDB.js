// const RegistroVentas = require("./models/registroventas");
// const ResumenDia = require("./models/resumenDia");
// const ResumenSemana = require("./models/resumenSemana");
// const ResumenMes = require("./models/resumenMes");
// const ResumenAño = require("./models/resumenAño");
// const sumaResumenDias = require("./utilities/sumaResumenDias")
// // const CalendarioCamioneros = require("./models/calendarioCamioneros");
// const RegistrosEliminados = require("./models/registroseliminados");
// let borrarLlaves = require("./utilities/borrarLlavesRedis")
// const { DateTime } = require("luxon");

// RegistroVentas.watch().on('change', async (cambio) => {
//   try {
//     console.log('Change detected:', cambio);
//     if (["insert", "update"].includes(cambio.operationType)) {
//       let objcambiado = await RegistroVentas.findById(cambio.documentKey._id);
//       if (cambio.operationType === "insert" || "tablas" in cambio.updateDescription.updatedFields)
//         await calcularResumenPorDia(objcambiado);
//     } else if (cambio.operationType === "delete")
//       await ResumenDia.findById(cambio.documentKey._id).deleteOne()
//   } catch (error) {
//     console.log(error)
//   }
// });

// // async function actualizarCamioneros(venta) {
// //   let _id = venta.fecha;
// //   let ultimoCambio = venta.fechaultimocambio;
// //   console.log(ultimoCambio)
// //   let camioneros = venta.camiones.map(el => el.nombretrabajador);
// //   let usuario = venta.usuario;
// //   let idMes = DateTime.fromJSDate(_id).toFormat("y/M");
// //   let calendarioCamioneros = await CalendarioCamioneros.findById(idMes);
// //   if (calendarioCamioneros) {
// //     let dia = calendarioCamioneros.dias.find(el => el._id.toString() === _id.toString());
// //     if (dia)
// //       Object.assign(dia, { camioneros, ultimoCambio, usuario });
// //     else
// //       calendarioCamioneros.dias.push({ _id, camioneros, ultimoCambio, usuario })
// //     calendarioCamioneros.save();
// //   } else {
// //     let dias = [{ _id, camioneros, ultimoCambio, usuario }];
// //     let nuevo = new CalendarioCamioneros({ _id: idMes, dias});
// //     nuevo.save();
// //   }
// // }

// //v es vendidos, i es ingresos, p es productoDesnormalizado, vt es ventasTotales, it es ingresosTotales, prods es productos 
// async function calcularResumenPorDia(venta) {
//   try {
//     let { _id } = venta;
//     let { prods, vt, it } = sumaResumenDias(venta)
//     let resumenDia = await ResumenDia.findOne({ _id });
//     if (resumenDia)
//       await resumenDia.updateOne({ prods, vt, it })
//     else
//       await new ResumenDia({ _id, prods, vt, it }).save()
//   } catch (e) {
//     console.log(e)
//   }
// }

// RegistrosEliminados.watch().on('change', borrarLlaves("registroseliminados"));
// ResumenDia.watch().on('change', async cambio => {
//   let { _id } = cambio.documentKey
//   let id = DateTime.fromJSDate(_id)
//   let { prods, vt, it } = await ResumenDia.findById(_id)
//   let otrosDatos = { id, prods, vt, it }
//   await verificarResumenes(ResumenSemana, "week", otrosDatos)
//   await verificarResumenes(ResumenMes, "month", otrosDatos)
//   await verificarResumenes(ResumenAño, "year", otrosDatos)
// });

// async function verificarResumenes(Resumen, tipo, otrosDatos) {
//   let { id, prods, vt, it } = otrosDatos
//   let inicio = id.startOf(tipo)
//   let resumen = await Resumen.findById(inicio)
//   if (!resumen)
//     await new Resumen({ _id: inicio, f: id.endOf(tipo), prods, vt, it, c: false }).save()
//   else if (!resumen.c)
//     await resumen.updateOne({ c: true })
// }
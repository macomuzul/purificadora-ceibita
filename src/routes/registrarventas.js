const router = require("express").Router();
const VentasPorDia = require("../models/registroventaspordia");
const plantilla = require("../models/plantillas");
const Respaldo = require("../models/registroseliminados");
const ResumenDia = require("../models/resumenDia");
const ResumenMes = require("../models/resumenMes");
const Camioneros = require("../models/camioneros");
const { DateTime } = require("luxon");

function calcularTodosLosResumenesPorDia() {
  let ventas = VentasPorDia.find();

}

function calcularResumenPorDia(venta) {
  listaTablasValores = [];
  venta.camiones.forEach(camion => {
    listaValores = [];
    camion.filas.forEach(fila => {
      let valor = { producto: fila.nombreproducto.normalizar(), vendidos: fila.vendidos, ingresos: fila.ingresos, productoDesnormalizado: fila.nombreproducto }
      listaValores.push(valor);
    });
    listaTablasValores.push(listaValores);
  });

  let result = listaTablasValores.reduce((acc, table) => {
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



}
String.prototype.normalizar = function () {
  return this.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
}

router.post("/guardar", async (req, res) => {
  try {
    let ventas = new VentasPorDia(req.body);
    ventas.usuario = req.user?.usuario ?? "yoquese";
    let registroanterior = await VentasPorDia.findOne({ fecha: ventas.fecha });
    if (registroanterior) { //si ya existe un registro anterior lo guarda en la parte de respaldos
      let respaldo = new Respaldo();
      respaldo.ventaspordia = registroanterior;
      respaldo.fechaeliminacion = new Date();
      await respaldo.save();
      await registroanterior.deleteOne();
    }
    await ventas.save();
    if (ResumenDia.find()) {

    }
    res.send("Se ha guardado con exito");

  } catch (e) {
    res.status(400).send("Error al guardar");
    console.log(e)
  }
});


router.get("/:id", async (req, res) => {
  try {
    id = req.params.id;
    var datos = id.split("-");
    if (datos.length !== 3)
      return res.send("página inválida");
    const fecha = DateTime.fromFormat(id, "d-M-y", { zone: "utc" });
    const datostablas = await VentasPorDia.findOne({ fecha });
    const plantillas = await plantilla.find().sort("orden");
    const plantillaDefault = await plantilla.findOne({ esdefault: true });
    let listaCamioneros = await Camioneros.findOne();
    let camioneros = listaCamioneros.camioneros.map(el => el.nombre);
    let fechastr = fecha.toLocaleString(DateTime.DATE_HUGE);
    res.render("registrarventas", { fecha: fecha.toFormat("d/M/y"), ventaspordia: datostablas, plantillas, plantillaDefault, fechastr, camioneros, DateTime});
  } catch (e) {
    console.log(e)
    res.send("página inválida");
  }
});

VentasPorDia.watch().on('change', (cambio) => {
  console.log('Change detected:', cambio);
});

module.exports = router;
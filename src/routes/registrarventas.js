const router = require("express").Router();
const RegistroVentas = require("../models/registroventas");
const plantilla = require("../models/plantillas");
const RegistrosEliminados = require("../models/registroseliminados");
const Camioneros = require("../models/camioneros");
const { DateTime } = require("luxon");
const _ = require("lodash");

router.post("/guardar", async (req, res) => {
  try {
    let ventasNuevo = new RegistroVentas(req.body);
    ventasNuevo.usuario = req.user?.usuario ?? "usuariodesconocido";
    let ventasAnterior = await RegistroVentas.findById(ventasNuevo._id);
    if (ventasAnterior) { //si ya existe un registro anterior lo guarda en la parte de respaldos
      await new RegistrosEliminados({ registro: ventasAnterior, borradoEl: new Date() }).save()
      _.extend(ventasAnterior, _.pick(ventasNuevo, ["usuario", "ultimocambio", "tablas"]));
      await ventasAnterior.save();
    }
    else
      await ventasNuevo.save();
    res.send("Se ha guardado con exito");

  } catch (e) {
    res.status(400).send("Error al guardar");
    console.log(e)
  }
});

router.post("/mover", async (req, res) => {
  try {
    let { anterior, fecha, sobreescribir } = req.body;
    let registrorecuperado = await RegistroVentas.findById(anterior);
    if (registrorecuperado == null)
      return res.status(400).send("Registro no existe");

    let registroanterior = await RegistroVentas.findById(fecha) //si ya existe un registro anterior lo guarda en la parte de respaldos
    let { tablas } = registrorecuperado
    let ahora = new Date()
    let nuevosDatos = { usuario: req.user?.usuario ?? "usuariodesconocido", ultimocambio: ahora, tablas }
    if (registroanterior) {
      if (!sobreescribir)
        return res.send(registroanterior);

      await new RegistrosEliminados({ registro: registroanterior, borradoEl: ahora }).save()
      await registroanterior.updateOne(nuevosDatos)
    } else
      await new RegistroVentas({ _id: fecha, ...nuevosDatos }).save()
    await registrorecuperado.deleteOne();
    res.send("Se ha restaurado con éxito");
  } catch (e) {
    res.status(400).send("Error al guardar");
    console.log(e)
  }
});


router.route("/:id").get(async (req, res) => {
  try {
    let { id } = req.params;
    let datos = id.split("-");
    if (datos.length !== 3)
      return res.send("página inválida");
    let fecha = DateTime.fromFormat(id, "d-M-y");
    let registro = await RegistroVentas.findById(fecha);
    let plantillas = await plantilla.find({}, { nombre: 1, _id: 0 }).sort("orden");
    let plantillaDefault = await plantilla.findOne({ esdefault: true });
    let listaCamioneros = await Camioneros.findOne({}, { "camioneros.nombre": 1, _id: 0 });
    let camioneros = listaCamioneros.camioneros.map(el => el.nombre);
    let fechastr = fecha.toLocaleString(DateTime.DATE_HUGE);
    res.render("registrarventas", { fecha: fecha.toFormat("d/M/y"), registro: registro, plantillas, plantillaDefault, fechastr, camioneros, DateTime });
  } catch (e) {
    console.log(e)
    res.status(400).send("página inválida");
  }
}).delete(async (req, res) => {
  try {
    let { id } = req.params;
    let datos = id.split("-");
    if (datos.length !== 3)
      return
    let fecha = DateTime.fromFormat(id, "d-M-y");
    let registro = await RegistroVentas.findById(fecha);
    await new RegistrosEliminados({ registro, borradoEl: new Date() }).save()
    registro.deleteOne();
    res.send("Exito");
  } catch (e) {
    console.log(e)
    res.send("página inválida");
  }
});


module.exports = router;
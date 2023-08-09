const router = require("express").Router();
const RegistroVentas = require("../models/registroventas");
const plantilla = require("../models/plantillas");
const RegistrosEliminados = require("../models/registroseliminados");
const Camioneros = require("../models/camioneros");
const { DateTime } = require("luxon");
const _ = require("lodash");

let mandarError = (res, mensaje) => res.status(400).send(mensaje)
router.post("/guardar", async (req, res) => {
  try {
    let ventasNuevo = new RegistroVentas(req.body);
    let usuario = req.user?.usuario ?? "usuariodesconocido"
    ventasNuevo.usuario = usuario
    let registroanterior = await RegistroVentas.findById(ventasNuevo._id);
    if (registroanterior) { //si ya existe un registro anterior lo guarda en la parte de respaldos
      await RegistrosEliminados.create({ registro: registroanterior, usuario, motivo: 0 })
      _.extend(registroanterior, _.pick(ventasNuevo, ["usuario", "ultimocambio", "tablas"]))
      await registroanterior.save()
    }
    else
      await ventasNuevo.save()
    res.send("Éxito")

  } catch (e) {
    mandarError(res, "Error al guardar")
    console.log(e)
  }
})

router.post("/mover", async (req, res) => {
  try {
    let { anterior, fecha, sobreescribir } = req.body;
    let registroAMover = await RegistroVentas.findById(anterior);
    if (registroAMover == null)
      return mandarError(res, "Registro no existe")

    let registroanterior = await RegistroVentas.findById(fecha) //si ya existe un registro anterior lo guarda en la parte de respaldos
    let ahora = new Date()
    let usuario = req.user?.usuario ?? "usuariodesconocido"
    let nuevosDatos = { usuario, ultimocambio: ahora, tablas: registroAMover.tablas }
    if (registroanterior) {
      if (!sobreescribir)
        return res.send(registroanterior);

      await RegistrosEliminados.create({ registro: registroanterior, borradoEl: ahora, usuario, motivo: 1 })
      await registroanterior.updateOne(nuevosDatos)
    } else
      await RegistroVentas.create({ _id: fecha, ...nuevosDatos })
    await registroAMover.deleteOne()
    res.send("Éxito")
  } catch (e) {
    console.log(e)
    mandarError(res, "Error al guardar")
  }
});


router.route('/:id([0-9]{1,2}-[0-9]{1,2}-[0-9]{4})').get(async (req, res) => {
  try {
    let fecha = DateTime.fromFormat(req.params.id, "d-M-y")
    let registro = await RegistroVentas.findById(fecha)
    let plantillas = await plantilla.nombrePlantillas()
    let plantillaDefault = registro ? plantillas.find(x => x.esdefault) : await plantilla.findOne({ esdefault: 1 }, { nombre: 1, productos: 1, _id: 0 })
    let listaCamioneros = await Camioneros.findOne({}, { "camioneros.nombre": 1, _id: 0 })
    let camioneros = listaCamioneros?.camioneros.map(el => el.nombre) || []
    res.render("registrarventas", { fecha: fecha.toFormat("d/M/y"), registro, plantillas, plantillaDefault, fechastr: fecha.toLocaleString(DateTime.DATE_HUGE), camioneros })
  } catch (e) {
    console.log(e)
    mandarError(res, "página inválida")
  }
}).delete(async (req, res) => {
  try {
    let fecha = DateTime.fromFormat(req.params.id, "d-M-y")
    let registro = await RegistroVentas.findById(fecha)
    if (!registro)
      return mandarError(res, "El registro no existe o ya fue borrado")
    await RegistrosEliminados.create({ registro, usuario: req.user?.usuario ?? "usuariodesconocido", motivo: 3 })
    registro.deleteOne()
    res.send("Éxito")
  } catch (e) {
    console.log(e)
    mandarError(res, "página inválida")
  }
})


module.exports = router;
const router = require("express").Router();
const RegistroVentas = require("../models/registroventas");
const Plantilla = require("../models/plantillas");
const RegistrosEliminados = require("../models/registroseliminados");
const Camioneros = require("../models/camioneros");
const { DateTime } = require("luxon");
const _ = require("lodash");

let mandarError = (res, mensaje) => res.status(400).send(mensaje)
let devuelveUsuario = req => ({ usuario: req.user?.usuario ?? "usuariodesconocido" })

router.post("/guardar", async (req, res) => {
  try {
    await RegistroVentas.guardar({ ...req.body, ...devuelveUsuario(req) }, 0)
    res.send("Éxito")
  } catch (e) {
    console.log("nombre", e.name)
    console.log(e)
    mandarError(res, e.name === 'ValidationError' ? Object.values(e.errors)[0].message : "Error al guardar")
  }
})

router.post("/mover", devuelveFuncionMover(RegistroVentas, "Hubo un error al momento de mover el registro"))

function devuelveFuncionMover(Reg, msg) {
  return async (req, res) => {
    try {
      let { de, a, sobreescribir } = req.body
      let registroAMover = await Reg.buscarPorID(de)
      if (!registroAMover) return mandarError(res, "Registro no existe")
      let registroanterior = await RegistroVentas.buscarPorID(a)
      if (registroanterior && !sobreescribir) return res.send(registroanterior.tablas)

      let { tablas, _id } = registroAMover
      await RegistroVentas.guardar({ _id: a, tablas, ...devuelveUsuario(req) }, 2)
      await Reg.findByIdAndDelete(_id)
      res.send("Éxito")
    } catch (e) {
      console.log(e)
      mandarError(res, 'ValidationError' ? Object.values(e.errors)[0].message : "Error al guardar")
    }
  }
}


router.route('/:id([0-9]{1,2}-[0-9]{1,2}-[0-9]{4})').get(async (req, res) => {
  try {
    let fecha = DateTime.fromFormat(req.params.id, "d-M-y")
    let registro = await RegistroVentas.buscarPorID(fecha.toJSDate())
    let plantillas = await Plantilla.nombres()
    let plantillaDefault = await Plantilla.encontrar({ esdefault: true }).select("nombre productos -_id")
    let camioneros = await Camioneros.nombres()
    res.render("registrarventas", { fecha: fecha.toFormat("d/M/y"), registro, plantillas, plantillaDefault, fechastr: fecha.toLocaleString(DateTime.DATE_HUGE), camioneros })
  } catch (e) {
    console.log(e)
    mandarError(res, "página inválida")
  }
}).delete(async (req, res) => {
  try {
    let registro = await RegistroVentas.buscarPorID(DateTime.fromFormat(req.params.id, "d-M-y"))
    if (!registro) return mandarError(res, "El registro no existe o ya fue borrado")
    await RegistrosEliminados.create({ registro, ...devuelveUsuario(req), motivo: 3 })
    await RegistroVentas.findByIdAndDelete(registro._id)
    res.send("Éxito")
  } catch (e) {
    console.log(e)
    mandarError(res, "página inválida")
  }
})


module.exports = { router, devuelveUsuario, devuelveFuncionMover }
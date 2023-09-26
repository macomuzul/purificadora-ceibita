const router = require("express").Router();
const RegistroVentas = require("../models/registroventas");
const Plantilla = require("../models/plantillas");
const RegistrosEliminados = require("../models/registroseliminados");
const Camioneros = require("../models/camioneros");
const { DateTime } = require("luxon");
const _ = require("lodash");

let devuelveUsuario = req => ({ usuario: req.user?.usuario ?? "usuariodesconocido" })

router.post("/guardar", trycatchruta(async (req, res) => {
  let r = await RegistroVentas.guardar({ ...req.body, ...devuelveUsuario(req) }, 0)
  res.send()
  await mandarCorreo(r.upsertedCount > 0 ? 0 : 1, req.user?.usuario ?? "usuariodesconocido", req.body._id)
}, "Ha habido un error al guardar los datos"))

let devuelveFuncionMover = (Reg, msg) => trycatchruta(async (req, res) => {
  let { de, a, sobreescribir } = req.body
  let registroAMover = await Reg.buscarPorID(de)
  if (!registroAMover) throw new errorDB("Registro no existe")
  let registroanterior = await RegistroVentas.buscarPorID(a)
  if (registroanterior && !sobreescribir) return res.status(201).send(registroanterior.tablas)

  let esRegEliminado = Reg.modelName === "registroseliminados"
  let { tablas } = esRegEliminado ? registroAMover.registro : registroAMover
  await RegistroVentas.guardar({ _id: a, tablas, ...devuelveUsuario(req) }, esRegEliminado ? 3 : 2)
  await Reg.deleteOne({ _id: registroAMover._id })
  res.send()
  await mandarCorreo(esRegEliminado ? sobreescribir ? 6 : 5 : sobreescribir ? 4 : 3, req.user?.usuario ?? "usuariodesconocido", a, esRegEliminado ? registroAMover.registro._id.valueOf() : de)
}, msg)


router.post("/mover", devuelveFuncionMover(RegistroVentas, "Hubo un error al momento de mover el registro"))


router.route('/:id([0-9]{1,2}-[0-9]{1,2}-[0-9]{4})').get(trycatchruta(async (req, res) => {
  let fecha = DateTime.fromFormat(req.params.id, "d-M-y")
  let registro = await RegistroVentas.buscarPorID(fecha.toJSDate())
  let plantillas = await Plantilla.nombres()
  let plantillaDefault = await Plantilla.encontrar({ esdefault: true }).select("nombre productos -_id")
  let camioneros = await Camioneros.nombres()
  res.render("registrarventas", { fecha: fecha.toFormat("d/M/y"), registro, plantillas, plantillaDefault, fechastr: fecha.toLocaleString(DateTime.DATE_HUGE), camioneros })
}, "página inválida")).delete(trycatchruta(async (req, res) => {
  let fecha = DateTime.fromFormat(req.params.id, "d-M-y")
  let registro = await RegistroVentas.buscarPorID(fecha)
  if (!registro) throw errorDB("El registro que deseas borrar ya no existe")
  await RegistrosEliminados.create({ registro, ...devuelveUsuario(req), motivo: 3 })
  await RegistroVentas.borrar(registro._id)
  res.send()
  await mandarCorreo(2, req.user?.usuario ?? "usuariodesconocido", fecha.toMillis())
}, "Ocurrió un error al eliminar el registro"))


module.exports = { router, devuelveUsuario, devuelveFuncionMover }
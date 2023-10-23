const router = require("express").Router()
const RegistroVentas = require("../models/registroventas")
const Plantilla = require("../models/plantillas")
const RegistrosEliminados = require("../models/registroseliminados")
const CambiosVentas = require("../models/cambiosventas")
const Camioneros = require("../models/camioneros")
const { DateTime } = require("luxon")

router.post("/guardar", tcaccion(async (req, res) => {
  let usuario = devuelveUsuario(req)
  let r = await RegistroVentas.guardar({ ...req.body, usuario }, 0)
  res.send()
  let { _id } = req.body
  await CambiosVentas.updateOne({ _id }, { motivo: 1 }, { upsert: true })
  await mandarCorreoRegVentas(r.upsertedCount > 0 ? 0 : 1, usuario, _id)
}, "Ha habido un error al guardar los datos"))

let devuelveFuncionMover = (Reg, msg) => tcaccion(async (req, res) => {
  let { de, a, sobreescribir } = req.body
  let registroAMover = await Reg.buscarPorID(de)
  if (!registroAMover) throw new errorDB("Registro no existe")
  let registroanterior = await RegistroVentas.buscarPorID(a)
  if (registroanterior && !sobreescribir) return res.status(201).send(registroanterior.tablas)

  let esRegEliminado = Reg.modelName === "registroseliminados"
  let { tablas } = esRegEliminado ? registroAMover.registro : registroAMover
  let usuario = devuelveUsuario(req)
  await RegistroVentas.guardar({ _id: a, tablas, usuario }, esRegEliminado ? 3 : 2)
  await Reg.borrar(registroAMover._id)
  res.send()
  let motivo = esRegEliminado ? sobreescribir ? 6 : 5 : sobreescribir ? 4 : 3
  await CambiosVentas.updateOne({ _id: a }, { motivo, ...(motivo < 5 ? { fecha2: de } : {}) }, { upsert: true })
  await mandarCorreoRegVentas(motivo, usuario, esRegEliminado ? registroAMover.registro._id.valueOf() : de, a)
}, msg)


router.post("/mover", devuelveFuncionMover(RegistroVentas, "Hubo un error al momento de mover el registro"))


router.route('/:id([0-9]{1,2}-[0-9]{1,2}-[0-9]{4})').get(tcaccion(async (req, res) => {
  let fecha = DateTime.fromFormat(req.params.id, "d-M-y")
  let registro = await RegistroVentas.buscarPorID(fecha.toJSDate())
  let plantillas = await Plantilla.nombres()
  let plantillaDefault = await Plantilla.encontrar({ esdefault: true }).select("nombre productos -_id")
  let camioneros = await Camioneros.nombres()
  res.render("registrarventas", { fecha: fecha.toFormat("d/M/y"), registro, plantillas, plantillaDefault, fechastr: fecha.toLocaleString(DateTime.DATE_HUGE), camioneros, esAdmin: esAdmin(req) })
}, "página inválida")).delete(verificacionIdentidad, tcaccion(async (req, res) => {
  let fecha = DateTime.fromFormat(req.params.id, "d-M-y")
  let registro = await RegistroVentas.buscarPorID(fecha)
  if (!registro) throw errorDB("El registro que deseas borrar ya no existe")
  let usuario = devuelveUsuario(req)
  await RegistrosEliminados.create({ registro, usuario, motivo: 3 })
  await RegistroVentas.borrar(registro._id)
  res.send()
  await CambiosVentas.updateOne({ _id: fecha }, { motivo: 2 }, { upsert: true })
  await mandarCorreoRegVentas(2, usuario, fecha.toMillis())
}, "Ocurrió un error al eliminar el registro"))


module.exports = { router, devuelveFuncionMover }
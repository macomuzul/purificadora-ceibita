// const router = require('express').Router()
// const { DateTime } = require('luxon')
// const Gastos = require("../models/gastos")
// const CategoriasGastos = require("../models/categoriasgastos")

// let devuelveMes = (fecha, dias) => ({ _id: fecha, dias: dias.map(({ _id, tablas, usuario, ultimocambio }) => ({ _id, camioneros: tablas.map(x => x.trabajador), usuario, ultimocambio })) })
// let datosMes = async fecha => await RegistroVentas.where("_id").gte(fecha.startOf("month")).lte(fecha.endOf("month")).select("tablas.trabajador usuario ultimocambio").lean()

// router.route('/').get(async (req, res) => {
//   let fecha = DateTime.now().setZone("America/Guatemala")
//   let dias = await datosMes(DateTime.fromISO(fecha.toISODate()))
//   let camioneros = await Camioneros.encontrar()
//   fecha = fecha.toFormat("y/M")
//   res.render('calendario', { mes: devuelveMes(fecha, dias), camioneros, fechaActual: fecha, esAdmin: esAdmin(req) })
// }).post(tcaccion(async (req, res) => {
//   fecha = DateTime.fromFormat(req.body.fecha, "y/M")
//   let dias = await datosMes(fecha)
//   res.send(dias ? devuelveMes(fecha, dias) : [])
// }, "Hubo un error"))


// module.exports = router



const router = require('express').Router()
const { DateTime } = require('luxon')
const Gastos = require('../models/gastos')
router.get('/', (req, res) => res.render('seleccionargastos', {fecha: DateTime.now().startOf('month').toFormat('dd/MM/y')}))

router.route('/:fechaP').get(tcrutas(async (req, res) => {
  let fecha = DateTime.fromFormat(req.params.fechaP, 'd-M-y')
  let datos = await Gastos.buscarPorID(fecha) || {}
  res.render('gastos', { datos, fechaTexto: fecha.toLocaleString({ month: 'long', year: 'numeric' })})
})).post(tcrutas(async (req, res) => {
  await Gastos.guardar({ _id: DateTime.fromFormat(req.params.fechaP, 'd-M-y'), usuario: devuelveUsuario(req), ...req.body })
  res.send()
}))

module.exports = router

const router = require('express').Router()
const { DateTime } = require('luxon')
const Gastos = require('../models/gastos')
router.get('/', (req, res) => res.render('gastos', {fecha: DateTime.now().startOf('month').toFormat('dd/MM/y')}))

router.route('/:fechaP').get(tcrutas(async (req, res) => {
  let { fechaP } = req.params
  let fecha = DateTime.fromFormat(fechaP, 'd-M-y')
  let datos = await Gastos.buscarPorID(fecha) || {}
  res.render('mostrargastos', { datos, fechaTexto: fecha.toLocaleString({ month: 'long', year: 'numeric' })})
}))
.post(tcrutas(async (req, res) => {
  await Gastos.guardar({ _id: DateTime.fromFormat(req.params.fechaP, 'd-M-y'), usuario: devuelveUsuario(req), ...req.body })
  res.send()
}))

module.exports = router

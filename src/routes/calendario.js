const router = require('express').Router()
const { DateTime } = require('luxon')
const RegistroVentas = require("../models/registroventas")
const Camioneros = require("../models/camioneros")

let devuelveMes = (fecha, dias) => ({ _id: fecha, dias: dias.map(({ _id, tablas, usuario, ultimocambio }) => ({ _id, camioneros: tablas.map(x => x.trabajador), usuario, ultimocambio })) })
let datosMes = async fecha => await RegistroVentas.where("_id").gte(fecha.startOf("month")).lte(fecha.endOf("month")).select("tablas.trabajador usuario ultimocambio").lean()

router.route('/calendario').get(async (req, res) => {
  let fecha = DateTime.now().setZone("America/Guatemala")
  let dias = await datosMes(fecha)
  let camioneros = await Camioneros.encontrar()
  fecha = fecha.toFormat("y/M")
  res.render('calendario', { mes: devuelveMes(fecha, dias), camioneros, fechaActual: fecha, esAdmin: esAdmin(req) })
}).post(tcaccion(async (req, res) => {
  fecha = DateTime.fromFormat(req.body.fecha, "y/M")
  let dias = await datosMes(fecha)
  res.send(dias ? devuelveMes(fecha, dias) : [])
}, "Hubo un error"))


router.get('/logout', (req, res, next) => req.logout(err => err ? next(err) : res.redirect('/')))
module.exports = router
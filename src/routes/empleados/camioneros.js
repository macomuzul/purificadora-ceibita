const router = require('express').Router()
const Camioneros = require('../../models/camioneros')

router.route('/').get(async (req, res) => {
  let camioneros = await Camioneros.encontrar()
  res.render('camioneros', { camioneros, esAdmin: esAdmin(req) })
}).post(tcaccion(async (req, res) => {
  let r = await Camioneros.updateOne({}, req.body, { upsert: true, sanitizeFilter: true })
  if (!r.modifiedCount && !r.upsertedCount) throw new Error()
  res.send()
}, "Ha habido un error al momento de guardar"))

router.route('/devuelvenombres').get(async (req, res) => {
  let camioneros = (await Camioneros.encontrar()).map(x => x.nombre)
  res.send(camioneros)
})

module.exports = router
const router = require('express').Router()
const Usuario = require('../models/usuario')
const Camioneros = require('../models/camioneros')

router.route('/usuarios').get(async (req, res) => {
  const usuarios = await Usuario.find({}, { _id: 0, contraseña: 0 });
  res.render('verusuarios', { usuarios, esAdmin: esAdmin(req) });
}).post(verificacionIdentidad, tcaccion(async (req, res) => {
  let { usuario } = req.body
  let u = await Usuario.findOne({ usuario })
  if (!u) throw new errorDB("El usuario no existe")
  res.send(u.contraseña)
}, "No se pudo recuperar la contraseña del usuario")).delete(tcaccion(async (req, res) => {
  let { usuario } = req.body
  let r = await Usuario.deleteOne({ usuario })
  if (!r.deletedCount) throw new errorDB("El usuario ya no existe")
  res.send()
}, "Ocurrió un error al borrar el usuario"))

router.route('/usuarios/crear').get(async (req, res) => res.render('crearusuarios', { esAdmin: esAdmin(req) })).post(verificacionIdentidad, tcaccion(async (req, res) => {
  let { usuario, contraseña, rol, correo } = req.body
  if (await Usuario.exists({ usuario })) throw new errorDB("Ya existe un usuario con ese nombre")
  await Usuario.create({ usuario, contraseña, rol, correo })
  res.send()
}, "Ha ocurrido un error al guardar el usuario"))

router.route('/usuarios/editar/:id').get(async (req, res) => res.render('editarusuarios', { nombreUsuario: req.params.id, esAdmin: esAdmin(req) })).post(verificacionIdentidad, tcaccion(async (req, res) => {
  let { usuario } = req.body
  if (usuario && await Usuario.exists({ usuario })) throw new errorDB("El usuario que deseas editar ya no existe")
  await Usuario.editarQueryCustom({ usuario: req.params.id }, req.body)
  res.send()
}, "No se pudo editar el usuario"))

router.route('/camioneros').get(async (req, res) => {
  let camioneros = await Camioneros.encontrar()
  res.render('camioneros', { camioneros, esAdmin: esAdmin(req) })
}).post(tcaccion(async (req, res) => {
  let r = await Camioneros.updateOne({}, req.body, { upsert: true })
  if (!r.modifiedCount && !r.upsertedCount) throw new Error()
  res.send()
}, "Ha habido un error al momento de guardar"))

router.route('/devuelvenombrescamioneros').get(async (req, res) => {
  let camioneros = (await Camioneros.encontrar()).map(x => x.nombre)
  res.send(camioneros)
})

module.exports = router
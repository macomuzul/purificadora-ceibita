const router = require('express').Router()
const Usuario = require('../../models/usuario')
const { sanitizeFilter } = require('mongoose')

router.route('/').get(comprobarQueEsAdmin, async (req, res) => {
  const usuarios = await Usuario.find({}, { _id: 0, contraseña: 0 })
  res.render('verusuarios', { usuarios, esAdmin: esAdmin(req) })
}).post(verificacionIdentidad, tcaccion(async (req, res) => {
  sanitizeFilter(req.body)
  let { usuario } = req.body
  let usr = await Usuario.findOne({ usuario })
  if (!usr) throw new errorDB("El usuario no existe")
  res.send(usr.contraseña)
}, "No se pudo recuperar la contraseña del usuario")).delete(comprobarQueEsAdmin, tcaccion(async (req, res) => {
  sanitizeFilter(req.body)
  let { usuario } = req.body
  let usr = await Usuario.findOne({ usuario })
  if (!usr) throw new errorDB("El usuario ya no existe")
  if (usr.correo === correoPrincipal) throw new errorDB("Este usuario no puede borrarse porque es el usuario principal")
  await Usuario.borrarCustom({ usuario })
  res.send()
}, "Ocurrió un error al borrar el usuario"))

router.route('/crear').get(comprobarQueEsAdmin, async (req, res) => res.render('crearusuarios', { esAdmin: esAdmin(req) })).post(verificacionIdentidad, tcaccion(async (req, res) => {
  sanitizeFilter(req.body)
  let { usuario, correo } = req.body
  if (await Usuario.exists({ usuario })) throw new errorDB("Ya existe un usuario con ese nombre")
  if (correo && await Usuario.exists({ correo })) throw new errorDB("Ya existe un usuario con ese correo")
  delete req.body.contraseñaVerificacion
  await Usuario.create(req.body)
  res.send()
}, "Ha ocurrido un error al guardar el usuario"))

router.route('/editar/:usuario').get(comprobarQueEsAdmin, async (req, res) => {
  sanitizeFilter(req.params)
  let usr = await Usuario.findOne({ usuario: req.params.usuario })
  if (!usr) return res.status(400).send("El usuario que deseas acceder ya no existe")
  let { usuario, rol, correo } = usr
  res.render('editarusuarios', { usuario, rol, correo, esAdmin: esAdmin(req) })
}).post(verificacionIdentidad, tcaccion(async (req, res) => {
  sanitizeFilter(req.params)
  sanitizeFilter(req.body)
  let { usuario } = req.params
  let usr = await Usuario.findOne({ usuario })
  if (!usr) throw new errorDB("El usuario que deseas editar ya no existe")
  if (await Usuario.exists({ usuario: req.body.usuario })) throw new errorDB("Ya existe un usuario con ese nombre")
  let { correo, rol } = req.body
  if (correo) {
    if (await Usuario.exists({ correo })) throw new errorDB("Ya existe un usuario con ese correo")
    if (usr.correo === correoPrincipal) throw new errorDB("No puedes cambiar el correo del usuario principal")
  }
  if (rol && usr.correo === correoPrincipal) throw new errorDB("No puedes cambiar el rol del usuario principal")
  delete req.body.contraseñaVerificacion
  await Usuario.editarCustom({ usuario }, req.body)
  res.send()
}, "No se pudo editar el usuario"))

module.exports = router
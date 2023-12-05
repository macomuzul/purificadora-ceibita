const router = require('express').Router()
const passport = require('passport')
const Usuarios = require("../models/usuario")
const redis = require("../redis")
const sesiones = require('../models/sesiones')

router.get('/', tcrutas(async (req, res) => {
  let errorInicioSesion = req.flash("errorInicioSesion")[0]
  let intentosRestantes = req.flash("intentosRestantesLogin")[0]
  let tiempoQueQueda = tiempoTimeoutLoginSegundos
  if (!errorInicioSesion) {
    let textoIP = `loginip:${req.ip}`
    let numRequestsInvalidas = parseInt(await redis.get(textoIP))
    if (numRequestsInvalidas && numRequestsInvalidas >= loginCantMaxPeticionesInvalidas) {
      intentosRestantes = "0"
      tiempoQueQueda = await redis.ttl(textoIP)
    }
  }
  res.render('index', { errorInicioSesion, intentosRestantes, tiempoQueQueda })
}, "Ocurrió un error"))

router.post('/iniciarSesion', passport.authenticate('iniciarSesion', {
  failureRedirect: '/',
  failureFlash: true
}), async (req, res) => {
  res.redirect("/calendario")
  let { ip, headers, body, httpVersion } = req
  let data = { ip, headers, body, httpVersion }
  await sesiones.create({ fecha: Date.now(), ip, sesion: res.getHeaders()['set-cookie'][0], data })
})

router.route('/recuperarcontrase%C3%B1a').get(async (req, res) => {
  let errorRecuperarContraseña = req.flash("errorRecuperarContraseña")[0]
  let intentosRestantes = req.flash("intentosRestantesRecuperarContraseña")[0]
  let correoEnviado = req.flash("correoEnviado")[0]
  let tiempoQueQueda = tiempoTimeoutRecuperarContraseñaSegundos
  if (!errorRecuperarContraseña) {
    let textoIP = `recuperarcontip:${req.ip}`
    let numRequestsInvalidas = parseInt(await redis.get(textoIP))
    if (numRequestsInvalidas && numRequestsInvalidas >= recuperarContraseñaCantMaxPeticionesInvalidas) {
      intentosRestantes = "0"
      tiempoQueQueda = await redis.ttl(textoIP)
    }
  }
  res.render('recuperarcontraseña', { errorRecuperarContraseña, intentosRestantes, tiempoQueQueda, correoEnviado })
}).post(async (req, res) => {
  let textoIP = `recuperarcontip:${req.ip}`
  await redis.set(textoIP, "0", { NX: true, EX: 86400 })
  let numRequestsInvalidas = parseInt(await redis.getEx(textoIP, { EX: tiempoTimeoutRecuperarContraseñaSegundos }))

  if (numRequestsInvalidas > recuperarContraseñaCantMaxPeticionesInvalidas) return req.flash('intentosRestantesRecuperarContraseña', '0')
  if (numRequestsInvalidas === recuperarContraseñaCantMaxPeticionesInvalidas) req.flash('intentosRestantesRecuperarContraseña', '0')
  else if (numRequestsInvalidas === recuperarContraseñaCantMaxPeticionesInvalidas - 1) req.flash('intentosRestantesRecuperarContraseña', '1')
  await redis.incr(textoIP)

  let { usuario, correo } = req.body
  let us = await Usuarios.findOne({ usuario }, {}, { sanitizeFilter: true })
  if (!us) req.flash('errorRecuperarContraseña', 'Usuario no existe')
  else if (us.correo !== correo) req.flash('errorRecuperarContraseña', 'Correo incorrecto')
  else {
    await mandarCorreoVerificacion("Recuperación de datos", `<b>Los datos de tu usuario son:</b><br><b>Usuario: </b>${us.usuario}<br><b>Contraseña: </b>${us.contraseña}`, us.correo)
    req.flash('correoEnviado', '1')
  }
  res.redirect("/recuperarcontraseña")
})

module.exports = router
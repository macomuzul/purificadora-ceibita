const router = require('express').Router();
const passport = require('passport');
const { DateTime } = require('luxon');
const RegistroVentas = require("../models/registroventas");
const Camioneros = require("../models/camioneros");
const Usuarios = require("../models/usuario");
const redis = require("../redis")

router.get('/', async (req, res) => {
  try {
    let errorInicioSesion = req.flash("errorInicioSesion")[0]
    let intentosRestantes = req.flash("intentosRestantesLogin")[0]
    let tiempoQueQueda = tiempoTimeoutLoginSegundos
    if (!errorInicioSesion) {
      let textoIP = `loginip:${req.ip || req.socket.remoteAddress}`
      let numRequestsInvalidas = parseInt(await redis.get(textoIP))
      if (numRequestsInvalidas && numRequestsInvalidas >= loginCantMaxPeticionesInvalidas) {
        intentosRestantes = "0"
        tiempoQueQueda = await redis.ttl(textoIP)
      }
    }
    res.render('index', { errorInicioSesion, intentosRestantes, tiempoQueQueda })
  } catch (error) {
    console.log(error)
    res.status(400).send("Errorazo")
  }
})

router.post('/iniciarSesion', passport.authenticate('iniciarSesion', {
  successRedirect: '/calendario',
  failureRedirect: '/',
  failureFlash: true
}))

router.route('/recuperarcontrase%C3%B1a').get(async (req, res) => {
  let errorRecuperarContraseña = req.flash("errorRecuperarContraseña")[0]
  let intentosRestantes = req.flash("intentosRestantesRecuperarContraseña")[0]
  let correoEnviado = req.flash("correoEnviado")[0]
  let tiempoQueQueda = tiempoTimeoutRecuperarContraseñaSegundos
  if (!errorRecuperarContraseña) {
    let textoIP = `recuperarcontip:${req.ip || req.socket.remoteAddress}`
    let numRequestsInvalidas = parseInt(await redis.get(textoIP))
    if (numRequestsInvalidas && numRequestsInvalidas >= recuperarContraseñaCantMaxPeticionesInvalidas) {
      intentosRestantes = "0"
      tiempoQueQueda = await redis.ttl(textoIP)
    }
  }

  res.render('recuperarcontraseña', { errorRecuperarContraseña, intentosRestantes, tiempoQueQueda, correoEnviado })
}).post(async (req, res) => {
  let textoIP = `recuperarcontip:${req.ip || req.socket.remoteAddress}`
  await redis.setNX(textoIP, "0")
  let numRequestsInvalidas = parseInt(await redis.getEx(textoIP, { EX: tiempoTimeoutRecuperarContraseñaSegundos }))

  if (numRequestsInvalidas > recuperarContraseñaCantMaxPeticionesInvalidas) return req.flash('intentosRestantesRecuperarContraseña', '0')
  if (numRequestsInvalidas === recuperarContraseñaCantMaxPeticionesInvalidas) req.flash('intentosRestantesRecuperarContraseña', '0')
  else if (numRequestsInvalidas === recuperarContraseñaCantMaxPeticionesInvalidas - 1) req.flash('intentosRestantesRecuperarContraseña', '1')
  await redis.incr(textoIP)

  let { usuario, correo } = req.body
  let us = await Usuarios.findOne({ usuario })
  if (!us) req.flash('errorRecuperarContraseña', 'Usuario no existe')
  else if (us.correo !== correo) req.flash('errorRecuperarContraseña', 'Correo incorrecto')
  else req.flash('correoEnviado', '1')
  res.redirect("/recuperarcontraseña")
})

let devuelveMes = (fecha, dias) => ({ _id: fecha, dias: dias.map(({ _id, tablas, usuario, ultimocambio }) => ({ _id, camioneros: tablas.map(x => x.trabajador), usuario, ultimocambio })) })
let datosMes = async fecha => await RegistroVentas.where("_id").gte(fecha.startOf("month")).lte(fecha.endOf("month")).select("tablas.trabajador usuario ultimocambio").lean()

router.route('/calendario').get(async (req, res) => {
  let fecha = DateTime.now().setZone("America/Guatemala")
  let dias = await datosMes(fecha)
  let camioneros = await Camioneros.encontrar()
  fecha = fecha.toFormat("y/M")
  res.render('calendario', { mes: devuelveMes(fecha, dias), camioneros, fechaActual: fecha })
}).post(async (req, res) => {
  try {
    fecha = DateTime.fromFormat(req.body.fecha, "y/M")
    let dias = await datosMes(fecha)
    res.send(dias ? devuelveMes(fecha, dias) : [])
  } catch (e) {
    console.log(e)
    res.send("Hubo un error")
  }
})


router.get('/logout', (req, res, next) => req.logout(err => err ? next(err) : res.redirect('/')))

module.exports = router
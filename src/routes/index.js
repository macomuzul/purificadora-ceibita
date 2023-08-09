const router = require('express').Router();
const passport = require('passport');
const { DateTime } = require('luxon');
const RegistroVentas = require("../models/registroventas");
const Camioneros = require("../models/camioneros");
const redis = require("../redis")

router.get('/', async (req, res) => {
  try {
    let errorInicioSesion = req.flash("errorInicioSesion");
    let cantidadMaximaInicioSesion = req.flash("cantidadMaximaInicioSesion");
    let ip = req.ip || req.socket.remoteAddress;
    let textoIP = `ip:${ip}`;
    console.log(redis)
    let numRequestsInvalidas = parseInt(await redis.get(textoIP))
    if (numRequestsInvalidas) {
      if (cantidadMaximaInicioSesion.length === 0 && numRequestsInvalidas > cantidadMaximaPeticionesInvalidas)
        return res.render('index', { errorInicioSesion: [], cantidadMaximaInicioSesion: ["Se ha superado la cantidad maxima"], tiempoQueQueda: await redis.ttl(textoIP) })
    }

    // let cantidadMaximaInicioSesion = "Solo te queda un intento";
    // let cantidadMaximaInicioSesion = "Se ha superado la cantidad maxima";
    res.render('index', { errorInicioSesion, cantidadMaximaInicioSesion, tiempoQueQueda: tiempoTimeoutLoginSegundos })
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

router.route('/recuperarcontrase%C3%B1a').get((req, res) => {
  let errorRecuperarContraseña = "El usuario que has ingresado no existe"
  res.render('recuperarcontraseña', { errorRecuperarContraseña })
}).post((req, res) => {

})

let devuelveMes = (fecha, dias) => ({ _id: fecha, dias: dias.map(({ _id, tablas, usuario, ultimocambio }) => ({ _id, camioneros: tablas.map(x => x.trabajador), usuario, ultimocambio })) })

router.route('/calendario').get(async (req, res) => {
  let tiempoGuatemala = DateTime.now().setZone("America/Guatemala")
  let fechaActual = tiempoGuatemala.toFormat("y/M")
  let fecha = DateTime.fromISO(tiempoGuatemala.toISODate())
  let dias = await RegistroVentas.find().where("_id").gte(fecha.startOf("month")).lte(fecha.endOf("month")).select("tablas.trabajador usuario ultimocambio")
  let camioneros = (await Camioneros.findOne())?.camioneros || []
  res.render('calendario', { mes: devuelveMes(fechaActual, dias), camioneros, fechaActual })
}).post(async (req, res) => {
  try {
    fecha = DateTime.fromFormat(req.body.fecha, "y/M")
    let dias = await RegistroVentas.find().where("_id").gte(fecha.startOf("month")).lte(fecha.endOf("month")).select("tablas.trabajador usuario ultimocambio")
    res.send(devuelveMes(fecha, dias) || [])
  } catch (e) {
    console.log(e)
    res.send("Hubo un error")
  }
})


router.get('/logout', (req, res, next) => req.logout(err => err ? next(err) : res.redirect('/')))

module.exports = router
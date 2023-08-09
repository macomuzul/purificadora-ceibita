const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Usuarios = require('../models/usuario');
const redis = require("../redis")

passport.serializeUser((user, done) => {
  console.log("Serializado")
  console.log(user)
  done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
  const user = await Usuarios.findById(id)
  done(null, user)
})

passport.use('iniciarSesion', new LocalStrategy({
  usernameField: 'usuario',
  passwordField: 'contraseña',
  passReqToCallback: true
}, async (req, usuario, contraseña, done) => {
  console.log("logueando")
  let ip = req.ip || req.socket.remoteAddress
  let textoIP = `ip:${ip}`
  await redis.setNX(textoIP, "0")
  let cantidadRequestsInvalidas = parseInt(await redis.get(textoIP))
  await redis.expire(textoIP, tiempoTimeoutLoginSegundos)

  if (cantidadRequestsInvalidas > cantidadMaximaPeticionesInvalidas) {
    let tiempoQueQueda = await redis.ttl(textoIP)
    req.flash('tiempoQueQueda', tiempoQueQueda)
    return done(null, false, req.flash('cantidadMaximaInicioSesion', 'Se ha superado la cantidad maxima'))
  }

  if (cantidadRequestsInvalidas === cantidadMaximaPeticionesInvalidas) req.flash('cantidadMaximaInicioSesion', 'Se ha superado la cantidad maxima')
  else if (cantidadRequestsInvalidas === (cantidadMaximaPeticionesInvalidas - 1)) req.flash('cantidadMaximaInicioSesion', 'Solo te queda un intento')

  await redis.incr(textoIP)
  let user = await Usuarios.findOne({ usuario })
  if (!user) return done(null, false, req.flash('errorInicioSesion', 'El usuario al que desea acceder no existe'))
  if (user.contraseña !== contraseña) return done(null, false, req.flash('errorInicioSesion', 'Contraseña incorrecta'))

  await redis.set(textoIP, "0")
  return done(null, user)
}))

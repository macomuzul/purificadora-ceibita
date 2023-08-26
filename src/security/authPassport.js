const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Usuarios = require('../models/usuario');
const redis = require("../redis")

passport.serializeUser((user, done) => done(null, user.id))

passport.deserializeUser(async (id, done) => {
  const user = await Usuarios.findById(id).lean()
  done(null, user)
})

passport.use('iniciarSesion', new LocalStrategy({
  usernameField: 'usuario',
  passwordField: 'contraseña',
  passReqToCallback: true
}, async (req, usuario, contraseña, done) => {
  let textoIP = `ip:${req.ip || req.socket.remoteAddress}`
  await redis.setNX(textoIP, "0")
  let numRequestsInvalidas = parseInt(await redis.getEx(textoIP, { EX: tiempoTimeoutLoginSegundos }))

  if (numRequestsInvalidas > loginCantMaxPeticionesInvalidas) {
    req.flash('tiempoQueQueda', await redis.ttl(textoIP))
    return done(null, false, req.flash('cantidadMaximaInicioSesion', 'Se ha superado la cantidad maxima'))
  }

  if (numRequestsInvalidas === loginCantMaxPeticionesInvalidas) done(null, false, req.flash('cantidadMaximaInicioSesion', 'Se ha superado la cantidad maxima'))
  else if (numRequestsInvalidas === (loginCantMaxPeticionesInvalidas - 1)) done(null, false, req.flash('cantidadMaximaInicioSesion', 'Solo te queda un intento'))

  await redis.incr(textoIP)
  let user = await Usuarios.findOne({ usuario }).lean()
  if (!user) return done(null, false, req.flash('errorInicioSesion', 'El usuario al que desea acceder no existe'))
  if (user.contraseña !== contraseña) return done(null, false, req.flash('errorInicioSesion', 'Contraseña incorrecta'))

  await redis.set(textoIP, "0")
  return done(null, user)
}))

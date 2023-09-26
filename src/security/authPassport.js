const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Usuarios = require('../models/usuario');
const redis = require("../redis")

passport.serializeUser((user, done) => done(null, user._id))

passport.deserializeUser(async (id, done) => {
  let user = await Usuarios.buscarPorID(id)
  done(null, user)
})

passport.use('iniciarSesion', new LocalStrategy({
  usernameField: 'usuario',
  passwordField: 'contraseña',
  passReqToCallback: true
}, async (req, usuario, contraseña, done) => {
  let textoIP = `loginip:${req.ip || req.socket.remoteAddress}`
  await redis.setNX(textoIP, "0")
  let numRequestsInvalidas = parseInt(await redis.getEx(textoIP, { EX: tiempoTimeoutLoginSegundos }))

  if (numRequestsInvalidas > loginCantMaxPeticionesInvalidas) return done(null, false, req.flash('intentosRestantesLogin', '0'))
  if (numRequestsInvalidas === loginCantMaxPeticionesInvalidas) req.flash('intentosRestantesLogin', '0')
  else if (numRequestsInvalidas === loginCantMaxPeticionesInvalidas - 1) req.flash('intentosRestantesLogin', '1')
  await redis.incr(textoIP)

  let user = await Usuarios.findOne({ usuario }).lean()
  if (!user) return done(null, false, req.flash('errorInicioSesion', 'Usuario no existe'))
  if (user.contraseña !== contraseña) return done(null, false, req.flash('errorInicioSesion', 'Contraseña incorrecta'))

  await redis.set(textoIP, "0")
  return done(null, user)
}))

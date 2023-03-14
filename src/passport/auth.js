const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const Usuarios = require('../models/usuario');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await Usuarios.findById(id);
  done(null, user);
});


passport.use('iniciarSesion', new LocalStrategy({
  usernameField: 'usuario',
  passwordField: 'contraseña',
  passReqToCallback: true
}, async (req, usuario, contraseña, done) => {
  const user = await Usuarios.findOne({usuario: usuario});
  if(!user) {
    return done(null, false, req.flash('signinMessage', 'El usuario al que desea acceder no existe'));
  }
  if(user.contraseña !== contraseña) {
    return done(null, false, req.flash('signinMessage', 'Contraseña incorrecta'));
  }

  return done(null, user);
}));

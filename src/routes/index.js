const router = require('express').Router();
const passport = require('passport');
const redis = require('../redis');

router.get('/', async (req, res) => {
  let errorInicioSesion = req.flash("errorInicioSesion");
  let cantidadMaximaInicioSesion = req.flash("cantidadMaximaInicioSesion");

  let ip = req.ip || req.socket.remoteAddress;
  let textoIP = `ip:${ip}`;
  let cantidadRequestsInvalidasSinParsear = await redis.get(textoIP);
  if(cantidadRequestsInvalidasSinParsear)
  {
    let cantidadRequestsInvalidas = parseInt(cantidadRequestsInvalidasSinParsear);
    if(cantidadMaximaInicioSesion.length === 0 && cantidadRequestsInvalidas > cantidadMaximaPeticionesInvalidas)
    {
      let tiempoQueQueda = await redis.ttl(textoIP);
      return res.render('index', {errorInicioSesion: [], cantidadMaximaInicioSesion: ["Se ha superado la cantidad maxima"], tiempoQueQueda});
    }
  }
  
  // let cantidadMaximaInicioSesion = "Solo te queda un intento";
  // let cantidadMaximaInicioSesion = "Se ha superado la cantidad maxima";
  res.render('index', {errorInicioSesion, cantidadMaximaInicioSesion, tiempoQueQueda: tiempoTimeoutLoginSegundos});
});

router.get('/signin', (req, res) => {
  res.render('index');
});

router.route('/recuperarcontrase%C3%B1a').get((req, res) => {
  let errorRecuperarContraseña = "El usuario que has ingresado no existe";
  res.render('recuperarcontraseña' , {errorRecuperarContraseña});
})
.post((req, res) => {
  
});


router.get('/calendario', (req, res) => {
  res.render('calendario');
});

router.post('/iniciarSesion', passport.authenticate('iniciarSesion', {
  successRedirect: '/calendario',
  failureRedirect: '/',
  failureFlash: true
}));


router.get('/logout', (req, res, next) => {
  req.logout(function (err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

module.exports = router;

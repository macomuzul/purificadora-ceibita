const router = require('express').Router();
const passport = require('passport');
const estaAutenticado = require("../passport/autenticado");

router.get('/', (req, res) => {
  res.render('index');
});

router.get('/signin', (req, res) => {
  res.render('index');
});

router.get('/calendario', estaAutenticado, (req, res) => {
    res.render('calendario');
  });

router.post('/iniciarSesion', passport.authenticate('iniciarSesion', {
  successRedirect: '/calendario',
  failureRedirect: '/',
  failureFlash: true
}));


router.get('/logout', (req, res, next) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

module.exports = router;

const express = require('express');
const path = require('path');
const engine = require('ejs-mate');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const morgan = require('morgan');

// initializations
const app = express();
require('./db');
require('./passport/auth');

// settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'))
app.engine('ejs', engine);
app.set('view engine', 'ejs');


// middlewares
app.use(morgan('dev'));
app.use(express.json()); 
app.use(express.static(path.join(__dirname, "public/css")));
app.use(express.static(path.join(__dirname, "public/images")));
app.use(express.static(path.join(__dirname, "public/js")));
app.use(express.static(path.join(__dirname, "public/js/partials")));
app.use(express.static(path.join(__dirname, "public/js/utilities")));

app.use(session({
  secret: 'llavedeautenticacionparaelusuario',
  resave: false,
  saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  app.locals.signinMessage = req.flash('signinMessage');
  app.locals.signupMessage = req.flash('signupMessage');
  app.locals.user = req.user;
  next();
});

// routes
app.use('/', require('./routes/index'));
app.use('/registrarventas', require('./routes/registrarventas'));
app.use('/plantillas', require('./routes/plantillas'));
app.use('/respaldos', require('./routes/respaldos'));



// Starting the server
app.listen(app.get('port'), () => {
  console.log('servidor funcionando en el puerto: ', app.get('port'));
});

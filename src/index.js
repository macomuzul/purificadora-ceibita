require('dotenv').config()
const express = require('express');
const path = require('path');
const engine = require('ejs-mate');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const morgan = require('morgan');
const { Settings } = require('luxon');
const estaAutenticado = require("./security/estaAutenticado");

global.cantidadMaximaPeticionesInvalidas = 3;
global.tiempoTimeoutLoginSegundos = 900; //15 minutos
Settings.defaultLocale = "es";

// initializations
const app = express();
require('./db');
require('./security/authPassport');

// settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'))
app.engine('ejs', engine);
app.set('view engine', 'ejs');


// middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json()); 
app.use(express.static(path.join(__dirname, "public/css")));
app.use(express.static(path.join(__dirname, "public/images")));
app.use(express.static(path.join(__dirname, "public/js")));
app.use(express.static(path.join(__dirname, "public/js/partials")));
app.use(express.static(path.join(__dirname, "public/js/utilities")));
app.use(express.static(path.join(__dirname, "public/components")));
app.use(express.static(path.join(__dirname, "../cypress/utilidades")));
app.use(express.static(path.join(__dirname, "../plugins")));

app.use(session({
  secret: 'llavedeautenticacionparaelusuario',
  resave: false,
  saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());


// routes
app.use('/', require('./routes/index'));
app.use(estaAutenticado);
app.use('/registrarventas', require('./routes/registrarventas'));
app.use('/plantillas', require('./routes/plantillas'));
app.use('/respaldos', require('./routes/respaldos'));
app.use('/empleados', require('./routes/empleados'));
app.use('/configuraciones', require('./routes/configuraciones'));
app.use('/analisis', require('./routes/analisis'));



// Starting the server
app.listen(app.get('port'), () => {
  console.log('servidor funcionando en el puerto: ', app.get('port'));
});

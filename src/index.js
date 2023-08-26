require('dotenv').config()
const express = require('express')
const path = require('path')
const engine = require('ejs-mate')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')
const morgan = require('morgan')
const { Settings } = require('luxon')
const estaAutenticado = require("./security/estaAutenticado")
const pruebasvalidaciones2 = require('./models/pruebasvalidaciones')

require("./listenersDB")
require("./redis")

// const convertirRegistrosPorDia = require("./utilities/convertirregistrospordia");
// convertirRegistrosPorDia()

// const convertirRespaldos = require("./utilities/convertirrespaldos");
// convertirRespaldos()

// const calcularTodosLosResumenesPorDia = require("./utilities/crearresumenespordia");
// calcularTodosLosResumenesPorDia()

// const { ResumenSemana, ResumenMes } = require("./models/resumenes")
// const convertirRegistrosPorSemanaYMes = require("./utilities/crearresumenesporsemanaymes");
// convertirRegistrosPorSemanaYMes("week", ResumenSemana)
// convertirRegistrosPorSemanaYMes("month", ResumenMes)

// const calcularTodosLosResumenesPorAño = require("./utilities/crearresumenesporaño");
// calcularTodosLosResumenesPorAño()

// const convertirPlantillas = require("./utilities/convertirnuevasplantillas");
// convertirPlantillas()



async function crearPruebasValidacion(){
  try {
    // let j = await pruebasvalidaciones.create({nombre: "masmfnvcnv",precio: 1200, viajes: [2,5,5,51,1,4], turbokike: 29939})
    // console.log(j)
    // let a = await pruebasvalidaciones.updateOne({}, {nombre: "manganeso"})
    // console.log(a)
    // let b = await pruebasvalidaciones.findOneAndUpdate({}, {nombre: "putito"})
    // console.log(b)
    // let j = await pruebasvalidaciones2.updateOne({nombre: "masmfnvcnv"}, {nombre: "masmfnvcnv",precio: -1500, viajes: [40], turbokike: 29939}, {runValidators: true})
    // console.log(j)
  } catch (error) {
    console.log(error)
  }
}
crearPruebasValidacion()

global.loginCantMaxPeticionesInvalidas = 3
global.tiempoTimeoutLoginSegundos = 900 //15 minutos
Settings.defaultLocale = "es"
Settings.defaultZone = "UTC"

// initializations
const app = express();
require('./db');
require('./security/authPassport');

// settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'))
app.engine('ejs', engine)
app.set('view engine', 'ejs')
app.set('view options', {rmWhitespace: true})

// middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public/css")))
app.use(express.static(path.join(__dirname, "public/images")))
app.use(express.static(path.join(__dirname, "public/js")))
app.use(express.static(path.join(__dirname, "public/html")))
app.use(express.static(path.join(__dirname, "public/js/partials")))
app.use(express.static(path.join(__dirname, "public/js/utilities")))
app.use(express.static(path.join(__dirname, "public/components")))
app.use(express.static(path.join(__dirname, "../cypress/utilidades")))
app.use(express.static(path.join(__dirname, "../plugins")))

app.use(session({ secret: process.env.SECRET_SESSION, resave: false, saveUninitialized: false }));
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())

// routes
app.use('/', require('./routes/index'))
app.use(estaAutenticado)
app.use('/registrarventas', require('./routes/registrarventas').router)
app.use('/plantillas', require('./routes/plantillas'))
app.use('/respaldos', require('./routes/respaldos'))
app.use('/empleados', require('./routes/empleados'))
app.use('/configuraciones', require('./routes/configuraciones'))
app.use('/analisis', require('./routes/analisis'))
app.use('/extras', require('./routes/extras'))

// app.use("/coso", (req, res) => res.render("renderprueba", {mivar: '"feliz": "cumpleaños"', mivar2: '"feliz": "cumpleaños"'}))

// Starting the server
app.listen(app.get('port'), () => console.log('servidor funcionando en el puerto: ', app.get('port')))
const fs = require('fs')
process.on('uncaughtException', async error => {
  try {
    console.log(error)
    await Promise.all([LogsGraves.log('Error fatal', error), mandarCorreoError('Error fatal importantisimo', 'Ha ocurrido un error fatal')])
  } catch (err) {
    console.log(err)
    let escribirError = errorazo => fs.appendFileSync('./logsfatales.log', JSON.stringify({fecha: new Date().toLocaleString('es-US', { timeZone: 'America/Guatemala' }), ...errorazo}) + '\n', e => { console.log(e) })
    escribirError(error)
    escribirError(err)
  }
})
require('./db')

const express = require('express')
const app = express()
const path = require('path')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')
const RedisStore = require('connect-redis').RedisStore
const redis = require('./redis')
const { LogsGraves } = require('./models/loggers')
require('./globals/globals')
require('./listenersDB')
require('./security/authPassport')

if (enTesting) require('../tests/testing')

//TODO este quitarlo despues
app.set('view cache', false)
app.set('port', process.env.PORT || 3000)
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.set('view options', { rmWhitespace: true })

// middlewares
if (enDesarrollo) {
  const morgan = require('morgan')
  app.use(morgan('dev'))
  app.use(express.static(path.join(__dirname, '../cypress/utilidades')))
}
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public/css')))
app.use(express.static(path.join(__dirname, 'public/images')))
app.use(express.static(path.join(__dirname, 'public/js')))
app.use(express.static(path.join(__dirname, 'public/html')))
app.use(express.static(path.join(__dirname, 'public/js/partials')))
app.use(express.static(path.join(__dirname, 'public/js/utilities')))
app.use(express.static(path.join(__dirname, 'public/components')))
app.use(express.static(path.join(__dirname, '../plugins')))

app.set('trust proxy', 1)
app.use(session({
  secret: process.env.SECRET_SESSION,
  resave: true,
  saveUninitialized: false,
  rolling: true,
  store: new RedisStore({
    client: redis,
    prefix: 'cookiesceibita:',
    disableTouch: false,
  }),
  cookie: {
    maxAge: 24 * 3600000,
    // maxAge: 30000,
  },
}))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())

// routes
app.use('/', require('./routes/login'))
enDesarrollo ? app.use((req, res, next) => next()) : app.use((req, res, next) => (req.isAuthenticated() ? next() : res.redirect('/')))
app.use('/calendario', require('./routes/calendario'))
app.use('/registrarventas', require('./routes/registrarventas').router)
app.use('/plantillas', require('./routes/plantillas'))
app.use('/respaldos', require('./routes/respaldos'))
app.use('/empleados', require('./routes/empleados'))
app.use('/configuraciones', require('./routes/configuraciones'))
app.use('/analisis', require('./routes/analisis'))
app.use('/gastos', require('./routes/gastos'))
app.get('*eso', (req, res) => res.send('La página a la que deseas acceder no existe :('))

app.listen(app.get('port'), () => console.log('servidor funcionando en el puerto: ', app.get('port')))







  // const calcularTodosLosResumenesPorDia = require("./utilities/crearresumenespordia");
  // calcularTodosLosResumenesPorDia()

  // const { ResumenSemana, ResumenMes } = require("./models/resumenes")
  // const convertirRegistrosPorSemanaYMes = require("./utilities/crearresumenesporsemanaymes");
  // convertirRegistrosPorSemanaYMes("week", ResumenSemana)
  // convertirRegistrosPorSemanaYMes("month", ResumenMes)

  // const calcularTodosLosResumenesPorAño = require("./utilities/crearresumenesporaño");
  // calcularTodosLosResumenesPorAño()
const fs = require("fs")
process.on('uncaughtException', async error => {
  try {
    console.log(error)
    await LogsGraves.log("Error fatal", error)
    await mandarCorreoError("Error fatal importantisimo", "Ha ocurrido un error fatal")
  } catch (err) {
    console.log(error)
    fs.writeFile('./logsfatales.log', JSON.stringify(error, ["name", "message", "arguments", "type", "error", "stack"]), e => console.log(e))
    console.log(err)
    fs.writeFile('./logsfatales.log', JSON.stringify(err, ["name", "message", "arguments", "type", "error", "stack"]), e => console.log(e))
  }
})
require('./db')

const express = require('express')
const app = express()
const path = require('path')
const engine = require('ejs-mate')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')
const pruebasvalidaciones = require('./models/pruebasvalidaciones')
const RedisStore = require('connect-redis')
const redis = require("./redis")
const { sanitizeFilter } = require("mongoose")
const { LogsGraves } = require("./models/loggers")
require("./globals/globals")
require("./listenersDB")
require('./security/authPassport')

// const calcularTodosLosResumenesPorDia = require("./utilities/crearresumenespordia");
// calcularTodosLosResumenesPorDia()

// const { ResumenSemana, ResumenMes } = require("./models/resumenes")
// const convertirRegistrosPorSemanaYMes = require("./utilities/crearresumenesporsemanaymes");
// convertirRegistrosPorSemanaYMes("week", ResumenSemana)
// convertirRegistrosPorSemanaYMes("month", ResumenMes)

// const calcularTodosLosResumenesPorAño = require("./utilities/crearresumenesporaño");
// calcularTodosLosResumenesPorAño()


async function crearPruebasValidacion(nombre) {
  try {
    // let j = await pruebasvalidaciones.create({nombre: "masmfnvcnv", fkdk: "kskd", precio: 1200, viajes: [2,5,5,51,1,4], turbokike: 29939})
    // console.log(j)
    // let a = await pruebasvalidaciones.updateOne({}, { fuu: "ewr" })
    // console.log(a)
    let req = {}
    req.body = { apellido: "vergazo" }
    req.body = { nombre: { $ne: 1 } }
    // sanitizeFilter(req.body)
    let { nombre } = req.body
    let cambios = { nombre: "chimadaamigo" }
    console.log(nombre)
    let r = await pruebasvalidaciones.updateOne({ nombre }, cambios, { sanitizeFilter: true })
    console.log(r)
    // let b = await pruebasvalidaciones.findOneAndUpdate({}, {nombre: "putito"})
    // console.log(b)
    // let j = await pruebasvalidaciones2.updateOne({nombre: "masmfnvcnv"}, {nombre: "masmfnvcnv",precio: -1500, viajes: [40], turbokike: 29939}, {runValidators: true})
    // console.log(j)
    // let a = await pruebasvalidaciones2.findOneAndDelete({coño: "esumare"}, {nombre: "coñodesumadreverga"})
    // console.log(a)
  } catch (error) {
    console.log(error)
  }
}
// crearPruebasValidacion()
// crearDiaGoogleSheets()
//TODO este quitarlo despues
app.set('view cache', false)
app.set('port', process.env.PORT || 3000)
app.set('views', path.join(__dirname, 'views'))
app.engine('ejs', engine)
app.set('view engine', 'ejs')
app.set('view options', { rmWhitespace: true })

// middlewares
if (enDesarrollo) {
  const morgan = require('morgan')
  app.use(morgan('dev'))
  app.use(express.static(path.join(__dirname, "../cypress/utilidades")))
}
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(express.static(path.join(__dirname, "public/css")))
app.use(express.static(path.join(__dirname, "public/images")))
app.use(express.static(path.join(__dirname, "public/js")))
app.use(express.static(path.join(__dirname, "public/html")))
app.use(express.static(path.join(__dirname, "public/js/partials")))
app.use(express.static(path.join(__dirname, "public/js/utilities")))
app.use(express.static(path.join(__dirname, "public/components")))
app.use(express.static(path.join(__dirname, "../plugins")))

app.set('trust proxy', 1)
app.use(session({
  secret: process.env.SECRET_SESSION,
  resave: true,
  saveUninitialized: false,
  rolling: true,
  store: new RedisStore.default({
    client: redis,
    prefix: "cookiesceibita:",
    disableTouch: false
  }),
  cookie: {
    maxAge: 24 * 3600000,
    // maxAge: 30000,
  }
}))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())

// routes
app.use('/', require('./routes/index'))
enDesarrollo ? app.use((req, res, next) => next()) : app.use((req, res, next) => req.isAuthenticated() ? next() : res.redirect('/'))
app.use('/', require('./routes/calendario'))

app.use('/registrarventas', require('./routes/registrarventas').router)
app.use('/plantillas', require('./routes/plantillas'))
app.use('/respaldos', require('./routes/respaldos'))
app.use('/empleados', require('./routes/empleados'))
app.use('/configuraciones', require('./routes/configuraciones'))
app.use('/analisis', require('./routes/analisis'))
app.use('/extras', require('./routes/extras'))
app.get('*', (req, res) => res.send("La página a la que deseas acceder no existe :("))

// agregarTituloDocs("Cambios ocurridos el 1/2/2023", "-")
// crearMesGoogleSheets()
// crearDiaGoogleSheets()
// titulosGoogleSheets(`Mes: Octubre de 2023`, 0, { red: 0.62, green: 0.77, blue: 0.91 }, 14)
// titulosGoogleSheets("Día: 1", 1, { red: 0.43, green: 0.62, blue: 0.92 }, 11)
// titulosGoogleSheets("Día: 2", 1, { red: 0.43, green: 0.62, blue: 0.92 }, 11)
// agregarFilaGoogleSheetsSimple(["Sin cambios"])
// pruebiña()
// agregarFilaGoogleSheets(["Hora", "Usuario", "Acción que realizó"])
// agregarFilaGoogleSheets(["Sin cambios"])
// agregarSinCambios()
// agregarHoja()
//   ;(async function () {
//   await crearMesGoogleSheets()
// await crearDiaGoogleSheets()
// })()
// datosSpreadSheet()
// agregarTituloDocs("Febrero", "*")
// crearMesGoogleSheets()
// agregarFilaGoogleSheets(["8:32 a. m.", "adm", "Movió un registro con fecha 20/10/2023 y sobreescribió otro registro con fecha 20/10/2023"])
// agregarTextoDocs("coño de su madre marico no joda")
// haceloPa()
// crearDiaGoogleSheets()
// async function guardarGD() {
//   let r = await guardarDias()
//   console.log(r ? "Se crearon con éxito" : "Falló al crearse")
// }
// guardarGD()

app.listen(app.get('port'), () => console.log('servidor funcionando en el puerto: ', app.get('port')))

// TODO hay que poner en la variable de entorno del servidor NODE_ENV="production"
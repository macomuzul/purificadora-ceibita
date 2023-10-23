const { Settings } = require('luxon')
const { google } = require("googleapis")
const redis = require("../redis")

global.enDesarrollo = process.env.NODE_ENV === "development"
global.loginCantMaxPeticionesInvalidas = 3
global.recuperarContraseñaCantMaxPeticionesInvalidas = 2
global.tiempoTimeoutLoginSegundos = 900 //15 minutos
global.tiempoTimeoutRecuperarContraseñaSegundos = 21600 //6 horas
global.correoPrincipal = process.env.CORREO

Settings.defaultLocale = "es"
Settings.defaultZone = "UTC"

global.primeraLetraMayuscula = a => a[0].toUpperCase() + a.slice(1)
global.primeraLetraMinuscula = a => a[0].toLowerCase() + a.slice(1)
global.esAdmin = enDesarrollo ? req => req.user?.rol === "Administrador" : req => req.user.rol === "Administrador"
global.devuelveUsuario = enDesarrollo ? req => req.user?.usuario ?? "usuariodesconocido" : req => req.user.usuario

require("./rutas")

let clientId = process.env.CLIENT_ID
let clientSecret = process.env.CLIENT_SECRET
let refreshToken = process.env.REFRESH_TOKEN
let oauth2Client = new google.auth.OAuth2(clientId, clientSecret, refreshToken)
oauth2Client.setCredentials({ refresh_token: refreshToken })

global.clientId = clientId
global.clientSecret = clientSecret
global.refreshToken = refreshToken
global.oauth2Client = oauth2Client
global.gDrive = google.drive({ version: 'v3', auth: oauth2Client })
global.gSheets = google.sheets({ version: 'v4', auth: oauth2Client })
global.gDocs = google.docs({ version: "v1", auth: oauth2Client })

require("./gmail")
require("./gsheets")
require("./gdocs")
require("./gdrive")
require("./crons")
let { LogsLeves, LogsGraves, LogsRutas, LogsGoogle } = require("../models/loggers")

global.errorDB = class errorDB extends Error {
  constructor(message) {
    super(message)
    this.name = "errorDB"
  }
}

let loggearError = (req, res, e, msg, logger = LogsGraves) => {
  res.status(400).send(msg)
  let { ip, baseUrl, url, method, headers, body, user, httpVersion } = req
  logger.log(`${method} ${baseUrl}${url} ${e.name}`, { ip, headers, body, user, httpVersion, error: e }).then(q => { }).catch(err => console.log("error en el logger"))
}

global.tcrutas = (f, msg) => async (req, res, ...params) => {
  try {
    await f(req, res, ...params)
  } catch (e) {
    loggearError(req, res, e, msg, LogsRutas)
  }
}

global.tcaccion = (f, msg) => async (req, res) => {
  try {
    await f(req, res)
  } catch (e) {
    let errores = enDesarrollo ? { StrictModeError: e.message, ValidationError: Object.values(e.errors)[0].message, errorDB: e.message, } : { StrictModeError: "dato no esperado", ValidationError: "error de validación", errorDB: "error de validación", }
    e.name in errores ? loggearError(req, res, e, errores[e.name]) : loggearError(req, res, e, msg, LogsLeves)
  }
}

global.tcgoogle = (f, msg) => async (...params) => {
  try {
    await f(...params)
  } catch (e) {
    LogsGoogle.error(msg, { error: e })
  }
}

if (enDesarrollo) {
  global.verificacionIdentidad = (req, res, next) => {
    next()
  }
} else {
  global.verificacionIdentidad = (req, res, next) => {
    if (!req.user) return res.status(400).send("Por favor iniciar sesión de nuevo ha habido un error")
    if (req.user.contraseña !== req.body.contraseñaVerificacion) return res.status(400).send("Contraseña incorrecta")
    next()
  }
}
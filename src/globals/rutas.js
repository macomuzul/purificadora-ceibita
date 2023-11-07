let { LogsLeves, LogsGraves, LogsRutas, LogsGoogle, LogsCron, LogsAutenticacion } = require("../models/loggers")
let errorDePermisos = async (req, res) => await loggearError(req, res, "Error de permisos", "Necesitas permisos de administrador para realizar esta acción", LogsAutenticacion)

global.errorDB = class errorDB extends Error {
  constructor(message) {
    super(message)
    this.name = "errorDB"
  }
}

let loggearError = async (req, res, e, msg, logger = LogsGraves) => {
  if (!res.headersSent) res.status(400).send(msg)
  let { ip, baseUrl, url, method, headers, body, user, httpVersion } = req
  await logger.log(`${method} ${baseUrl}${url} ${e.name || e}`, { ip, headers, body, user, httpVersion, error: e })
}

global.tcrutas = (f, msg) => async (req, res, ...params) => {
  try {
    await f(req, res, ...params)
  } catch (e) {
    await loggearError(req, res, e, msg, LogsRutas)
  }
}

global.tcaccion = (f, msg) => async (req, res) => {
  try {
    await f(req, res)
  } catch (e) {
    let errores = enDesarrollo ? { StrictModeError: e.message, ValidationError: Object.values(e.errors)[0].message } : { StrictModeError: "dato no esperado", ValidationError: "error de validación" }
    if (["StrictModeError", "ValidationError", "CastError"].includes(e.name)) {
      await loggearError(req, res, e, errores[e.name])
      let { baseUrl, url, method } = req
      await mandarCorreoError("Error", `Ocurrió un error grave de ${method} en ${baseUrl}${url}`)
    } else
      await loggearError(req, res, e, e.name === "errorDB" ? e.message : msg, LogsLeves)
  }
}

global.tcgoogle = (f, msg) => async (...params) => {
  try {
    await f(...params)
  } catch (e) {
    await LogsGoogle.log(msg, { error: e })
    await mandarCorreoError("Error de google", msg)
  }
}

global.tccron = (f, msg) => async (...params) => {
  try {
    await f(...params)
  } catch (e) {
    await LogsCron.log(msg, { error: e })
    await mandarCorreoError("Error en el cron", msg)
  }
}

//TODO cambiar el rol de admin a administrador
if (enDesarrollo) {
  global.verificacionIdentidad = (req, res, next) => next()
  global.comprobarQueEsAdmin = (req, res, next) => next()
} else {
  global.verificacionIdentidad = async (req, res, next) => {
    if (!esAdmin(req)) return await errorDePermisos(req, res)
    if (req.user.contraseña !== req.body.contraseñaVerificacion) return res.status(400).send("Contraseña incorrecta")
    next()
  }
  global.comprobarQueEsAdmin = async (req, res, next) => req.user.rol === "Administrador" ? next() : await errorDePermisos(req, res)
}
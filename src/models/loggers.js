const mongoose = require('mongoose')
const { Schema } = mongoose

const loggerSchema = new Schema({
  fecha: Date,
  req: {},
  error: {},
  tipo: String
}, {
  statics: {
    async log(req, error, tipo) {
      //TODO este log quitarlo para produccion
      console.log({ req, error })
      await this.create({ tipo, fecha: Date.now(), req, error })
    }
  }
})

let LogsLevesMongo = mongoose.model("logsleves", loggerSchema)
let LogsGravesMongo = mongoose.model("logsgraves", loggerSchema)

class LoggerLeve {
  tipo
  constructor(tipo) {
    this.tipo = tipo
  }
  async log(req, error) {
    await LogsLevesMongo.log(req, error, this.tipo)
  }
}

class LoggerGrave extends LoggerLeve {
  async log(req, error) {
    await LogsGravesMongo.log(req, error, this.tipo)
    await mandarCorreoError(`Error de ${this.tipo}`, req)
  }
}

let LogsLeves = new LoggerLeve()
let LogsGraves = new LoggerGrave("tipo grave")
let LogsRutas = new LoggerGrave("rutas")
let LogsGoogle = new LoggerGrave("google")
let LogsCron = new LoggerGrave("cron")
let LogsAutenticacion = new LoggerGrave("autenticacion")

module.exports = { LogsLeves, LogsGraves, LogsRutas, LogsGoogle, LogsCron, LogsAutenticacion }
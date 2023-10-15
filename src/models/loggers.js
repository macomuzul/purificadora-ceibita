const mongoose = require('mongoose')
const { Schema } = mongoose

const loggerSchema = new Schema({
  fecha: {
    type: Date,
    default: () => Date.now()
  },
  req: {},
  error: {}
}, {
  statics: {
    async log(req, error) {
      console.log({ req, error })
      await this.create({ req, error })
    }
  }
})

let LogsLeves = mongoose.model("logsleves", loggerSchema)
let LogsGraves = mongoose.model("logsgraves", loggerSchema)
let LogsRutas = mongoose.model("logsrutas", loggerSchema)
let LogsGoogle = mongoose.model("logsgoogle", loggerSchema)


module.exports = { LogsLeves, LogsGraves, LogsRutas, LogsGoogle }
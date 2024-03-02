const mongoose = require('mongoose')
const { Schema } = mongoose
const Gastos = require('./gastos')
let { validarString, camposObligatorios } = require('./validaciones/validar')
let { editarborrar } = require('./metodos/metodosschema')

const gastoseliminadosSchema = new Schema({
  registro: Gastos.schema,
  borradoEl: {
    type: Date,
    default: () => Date.now(),
  },
  usuario: validarString,
}, {
  statics: {
    buscarPorID(id) { return this.findById(id).lean() },
    ...editarborrar,
  },
})

camposObligatorios(gastoseliminadosSchema)

module.exports = mongoose.model('gastoseliminados', gastoseliminadosSchema)

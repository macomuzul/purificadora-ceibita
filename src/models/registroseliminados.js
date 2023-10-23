const mongoose = require('mongoose');
const { Schema } = mongoose;
const RegistroVentas = require('./registroventas');
_ = require('lodash');
let { validarString, cantidadMinima0YEntero, camposObligatorios } = require("./validaciones/validar")
let { editarborrar } = require("./metodos/metodosschema")

const registroseliminadosSchema = new Schema({
  registro: RegistroVentas.schema,
  borradoEl: {
    type: Date,
    default: () => Date.now()
  },
  usuario: validarString,
  motivo: cantidadMinima0YEntero
}, {
  statics: {
    buscarPorID(id) { return this.findById(id).lean() },
    ...editarborrar
  }
})

// 0 - sobreescrito por cambios dentro del documento
// 1 - fue eliminado
// 2 - sobreescrito por otro registro que fue movido en su lugar
// 3 - sobreescrito por un registro que fue eliminado previamente y se recuperó

;[registroseliminadosSchema].forEach(x => camposObligatorios(x))

module.exports = mongoose.model('registroseliminados', registroseliminadosSchema)
const mongoose = require('mongoose');
const { Schema } = mongoose;
const RegistroVentas = require('./registroventas');
_ = require('lodash');
let { validarString, cantidadMinima0YEntero } = require("./validaciones/validar")

const registroseliminadosSchema = new Schema({
  registro: RegistroVentas.schema,
  borradoEl: {
    type: Date,
    default: () => Date.now()
  },
  usuario: validarString,
  motivo: cantidadMinima0YEntero
});

_.each(_.keys(registroseliminadosSchema.paths), attr => registroseliminadosSchema.path(attr).required(true));

module.exports = mongoose.model('registroseliminados', registroseliminadosSchema);
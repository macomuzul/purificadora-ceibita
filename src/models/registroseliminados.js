const mongoose = require('mongoose');
const { Schema } = mongoose;
const RegistroVentas = require('./registroventas');
_ = require('lodash');

const registroseliminadosSchema = new Schema({
  registro: RegistroVentas.schema,
  borradoEl: Date,
  usuario: String,
  motivo: Number
});

_.each(_.keys(registroseliminadosSchema.paths), attr => registroseliminadosSchema.path(attr).required(true));

module.exports = mongoose.model('registroseliminados', registroseliminadosSchema);
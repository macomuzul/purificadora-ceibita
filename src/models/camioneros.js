const mongoose = require('mongoose');
const { Schema } = mongoose;
_ = require('lodash');
let { validarString, arregloMenorACustom, arregloMayorA0, validadorString, validarColores } = require("./validaciones/validar")

const nombreSchema = new Schema({
  nombre: validarString,
  color: {
    type: String,
    validate: [validadorString, validarColores]
  },
  _id: false
})

const camionerosSchema = new Schema({
  camioneros: {
    type: [nombreSchema],
    validate: [arregloMayorA0, arregloMenorACustom(200, "La cantidad máxima de camioneros es 200")]
  }
})

_.each(_.keys(nombreSchema.paths), attr => nombreSchema.path(attr).required(true))
_.each(_.keys(camionerosSchema.paths), attr => camionerosSchema.path(attr).required(true))

module.exports = mongoose.model('camioneros', camionerosSchema)
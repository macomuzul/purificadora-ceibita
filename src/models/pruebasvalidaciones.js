const mongoose = require('mongoose');
const { Schema } = mongoose;
let { cantidadMinima0, validarString, arregloMayorA0, arregloMenorACustom } = require("./validaciones/validar")
_ = require('lodash');

const validacionesSchema = new Schema({
  nombre: validarString,
  precio: cantidadMinima0,
  viajes: {
    type: [cantidadMinima0],
    validate: [
      arregloMayorA0,
      {
        validator: v => v.length % 2 === 0,
        message: "Se intento pasar numero de viajes impares"
      },
      arregloMenorACustom(40, 'El valor maximo de los viajes debe ser 40, se obtuvo {VALUE}')
    ]
  },
})

_.each(_.keys(validacionesSchema.paths), attr => validacionesSchema.path(attr).required(true));

module.exports = mongoose.model('validaciones', validacionesSchema);
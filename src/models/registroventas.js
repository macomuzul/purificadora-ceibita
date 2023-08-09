const mongoose = require('mongoose');
const { Schema } = mongoose;
let { cantidadMinima0, validarString, arregloMayorA0, arregloMenorACustom, cantidadMinima0YEntero, esPar } = require("./validaciones/validar")
_ = require('lodash');

const productosSchema = new Schema({
  nombre: validarString,
  precio: cantidadMinima0,
  viajes: {
    type: [cantidadMinima0YEntero],
    validate: [arregloMayorA0, esPar, arregloMenorACustom(100, 'El valor maximo de los viajes debe ser 40 y se obtuvo {VALUE}')]
  },
  vendidos: cantidadMinima0YEntero,
  ingresos: cantidadMinima0,
  _id: false
})

const camionesSchema = new Schema({
  trabajador: validarString,
  productos: {
    type: [productosSchema],
    validate: [arregloMayorA0, arregloMenorACustom(200, 'La maxima cantidad de productos es 200 y se obtuvo {VALUE}')],
  },
  totalvendidos: cantidadMinima0YEntero,
  totalingresos: cantidadMinima0,
  _id: false
})

const registroventasSchema = new Schema({
  _id: Date,
  usuario: validarString,
  ultimocambio: {
    type: Date,
    default: () => Date.now()
  },
  tablas: {
    type: [camionesSchema],
    validate: [arregloMayorA0, arregloMenorACustom(20, 'La maxima cantidad de camiones es 20 y se obtuvo {VALUE}')],
  }
})

_.each(_.keys(productosSchema.paths), attr => productosSchema.path(attr).required(true));
_.each(_.keys(camionesSchema.paths), attr => camionesSchema.path(attr).required(true));
_.each(_.keys(registroventasSchema.paths), attr => registroventasSchema.path(attr).required(true));

module.exports = mongoose.model('registroventas', registroventasSchema);
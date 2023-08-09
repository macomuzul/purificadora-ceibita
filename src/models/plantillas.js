const mongoose = require('mongoose');
const { Schema } = mongoose;
_ = require('lodash');
let { cantidadMinima0, validarString, arregloMayorA0, arregloMenorACustom, cantidadMinima0YEntero } = require("./validaciones/validar")

const productoSchema = new Schema({
  producto: validarString,
  precio: cantidadMinima0,
  _id: false
})

const plantillaSchema = new Schema({
  nombre: validarString,
  ultimaedicion: validarString,
  fechaultimaedicion: {
    type: Date,
    default: () => Date.now()
  },
  orden: cantidadMinima0YEntero,
  esdefault: Boolean,
  productos: {
    type: [productoSchema],
    validate: [arregloMayorA0, arregloMenorACustom(500, "La cantidad maxima de productos en una plantilla es 200 y se obtuvo {VALUE}")]
  }
})

plantillaSchema.statics.nombrePlantillas = function(){
  return this.find({}, { nombre: 1, _id: 0 }).sort("orden")
}

_.each(_.keys(productoSchema.paths), attr => productoSchema.path(attr).required(true))
_.each(_.keys(plantillaSchema.paths), attr => plantillaSchema.path(attr).required(true))
plantillaSchema.path("esdefault").required(false)

module.exports = mongoose.model('plantilla', plantillaSchema)
const mongoose = require('mongoose');
const { Schema } = mongoose;
_ = require('lodash');
let { cantidadMinima0, validarString, arregloMayorA0, arregloMenorACustom, cantidadMinima0YEntero, camposObligatorios } = require("./validaciones/validar")

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
}, {
  statics: {
    ordenado() { return this.find().sort("orden").lean() },
    nombres() { return this.ordenado().select("nombre -_id") },
    encontrar(p) { return this.findOne(p).lean() }
  }
})

;[productoSchema, plantillaSchema].forEach(x => camposObligatorios(x))
plantillaSchema.path("esdefault").required(false)

module.exports = mongoose.model('plantilla', plantillaSchema)
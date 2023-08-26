const mongoose = require('mongoose');
const { Schema } = mongoose;
_ = require('lodash');
let { validarString, arregloMenorACustom, arregloMayorA0, validadorString, validarColores, camposObligatorios } = require("./validaciones/validar")

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
}, {
  statics: {
    filtrar(f) { return this.findOne().lean().select(f + " -_id") },
    async encontrar(f = "") { return (await this.filtrar(f))?.camioneros || [] },
    async nombres() { return (await this.encontrar("camioneros.nombre")).map(el => el.nombre) || [] }
  }
})

;[nombreSchema, camionerosSchema].forEach(x => camposObligatorios(x))

module.exports = mongoose.model('camioneros', camionerosSchema)
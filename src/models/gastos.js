const mongoose = require('mongoose')
const { Schema } = mongoose
let { validarString, validarString1000, camposObligatorios, cantidadMinima0, cantidadMinima0YEntero } = require('./validaciones/validar')

let gastos = {
  type: [[validarString, Date, cantidadMinima0, validarString1000]],
  default: undefined,
}
let gastosProd = {
  type: [[validarString, Date, cantidadMinima0YEntero, cantidadMinima0, cantidadMinima0, validarString1000]],
  default: undefined,
}
const gastosSchema = new Schema({
  _id: Date,
  usuario: validarString,
  ultimocambio: {
    type: Date,
    default: () => Date.now(),
  },
  fijos: gastos,
  mixtos: gastos,
  productos: gastosProd,
}, {
  statics: {
    buscarPorID(id) { return this.findById(id).lean() },
    async guardar(datos) {
      let { _id, usuario, ultimocambio } = datos
      let registro = await this.buscarPorID(_id)
      if (registro) await GastosEliminados.create({ registro, borradoEl: ultimocambio, usuario })
      let a = this.updateOne({ _id }, datos, { upsert: true, sanitizeFilter: true })
      if (a.modifiedCount === 0 && a.upsertedCount === 0) throw new Error()
      return a
    },
  },
})

camposObligatorios(gastosSchema)
module.exports = mongoose.model('gastos', gastosSchema)

let GastosEliminados = require('./gastoseliminados')

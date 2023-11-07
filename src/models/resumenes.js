const mongoose = require('mongoose')
const { Schema } = mongoose

let statics = {
  statics: {
    buscarPorID(id) { return this.findById(id).lean() },
    id() { return this.where("_id").lean() },
    ordenado() { return this.id().sort("_id") },
    entre(f1, f2) { return this.id().gte(f1).lte(f2) },
    entreOrdenado(f1, f2) { return this.entre(f1, f2).sort("_id") },
    mayor(f) { return this.ordenado().gte(f) },
    menor(f) { return this.ordenado().lte(f) },
  }, strict: false, strictQuery: false
}

//v es vendidos, i es ingresos, p es productoDesnormalizado, vt es ventasTotales, it es ingresosTotales, prods es productos
let resumenes = new Schema({
  _id: Date,
  f: Date,
  cams: {},
  prods: {},
  vt: Number,
  it: Number,
  c: Boolean
}, { ...statics })

let ResumenSemana = mongoose.model('resumenSemana', resumenes)
let ResumenMes = mongoose.model('resumenMes', resumenes)
let ResumenAño = mongoose.model('resumenAño', resumenes)

module.exports = { ResumenSemana, ResumenMes, ResumenAño, statics }
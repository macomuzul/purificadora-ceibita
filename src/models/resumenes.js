const mongoose = require('mongoose')
const { Schema } = mongoose
_ = require('lodash')

let statics = {
  statics: {
    buscarPorID(id) { return this.findById(id).lean() },
    id() { return this.where("_id").lean() },
    ordenado() { return this.id().sort("_id") },
    entre(f1, f2) { return this.id().gte(f1).lte(f2) },
    entreOrdenado(f1, f2) { return this.entre(f1, f2).sort("_id") },
    mayor(f) { return this.ordenado().gte(f) },
    menor(f) { return this.ordenado().lte(f) },
  }
}

let resumenes = new Schema({
  _id: Date,
  f: Date,
  prods: {

  },
  vt: Number,
  it: Number,
  c: Boolean
}, { ...statics })

_.each(_.keys(resumenes.paths), attr => resumenes.path(attr).required(true))

let ResumenSemana = mongoose.model('resumenSemana', resumenes)
let ResumenMes = mongoose.model('resumenMes', resumenes)
let ResumenAño = mongoose.model('resumenAño', resumenes)
module.exports = { ResumenSemana, ResumenMes, ResumenAño, statics }
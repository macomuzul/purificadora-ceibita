const mongoose = require('mongoose')
const { Schema } = mongoose
_ = require('lodash')
let { statics } = require("./resumenes")
const resumenDiaSchema = new Schema({
  _id: Date,
  prods: {

  },
  vt: Number,
  it: Number
}, { ...statics })

_.each(_.keys(resumenDiaSchema.paths), attr => resumenDiaSchema.path(attr).required(true))
module.exports = mongoose.model('resumenDia', resumenDiaSchema)
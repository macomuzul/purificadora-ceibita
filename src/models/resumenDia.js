const mongoose = require('mongoose')
const { Schema } = mongoose
let { statics } = require("./resumenes")
const resumenDiaSchema = new Schema({
  _id: Date,
  prods: {

  },
  vt: Number,
  it: Number
}, { ...statics })

module.exports = mongoose.model('resumenDia', resumenDiaSchema)
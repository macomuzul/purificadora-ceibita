const mongoose = require('mongoose')
const { Schema } = mongoose
let { statics } = require("./resumenes")
const resumenDiaSchema = new Schema({
  _id: Date,
  cams: {},
  prods: {},
  vt: Number,
  it: Number
}, { ...statics })

let resumenDia = mongoose.model('resumenDia', resumenDiaSchema)
module.exports = resumenDia
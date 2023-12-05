const mongoose = require('mongoose')
const { Schema } = mongoose

const sesionSchema = new Schema({
  fecha: Date,
  ip: String,
  sesion: String,
  data: {}
})

let sesiones = mongoose.model("sesiones", sesionSchema)
module.exports = sesiones
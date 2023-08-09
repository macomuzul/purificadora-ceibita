const mongoose = require('mongoose');
const { Schema } = mongoose;
_ = require('lodash');

const datosSchema = new Schema({
  _id: Date,
  motivo: Number,
  fecha2: Date,
})

const cambiosSchema = new Schema({ datos: [datosSchema] })

_.each(_.keys(datosSchema.paths), attr => datosSchema.path(attr).required(true))
_.each(_.keys(cambiosSchema.paths), attr => cambiosSchema.path(attr).required(true))
datosSchema.path("fecha2").required(false)

module.exports = mongoose.model('cambiosventasgoogledrive', cambiosSchema);
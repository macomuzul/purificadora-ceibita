const mongoose = require('mongoose');
const { Schema } = mongoose;
_ = require('underscore');

const resumenMesSchema = new Schema({
  _id: String,
  productos: {

  },
  vendidosTotal: Number,
  ingresosTotal: Number,
  huboCambio: Boolean
});

_.each(_.keys(resumenMesSchema.paths), attr => resumenMesSchema.path(attr).required(true));
module.exports = mongoose.model('resumenMes', resumenMesSchema);
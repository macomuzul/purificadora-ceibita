const mongoose = require('mongoose');
const { Schema } = mongoose;
const ventaspordia = require('./registroventaspordia');
_ = require('lodash');

const respaldoSchema = new Schema({
  ventaspordia: ventaspordia.schema,
  fechaeliminacion: Date
});

_.each(_.keys(respaldoSchema.paths), attr => respaldoSchema.path(attr).required(true));

module.exports = mongoose.model('respaldo', respaldoSchema);
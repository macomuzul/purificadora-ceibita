const mongoose = require('mongoose');

const { Schema } = mongoose;
const ventaspordia = require('../models/registroventaspordia');

const respaldoSchema = new Schema({
  ventaspordia: ventaspordia.schema,
  fechaeliminacion: Date
});

module.exports = mongoose.model('respaldo', respaldoSchema);
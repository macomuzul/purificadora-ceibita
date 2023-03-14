const mongoose = require('mongoose');

const { Schema } = mongoose;
const ventaspordia = require('../models/registroventaspordia');

// const viajesSchema = new Schema({
//     sale: Number,
//     entra: Number,
//     _id : false 
//   });

const respaldoSchema = new Schema({
    ventaspordia: ventaspordia.schema,
    fechaeliminacion: Date
  });

module.exports = mongoose.model('respaldo', respaldoSchema);
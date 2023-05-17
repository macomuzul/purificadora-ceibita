const mongoose = require("mongoose");
const { Schema } = mongoose;
_ = require('underscore');

const calendarioDiasSchema = new Schema({
  _id: Date,
  camioneros: [String],
  fechaultimocambio: Date,
  usuario: String,
});

const calendarioCamionerosSchema = new Schema({
  _id: String,
  dias: [calendarioDiasSchema],
});

_.each(_.keys(calendarioCamionerosSchema.paths), attr => calendarioCamionerosSchema.path(attr).required(true));
_.each(_.keys(calendarioDiasSchema.paths), attr => calendarioDiasSchema.path(attr).required(true));
module.exports = mongoose.model('calendarioCamioneros', calendarioCamionerosSchema);
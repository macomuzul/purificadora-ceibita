const mongoose = require('mongoose');
const { Schema } = mongoose;
_ = require('lodash');

const nombreSchema = new Schema({
  nombre: String,
  color: String,
  _id: false
});
const camionerosSchema = new Schema({
  camioneros: [nombreSchema]
});

_.each(_.keys(nombreSchema.paths), attr => nombreSchema.path(attr).required(true));
_.each(_.keys(camionerosSchema.paths), attr => camionerosSchema.path(attr).required(true));

module.exports = mongoose.model('camioneros', camionerosSchema)
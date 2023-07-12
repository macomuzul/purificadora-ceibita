const mongoose = require('mongoose');
const { Schema } = mongoose;
_ = require('lodash');

const resumenAñoSchema = new Schema({
  _id: Date,
  f: Date,
  prods: {
    
  },
  vt: Number,
  it: Number,
  c: Boolean
});

_.each(_.keys(resumenAñoSchema.paths), attr => resumenAñoSchema.path(attr).required(true));
module.exports = mongoose.model('resumenAño', resumenAñoSchema);
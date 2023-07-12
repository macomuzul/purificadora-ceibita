const mongoose = require('mongoose');
const { Schema } = mongoose;
_ = require('lodash');

const resumenSemanaSchema = new Schema({
  _id: Date,
  f: Date,
  prods: {
    
  },
  vt: Number,
  it: Number,
  c: Boolean
});

_.each(_.keys(resumenSemanaSchema.paths), attr => resumenSemanaSchema.path(attr).required(true));
module.exports = mongoose.model('resumenSemana', resumenSemanaSchema);
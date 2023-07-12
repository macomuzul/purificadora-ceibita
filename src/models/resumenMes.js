const mongoose = require('mongoose');
const { Schema } = mongoose;
_ = require('lodash');

const resumenMesSchema = new Schema({
  _id: Date,
  f: Date,
  prods: {
    
  },
  vt: Number,
  it: Number,
  c: Boolean
});

_.each(_.keys(resumenMesSchema.paths), attr => resumenMesSchema.path(attr).required(true));
module.exports = mongoose.model('resumenMes', resumenMesSchema);
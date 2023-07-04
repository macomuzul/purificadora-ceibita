const mongoose = require('mongoose');
const { Schema } = mongoose;
_ = require('underscore');

const resumenDiaSchema = new Schema({
  _id: Date,
  prods: {

  },
  vt: Number,
  it: Number
});

_.each(_.keys(resumenDiaSchema.paths), attr => resumenDiaSchema.path(attr).required(true));
module.exports = mongoose.model('resumenDia', resumenDiaSchema);
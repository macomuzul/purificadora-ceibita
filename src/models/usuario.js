const mongoose = require('mongoose');
const { Schema } = mongoose;
_ = require('underscore');

const usuarioSchema = new Schema({
  usuario: String,
  contraseña: String,
  rol: String,
  correo: String,
});

_.each(_.keys(usuarioSchema.paths), attr => usuarioSchema.path(attr).required(true));

module.exports = mongoose.model('usuarios', usuarioSchema);
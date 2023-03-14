const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  usuario: String,
  contraseña: String,
  rol: String
});

module.exports = mongoose.model('usuarios', userSchema);

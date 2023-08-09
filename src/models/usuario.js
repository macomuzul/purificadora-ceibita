const mongoose = require('mongoose');
const { Schema } = mongoose;
_ = require('lodash');
let { validarString, validarCorreo, validadorString } = require("./validaciones/validar")

const usuarioSchema = new Schema({
  usuario: validarString,
  contraseña: validarString,
  rol: {
    type: String,
    enum: { values: ['Administrador', 'Empleado'], message: '{VALUE} no es un rol' }
  },
  correo: { type: String, validate: [validadorString, validarCorreo] }
})

usuarioSchema.pre("save", function (next) {

})

_.each(_.keys(usuarioSchema.paths), attr => usuarioSchema.path(attr).required(true))
usuarioSchema.path("correo").required(false)

module.exports = mongoose.model('usuarios', usuarioSchema)
const mongoose = require('mongoose');
const { Schema } = mongoose;
_ = require('lodash');
let { cantidadMinima0, validarString, arregloMayorA0 } = require("./validaciones/validar")

const usuarioSchema = new Schema({
  usuario: validarString,
  contraseña: validarString,
  rol: {
    type: String,
    enum: {
      values: ['Administrador', 'Empleado'],
      message: '{VALUE} no es un rol'
    }
  },
  correo: {...validarString},
})

_.each(_.keys(usuarioSchema.paths), attr => usuarioSchema.path(attr).required(true))

module.exports = mongoose.model('usuarios', usuarioSchema)
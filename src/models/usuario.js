const mongoose = require('mongoose');
const { Schema } = mongoose;
let { validarString, validarCorreo, validadorString, camposObligatorios } = require("./validaciones/validar")

const usuarioSchema = new Schema({
  usuario: validarString,
  contraseña: validarString,
  rol: {
    type: String,
    enum: { values: ['Administrador', 'Empleado'], message: '{VALUE} no es un rol' }
  },
  correo: { type: String, validate: [validadorString, validarCorreo] }
}, {
  statics: {
    buscarPorID(id) { return this.findById(id).lean() },
  }
})

usuarioSchema.pre("save", function (next) {

})

camposObligatorios(usuarioSchema)
usuarioSchema.path("correo").required(false)

module.exports = mongoose.model('usuarios', usuarioSchema)
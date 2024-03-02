const mongoose = require('mongoose')
const {
  Error: { ValidationError },
} = mongoose

const cantidadMinima0 = { type: Number, min: [0, 'El valor debe ser mínimo 0 y se obtuvo {VALUE}'] }
const validarColores = { validator: v => /^#([A-Fa-f0-9]{3}){1,2}$/.test(v), message: `{VALUE} no es un color válido` }
const validarCorreo = { validator: v => /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test(v), message: `{VALUE} es un correo inválido` }
const validadorString = { validator: v => /^[^"\\`']*$/.test(v), message: `{VALUE} contiene un caracter prohibido " ' o \\` }
const stringMenorA200 = { validator: v => v.length < 200, message: `{VALUE} es demasiado largo, solo se permiten 200 caracteres` }
const stringMenorA1000 = { validator: v => v.length < 1000, message: `{VALUE} es demasiado largo, solo se permiten 200 caracteres` }
const validarString = { type: String, validate: [validadorString, stringMenorA200], trim: 1 }
const validarString1000 = { type: String, validate: [validadorString, stringMenorA1000], trim: 1 }
const arregloMayorA0 = { validator: v => Array.isArray(v) && v.length > 0, message: 'El arreglo no debe estar vacío' }
const esEntero = { validator: v => Number.isInteger(v), message: 'El valor {VALUE} no es un entero' }
const cantidadMinima0YEntero = { ...cantidadMinima0, validate: [esEntero] }
const esPar = { validator: v => v.length % 2 === 0, message: 'Se intento pasar numero de viajes impares' }
const arregloMenorACustom = (cantidad, message) => ({ validator: v => v.length <= cantidad, message })

//TODO este tal vez solo dejarlo con error fatal
// const camposObligatorios = schema => Object.keys(schema.paths).forEach(p => schema.path(p).required(true, p === "_id" ? "Fatal error" : "Faltó el campo " + p))
const camposObligatorios = schema => Object.keys(schema.paths).forEach(p => schema.path(p).required(true))

function crearValidationError(message) {
  let e = new ValidationError()
  e.name = 'ValidationError'
  e.errors = { err: { message } }
  return e
}

module.exports = { cantidadMinima0, validarString, validarString1000, validadorString, arregloMayorA0, arregloMenorACustom, esEntero, cantidadMinima0YEntero, esPar, validarCorreo, validarColores, camposObligatorios, crearValidationError }

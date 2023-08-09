let cantidadMinima0 = { type: Number, min: [0, 'El valor debe ser mínimo 0 y se obtuvo {VALUE}'] }
let validarColores = { validator: v => /^#([A-Fa-f0-9]{3}){1,2}$/.test(v), message: `{VALUE} no es un color válido` }
let validarCorreo = { validator: v => /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test(v), message: `{VALUE} es un correo inválido` }
let validadorString = { validator: v => /^[^"\\`']*$/.test(v), message: `{VALUE} contiene un caracter prohibido " ' o \\` }
let stringMenorA200 = { validator: v => v.length < 200, message: `{VALUE} es demasiado largo, solo se permiten 200 caracteres` }
let validarString = { type: String, validate: [validadorString, stringMenorA200] }
let arregloMayorA0 = { validator: v => Array.isArray(v) && v.length > 0, message: "El arreglo no debe estar vacío" }
let esEntero = { validator: v => Number.isInteger(v), message: 'El valor {VALUE} no es un entero' }
let cantidadMinima0YEntero = { ...cantidadMinima0, validate: [esEntero] }
let esPar = { validator: v => v.length % 2 === 0, message: "Se intento pasar numero de viajes impares" }
let arregloMenorACustom = (cantidad, message) => ({ validator: v => v.length <= cantidad, message })

module.exports = { cantidadMinima0, validarString, validadorString, arregloMayorA0, arregloMenorACustom, esEntero, cantidadMinima0YEntero, esPar, validarCorreo, validarColores }
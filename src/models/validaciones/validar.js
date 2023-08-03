let cantidadMinima0 = { type: Number, min: [0, 'El valor debe ser mínimo 0, se obtuvo {VALUE}'] }
let validarString = { type: String, validate: [v => /^[^"\\']*$/.test(v), m => `${m.value} contiene un caracter prohibido " ' o \\`] }
let arregloMayorA0 = { validator: v => Array.isArray(v) && v.length > 0, message: "El arreglo no debe estar vacío" }
let esEntero = { validator: Number.isInteger, message: 'El valor {VALUE} no es un entero' }
let cantidadMinima0YEntero = { ...cantidadMinima0, validate: [esEntero] }
function arregloMenorACustom(cantidad, message) {
  return ({ validator: v => v.length <= cantidad, message })
}


module.exports = { cantidadMinima0, validarString, arregloMayorA0, arregloMenorACustom, esEntero, cantidadMinima0YEntero }
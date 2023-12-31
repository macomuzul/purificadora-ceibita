const mongoose = require('mongoose')
const { Schema, model } = mongoose
const { cantidadMinima0, validarString, arregloMayorA0, arregloMenorACustom, cantidadMinima0YEntero, esPar, camposObligatorios, crearValidationError } = require("./validaciones/validar")
let { editarborrar } = require("./metodos/metodosschema")

const productosSchema = new Schema({
  nombre: validarString,
  precio: cantidadMinima0,
  viajes: {
    type: [cantidadMinima0YEntero],
    validate: [arregloMayorA0, esPar, arregloMenorACustom(100, 'El valor maximo de los viajes debe ser 40 y se obtuvo {VALUE}')]
  },
  vendidos: cantidadMinima0YEntero,
  ingresos: cantidadMinima0,
  _id: false
})

const camionesSchema = new Schema({
  trabajador: validarString,
  productos: {
    type: [productosSchema],
    validate: [arregloMayorA0, arregloMenorACustom(200, 'La maxima cantidad de productos es 200 y se obtuvo {VALUE}')],
  },
  totalvendidos: cantidadMinima0YEntero,
  totalingresos: cantidadMinima0,
  _id: false
})

const registroventasSchema = new Schema({
  _id: Date,
  usuario: validarString,
  ultimocambio: {
    type: Date,
    default: () => Date.now()
  },
  tablas: {
    type: [camionesSchema],
    validate: [arregloMayorA0, arregloMenorACustom(20, 'La maxima cantidad de camiones es 20 y se obtuvo {VALUE}')],
  }
}, {
  statics: {
    buscarPorID(id) { return this.findById(id).lean() },
    async guardar(ventasNuevo, motivo) {
      let { _id, usuario, ultimocambio } = ventasNuevo
      let registro = await this.buscarPorID(_id)
      if (registro) await RegistrosEliminados.create({ registro, borradoEl: ultimocambio, usuario, motivo })
      let a = await this.updateOne({ _id }, ventasNuevo, { upsert: true, sanitizeFilter: true })
      if (a.modifiedCount === 0 && a.upsertedCount === 0) throw new Error()
      return a
    },
    ordenado() { return this.find().sort("_id").lean() },
    ...editarborrar
  },
})


registroventasSchema.pre("updateOne", function (next) {
  try {
    this._update.tablas.forEach(({ productos }) => {
      let viajes = productos[0].viajes.length
      productos.some(p => { if (p.viajes.length !== viajes) { throw new Error() } })
    })
    next()
  } catch (e) {
    throw crearValidationError("La cantidad de viajes en las tablas no coinciden")
  }
  next()
})

// registroventasSchema.post("updateOne", function (doc, next) {
//   console.log("despues de actualizar")

//   next()
// })

  ;[productosSchema, camionesSchema, registroventasSchema].forEach(x => camposObligatorios(x))

module.exports = model('registroventas', registroventasSchema)

let RegistrosEliminados = require("./registroseliminados")
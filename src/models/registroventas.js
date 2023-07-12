const mongoose = require('mongoose');
const { Schema } = mongoose;
_ = require('lodash');

const productosSchema = new Schema({
    nombre: String,
    precio: Number,
    viajes: [Number],
    vendidos: Number,
    ingresos: Number,
    _id: false
});

const camionesSchema = new Schema({
    trabajador: String,
    productos: [productosSchema],
    totalvendidos: Number,
    totalingresos: Number,
    _id: false
});

const registroventasSchema = new Schema({
    _id: Date,
    usuario: String,
    ultimocambio: Date,
    tablas: [camionesSchema]
});

_.each(_.keys(productosSchema.paths), attr => productosSchema.path(attr).required(true));
_.each(_.keys(camionesSchema.paths), attr => camionesSchema.path(attr).required(true));
_.each(_.keys(registroventasSchema.paths), attr => registroventasSchema.path(attr).required(true));

module.exports = mongoose.model('registroventas', registroventasSchema);
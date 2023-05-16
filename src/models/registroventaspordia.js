const mongoose = require('mongoose');
const { Schema } = mongoose;
_ = require('underscore');

const viajesSchema = new Schema({
    sale: Number,
    entra: Number,
    _id: false
});

const productosSchema = new Schema({
    nombreproducto: String,
    precioproducto: Number,
    viajes: [viajesSchema],
    vendidos: Number,
    ingresos: Number,
    _id: false
});

const camionesSchema = new Schema({
    nombretrabajador: String,
    filas: [productosSchema],
    totalvendidos: Number,
    totalingresos: Number,
    _id: false
});

const ventaspordiaSchema = new Schema({
    fecha: Date,
    usuario: String,
    fechacreacion: { type: Date, inmutable: true },
    fechaultimocambio: Date,
    camiones: [camionesSchema]
});

_.each(_.keys(viajesSchema.paths), attr => viajesSchema.path(attr).required(true));
_.each(_.keys(productosSchema.paths), attr => productosSchema.path(attr).required(true));
_.each(_.keys(camionesSchema.paths), attr => camionesSchema.path(attr).required(true));
_.each(_.keys(ventaspordiaSchema.paths), attr => ventaspordiaSchema.path(attr).required(true));

module.exports = mongoose.model('ventaspordia', ventaspordiaSchema);
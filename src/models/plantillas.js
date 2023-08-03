const mongoose = require('mongoose');
const { Schema } = mongoose;
_ = require('lodash');

const productoSchema = new Schema({
    producto: String,
    precio: Number,
    _id: false 
});

const plantillaSchema = new Schema({
    nombre: String,
    ultimaedicion: String,
    fechaultimaedicion: Date,
    orden: Number,
    esdefault: Boolean,
    productos: [productoSchema]
});

_.each(_.keys(productoSchema.paths), attr => productoSchema.path(attr).required(true))
_.each(_.keys(plantillaSchema.paths), attr => plantillaSchema.path(attr).required(true))
plantillaSchema.path("esdefault").required(false)

module.exports = mongoose.model('plantilla', plantillaSchema)
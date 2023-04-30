const mongoose = require('mongoose');
const { Schema } = mongoose;
_ = require('underscore');

const productoSchema = new Schema({
    producto: String,
    precio: Number,
    _id: false 
});

const plantillaSchema = new Schema({
    nombreplantilla: String,
    ultimaedicion: String,
    orden: Number,
    esdefault: Boolean,
    productos: [productoSchema]
});

_.each(_.keys(productoSchema.paths), attr => productoSchema.path(attr).required(true));
plantillaSchema.path("esdefault").required(false);

module.exports = mongoose.model('plantilla', plantillaSchema);
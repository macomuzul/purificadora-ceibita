const mongoose = require('mongoose');
const { Schema } = mongoose;
_ = require('lodash');

const productoSchema = new Schema({
    producto: String,
    precio: Number,
    _id: false 
});

const viejasPlantillaSchema = new Schema({
    nombreplantilla: String,
    ultimaedicion: String,
    orden: Number,
    esdefault: Boolean,
    productos: [productoSchema]
});

_.each(_.keys(productoSchema.paths), attr => productoSchema.path(attr).required(true));
viejasPlantillaSchema.path("esdefault").required(false);

module.exports = mongoose.model('viejasplantillas', viejasPlantillaSchema);
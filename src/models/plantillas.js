const mongoose = require('mongoose');
const { Schema } = mongoose;


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

module.exports = mongoose.model('plantilla', plantillaSchema);
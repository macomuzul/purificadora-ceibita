const mongoose = require('mongoose');

const { Schema } = mongoose;

const viajesSchema = new Schema({
    sale: Number,
    entra: Number,
    _id : false
  });

const filasSchema = new Schema({
    nombreproducto: String,
    precioproducto: Number,
    viajes: [viajesSchema],
    vendidos: Number,
    ingresos: Number,
    _id : false 
});


//hay que cambiar el id a false despues
const camionesSchema = new Schema({
    nombretrabajador: String,
    filas: [filasSchema],
    totalvendidos: Number,
    totalingresos: Number,
    _id : false 
});


const ventaspordiaSchema = new Schema({
    fecha: Date,
    usuario: String,
	fechacreacion: {type: Date, inmutable: true },
	fechaultimocambio: Date,
    nombretrabajador: String,
    camiones: [camionesSchema]
});


module.exports = mongoose.model('ventaspordia', ventaspordiaSchema);



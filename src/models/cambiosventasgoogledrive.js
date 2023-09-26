const mongoose = require('mongoose');
const { Schema } = mongoose;
_ = require('lodash');

const datosSchema = new Schema({
  _id: Date,
  motivo: Number,
  fecha2: Date,
})

const cambiosSchema = new Schema({ datos: [datosSchema] })

_.each(_.keys(datosSchema.paths), attr => datosSchema.path(attr).required(true))
_.each(_.keys(cambiosSchema.paths), attr => cambiosSchema.path(attr).required(true))
datosSchema.path("fecha2").required(false)


// cambiados:
// 	_id, //fecha que se hizo el cambio
// 	motivo //0 nuevo, 1 sobreescrito, 2 eliminado, 3 movido, 4 recuperado, 5 sobreescrito por otro registro anterior
// 	fecha2? //si fue movido


// 	Se ha agregado un nuevo registro
// 	Un registro ha sido sobreescrito
// 	Un registro ha sido eliminado
// 	Un registro ha sido movido
// 	Un registro ha sido recuperado
// 	Un registro ha sido sobreescrito por otro registro anterior

module.exports = mongoose.model('cambiosventasgoogledrive', cambiosSchema);
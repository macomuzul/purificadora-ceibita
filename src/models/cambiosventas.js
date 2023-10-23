const mongoose = require('mongoose')
const { Schema } = mongoose

const cambiosSchema = new Schema({
  _id: Date,
  motivo: Number,
  fecha2: Date,
})

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

module.exports = mongoose.model('cambiosventas', cambiosSchema)
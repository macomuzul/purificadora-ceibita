const mongoose = require('mongoose')
mongoose.set({ strict: "throw", strictQuery: "throw", runValidators: true })

//TODO este hay que cambiarlo despues
let url = process.env.URL_DB
// let url = 'mongodb://127.0.0.1:27027/ceibita18-7-2023'
// let url = 'mongodb://127.0.0.1:27027/dbceibita'
mongoose.connect(url, { useNewUrlParser: true }).then(db => console.log('Conectado a la base de datos')).catch(err => console.log(err))
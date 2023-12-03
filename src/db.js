const mongoose = require('mongoose')
mongoose.set({ strict: "throw", strictQuery: "throw", runValidators: true })

mongoose.connect(process.env.URL_DB).then(db => console.log('Conectado a la base de datos')).catch(err => console.log(err))
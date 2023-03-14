const mongoose = require('mongoose');
const { mongodb } = require('./keys');

mongoose.connect(mongodb.URI, {
  useNewUrlParser: true
})
  .then(db => console.log('Conectado a la base de datos'))
  .catch(err => console.log(err));

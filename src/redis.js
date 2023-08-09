const redis = require("redis").createClient()
redis.connect().then(() => console.log("conectado a redis")).catch(err => console.log(err))
module.exports = redis
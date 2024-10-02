const redis = require("redis").createClient()
redis.connect().then(q => {
  console.log("conectado a redis")
  redis.set("filagsheetssobreescribir", "0", { NX: true })
  redis.set("filagsheets", "0", { NX: true })
}).catch(e => console.log(e))
module.exports = redis
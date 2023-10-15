const redis = require("redis").createClient()
redis.connect().then(() => console.log("conectado a redis")).catch(err => console.log(err))
//TODO estos verificar el filagsheets
async function crearVariablesRedis() {
  await redis.setNX("filagsheets", "0")
  await redis.setNX("hubocambioshoy", "0")
}
crearVariablesRedis()
module.exports = redis
const redis = require("redis").createClient()
redis.connect().then(() => console.log("conectado a redis")).catch(err => console.log(err))
async function crearVariablesRedis() {
  await redis.set("filagsheets", "0", { NX: true })
  await redis.set("hubocambioshoy", "0", { NX: true })
  await redis.set("sobreescribirfilagsheets", "0", { NX: true })
}
crearVariablesRedis()
module.exports = redis
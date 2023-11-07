const redis = require("redis").createClient()
redis.connect().then(() => console.log("conectado a redis")).catch(err => console.log(err))
// await redis.setNX("filagsheets", "0")
// await redis.setNX("hubocambioshoy", "0")
module.exports = redis
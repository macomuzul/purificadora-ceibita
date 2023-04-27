const moduloRedis = require("redis");
let redis = moduloRedis.createClient();
redis.connect().then(() => {
  console.log("conectado a redis")
});

module.exports = redis;
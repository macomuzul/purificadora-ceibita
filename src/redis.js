const moduloRedis = require("redis");
global.redis = moduloRedis.createClient();
redis.connect().then(() => {
  console.log("conectado a redis")
});

module.exports = redis;
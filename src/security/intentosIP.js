const moduloRedis = require("redis");
let redis = moduloRedis.createClient();

async function intentosIP(req, res, next){
  let ip = req.ip || req.socket.remoteAddress;
  let textoIP = `ip:${ip}`;
  let cantidadRequests = await redis.get(textoIP);
  if(cantidadRequests >= 5){
    await redis.setEx(textoIP, 30)
    res.status(200).send("Error");
    return;
  }
  cantidadRequests = await redis.incr(textoIP);
  res.send(`bien ahi no de requests: ${cantidadRequests}`);
  next();
}

module.exports = intentosIP;
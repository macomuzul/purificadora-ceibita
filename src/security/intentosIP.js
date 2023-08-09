const redis = require("../redis")

async function intentosIP(req, res, next){
  let ip = req.ip || req.socket.remoteAddress
  let textoIP = `ip:${ip}`
  let cantidadRequests = await redis.get(textoIP)
  if(cantidadRequests >= 5){
    await redis.setEx(textoIP, 30)
    return res.status(400).send("Error")
  }
  cantidadRequests = await redis.incr(textoIP)
  res.send(`bien ahi no de requests: ${cantidadRequests}`)
  next()
}

module.exports = intentosIP;
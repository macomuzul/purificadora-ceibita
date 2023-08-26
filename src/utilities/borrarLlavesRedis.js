const redis = require("../redis")

function borrarLlaves(llave){
  return async cambio => {
    try {
      let registrosEliminados = await redis.keys(`${llave}:*`)
      registrosEliminados.forEach(async el => { await redis.del(el)})
    } catch {
  
    }
  }
}

module.exports = borrarLlaves;
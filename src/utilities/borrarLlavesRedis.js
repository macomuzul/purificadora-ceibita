function borrarLlaves(llave){
  return async (cambio) => {
    try {
      console.log("Hoy si me cambiaron")
      let registrosEliminados = await redis.keys(`${llave}:*`);
      registrosEliminados.forEach(async el => {
        await redis.del(el);
      });
    } catch {
  
    }
  }
}

module.exports = borrarLlaves;
function devuelveNuevasTablas(venta) {
  return venta.camiones.map(tabla => ({
    trabajador: (tabla.nombretrabajador ? primeraLetraMayuscula(tabla.nombretrabajador) : "desconocido"),
    productos: tabla.filas.map(producto => ({
      nombre: primeraLetraMayuscula(producto.nombreproducto),
      precio: producto.precioproducto,
      viajes: producto.viajes.flatMap(viaje => [viaje.sale, viaje.entra]),
      vendidos: producto.vendidos,
      ingresos: producto.ingresos
    })),
    totalvendidos: tabla.totalvendidos,
    totalingresos: tabla.totalingresos
  }))
}

module.exports = devuelveNuevasTablas
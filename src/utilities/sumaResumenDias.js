function sumaResumenDias(venta) {
  let listaTablasValores = venta.tablas.map(tabla => tabla.productos.map(producto => ({ producto: producto.nombre.normalizar(), v: producto.vendidos, i: producto.ingresos, p: producto.nombre })));

  let prods = {}
  listaTablasValores.forEach(tabla => {
    tabla.forEach(prod => {
      let { v, i, p, producto: n } = prod
      if (prods[n]) {
        prods[n].v += v;
        prods[n].i += i;
      } else prods[n] = { v, i, p }
    })
  })

  let listaTablasValores2 = venta.tablas.map(tabla => ({ trabajador: tabla.trabajador.normalizar(), v: tabla.totalvendidos, i: tabla.totalingresos, p: tabla.trabajador }));

  let cams = {}
  listaTablasValores2.forEach(tabla => {
    let { v, i, p, trabajador: t } = tabla
    if (cams[t]) {
      cams[t].v += v;
      cams[t].i += i;
    } else cams[t] = { v, i, p }
  })

  let vt = 0, it = 0
  Object.values(cams).forEach(x => {
    x.i = parseFloat(x.i.normalizarPrecio())
    vt += x.v
    it += x.i
  })
  it = parseFloat(it.normalizarPrecio())
  return { prods, cams, vt, it }
}
String.prototype.normalizar = function () { return this.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, "") }
String.prototype.normalizarPrecio = function () { return parseFloat(this).toFixed(2).replace(/[.,]00$/, "") }
Number.prototype.normalizarPrecio = function () { return this.toFixed(2).replace(/[.,]00$/, "") }

module.exports = sumaResumenDias
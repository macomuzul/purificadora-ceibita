function sumaResumenDias(venta) {
  let listaTablasValores = venta.tablas.map(tabla => tabla.productos.map(producto => ({ producto: producto.nombre.normalizar(), v: producto.vendidos, i: producto.ingresos, p: producto.nombre })));
  let prods = listaTablasValores.reduce((acc, table) => {
    table.forEach(prod => {
      if (acc[prod.producto]) {
        acc[prod.producto].v += prod.v;
        acc[prod.producto].i += prod.i;
      } else {
        acc[prod.producto] = { v: prod.v, i: prod.i, p: prod.p };
      }
    });
    return acc;
  }, {});
  let vt = 0;
  let it = 0;
  Object.values(prods).forEach(x => {
    x.i = parseFloat(x.i.normalizarPrecio())
    vt += x.v
    it += x.i
  })
  it = parseFloat(it.normalizarPrecio())
  return { prods, vt, it }
}

String.prototype.normalizar = function () { return this.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, "") }
String.prototype.normalizarPrecio = function () { return parseFloat(this).toFixed(2).replace(/[.,]00$/, "") }
Number.prototype.normalizarPrecio = function () { return this.toFixed(2).replace(/[.,]00$/, "") }

module.exports = sumaResumenDias
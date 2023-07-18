function devuelveValoresSumados(dias) {
  if (dias.length === 0)
    return {}
  let prods = dias.reduce((acc, curr) => {
    Object.entries(curr.prods).forEach(([k, v]) => {
      if (acc[k]) {
        acc[k].v += v.v;
        acc[k].i += v.i
      } else
        acc[k] = v
    })
    return acc
  }, {})
  let vt = 0, it = 0
  Object.values(prods).forEach(x => {
    x.i = parseFloat(x.i.normalizarPrecio())
    vt += x.v
    it += x.i
  })
  it = parseFloat(it.normalizarPrecio())
  return { prods, vt, it }
}

module.exports = devuelveValoresSumados
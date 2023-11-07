function devuelveValoresSumados(dias) {
  if (dias.length === 0) return {}
  let prods = {}, cams = {}
  let sumar = (it, obj) => {
    Object.entries(it).forEach(([k, v]) => {
      if (obj[k]) {
        obj[k].v += v.v;
        obj[k].i += v.i
      } else
        obj[k] = v
    })
  }

  dias.forEach(x => {
    sumar(x.prods, prods)
    sumar(x.cams, cams)
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

module.exports = devuelveValoresSumados
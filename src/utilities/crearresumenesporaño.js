const { DateTime } = require("luxon")
const { ResumenMes, ResumenAño } = require("../models/resumenes")
const devuelveValoresSumados = require("./devuelveValoresSumados")

String.prototype.normalizarPrecio = function () { return parseFloat(this).toFixed(2).replace(/[.,]00$/, "") }
Number.prototype.normalizarPrecio = function () { return this.toFixed(2).replace(/[.,]00$/, "") }


async function calcularTodosLosResumenesPorAño() {
  let resumenesMes = await ResumenMes.ordenado()
  let agrupados = Object.groupBy(resumenesMes, ({ _id }) => DateTime.fromJSDate(_id).startOf("year"))
  await ResumenAño.insertMany(Object.entries(agrupados).map(([_id, v]) => ({ _id, ...devuelveValoresSumados(v), f: DateTime.fromISO(_id).endOf("year").valueOf(), c: false })))
}

module.exports = calcularTodosLosResumenesPorAño
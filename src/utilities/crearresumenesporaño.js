const { DateTime } = require("luxon");
const ResumenMes = require("../models/resumenMes");
const ResumenAño = require("../models/resumenAño");
const _ = require("lodash")
const devuelveValoresSumados = require("./devuelveValoresSumados")

String.prototype.normalizarPrecio = function () { return parseFloat(this).toFixed(2).replace(/[.,]00$/, "") }
Number.prototype.normalizarPrecio = function () { return this.toFixed(2).replace(/[.,]00$/, "") }


async function calcularTodosLosResumenesPorAño() {
  let resumenMes = await ResumenMes.find().sort("_id");
  let agrupados = _.groupBy(resumenMes, ({ _id }) => DateTime.fromJSDate(_id).startOf("year"))
  let resumen = Object.entries(agrupados).map(([_id, v]) => ({ _id, ...devuelveValoresSumados(v), f: DateTime.fromISO(_id).endOf("year").valueOf(), c: false }));
  await ResumenAño.insertMany(resumen);
}

module.exports = calcularTodosLosResumenesPorAño
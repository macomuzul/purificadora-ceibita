const { DateTime } = require("luxon");
const ResumenDia = require("../models/resumenDia");
const _ = require("lodash")
const devuelveValoresSumados = require("./devuelveValoresSumados")

String.prototype.normalizarPrecio = function () { return parseFloat(this).toFixed(2).replace(/[.,]00$/, "") }
Number.prototype.normalizarPrecio = function () { return this.toFixed(2).replace(/[.,]00$/, "") }


async function calcularTodosLosResumenesPorSemanaYMes(tiempo, Resumen) {
  let resumenDia = await ResumenDia.ordenado()
  let agrupados = _.groupBy(resumenDia, ({ _id }) => DateTime.fromJSDate(_id).startOf(tiempo))
  await Resumen.insertMany(Object.entries(agrupados).map(([_id, v]) => ({ _id, ...devuelveValoresSumados(v), f: DateTime.fromISO(_id).endOf(tiempo).valueOf(), c: false })))
}

module.exports = calcularTodosLosResumenesPorSemanaYMes
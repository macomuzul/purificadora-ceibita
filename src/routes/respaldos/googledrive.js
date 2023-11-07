require('dotenv').config()
const router = require("express").Router()
const { DateTime } = require("luxon")

router.route("/").get((req, res) => res.render("googledrive", { fecha: DateTime.now().setZone("America/Guatemala").toFormat("d/M/y"), esAdmin: esAdmin(req) })).post(tcaccion(guardarRespaldosCreadosPorElUsuario, "google drive respaldo generado por usuario"))

String.prototype.formatearFecha = function () { return DateTime.fromFormat(this, "d/M/y") }

module.exports = router

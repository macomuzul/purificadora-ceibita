require('dotenv').config()
const router = require("express").Router()
const RegistroVentas = require("../../models/registroventas")
const Plantillas = require("../../models/plantillas")
const Camioneros = require('../../models/camioneros')
const Registroseliminados = require('../../models/registroseliminados')

const { DateTime } = require("luxon")

router.route("/").get((req, res) => res.render("googledrive", { fecha: DateTime.now().setZone("America/Guatemala").toFormat("d/M/y"), esAdmin: esAdmin(req) })).post(tcaccion(async (req, res) => {
  let { datos, sobreescribir, nombreCarpeta } = req.body
  let folder = await buscarFolder(nombreCarpeta, folderVentas)
  if (folder && sobreescribir !== 1) return res.status(402).send()
  if (!folder) folder = await crearFolder(nombreCarpeta, folderVentas)
  folder = folder.id

  let o = {
    "mayores o iguales que": v => ({ $gte: v.formatearFecha() }),
    "menores o iguales que": v => ({ $lte: v.formatearFecha() }),
    "entre el": v => {
      let [menor, mayor] = v.split(" y ")
      return { $gte: menor.formatearFecha(), $lte: mayor.formatearFecha() }
    },
    "": v => {
      let fechas = v.split(", ")
      fechas = fechas.map(v => v.formatearFecha())
      return { $in: fechas }
    },
  }
  await Promise.all(datos.map(async x => {
    let { nombre, archivos, guardar, nombreArchivo } = x
    let regs = await ({
      Ventas: async g => {
        if (g === "todos") return await RegistroVentas.find().lean()
        let { rango, valor } = g
        return await RegistroVentas.find({ _id: o[rango](valor) }).lean()
      },
      Plantillas: async g => {
        if (g === "todos") return await Plantillas.find().lean()
        return await Plantillas.where("nombre").in(g.valor).lean()
      },
      Camioneros: async g => {
        let camioneros = await Camioneros.findOne().lean()
        if (g !== "todos") {
          let arr = g.valor
          camioneros.camioneros = camioneros.camioneros.filter(x => arr.includes(x.nombre))
        }
        return camioneros
      },
      "Registros eliminados": async g => {
        if (g === "todos") return await Registroseliminados.find().lean()
        let { rango, valor } = g
        return await Registroseliminados.find({ borradoEl: o[rango](valor) }).lean()
      },
    })[nombre](guardar)

    await crearArchivo(nombreArchivo, folder, regs, archivos)
    return regs
  }))
  res.send()
}, "google drive respaldo generado por usuario"))

String.prototype.formatearFecha = function () { return DateTime.fromFormat(this, "d/M/y") }

module.exports = router

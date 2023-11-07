const { DateTime } = require("luxon")
const { Readable } = require("stream")
const BSON = require('bson')
const RegistroVentas = require("../models/registroventas")
const Plantillas = require("../models/plantillas")
const Camioneros = require('../models/camioneros')
const Registroseliminados = require('../models/registroseliminados')

let folderRespaldosUsuario = process.env.FOLDER_RESPALDOS_USUARIO
let folderVentas = process.env.FOLDER_VENTAS

let buscarFolder = async (name, folderPadre) => await buscarDrive(name, folderPadre, 1)
let buscarArchivo = async (name, folderPadre) => await buscarDrive(name, folderPadre, 0)
let bufferJSON = v => JSON.stringify(v)
let bufferBSON = v => Readable.from(v instanceof Array ? v.map(x => BSON.serialize(x)) : BSON.serialize(v))
let devuelveBuffer = (x, tipo) => tipo === "json" ? bufferJSON(x) : bufferBSON(x)
let objVacio = o => Object.keys(o).length === 0

global.crearFolder = async function (name, folderPadre) {
  let folder = await gDrive.files.create({
    requestBody: {
      name,
      mimeType: "application/vnd.google-apps.folder",
      parents: [folderPadre]
    }
  })
  // console.log("folder creado: ",folder)
  return folder.data
}

global.crearArchivoDrive = async function (nombre, folderPadre, objetosAMandar, tipo) {
  let body = devuelveBuffer(objetosAMandar, tipo)
  let archivo = await gDrive.files.create({
    media: {
      mimeType: "application/" + tipo,
      body
    },
    requestBody: {
      name: `${nombre}.${tipo}`,
      parents: [folderPadre]
    }
  })
  // console.log("archivo creado:",archivo)
  return archivo.data
}

global.crearArchivo = async function (name, folderPadre, objetosAMandar, tipo) {
  let tipos = ["json", "bson"]
  for (let t of tipos) {
    if (tipo === t || tipo === "ambos") {
      let archivo = await crearArchivoDrive(name, folderPadre, objetosAMandar, t)
      if (objVacio(archivo)) return false
    }
  }
  return true
}

async function crearArchivoVacio(name, folderPadre) {
  const archivo = await gDrive.files.create({
    requestBody: {
      name: name,
      parents: [folderPadre]
    },
    fields: "id, name"
  })
  return archivo.data
}

async function buscarDrive(name, folderPadre, esFolder) {
  let folder = await gDrive.files.list({
    q: `mimeType${esFolder ? "=" : "!="}'application/vnd.google-apps.folder' and trashed=false and name='${name}' and '${folderPadre}' in parents`,
    fields: "nextPageToken, files(id, name)",
    spaces: "drive",
  })
  // console.log("folder buscado:", folder)
  // console.log(folder.data.files[0])
  return folder.data.files[0]
}

async function buscarOCrearFolder(name, folderPadre) {
  let folder = await buscarFolder(name, folderPadre)
  if (!folder) folder = await crearFolder(name, folderPadre)
  return folder
}

async function devuelveFolderMes(años, year, meses, month, func = buscarOCrearFolder) {
  let folder
  if (años[year]) folder = años[year]
  else {
    folder = await func(year, folderVentas)
    if (!folder) return false
    años[year] = folder
  }
  if (meses[month]) folder = meses[month]
  else {
    folder = await func(month, folder.id)
    if (!folder) return false
    meses[month] = folder
  }
  return folder
}

global.guardarRespaldoDiario = async function (creadosOModificados, tipo, borrados = []) {
  let creadoEl = DateTime.now().minus({ days: 1 }).toFormat("d/M/y")
  let años = {}, meses = {}
  for (const c of creadosOModificados) {
    let { year, month, day } = DateTime.fromJSDate(c.venta._id)
    let folder = await devuelveFolderMes(años, year, meses, month)
    if (!folder) return false
    let folderid = folder.id
    let existiaAntes = true
    folder = await buscarFolder(day, folderid)
    if (!folder) {
      existiaAntes = false
      folder = await crearFolder(day, folderid)
    }
    if (!folder) return false
    let m = c.motivo
    let textoArchivo = `Registro con fecha ${day}/${month}/${year}`
    folder = await crearFolder(textoArchivo + ` fue ${!existiaAntes ? "creado" : m === 1 ? "modificado" : (m === 3 || m === 4) ? `movido a esta fecha desde la fecha ${DateTime.fromJSDate(c.fecha2).toFormat("d/M/y")}` : "recuperado"} el ${creadoEl}`, folder.id)
    if (!folder) return false
    await crearArchivo(textoArchivo, folder.id, c.venta, tipo)
  }
  for (const b of borrados) {
    let { year, month, day } = DateTime.fromJSDate(new Date(b._id))
    let folder = await devuelveFolderMes(años, year, meses, month, buscarFolder)
    if (!folder) return false
    folder = await buscarFolder(day, folder.id)
    if (folder) await crearArchivoVacio(`Registro con fecha ${day}/${month}/${year} fue ${b.motivo === 2 ? "eliminado" : ("movido a la fecha " + DateTime.fromJSDate(b.fecha1).toFormat("d/M/y"))} el ${creadoEl}`, folder.id)
  }
  return true
}



global.guardarDias = async function () {
  let ventas = await RegistroVentas.find().sort("_id").lean()
  // let ventas = await RegistroVentas.where("_id").gte(DateTime.now().startOf("month")).lean()
  let años = {}, meses = {}
  let creadoEl = DateTime.now().toFormat("d/M/y")
  for (const venta of ventas) {
    let { year, month, day } = DateTime.fromJSDate(venta._id)
    let folder = await devuelveFolderMes(años, year, meses, month)
    if (!folder) return false
    folder = await buscarOCrearFolder(day, folder.id)
    if (!folder) return false
    let textoArchivo = `Registro con fecha ${day}/${month}/${year}`
    folder = await crearFolder(textoArchivo + ` fue creado el ${creadoEl}`, folder.id)
    if (!folder) return false
    let archivo = await crearArchivo(textoArchivo, folder.id, venta, "ambos")
    if (!archivo) return false
  }
  return true
}

global.guardarRespaldosCreadosPorElUsuario = async (req, res) => {
  let { datos, sobreescribir, nombreCarpeta } = req.body
  let folder = await buscarFolder(nombreCarpeta, folderRespaldosUsuario)
  if (folder && sobreescribir !== 1) return res.status(402).send()
  if (!folder) folder = await crearFolder(nombreCarpeta, folderRespaldosUsuario)
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
}
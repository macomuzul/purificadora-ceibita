require('dotenv').config()
const router = require("express").Router()
const RegistroVentas = require("../../models/registroventas")
const Plantillas = require("../../models/plantillas")
const Camioneros = require('../../models/camioneros')
const Registroseliminados = require('../../models/registroseliminados')
const { Readable } = require("stream")

const { DateTime } = require("luxon")
const { google } = require("googleapis")
const BSON = require('bson')
const nodemailer = require("nodemailer")

let correo = process.env.CORREO
let folderVentas = process.env.FOLDER_VENTAS

let buscarFolder = async (name, folderPadre) => await buscarDrive(name, folderPadre, 1)
let buscarArchivo = async (name, folderPadre) => await buscarDrive(name, folderPadre, 0)
let bufferJSON = v => JSON.stringify(v)
let bufferBSON = v => Readable.from(v instanceof Array ? v.map(x => BSON.serialize(x)) : BSON.serialize(v))
let devuelveBuffer = (x, tipo) => tipo === "json" ? bufferJSON(x) : bufferBSON(x)
let objVacio = o => Object.keys(o).length === 0

async function crearFolder(name, folderPadre) {
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

async function crearArchivoDrive(nombre, folderPadre, objetosAMandar, tipo) {
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

async function crearArchivo(name, folderPadre, objetosAMandar, tipo) {
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

async function devuelveFolderMes(años, year, meses, month) {
  let folder
  if (años[year]) folder = años[year]
  else {
    folder = await buscarOCrearFolder(year, folderVentas)
    if (!folder) return false
    años[year] = folder
  }
  if (meses[month]) folder = meses[month]
  else {
    folder = await buscarOCrearFolder(month, folder.id)
    if (!folder) return false
    meses[month] = folder
  }
  return folder
}

async function guardarDias(ventas, creadoEl, tipo, borrados = []) {
  let años = {}, meses = {}
  for (const venta of ventas) {
    let { year, month, day } = DateTime.fromJSDate(venta._id)
    let folder = await devuelveFolderMes(años, year, meses, month)
    if (!folder) return false
    folder = await buscarOCrearFolder(day, folder.id)
    if (!folder) return false

    let archivo = await crearArchivo(`registro con fecha ${day}/${month}/${year} creado el ${creadoEl}`, folder.id, venta, tipo)
    if (!archivo) return false
  }
  for (const borrado of borrados) {
    let { _id, motivo, fecha } = borrado
    let { year, month, day } = DateTime.fromJSDate(_id)
    let folder = await devuelveFolderMes(años, year, meses, month)
    if (!folder) return false
    folder = await buscarOCrearFolder(day, folder.id)
    if (folder) {
      let archivo = await crearArchivoVacio(`registro con fecha ${day}/${month}/${year} ${motivo === 2 ? "fue movido" : "fue eliminado"} el ${creadoEl}${motivo === 2 ? ` a la fecha ${DateTime.fromJSDate(fecha).toFormat("d/M/y")}` : ""}`, folder.id)
      if (!archivo) return false
    }
  }
  return true
}

async function mandarCorreoCambioRegistro(opcion, usuario, fecha1, fecha2) {
  try {
    let colores = ["green", "black", "red", "orange", "blue", "rebeccapurple"]
    let opciones = ["creado", "sobreescrito", "eliminado", "movido", "recuperado", "sobreescrito por un registro recuperado"]
    let html = `El registro con fecha <strong>${fecha1}</strong> ha sido <span style="font-weight:600; color: ${colores[opcion]};">${opciones[opcion]}</span>
    ${(opcion === 3 || opcion === 4 || opcion === 5) ? ` ${opcion === 3 ? "a la" : `${opcion === 4 ? "desde otro registro anterior" : ""} con`} fecha <strong>${fecha2}</strong>` : ""} por el usuario <strong>${usuario}</strong>
    <div>Haz click aqui para ir al registro ➔ http://localhost:3000/registrarventas/3-4-2023</div>
    <img src="https://lh3.googleusercontent.com/u/0/drive-viewer/AITFw-xt_PXzBn-AiMOJJGFpu0cXoaC-GUBhXChgaJJEmwwPwG5Fe2Q1sEH-0_2I8HZxMg9W_DmUl3Tb3rNENogESc5IUSP-=w811-h643">`
    let accessToken = await oauth2Client.getAccessToken()
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        type: "OAuth2",
        user: correo,
        clientId, clientSecret, refreshToken, accessToken,
      },
    })
    let { accepted } = await transporter.sendMail({
      from: `<${correo}>`,
      to: correo,
      subject: `${!opcion ? "Se ha agregado un nuevo registro" : `Un registro ha sido ${opciones[opcion]}`}!`,
      html
    })
    if (!accepted.length)
      console.log("Error al mandar correo")
  } catch (error) {
    console.log(error)
  }
}

router.route("/").get((req, res) => res.render("googledrive", { fecha: DateTime.now().setZone("America/Guatemala").toFormat("d/M/y") })).post(async (req, res) => {
  try {
    let { datos, sobreescribir, nombreCarpeta } = req.body
    let folder = await buscarFolder(nombreCarpeta, folderVentas)
    if (folder && sobreescribir !== 1) return res.status(402).send()
    if (!folder) folder = await crearFolder(nombreCarpeta, folderVentas)
    folder = folder.id

    await Promise.all(datos.map(async x => {
      let { nombre, archivos, guardar, nombreArchivo } = x
      let regs = await ({
        Ventas: async g => {
          if (g === "todos") return await RegistroVentas.find().lean()
          let { rango, valor } = g
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
          return await Registroseliminados.find({ borradoEl: o[rango](valor) }).lean()
        },
      })[nombre](guardar)

      await crearArchivo(nombreArchivo, folder, regs, archivos)
      return regs
    }))
    res.send()
  } catch (e) {
    console.log(e)
    res.status(400).send("")
  }
})

String.prototype.formatearFecha = function () { return DateTime.fromFormat(this, "d/M/y") }

module.exports = router

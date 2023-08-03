require('dotenv').config()
const router = require("express").Router();
const Respaldo = require("../../models/registroseliminados");
const RegistroVentas = require("../../models/registroventas");
const { DateTime } = require("luxon");
const { google } = require("googleapis")
const stream = require("stream")
const BSON = require('bson');
const nodemailer = require("nodemailer");
const { send } = require('process');

let clientId = process.env.CLIENT_ID
let clientSecret = process.env.CLIENT_SECRET
let refreshToken = process.env.REFRESH_TOKEN
let correo = process.env.CORREO
let folderVentas = process.env.FOLDER_VENTAS

let buscarFolder = async (name, folderPadre) => await buscarDrive(name, folderPadre, 1)
let buscarArchivo = async (name, folderPadre) => await buscarDrive(name, folderPadre, 0)
let bufferJSON = x => Buffer.from(JSON.stringify(x))
let bufferBSON = x => BSON.serialize(x)
let devuelveBuffer = (x, esBSON) => esBSON ? bufferBSON(x) : bufferJSON(x)
let objVacio = o => Object.keys(o).length === 0

const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, refreshToken)
oauth2Client.setCredentials({ refresh_token: refreshToken })
const gDrive = google.drive({ version: 'v3', auth: oauth2Client })

async function crearFolder(name, folderPadre) {
  let folder = await gDrive.files.create({
    requestBody: {
      name,
      mimeType: "application/vnd.google-apps.folder",
      parents: [folderPadre]
    }
  })
  return folder.data
}

async function crearArchivo(name, folderPadre, objetosAMandar, esBSON) {
  let archivo = await crearArchivoDrive(name, folderPadre, objetosAMandar, esBSON)
  if (objVacio(archivo)) return false
  if (esBSON === 2)
    archivo = await crearArchivoDrive(name, folderPadre, objetosAMandar, 0)
  if (objVacio(archivo)) return false
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

async function crearArchivoDrive(name, folderPadre, objetosAMandar, esBSON) {
  let buffer = new stream.PassThrough()
  if (objetosAMandar instanceof Array)
    objetosAMandar.forEach((x, i) => buffer[(i === objetosAMandar.length - 1 ? 'end' : 'write')](devuelveBuffer(x, esBSON)))
  else
    buffer.end(devuelveBuffer(objetosAMandar, esBSON))
  const archivo = await gDrive.files.create({
    media: {
      mimeType: esBSON ? "application/bson" : "application/json",
      body: buffer
    },
    requestBody: {
      name: name + (esBSON ? ".bson" : ".json"),
      parents: [folderPadre]
    },
    fields: "id, name"
  })
  return archivo.data
}

async function buscarDrive(name, folderPadre, esFolder) {
  let folder = await gDrive.files.list({
    q: `mimeType${esFolder ? "=" : "!="}'application/vnd.google-apps.folder' and trashed = false and name='${name}' and '${folderPadre}' in parents`,
    fields: "nextPageToken, files(id, name)",
    spaces: "drive",
  })
  return folder.data.files[0]
}

async function buscarOCrearFolder(name, folderPadre) {
  let folder = await buscarFolder(name, folderPadre)
  if (!folder)
    folder = await crearFolder(name, folderPadre)
  return folder
}

async function devuelveFolderMes(años, year, meses, month) {
  let folder
  if (años[year])
    folder = años[year]
  else {
    folder = await buscarOCrearFolder(year, folderVentas)
    if (!folder) return false
    años[year] = folder
  }
  if (meses[month])
    folder = meses[month]
  else {
    folder = await buscarOCrearFolder(month, folder.id)
    if (!folder) return false
    meses[month] = folder
  }
  return folder
}

async function guardarDias(ventas, creadoEl, esBSON, borrados = []) {
  let años = {}, meses = {}
  for (const venta of ventas) {
    let { year, month, day } = DateTime.fromJSDate(venta._id)
    let folder = await devuelveFolderMes(años, year, meses, month)
    if (!folder) return false
    folder = await buscarOCrearFolder(day, folder.id)
    if (!folder) return false

    let archivo = await crearArchivo(`registro con fecha ${day}/${month}/${year} creado el ${creadoEl}`, folder.id, venta, esBSON)
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

router.post("/respaldarGoogleDrive", async (req, res) => {
  try {
    var fechaiso = DateTime.fromFormat("29-01-2023", "d-M-y")
    let ventaspordia = await RegistroVentas.where("_id").equals(fechaiso);



    res.send("Subido")
  } catch (e) {
    res.status(400).send(`No se pudo restaurar ${e}`);
  }
});


module.exports = router;

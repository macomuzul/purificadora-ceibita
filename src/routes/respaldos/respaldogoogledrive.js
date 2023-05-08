require('dotenv').config()
const router = require("express").Router();
const Respaldo = require("../../models/registroseliminados");
const VENTASPORDIA = require("../../models/registroventaspordia");
const { DateTime } = require("luxon");
const { google } = require("googleapis")
const stream = require("stream")
const BSON = require('bson');
const nodemailer = require("nodemailer");
const redis = require('../../redis');
const { send } = require('process');

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);
oauth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });
const service = google.drive({ version: 'v3', auth: oauth2Client });

router.post("/mandarcorreo", async (req, res) => {
  try {
    let html = `<h1>Que bonito es lo bonito</h1>
    <br>
    Ha habido cambios en la pagina http://localhost:3000/registrarventas/3-4-2023
    <br>
    <img src="cid:logo">`
    const accessToken = await oauth2Client.getAccessToken();
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        type: "OAuth2",
        user: "purificadoralaceibita@gmail.com",
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken,
      },
    });
    const mailOptions = {
      from: "Se han agregado cosas nuevas a la página <purificadoralaceibita@gmail.com>",
      to: "purificadoralaceibita@gmail.com",
      subject: "Se pudo",
      html,
      attachments: [{
        filename: "ceibitalogo.png",
        path: "./src/public/images/ceibitalogo.png",
        cid: "logo"
      }]
    }

    const result = await transporter.sendMail(mailOptions)
    if (result.accepted)
      res.send("Correo enviado")
    else
      res.send("No se pudo mandar :(")
  } catch (e) {
    res.status(400).send(`No se pudo enviar el correo ${e}`);
  }
});

router.post("/respaldarGoogleDrive", async (req, res) => {
  try {
    var fechaiso = DateTime.fromFormat("29-01-2023", "d-M-y").toISODate();
    let ventaspordia = await VENTASPORDIA.find().where("fecha").equals(fechaiso);
    const buffer = new stream.PassThrough()
    let i = 0
    for (; i < ventaspordia.length - 1; i++) {
      buffer.write(BSON.serialize(ventaspordia[i]))
    }
    buffer.end(BSON.serialize(ventaspordia[i]))

    const folder = await service.files.create({
      requestBody: {
        name: "folderconcosasdentro2",
        mimeType: "application/vnd.google-apps.folder",
      }
    });
    console.log('Folder:', folder);


    const archivo = await service.files.create({
      media: {
        mimeType: "application/bson",
        body: buffer
      },
      requestBody: {
        name: `respaldo con fecha de hoy.bson`,
        parents: [folder.data.id]
      },
      fields: "id, name"
    })
    console.log(archivo)
    console.log(`Se subio el archivo con el nombre ${archivo.data.name} y el id ${archivo.data.id} `)

    res.send("Subido")
  } catch (e) {
    res.status(400).send(`No se pudo restaurar ${e}`);
  }
});


module.exports = router;

const { DateTime, Settings } = require('luxon')
const { google } = require("googleapis")
const nodemailer = require("nodemailer")

global.errorDB = class errorDB extends Error {
  constructor(message) {
    super(message)
    this.name = "errorDB"
  }
}

global.trycatchruta = (f, msg) => async (req, res) => {
  try {
    await f(req, res)
  } catch (e) {
    console.log(e)
    //TODO el y StrictModeError validationError hay que dejarlo solo en desarrollo porque si no es un fallo de seguridad
    // if (err.name === 'StrictModeError') return
    if (e.name === 'StrictModeError') return res.status(400).send(e.message)
    else if (e.name === 'ValidationError') return res.status(400).send(Object.values(e.errors)[0].message)
    else if (e.name === 'errorDB') return res.status(400).send(e.message)
    else res.status(400).send(msg)
  }
}

global.loginCantMaxPeticionesInvalidas = 3
global.recuperarContraseñaCantMaxPeticionesInvalidas = 2
global.tiempoTimeoutLoginSegundos = 900 //15 minutos
global.tiempoTimeoutRecuperarContraseñaSegundos = 21600 //6 horas
Settings.defaultLocale = "es"
Settings.defaultZone = "UTC"


let clientId = process.env.CLIENT_ID
let clientSecret = process.env.CLIENT_SECRET
let refreshToken = process.env.REFRESH_TOKEN
global.oauth2Client = new google.auth.OAuth2(clientId, clientSecret, refreshToken)
oauth2Client.setCredentials({ refresh_token: refreshToken })
global.gDrive = google.drive({ version: 'v3', auth: oauth2Client })

global.mandarCorreo = async function (motivo, usuario, f1, f2) {
  try {
    let correo = process.env.CORREO
    let formatearFecha = fecha => DateTime.fromMillis(fecha).toLocaleString(DateTime.DATE_HUGE)
    let fecha2
    let fecha1 = formatearFecha(f1)
    let fechaURL = DateTime.fromMillis(f1).toFormat("d-M-y")
    if (f2) fecha2 = formatearFecha(f2)

    let colores = ["green", "black", "red", "orange", "brown", "blue", "rebeccapurple"]
    let opciones = ["creado", "modificado", "eliminado", "creado por un registro movido", "sobreescrito por un registro movido", "creado por un registro recuperado", "sobreescrito por un registro recuperado"]
    let html = `El registro con fecha <strong>${fecha1}</strong> ha sido <span style="font-weight:600; color: ${colores[motivo]};">${opciones[motivo]}</span>
    ${motivo > 2 ? ` con fecha <strong>${fecha2}</strong>` : ""} por el usuario <strong>${usuario}</strong>
    <div>Haz click aqui para ir al registro ➔ http://localhost:3000/registrarventas/${fechaURL}</div>
    <img src="https://lh3.googleusercontent.com/fife/AKsag4Os94JVrk5ZygVBFIIAMsJ_duZfFS8XHdAKZpnxGb7jm8b_iq-x5ycQ926XmEupvniIvCgGSiUtHhHoPsSUY2k7uRPh0WUuuO2o9b3fSidVDzHB-21hOmkzhNDe34aDBHyRo-sNop2n8Qkd3CcrQ_GLg6LCabqyHQnOKfAa-Q4y5UGlrvBjI53-zyO4S1HJKDSdszbAgQUDI3DoO6dbYTQ74wX4NDLsq23zpU5R71Bl1F0UnZ7d35uUF8BvEZpeRGB0pj73lakTd39bgeVx378UYpeq-XVabinp3Lt--P88jB9QYb8Vjhzdbhisj94eUFe7SSL-yIoFbxfWyZUMPtTpbm0avYhmFsJHTnemWo5tvwzQpvrLgMKSGraRwh94_bhr-tDqq9FqXzTZTQxqkmKiT_KCT0p1VvZeCNgbrDTYtN3PDn0cWU3AcNdrbTfTLpB7Szc99_1fgbO4nfl1TY8qNh4bNQsqKFCAvNVRRNSxCjSGh4radcqtq7YgXsO8ick609CpiHhUY0Iu21qy9rNl8_HludecdI5CsRy7pWw-KdCUugXRCCMpGUwMptIFca-T_Rxp8czNjmkzG9RbC4Vbw4U9AQsU6VF9KzqPLVIvsmoz_AmQuemPf6ppwq8TqrRv_w75Pjo3bqJ14evz66r9_MjU1qbB6IT10R99j7LcjBnb8_twBsOXOyKx68n7s_f6udiW7nyN0WR-FFmHqFEb09knbIa9M1mzt5D6_Dd9ddX1WgdHVwXa2dFOLgLmI-DCZ_CCP8GO6IJmrsyJYP_kSenwq8o5yYw4QnoDKrjoTKj4MeG4SUdZJeVRRxUTKKLbqHviPVGAeheGsw8bjp75rTjji5vZEHphDkW5qpqaXv-gvbLL9i09FVGHO90yl2UReJ_YurgU82VcwXRGIzuK1vfy8zJcoD7MzhgTDlIfNvJ4WMxV_oYbdOLmd-FKMPXUI4m9EZd3AOCkQe87gWm9JDZQm0iabmU78RutvmcV2hnX_es66EXRkng0Azgr0NzfIV6KoDxkBlclkOOr87D9r7zfotvyyIIPUHb-eb_ljF5M3rNWu7DpxjldthflDPtF5ADWSxPt9PQYKVuNMwbh7IsVeO1q0W6e-QqKeC7yCkQw2JVdCP7z-zv0m3hfPaIbZyQu1QcxjEsy4ntfELm10VTHxgCIFw_C-IwdhQjYsUdD5HC9GQJoFPgE0xiDbMBxoA8yfBYJd6PucglaPjwXYxPP05kFrJjTF5tuvnhXuSp13FL9rxY2SnUko-SWWFhrJpmZv-HyVTCqvme_BO_W7vCgRcMGlYbxxm5ml_9Kbj1YfPfdKWfSo7h4xwQljyUHFQJiM_WCG3HfqScK0GZLR1cB9XPXaTUe7fnVeK6aFyWS8tA4VZrKz6TgiiW7i_eohCCK6bOhc_HTnJVM4WIxJ3Lnii6zySjRUpIYNEDSL2IvDcbDt5u2mZ-3Ge83X-XqEWHZJQuki6N3lDpZqhXBsbOPANuo8Wmml6TrGKhTJfHv0zD10o0Lsm2BiLeX39_zPIyG8J9jvqZ6y4VK5i2DtB37x3IgH3oFbU6AjCL1GvwDdwQi9hkJHm91WPVkFLOluzw10g3SMAY=w1365-h312">`
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
      subject: `${!motivo ? "Se ha agregado un nuevo registro" : `Un registro ha sido ${opciones[motivo]}`}!`,
      html
    })

    console.log(accepted.length ? "Correo enviado" : "No se pudo mandar :(")
  } catch (error) {
    console.log(error)
  }
}
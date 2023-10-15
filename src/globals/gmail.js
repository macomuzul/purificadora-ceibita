const nodemailer = require("nodemailer")
let correo = process.env.CORREO

global.mandarCorreoRegVentas = tcgoogle(async (motivo, usuario, f1, f2) => {
  let formatearFecha = f => DateTime.fromMillis(f).toLocaleString(DateTime.DATE_HUGE)
  let fecha2
  let fecha1 = formatearFecha(f1)
  let fechaURL = motivo > 4 ? DateTime.fromMillis(f2).toFormat("d-M-y") : DateTime.fromMillis(f1).toFormat("d-M-y")
  if (f2) fecha2 = formatearFecha(f2)

  let colores = ["green", "black", "red", "orange", "brown", "blue", "rebeccapurple"]
  let opcionesHTML = ["creado", "modificado", "eliminado", "movido", "movido y ha sobreescrito otro registro", "recuperado", "recuperado y ha sobreescrito otro registro"]
  let extras = ["", "", "", "a la", "con", "y ha sido puesto en la", "con"]
  let html = `${motivo > 4 ? "Un" : "El"} registro ${motivo > 4 ? "previamente eliminado " : ""}con fecha <strong>${fecha1}</strong> ha sido <span style="font-weight:600; color: ${colores[motivo]};">${opcionesHTML[motivo]}</span>${motivo > 2 ? ` ${extras[motivo]} fecha <strong>${fecha2}</strong>` : ""} por el usuario <strong>${usuario}</strong>
    <div>Haz click aqui para ir al registro ➔ http://localhost:3000/registrarventas/${fechaURL}</div>
    <img src="https://lh3.googleusercontent.com/fife/AKsag4Os94JVrk5ZygVBFIIAMsJ_duZfFS8XHdAKZpnxGb7jm8b_iq-x5ycQ926XmEupvniIvCgGSiUtHhHoPsSUY2k7uRPh0WUuuO2o9b3fSidVDzHB-21hOmkzhNDe34aDBHyRo-sNop2n8Qkd3CcrQ_GLg6LCabqyHQnOKfAa-Q4y5UGlrvBjI53-zyO4S1HJKDSdszbAgQUDI3DoO6dbYTQ74wX4NDLsq23zpU5R71Bl1F0UnZ7d35uUF8BvEZpeRGB0pj73lakTd39bgeVx378UYpeq-XVabinp3Lt--P88jB9QYb8Vjhzdbhisj94eUFe7SSL-yIoFbxfWyZUMPtTpbm0avYhmFsJHTnemWo5tvwzQpvrLgMKSGraRwh94_bhr-tDqq9FqXzTZTQxqkmKiT_KCT0p1VvZeCNgbrDTYtN3PDn0cWU3AcNdrbTfTLpB7Szc99_1fgbO4nfl1TY8qNh4bNQsqKFCAvNVRRNSxCjSGh4radcqtq7YgXsO8ick609CpiHhUY0Iu21qy9rNl8_HludecdI5CsRy7pWw-KdCUugXRCCMpGUwMptIFca-T_Rxp8czNjmkzG9RbC4Vbw4U9AQsU6VF9KzqPLVIvsmoz_AmQuemPf6ppwq8TqrRv_w75Pjo3bqJ14evz66r9_MjU1qbB6IT10R99j7LcjBnb8_twBsOXOyKx68n7s_f6udiW7nyN0WR-FFmHqFEb09knbIa9M1mzt5D6_Dd9ddX1WgdHVwXa2dFOLgLmI-DCZ_CCP8GO6IJmrsyJYP_kSenwq8o5yYw4QnoDKrjoTKj4MeG4SUdZJeVRRxUTKKLbqHviPVGAeheGsw8bjp75rTjji5vZEHphDkW5qpqaXv-gvbLL9i09FVGHO90yl2UReJ_YurgU82VcwXRGIzuK1vfy8zJcoD7MzhgTDlIfNvJ4WMxV_oYbdOLmd-FKMPXUI4m9EZd3AOCkQe87gWm9JDZQm0iabmU78RutvmcV2hnX_es66EXRkng0Azgr0NzfIV6KoDxkBlclkOOr87D9r7zfotvyyIIPUHb-eb_ljF5M3rNWu7DpxjldthflDPtF5ADWSxPt9PQYKVuNMwbh7IsVeO1q0W6e-QqKeC7yCkQw2JVdCP7z-zv0m3hfPaIbZyQu1QcxjEsy4ntfELm10VTHxgCIFw_C-IwdhQjYsUdD5HC9GQJoFPgE0xiDbMBxoA8yfBYJd6PucglaPjwXYxPP05kFrJjTF5tuvnhXuSp13FL9rxY2SnUko-SWWFhrJpmZv-HyVTCqvme_BO_W7vCgRcMGlYbxxm5ml_9Kbj1YfPfdKWfSo7h4xwQljyUHFQJiM_WCG3HfqScK0GZLR1cB9XPXaTUe7fnVeK6aFyWS8tA4VZrKz6TgiiW7i_eohCCK6bOhc_HTnJVM4WIxJ3Lnii6zySjRUpIYNEDSL2IvDcbDt5u2mZ-3Ge83X-XqEWHZJQuki6N3lDpZqhXBsbOPANuo8Wmml6TrGKhTJfHv0zD10o0Lsm2BiLeX39_zPIyG8J9jvqZ6y4VK5i2DtB37x3IgH3oFbU6AjCL1GvwDdwQi9hkJHm91WPVkFLOluzw10g3SMAY=w1365-h312">`

  let formatearFechaDocs = f => DateTime.fromMillis(f).toFormat("d/M/y")
  let f1docs = formatearFechaDocs(f1), f2docs
  if (f2) f2docs = formatearFechaDocs(f2)
  opcionesDocs = ["Creó", "Modificó", "Eliminó", "Movió", "Movió", "Recuperó", "Recuperó"]
  extrasDocs = ["", "", "", "a la", "y sobrescribió el registro con", "y lo puso en la", "y sobreescribió el registro con"]
  let textoGSheets = `${opcionesDocs[motivo]} ${motivo > 4 ? "un" : "el"} registro ${motivo > 4 ? "previamente eliminado " : ""}con fecha ${f1docs}${motivo > 2 ? ` ${extrasDocs[motivo]} fecha ${f2docs}` : ""}`
  let hora = DateTime.now().setZone("America/Guatemala").toFormat('h:mm a').replace(' ', '')
  textoGDocs = `- El usuario ${usuario} ${primeraLetraMinuscula(textoGSheets)} a las ${hora}`
  await agregarFilaGoogleSheets([hora, usuario, textoGSheets])
  if ((await redis.get("hubocambioshoy")) === "0") {
    await redis.set("hubocambioshoy", "1")
    await crearDiaGoogleDocs(textoGDocs)
  }
  await agregarTextoDocs(textoGDocs)

  await mandarCorreo(`${!motivo ? "Se ha agregado un nuevo registro" : `Un registro ha sido ${opcionesHTML[motivo]}`}!`, html)
}, "gmail mandarCorreoRegVentas")

global.mandarCorreoError = tcgoogle(mandarCorreo, "mandarCorreoError")

async function mandarCorreo(subject, html) {
  let accessToken = await oauth2Client.getAccessToken()
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { type: "OAuth2", user: correo, clientId, clientSecret, refreshToken, accessToken }
  })
  await transporter.sendMail({ from: `<${correo}>`, to: correo, subject, html })
}
let correo = process.env.CORREO

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
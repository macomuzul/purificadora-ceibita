let usuario, contraseña, confirmarContraseña, rol, correo
toastr.options.positionClass = "toast-bottom-right"

async function validarDatos() {
  if (!usuario || !contraseña || !confirmarContraseña) return mostrarError("Por favor llenar todos los campos")
  if (contraseña !== confirmarContraseña) return mostrarError("Las contraseñas no coinciden")
  if (rol === "Escoge un rol") return mostrarError("No se ha escogido ningún rol para el usuario")

  return true
}

function mostrarError(error) {
  swalError(error)
  return false
}

let c = qsd("#correo")
bodyOnClick('#guardar', async function () {
  [usuario, contraseña, confirmarContraseña, correo] = ["#usuario", "#contraseña", "#confirmarContraseña", "#correo"].map(id => $(id).val((_, x) => x = x.trim()).val())
  rol = qsd("#rol").innerText
  if (!await validarDatos()) return
  if (correo) {
    validarCorreo()
    if (!c.checkValidity()) return c.reportValidity()
  }
  modalAutenticacion.mostrar(crearUsuario)
})

let validarCorreo = q => c.setCustomValidity(c.validity.valueMissing ? 'Por favor escribe un correo' : c.validity.typeMismatch ? 'Por favor escribe un correo válido por ejemplo: usuario@dominio.com' : '')
c.addEventListener('input', validarCorreo)



let crearUsuario = async function () {
  let contraseñaVerificacion = qsd("#verificacionIdentidad").value
  hazPost('', JSON.stringify({ usuario, contraseña, ...(correo ? { correo } : {}), rol, contraseñaVerificacion }), q => {
    swalExito("Se ha guardado el usuario correctamente")
    // if (correo) toastr.info("Se ha enviado un mensaje a tu correo para validarlo", "Atención")
  })
}

body.on("keydown", "input", e => {
  if (e.which === 13) {
    let elemSig = siguiente(padre(this))
    let input = qs(elemSig, "input")
    input instanceof HTMLInputElement ? input.focus() : qs(elemSig, "button")?.focus()
  }
})
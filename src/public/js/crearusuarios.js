let usuario, contraseña, confirmarContraseña, rol, correo
toastr.options.positionClass = "toast-bottom-right"

$("body").on('click', '.dropdown-item', function () {
  $(this).closest(".dropdown-menu").prev()[0].innerText = this.innerText
})

async function validarDatos() {
  if (!usuario || !contraseña || !confirmarContraseña) return mostrarError("Por favor llenar todos los campos")
  if (contraseña !== confirmarContraseña) return mostrarError("Las contraseñas no coinciden")
  if (rol === "Escoge un rol") return mostrarError("No se ha escogido ningún rol para el usuario")

  return true
}

function mostrarError(error) {
  Swal.fire("Error", error, "error")
  return false
}

let c = $("#correo")[0]
$("body").on('click', '#guardar', async function () {
  [usuario, contraseña, confirmarContraseña, correo] = ["#usuario", "#contraseña", "#confirmarContraseña", "#correo"].map(id => $(id).val((_, x) => x = x.trim()).val())
  rol = $("#rol")[0].innerText;
  if (!await validarDatos()) return
  if (correo) {
    validarCorreo()
    if (!c.checkValidity()) return c.reportValidity()
  }
  modal.mostrar(crearUsuario)
})

let validarCorreo = q => c.setCustomValidity(c.validity.valueMissing ? 'Por favor escribe un correo' : c.validity.typeMismatch ? 'Por favor escribe un correo válido por ejemplo: usuario@dominio.com' : '')
c.addEventListener('input', validarCorreo)



let crearUsuario = async function () {
  let contraseñaVerificacion = $("#verificacionIdentidad")[0].value;
  let data = JSON.stringify({ usuario, contraseña, ...(correo ? { correo } : {}), rol, contraseñaVerificacion })
  $.ajax({
    url: `/empleados/usuarios/crear`,
    method: "POST",
    contentType: "application/json",
    data,
    success: q => {
      Swal.fire("ÉXITO", "Se ha guardado el usuario correctamente", "success");
      // if (correo)
      //   toastr.info("Se ha enviado un mensaje a tu correo para validarlo", "Atención")
    },
    error: r => Swal.fire("Ups...", r.responseText, "error")
  })
}

$("body").on("keydown", "input", e => {
  if (e.which === 13) {
    let siguienteInput = $(this).parent().next().find("input")[0]
    siguienteInput instanceof HTMLInputElement ? siguienteInput.focus() : $(this).parent().next().find("button")[0]?.focus()
  }
})
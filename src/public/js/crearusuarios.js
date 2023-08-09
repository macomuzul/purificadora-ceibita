let usuario, contraseña, confirmarContraseña, rol, correo;

toastr.options = {
  "closeButton": true,
  "progressBar": true,
  "positionClass": "toast-bottom-right",
  "preventDuplicates": false,
  "timeOut": "100000",
  "extendedTimeOut": "100000",
}


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

$("body").on('click', '#guardar', async function () {
  [usuario, contraseña, confirmarContraseña, correo] = ["#usuario", "#contraseña", "#confirmarContraseña", "#correo"].map(id => $(id).val((_, x) => x = x.trim()).val())
  rol = $("#rol")[0].innerText;
  if (!await validarDatos()) return
  if (correo) {
    if (!$("#correo")[0].validar())
      return
  }
  modal.show()
})

funcionEnviar = async function () {
  let contraseñaVerificacion = $("#verificacionIdentidad")[0].value;
  let data = JSON.stringify({ usuario, contraseña, correo: correo || "-", rol, contraseñaVerificacion })
  modal.hide();
  $.ajax({
    url: `/empleados/usuarios/crear`,
    method: "POST",
    contentType: "application/json",
    data,
    success: q => {
      Swal.fire("ÉXITO", "Se ha guardado el usuario correctamente", "success");
      if (correo)
        toastr.info("Se ha enviado un mensaje a tu correo para validarlo", "Atención")
    },
    error: r => Swal.fire("Ups...", r.responseText, "error")
  })
}

$("body").on("keydown", "input", function (e) {
  if (e.keyCode === 13) {
    let siguienteInput = $(this).parent().next().find("input")[0]
    siguienteInput instanceof HTMLInputElement ? siguienteInput.focus() : $(this).parent().next().find("button")[0]?.focus()
  }
})
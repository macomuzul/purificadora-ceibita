//TODO cambiar los $(document) a $(body) para mas performance
let usuario;
let contraseña;
let confirmarContraseña;
let rol;

$("body").on('click', '.dropdown-item', function () {
  $(this).closest(".dropdown-menu").prev()[0].innerText = this.innerText;
});

async function validarDatos() {
  if (usuario === "" || contraseña === "" || confirmarContraseña === "") {
    mostrarError("Por favor llenar todos los campos")
    return false;
  }

  if (contraseña !== confirmarContraseña) {
    mostrarError("Las contraseñas no coinciden")
    return false;
  }
  if (rol === "Escoge un rol") {
    mostrarError("No se ha escogido ningún rol para el usuario")
    return false;
  }
  return true;
}

function mostrarError(error) {
  Swal.fire({
    icon: "error",
    title: "Error",
    text: error,
  });
}

$("body").on('click', '#guardar', async function () {
  usuario = document.getElementById("usuario").value;
  contraseña = document.getElementById("contraseña").value;
  confirmarContraseña = document.getElementById("confirmarContraseña").value;
  rol = document.getElementById("rol").innerText;
  let validacion = await validarDatos();
  if (!validacion)
    return;
  modal.show();
});

funcionEnviar = async function () {
  let contraseñaVerificacion = $("#verificacionIdentidad")[0].value;
  let mandar = `{ "usuario": "${usuario.trim()}", "contraseña": "${contraseña}", "rol": "${rol}",  "contraseñaVerificacion": "${contraseñaVerificacion}"}`
  modal.hide();
  $.ajax({
    url: `/empleados/usuarios/crear`,
    method: "POST",
    contentType: "application/json",
    data: mandar,
    success: res => {
      Swal.fire(
        "ÉXITO",
        "Se ha guardado el usuario correctamente",
        "success"
      );
    },
    error: res => {
      Swal.fire({
        icon: "error",
        title: "Ups...",
        text: res.responseText,
      });
    },
  });
}

$("body").on("keydown", "input", function (e) {
  if (e.keyCode === 13) {
    let siguienteInput = $(this).parent().next().find("input")[0];
    if (siguienteInput instanceof HTMLInputElement)
      siguienteInput.focus();
    else
      $(this).parent().next().find("button")[0]?.focus();
  }
});
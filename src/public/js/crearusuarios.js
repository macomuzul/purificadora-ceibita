//TODO cambiar los $(document) a $(body) para mas performance
let usuario;
let contraseña;
let confirmarContraseña;
let rol;
let correo;

toastr.options = {
  "closeButton": true,
  "progressBar": true,
  "positionClass": "toast-bottom-right",
  "preventDuplicates": false,
  "timeOut": "100000",
  "extendedTimeOut": "100000",
}


$("body").on('click', '.dropdown-item', function () {
  $(this).closest(".dropdown-menu").prev()[0].innerText = this.innerText;
});

async function validarDatos() {
  if (usuario === "" || contraseña === "" || confirmarContraseña === "")
    return mostrarError("Por favor llenar todos los campos");
  if (contraseña !== confirmarContraseña)
    return mostrarError("Las contraseñas no coinciden");
  if (rol === "Escoge un rol")
    return mostrarError("No se ha escogido ningún rol para el usuario");

  return true;
}

function mostrarError(error) {
  Swal.fire("Error", error, "error");
  return false;
}

$("body").on('click', '#guardar', async function () {
  usuario = document.getElementById("usuario").value;
  contraseña = document.getElementById("contraseña").value;
  confirmarContraseña = document.getElementById("confirmarContraseña").value;
  rol = document.getElementById("rol").innerText;
  let validacion = await validarDatos();
  if (!validacion)
    return;
  let inputCorreo = document.getElementById("correo");
  correo = inputCorreo.value;
  if (correo !== "") {
    if (!inputCorreo.validar())
      return mostrarError("correo inválido");
  }
  modal.show();
});

funcionEnviar = async function () {
  let contraseñaVerificacion = $("#verificacionIdentidad")[0].value;
  let mandar = `{ "usuario": "${usuario.trim()}", "contraseña": "${contraseña}", "correo": "${correo !== "" ? correo.trim() : "-"}", "rol": "${rol}",  "contraseñaVerificacion": "${contraseñaVerificacion}"}`
  modal.hide();
  $.ajax({
    url: `/empleados/usuarios/crear`,
    method: "POST",
    contentType: "application/json",
    data: mandar,
    success: res => {
      Swal.fire("ÉXITO", "Se ha guardado el usuario correctamente", "success");
      if(correo !== ""){
        toastr.info("Se ha enviado un mensaje a tu correo para validarlo", "Atención");
      }
    },
    error: res => {
      Swal.fire("Ups...", res.responseText, "error");
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
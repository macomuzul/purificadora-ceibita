$("body").on("click", "#cambiarUsuario", function () {
  let usuario = document.getElementById("usuario").value;
  if (usuario === "")
    return mostrarError("El campo de usuario está vacío");
  funcionEnviar = enviar(`"usuario": "${usuario.trim()}"`, "Se ha cambiado el nombre de usuario correctamente");
  modal.show();
});

$("body").on('click', '.dropdown-item', function () {
  $(this).closest(".dropdown-menu").prev()[0].innerText = this.innerText;
});

$("body").on("click", "#cambiarContraseña", function () {
  let contraseña = document.getElementById("contraseña").value;
  let confirmarContraseña = document.getElementById("confirmarContraseña").value;
  if (contraseña !== confirmarContraseña)
    return mostrarError("Las contraseñas no coinciden");
  funcionEnviar = enviar(`"contraseña": "${contraseña}"`, "Se ha cambiado la contraseña correctamente");
  modal.show();
});

$("body").on("click", "#cambiarRol", function () {
  rol = document.getElementById("rol").innerText;
  if (rol === "Escoge un rol")
    return mostrarError("No se ha escogido ningún rol para el usuario")
  funcionEnviar = enviar(`"rol": "${rol}"`, "Se ha cambiado el rol correctamente");
  modal.show();
});

$("body").on("click", "#cambiarCorreo", function () {
  correo = document.getElementById("correo");
  if (!correo.validar())
    return;
  funcionEnviar = enviar(`"correo": "${correo}"`, "Se ha cambiado el correo correctamente");
  modal.show();
});

function mostrarError(error) {
  Swal.fire("Error", error, "error");
}

function enviar(atributo, texto) {
  return function () {
    let contraseñaVerificacion = $("#verificacionIdentidad")[0].value;
    let mandar = `{ ${atributo},  "contraseñaVerificacion": "${contraseñaVerificacion}"}`
    modal.hide();
    $.ajax({
      url: `/empleados/usuarios/editar/${document.getElementById("nombreUsuario").innerText}`,
      method: "POST",
      contentType: "application/json",
      data: mandar,
      success: res => {
        Swal.fire("ÉXITO", texto, "success");
      },
      error: res => {
        Swal.fire("Ups...", res.responseText, "error");
      },
    });
  }
}

$("body").on("click", ".fa-eye-slash", function () {
  this.classList.add("escondido");
  $(this).prev()[0].classList.remove("escondido");
  $(this).prev().prev().attr("type", "text");
})
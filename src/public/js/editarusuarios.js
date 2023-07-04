function trim(el) {
  let recortado = el.val().trim()
  el.val(recortado)
  return recortado
}

$("body").on("click", "#cambiarUsuario", function () {
  let usuario = trim($("#usuario"));
  if (!usuario)
    return mostrarError("El campo de usuario está vacío");
  funcionEnviar = enviar({usuario}, "Se ha cambiado el nombre de usuario correctamente");
  modal.show();
});

$("body").on('click', '.dropdown-item', function () {
  $(this).closest(".dropdown-menu").prev()[0].innerText = this.innerText;
});

$("#cambiarContraseña").on("click", function () {
  let contraseña = trim($("#contraseña"));
  let confirmarContraseña = trim($("#confirmarContraseña"));
  if (!contraseña || !confirmarContraseña)
    return mostrarError("Error contraseñas vacías");
  if (contraseña !== confirmarContraseña)
    return mostrarError("Las contraseñas no coinciden");
  funcionEnviar = enviar({contraseña}, "Se ha cambiado la contraseña correctamente");
  modal.show();
});

$("#cambiarRol").on("click", function () {
  rol = $("#rol")[0].innerText;
  if (rol === "Escoge un rol")
    return mostrarError("No se ha escogido ningún rol para el usuario")
  funcionEnviar = enviar({rol}, "Se ha cambiado el rol correctamente");
  modal.show();
});

$("#cambiarCorreo").on("click", function () {
  correo = trim($("#correo"));
  if (!correo.validar())
    return;
  funcionEnviar = enviar(correo, "Se ha cambiado el correo correctamente");
  modal.show();
});

function mostrarError(error) {
  Swal.fire("Error", error, "error");
}

function enviar(atributos, texto) {
  return function () {
    let contraseñaVerificacion = $("#verificacionIdentidad").val();
    let data = JSON.stringify({ ...atributos, contraseñaVerificacion })
    modal.hide();
    $.ajax({
      url: `/empleados/usuarios/editar/${$("#nombreUsuario")[0].innerText}`,
      method: "POST",
      contentType: "application/json",
      data,
      success: res => {
        Swal.fire("ÉXITO", texto, "success");
      },
      error: res => {
        Swal.fire("Ups...", res.responseText, "error");
      },
    });
  }
}
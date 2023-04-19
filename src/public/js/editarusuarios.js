$("body").on("click", "#cambiarUsuario", function () {
  let usuario = document.getElementById("usuario").value;
  if (usuario === "") {
    mostrarError("El campo de usuario está vacío")
    return;
  }
  funcionEnviar = enviar(`"usuario": "${usuario.trim()}"`, "Se ha cambiado el nombre de usuario correctamente");
  debugger
  modal.show();
});

$("body").on('click', '.dropdown-item', function () {
  $(this).closest(".dropdown-menu").prev()[0].innerText = this.innerText;
});

$("body").on("click", "#cambiarContraseña", function () {
  let contraseña = document.getElementById("contraseña").value;
  let confirmarContraseña = document.getElementById("confirmarContraseña").value;
  if (contraseña !== confirmarContraseña) {
    mostrarError("Las contraseñas no coinciden");
    return;
  }
  funcionEnviar = enviar(`"contraseña": "${contraseña}"`, "Se ha cambiado la contraseña correctamente");
  modal.show();
});

$("body").on("click", "#cambiarRol", function () {
  rol = document.getElementById("rol").innerText;
  if (rol === "Escoge un rol") {
    mostrarError("No se ha escogido ningún rol para el usuario")
    return;
  }
  funcionEnviar = enviar(`"rol": "${rol}"`, "Se ha cambiado el rol correctamente");
  modal.show();
});



function mostrarError(error) {
  Swal.fire({
    icon: "error",
    title: "Error",
    text: error,
  });
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
        Swal.fire(
          "ÉXITO",
          texto,
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
}

$("body").on("click", ".fa-eye-slash", function () {
  this.classList.add("escondido");
  $(this).prev()[0].classList.remove("escondido");
  $(this).prev().prev().attr("type", "text");
})
let trim = x => x.val((_, v) => v.trim()).val()
let mostrarError = err => Swal.fire("Error", err, "error")

$("body").on("click", "#cambiarUsuario", function () {
  let usuario = trim($("#usuario"));
  if (!usuario) return mostrarError("El campo de usuario está vacío")
  modal.mostrar(enviar({ usuario }, "Se ha cambiado el nombre de usuario correctamente"))
})

$("body").on('click', '.dropdown-item', function () {
  $(this).closest(".dropdown-menu").prev()[0].innerText = this.innerText
})

$("#cambiarContraseña").on("click", function () {
  let contraseña = trim($("#contraseña"))
  let confirmarContraseña = trim($("#confirmarContraseña"))
  if (!contraseña || !confirmarContraseña) return mostrarError("Error contraseñas vacías")
  if (contraseña !== confirmarContraseña) return mostrarError("Las contraseñas no coinciden")
  modal.mostrar(enviar({ contraseña }, "Se ha cambiado la contraseña correctamente"))
})

$("#cambiarRol").on("click", function () {
  rol = $("#rol")[0].innerText;
  if (rol === "Escoge un rol") return mostrarError("No se ha escogido ningún rol para el usuario")
  modal.mostrar(enviar({ rol }, "Se ha cambiado el rol correctamente"))
})

$("#cambiarCorreo").on("click", function () {
  correo = trim($("#correo"))
  if (!correo.validar()) return
  modal.mostrar(enviar(correo, "Se ha cambiado el correo correctamente"))
})

function enviar(atributos, texto) {
  return function () {
    let contraseñaVerificacion = $("#verificacionIdentidad").val()
    let data = JSON.stringify({ ...atributos, contraseñaVerificacion })
    $.ajax({
      url: `/empleados/usuarios/editar/${$("#nombreUsuario")[0].innerText}`,
      method: "POST",
      contentType: "application/json",
      data,
      success: q => Swal.fire("ÉXITO", texto, "success"),
      error: r => Swal.fire("Ups...", r.responseText, "error")
    })
  }
}
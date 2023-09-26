let trim = x => x.val((_, v) => v.trim()).val()
let mostrarError = err => Swal.fire("Error", err, "error")
let enviar = (atributos, texto) => function () {
  let contraseñaVerificacion = $("#verificacionIdentidad").val()
  let data = JSON.stringify({ ...atributos, contraseñaVerificacion })
  $.ajax({
    url: `/empleados/usuarios/editar/${$("#nombreUsuario").text()}`,
    method: "POST",
    contentType: "application/json",
    data,
    success: q => Swal.fire("ÉXITO", texto, "success"),
    error: r => Swal.fire("Ups...", r.responseText, "error")
  })
}

$("body").on('click', '.dropdown-item', function () { $(this).closest(".dropdown-menu").prev()[0].innerText = this.innerText })

$("body").on("click", "#cambiarUsuario", function () {
  let usuario = trim($("#usuario"));
  if (!usuario) return mostrarError("El campo de usuario está vacío")
  modal.mostrar(enviar({ usuario }, "Se ha cambiado el nombre de usuario correctamente"))
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

let correo = $("#correo")[0]
$("#cambiarCorreo").on("click", function () {
  correoTexto = trim($("#correo"))
  validarCorreo()
  if (!correo.checkValidity()) return correo.reportValidity()
  modal.mostrar(enviar(correoTexto, "Se ha cambiado el correo correctamente"))
})
let validarCorreo = q => correo.setCustomValidity(correo.validity.valueMissing ? 'Por favor escribe un correo' : correo.validity.typeMismatch ? 'Por favor escribe un correo válido por ejemplo: usuario@dominio.com' : '')
correo.addEventListener('input', validarCorreo)

// let usuario = document.getElementById("usuario")
// let correo = document.getElementById("correo")
// let validarUsuario = q => usuario.setCustomValidity(usuario.validity.valueMissing ? 'Por favor escribe un nombre de usuario' : '')
// usuario.addEventListener('input', validarUsuario)
// usuario.addEventListener("keydown", e => {
//   if (e.key === "Enter") {
//     e.preventDefault()
//     correo.focus()
//   }
// })
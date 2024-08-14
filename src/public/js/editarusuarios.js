let trim = x => x.value = x.value.trim()
let mostrarError = err => Swal.fire("Error", err, "error")
let enviar = (atributos, texto) => q => {
  let contraseñaVerificacion = qsd("#verificacionIdentidad").value
  let data = JSON.stringify({ ...atributos, contraseñaVerificacion })
  $.ajax({
    url: location.pathname,
    method: "POST",
    contentType: "application/json",
    data,
    success: q => Swal.fire("ÉXITO", texto, "success"),
    error: r => Swal.fire("Ups...", r.responseText, "error")
  })
}

bodyOnClick('.dropdown-item', function () { anterior(this.closest(".dropdown-menu")).innerText = this.innerText })

bodyOnClick("#cambiarUsuario", q => {
  let usuario = trim(qsd("#usuario"))
  if (!usuario) return mostrarError("El campo de usuario está vacío")
  modalAutenticacion.mostrar(enviar({ usuario }, "Se ha cambiado el nombre de usuario correctamente"))
})

qsclickd("#cambiarContraseña", function () {
  let contraseña = trim(qsd("#contraseña"))
  let confirmarContraseña = trim(qsd("#confirmarContraseña"))
  if (!contraseña || !confirmarContraseña) return mostrarError("Error contraseñas vacías")
  if (contraseña !== confirmarContraseña) return mostrarError("Las contraseñas no coinciden")
  modalAutenticacion.mostrar(enviar({ contraseña }, "Se ha cambiado la contraseña correctamente"))
})

qsclickd("#cambiarRol", q => {
  rol = qsd("#rol").innerText
  if (rol === "Escoge un rol") return mostrarError("No se ha escogido ningún rol para el usuario")
  modalAutenticacion.mostrar(enviar({ rol }, "Se ha cambiado el rol correctamente"))
})

let c = qsd("#correo")
qsclickd("#cambiarCorreo", q => {
  let correo = trim(qsd("#correo"))
  validarCorreo()
  if (!c.checkValidity()) return c.reportValidity()
  modalAutenticacion.mostrar(enviar({ correo }, "Se ha cambiado el correo correctamente"))
})
let validarCorreo = q => c.setCustomValidity(c.validity.valueMissing ? 'Por favor escribe un correo' : c.validity.typeMismatch ? 'Por favor escribe un correo válido por ejemplo: usuario@dominio.com' : '')
c.addEventListener('input', validarCorreo)

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
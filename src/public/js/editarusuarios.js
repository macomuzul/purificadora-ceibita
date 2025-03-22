let trim = x => x.value = x.value.trim()
let mostrarError = err => Swal.fire("Error", err, "error")
let enviar = (atributos, texto) => q => hazPost('', JSON.stringify({ ...atributos, contraseñaVerificacion: qs("#verificacionIdentidad").value }), q => swalExito(texto))

bodyOnClick("#cambiarUsuario", q => {
  let usuario = trim(qs("#usuario"))
  if (!usuario) return mostrarError("El campo de usuario está vacío")
  modalAutenticacion.mostrar(enviar({ usuario }, "Se ha cambiado el nombre de usuario correctamente"))
})

qsclick("#cambiarContraseña", q => {
  let contraseña = trim(qs("#contraseña"))
  let confirmarContraseña = trim(qs("#confirmarContraseña"))
  if (!contraseña || !confirmarContraseña) return mostrarError("Error contraseñas vacías")
  if (contraseña !== confirmarContraseña) return mostrarError("Las contraseñas no coinciden")
  modalAutenticacion.mostrar(enviar({ contraseña }, "Se ha cambiado la contraseña correctamente"))
})

qsclick("#cambiarRol", q => {
  rol = qs("#rol").textContent
  if (rol === "Escoge un rol") return mostrarError("No se ha escogido ningún rol para el usuario")
  modalAutenticacion.mostrar(enviar({ rol }, "Se ha cambiado el rol correctamente"))
})

let c = qs("#correo")
qsclick("#cambiarCorreo", q => {
  let correo = trim(qs("#correo"))
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
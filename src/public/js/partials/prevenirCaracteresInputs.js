body.on("beforeinput", "input", function (e) {
  let letra = event.data === null ? '' : event.data
  if (letra === '"' || letra == "\\") {
    e.preventDefault()
    this.setCustomValidity('Caracter inválido, no se permiten comillas (") ni barra invertida (\\)')
    this.reportValidity()
  } else {
    this.setCustomValidity("")
  }
})
bodyOn("beforeinput", "input", (c, e) => {
  let letra = e.data ?? ''
  if (letra === '"' || letra == "\\") {
    e.preventDefault()
    c.setCustomValidity('Caracter inválido, no se permiten comillas (") ni barra invertida (\\)')
    c.reportValidity()
  } else {
    c.setCustomValidity("")
  }
})
class inputCorreo extends HTMLInputElement {
  constructor() {
    super()
    this.required = true
    this.addEventListener('input', this.revisar)
  }

  revisar() {
    if (this.validity.valueMissing) this.setCustomValidity('Por favor escribe un correo válido')
    else if (this.validity.typeMismatch) this.setCustomValidity('Por favor escribe un correo válido por ejemplo: usuario@dominio.com')
    else this.setCustomValidity('')
  }

  validar() {
    let esValido = this.checkValidity()
    if (!esValido) {
      this.revisar()
      this.reportValidity()
    }
    return esValido
  }
}

customElements.define("input-correo", inputCorreo, { extends: "input" })
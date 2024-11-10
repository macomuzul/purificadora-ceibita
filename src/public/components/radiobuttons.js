class radiogroup extends Componente {
  alConectar() {
    this.qsafor('custom-radiobutton', x => {
      let { checked } = x.dataset
      x.className = "form-check form-check-inline"
      x.innerHTML = `<label class="form-check-label"><input class="form-check-input" type="radio" ${checked ? "checked" : ""}> ${x.innerHTML}</label>`
    })
    this.qsafor('input', x => x.setAttribute('name', this.id))
  }
}

customElements.define("custom-radiogroup", radiogroup)
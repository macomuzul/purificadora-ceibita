class radiogroup extends HTMLElement {
  connectedCallback() {
    qsaforeach(this, 'custom-radiobutton', x => {
      let { id, checked } = x.dataset
      x.className = "form-check form-check-inline"
      x.innerHTML = `<input class="form-check-input" type="radio" id="${id}" ${checked ? "checked" : ""}>
      <label class="form-check-label" for="${id}">${x.innerHTML}</label>`
    })
    qsaforeach(this, 'input', x => x.setAttribute('name', this.id))
  }
}

customElements.define("custom-radiogroup", radiogroup)
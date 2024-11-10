añadirCSS(`.custom-switch .custom-control-label::before {
  width: 2rem;
}

.custom-switch .custom-control-input:checked~.custom-control-label::after {
  transform: translateX(1rem);
}`)

class switches extends HTMLElement {
  connectedCallback() {
    let { id, checked } = this.dataset
    this.className = "form-check form-switch"
    this.innerHTML = `<label class="form-check-label"><input class="form-check-input" type="checkbox" id="${id}" ${checked ? "checked" : ""}> ${this.innerHTML}</label>`
  }
}

customElements.define("custom-switch", switches)
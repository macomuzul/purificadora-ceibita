class switches extends HTMLElement {
  connectedCallback() {
    let { id, checked } = this.dataset
    this.className = "form-check form-switch"
    this.innerHTML = `<input class="form-check-input" type="checkbox" id="${id}" ${checked ? "checked" : ""}><label class="form-check-label" for="${id}">${this.innerHTML}</label>`
  }
}

customElements.define("custom-switch", switches)
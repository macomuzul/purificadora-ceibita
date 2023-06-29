class checkbox extends HTMLElement {
  connectedCallback() {
    let { checked } = this.dataset
    this.className = "form-check"
    this.innerHTML = `<label class="form-check-label"><input class="form-check-input" type="checkbox" ${checked ? "checked" : ""}>${this.innerHTML}</label>`
  }
}

customElements.define("custom-checkbox", checkbox)
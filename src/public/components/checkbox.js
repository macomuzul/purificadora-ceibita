class checkbox extends HTMLElement {
  connectedCallback() {
    let { checked } = this.dataset;
    this.innerHTML = `<div class="form-check">
    <label class="form-check-label"><input class="form-check-input" type="checkbox" ${checked ? "checked" : ""}>${this.innerHTML}</label>
  </div>`
  }
}

customElements.define("custom-checkbox", checkbox);
 class radiobutton extends HTMLElement {
  connectedCallback() {
    let { id, checked } = this.dataset;
    this.className = "form-check form-check-inline"
    this.innerHTML = `<input class="form-check-input" type="radio" id="${id}" ${checked ? "checked" : ""}>
    <label class="form-check-label" for="${id}">${this.innerHTML}</label>`
  }
}

customElements.define("custom-radiobutton", radiobutton)

class radiogroup extends HTMLElement {
  connectedCallback() {
    $(this).find("input").attr("name", this.id)
  }
}

customElements.define("custom-radiogroup", radiogroup)
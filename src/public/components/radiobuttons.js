class radiogroup extends HTMLElement {
  connectedCallback() {
    $(this).find("custom-radiobutton").each((_, x) => {
      let { id, checked } = x.dataset
      x.className = "form-check form-check-inline"
      x.innerHTML = `<input class="form-check-input" type="radio" id="${id}" ${checked ? "checked" : ""}>
      <label class="form-check-label" for="${id}">${x.innerHTML}</label>`
    })
    $(this).find("input").attr("name", this.id)
  }
}

customElements.define("custom-radiogroup", radiogroup)
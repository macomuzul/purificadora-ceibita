class cCustomCheckbox extends HTMLElement {
  connectedCallback() {
    let { checked, clase, id } = this.dataset
    this.className = `form-check form-check-inline ${clase ?? ""}`
    this.style.userSelect = "none"
    this.innerHTML = `<input class="form-check-input" ${id ? `id="${id}"` : ""} type="checkbox" ${checked ? "checked" : ""}><label class="form-check-label">${this.innerHTML}</label>`
  }
}

bodyOnClick("custom-checkbox", (c, e) => {
  let input = qs(c, 'input')
  if(!e.target.matches("input")) input.checked = !input.checked
})

customElements.define("custom-checkbox", cCustomCheckbox)
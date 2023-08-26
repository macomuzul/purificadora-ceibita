class cCheckbox extends HTMLElement {
  connectedCallback() {
    let { checked, clase } = this.dataset
    this.className = `form-check form-check-inline ${clase ?? ""}`
    this.style.userSelect = "none"
    this.innerHTML = `<input class="form-check-input" type="checkbox" ${checked ? "checked" : ""}><label class="form-check-label">${this.innerHTML}</label>`
  }
}

$("body").on("click", "custom-checkbox", e => $(e.currentTarget).find("input").prop("checked", (_, val) => e.target.matches("input") ? val : !val))

customElements.define("custom-checkbox", cCheckbox)
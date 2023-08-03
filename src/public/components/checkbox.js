class cCheckbox extends HTMLElement {
  connectedCallback() {
    let { checked, clase } = this.dataset
    this.className = `form-check form-check-inline ${clase ?? ""}`
    this.innerHTML = `<input class="form-check-input" type="checkbox" ${checked ? "checked" : ""}><label class="form-check-label">${this.innerHTML}</label>`
  }
}

$("body").on("click", "custom-checkbox", function (e) {
  if (!e.target.matches("input"))
    $(this).find("input").prop("checked", (_, val) => !val)
})

customElements.define("custom-checkbox", cCheckbox)
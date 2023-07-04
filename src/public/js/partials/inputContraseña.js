class inputContraseña extends HTMLElement {
  connectedCallback() {
    let { id, focus } = this.dataset

    this.innerHTML = `<input type="password" id="${id}" ${focus ? "autofocus" : ""}>
    <i class="fa-sharp fa-solid fa-eye" style="display: none;"></i>
    <i class="fa-sharp fa-solid fa-eye-slash"></i>`

    let ojoNormal = $(this).find(".fa-eye")
    let ojoCerrado = $(this).find(".fa-eye-slash")
    let input = $(this).find("input")

    $(this).on("click", ".fa-eye", () => {
      ojoNormal.toggle()
      ojoCerrado.toggle()
      input.attr("type", "password")
    })

    $(this).on("click", ".fa-eye-slash", () => {
      ojoNormal.toggle()
      ojoCerrado.toggle()
      input.attr("type", "text")
    })
  }
}

customElements.define("input-contraseña", inputContraseña);
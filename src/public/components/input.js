
//TODO este con prevenir caracteres input
class customInput extends HTMLElement {
  connectedCallback() {
    let { texto, props, textopordefecto } = this.dataset
    this.innerHTML = `<label class="form-label">${this.innerHTML} <input type="text" class="form-control" id="i" value="${texto}" ${props || ""}></label>`
  }
}

customElements.define("custom-input", customInput)
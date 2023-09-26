
//TODO este con prevenir caracteres input
class customInput extends HTMLElement {
  connectedCallback() {
    let { texto, props, textopordefecto } = this.dataset
    this.innerHTML = `<label for="i" class="form-label">${this.innerHTML}</label>
    <input type="text" class="form-control" id="i" value="${texto}" ${props || ""}>`
  }
}

customElements.define("custom-input", customInput)
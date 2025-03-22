class tabLabel extends Componente {
  alConectar() {
    this.outerHTML = `<div class="tab-label ${this.classList.value}"><input type="radio" class="tabRadio"${this.indice() === 0 ? ' checked' : ''}><label class="tabLabel">${this.innerHTML}</label></div>`
  }
}
customElements.define("tab-label", tabLabel)

let devuelveTabContent = (el, i) => el.qs(`tab-content:nth-child(${i + 1})`)
let cambiarChecked = (el, c) => el.checked = c
class customTabs extends HTMLElement {
  connectedCallback() { }
}
customElements.define("custom-tabs", customTabs)

bodyOnClick('.tab-label', c => {
  let p = c.closest('custom-tabs')
  let input = c.qs('input')
  let checkeado = p.qs('input:checked')
  if (input === checkeado) return
  if (checkeado) {
    cambiarChecked(checkeado, false)
    devuelveTabContent(p, checkeado.padre().indice()).style.display = 'none'
  }
  cambiarChecked(input, true)
  devuelveTabContent(p, c.indice()).style.display = 'block'
})
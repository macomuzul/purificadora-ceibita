añadirCSS(`.tabs {
  display: flex;
  flex-wrap: wrap;
  font-family: sans-serif;
  margin-top: 10px;
  justify-content: center;
  margin-bottom: 0;
}

.tabLabel, .agregarcamion {
  padding: 12px 20px;
  cursor: pointer;
  background-color: #0f0924;
  font-size: 15px;
  color: white;
  height: 50px;
  display: grid;
  align-items: center;
  transition: font-size 200ms;
}

.agregarcamion{
    width: 60px;
    margin-left: 1px;
    padding: 10px 16px;
}

html, body, main {
  width: fit-content;
}

.tabRadio {
  display: none;
}

tab-content{
  display: block;
  order: 1;
  width: 100%;
}

.tabRadio:checked + .tabLabel {
  font-weight: bold;
  color: white;
  background-color: #009578;
  border-bottom: 2px solid #009578;
}`)

class tabLabel extends HTMLElement {
  connectedCallback() {
     this.innerHTML = `<input type="radio" class="tabRadio"><label class="tabLabel">${this.innerHTML}</label>`
  }
}
customElements.define("tab-label", tabLabel)

let devuelveTabContent = (el, id) => registrarVentas ? qs(el, `tab-content[data-tabid="${id-1}"]`) : qs(el, `tab-content:nth-child(${id})`)
class customTabs extends HTMLElement {
  connectedCallback() {
    // let cambiarChecked = (el, c) => el.setAttribute('checked', c)
    let cambiarChecked = (el, c) => el.checked = c
    cambiarChecked(qs(this, 'input'), true)
    qsaforeach(this, 'tab-content', (x, i) => { if(i !== 0) x.hidden = true })
    this.idSeleccionado = 1
    $(this).on("click", "tab-label label", e => {
      let el = e.currentTarget.previousElementSibling
      let checkeado = qs(this, "tab-label input:checked")
      if (el === checkeado) return
      devuelveTabContent(this, this.idSeleccionado).hidden = true
      this.idSeleccionado = indice(padre(el)) + 1
      cambiarChecked(el, true)
      if(checkeado) cambiarChecked(checkeado, false)
      devuelveTabContent(this, this.idSeleccionado).hidden = false
    })
  }
}
customElements.define("custom-tabs", customTabs)
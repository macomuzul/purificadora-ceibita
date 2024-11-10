añadirCSS(`.tabs {
  display: flex;
  flex-wrap: wrap;
  font-family: sans-serif;
  margin-top: 10px;
  justify-content: center;
  margin-bottom: 0;
}

.tabLabel, .añadirCamion {
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

class tabLabel extends Componente {
  alConectar() {
    this.innerHTML = `<input type="radio" class="tabRadio"><label class="tabLabel">${this.innerHTML}</label>`
  }
}
customElements.define("tab-label", tabLabel)

let devuelveTabContent = (el, i) => el.qs(`tab-content:nth-child(${i + 1})`)
let cambiarChecked = (el, c) => el.checked = c
class customTabs extends Componente {
  alConectar() {
    setTimeout(q => {
      cambiarChecked(this.qs('input'), true)
      this.qs('tab-content').mostrar()
    })
  }
}
customElements.define("custom-tabs", customTabs)

bodyOnClick('tab-label', c => {
  let p = c.closest('custom-tabs')
  let input = c.qs('input')
  let checkeado = p.qs('input:checked')
  if (input === checkeado) return
  if (checkeado) {
    cambiarChecked(checkeado, false)
    devuelveTabContent(p, checkeado.padre().indice()).esconder()
  }
  cambiarChecked(input, true)
  devuelveTabContent(p, c.indice()).mostrar()
})
class label extends HTMLElement {
  connectedCallback() {
    let { id } = this.dataset;
    this.innerHTML = `<input type="radio" class="tabs__radio" name="${this.getAttribute("name")}" id="${id}">
    <label for="${id}" class="tabs__label">${this.innerHTML}</label>`
  }
}

customElements.define("custom-label", label)

class tabContent extends HTMLElement {
  connectedCallback() {
    $(this).addClass("tabs__content")
    this.innerHTML = `${this.innerHTML}`
  }
}

customElements.define("tab-content", tabContent)

class customTabs extends HTMLElement {
  connectedCallback() {
    requestAnimationFrame(() => {
      try {
        $(this).find("custom-label input")[0].checked = true
        $(this).find("tab-content")[0].style.display = "initial"
        $(this).on("click", "custom-label label", e => {
          let el = $(e.currentTarget).prev()[0]
          let checkeado = $(this).find("custom-label input:checked")[0]
          if (el === checkeado) return
          checkeado.checked = false
          $(this).find(`tab-content:nth-child(${$(checkeado).parent().index() + 1})`).css("display", "none")

          el.checked = true
          $(this).find(`tab-content:nth-child(${$(el).parent().index() + 1})`).css("display", "initial")
        })
      } catch {

      }
    })
  }
}

customElements.define("custom-tabs", customTabs)
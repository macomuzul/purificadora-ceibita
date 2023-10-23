class acordeon extends HTMLElement {
  connectedCallback() {
    this.classList.add("accordion")
    debugger
  }
}

customElements.define("custom-acordeon", acordeon)

class acordeonitem extends HTMLElement {
  connectedCallback() {
    let idPadre = $(this).closest(".accordion")[0]?.id
    this.classList.add("accordion-item")
    let { id, titulo } = this.dataset
    console.log(this.innerHTML)
    this.innerHTML = `<h2 class="accordion-header headeracordeon">
        <button class="accordion-button tituloacordeon collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#${id}"><div class="tituloProductos">${titulo}</div></button>
      </h2>
  <div id="${id}" class="accordion-collapse collapse" ${idPadre ? `data-bs-parent="#${idPadre}"` : ""}>
  <div class="accordion-body">${this.innerHTML}</div></div>`
  }
}

customElements.define("custom-acordeonitem", acordeonitem)
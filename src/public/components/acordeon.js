class acordeon extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    let id = this.dataset?.id;
    this.innerHTML = `<div class="accordion" ${id ? `id="${id}"` : ""}>${this.innerHTML}</div>`;
  }
}

customElements.define("custom-acordeon", acordeon);

class acordeonitem extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    let idPadre = $(this).closest(".accordion")[0]?.id;
    let { id, titulo } = this.dataset;
    this.innerHTML = `<div class="accordion-item">
      <h2 class="accordion-header headeracordeon">
        <button class="accordion-button tituloacordeon collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#${id}"><div class="tituloProductos">${titulo}</div></button> 
      </h2>
  <div id="${id}" class="accordion-collapse collapse" ${idPadre ? `data-bs-parent="#${idPadre}"` : ""}>
  <div class="accordion-body">${this.innerHTML}</div></div></div>`;
  }
}

customElements.define("custom-acordeonitem", acordeonitem);
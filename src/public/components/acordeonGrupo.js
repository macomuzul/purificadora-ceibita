class acordeon extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `<div class="accordion" ${this.id ? `id="${id}"` : ""}>${this.innerHTML}</div>`;
  }
}

customElements.define("custom-acordeon", acordeon);

class acordeonitem extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `<div class="accordion-item">
      <h2 class="accordion-header headeracordeon">
        <button class="accordion-button tituloacordeon" type="button" data-bs-toggle="collapse" data-bs-target="${this.id}"><div class="tituloProductos">Días</div></button> 
      </h2>
  <div id="${this.id}" class="accordion-collapse collapse show" data-bs-parent="${this.parentElement.id}">
  <div class="accordion-body">${this.innerHTML}</div></div></div>`;
  }
}

customElements.define("custom-acordeonitem", acordeonitem);
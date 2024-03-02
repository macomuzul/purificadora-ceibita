class contenedorAcciones extends HTMLElement {
  connectedCallback() {
    $(this).addClass("contenedoracciones");
    let { id } = this.dataset;
    this.innerHTML = `<div class="form-check checkabsolute">
    <input class="form-check-input check" type="checkbox" id="${id}">
    <label class="form-check-label" for="${id}">Seleccionar</label>
  </div>
  <div class="contenedorbotones contenedorrestaurar btnrestaurar">
    <div class="contenedorrestaurarinterior">
      <svg class="svgrestaurar" viewBox="0 0 25 25"><path d="M5.88468 17C7.32466 19.1128 9.75033 20.5 12.5 20.5C16.9183 20.5 20.5 16.9183 20.5 12.5C20.5 8.08172 16.9183 4.5 12.5 4.5C8.08172 4.5 4.5 8.08172 4.5 12.5V13.5M12.5 8V12.5L15.5 15.5" /><path d="M7 11L4.5 13.5L2 11" /></svg>
      <span>Restaurar este registro</span>
    </div>
  </div>
  <div class="contenedorbotones contenedoreliminar btneliminar">
    <svg width="30" height="30" fill="white" class="bi bi-trash" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" /><path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/></svg>
    <span>Eliminar este registro</span>
  </div>`
  }
}

customElements.define("contenedor-acciones", contenedorAcciones)


class botonRestaurar extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `<div class="contenedorrestaurar restaurarsoloestatabla">
    <svg class="svgrestaurar" viewBox="0 0 25 25"><path d="M5.88468 17C7.32466 19.1128 9.75033 20.5 12.5 20.5C16.9183 20.5 20.5 16.9183 20.5 12.5C20.5 8.08172 16.9183 4.5 12.5 4.5C8.08172 4.5 4.5 8.08172 4.5 12.5V13.5M12.5 8V12.5L15.5 15.5" /><path d="M7 11L4.5 13.5L2 11" /></svg>
    <span>Restaurar solo esta tabla</span>
  </div>`
  }
}

customElements.define("boton-restaurar", botonRestaurar)
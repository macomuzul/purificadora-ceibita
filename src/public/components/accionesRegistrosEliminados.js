class contenedorAcciones extends HTMLElement {
  connectedCallback() {
    this.añadirClase("contenedoracciones")
    let { id } = this.dataset
    this.innerHTML = `<div class="form-check checkabsolute">
    <label class="form-check-label"><input class="form-check-input check" type="checkbox"> Seleccionar</label>
  </div>
  <div class="contenedorbotones contenedorrestaurar btnrestaurar">
    <div class="contenedorrestaurarinterior">
      <svg class="svgrestaurar" viewBox="0 0 25 25"><path d="M5.88468 17C7.32466 19.1128 9.75033 20.5 12.5 20.5C16.9183 20.5 20.5 16.9183 20.5 12.5C20.5 8.08172 16.9183 4.5 12.5 4.5C8.08172 4.5 4.5 8.08172 4.5 12.5V13.5M12.5 8V12.5L15.5 15.5" /><path d="M7 11L4.5 13.5L2 11" /></svg>
      <span>Restaurar este registro</span>
    </div>
  </div>
  <div class="contenedorbotones contenedoreliminar btneliminar"><svg-eliminar blanco></svg-eliminar><span>Eliminar este registro</span></div>`
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
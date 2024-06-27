añadirCSS(`.botonazul {
  background: #0b2346;
  border-color: #010a18;
  padding: 15px 25px;

  &:focus, &:hover, &:active {
    outline: none;
    box-shadow: none;
    background-color: #072a5c;
  }
}

.flecha {
  transform: scale(1.5);
  margin-left: 10px;
}

.flecharotada {
  margin-right: 10px;
  transform: rotate(180deg) scale(1.5);
}`)

let svgFlechaDerecha = '<svg class="flecha" width="20" height="20" fill="white"><path d="M20 0zm-8.344 14.709-1.41-1.418L12.547 11H4V9h8.673l-2.38-2.379 1.414-1.414 4.737 4.736z"/></svg>';
let svgFlechaIzquierda = svgFlechaDerecha.replace('="flecha"', '="flecharotada"');

class cBotonAzul extends HTMLElement { connectedCallback() { this.outerHTML = `<button ${contenidoBotonAzul(this)}>${this.innerHTML}</button>` } }
customElements.define("boton-azul", cBotonAzul)

class cInputAzul extends HTMLElement { connectedCallback() { this.outerHTML = `<input ${contenidoBotonAzul(this)} value="${this.innerHTML}">` } }
customElements.define("input-azul", cInputAzul)

class cBotonAzulFlechaDerecha extends HTMLElement { connectedCallback() { tipoBotonAzul(this, svgFlechaDerecha, 1) } }
customElements.define("botonazul-flechaderecha", cBotonAzulFlechaDerecha)

class cBotonAzulFlechaIzquierda extends HTMLElement { connectedCallback() { tipoBotonAzul(this, svgFlechaIzquierda, 0) } }
customElements.define("botonazul-flechaizquierda", cBotonAzulFlechaIzquierda)

class cBotonAzulFlechaDerechaSinUrl extends HTMLElement { connectedCallback() { tipoBotonAzulSinUrl(this, svgFlechaDerecha, 1) } }
customElements.define("botonazul-flechaderechasinurl", cBotonAzulFlechaDerechaSinUrl)

class cBotonAzulFlechaIzquierdaSinUrl extends HTMLElement { connectedCallback() { tipoBotonAzulSinUrl(this, svgFlechaIzquierda, 0) } }
customElements.define("botonazul-flechaizquierdasinurl", cBotonAzulFlechaIzquierdaSinUrl)


function tipoBotonAzul(boton, svg, esLadoDerecho) {
  let url = boton.dataset.url
  let contenido = svg ? esLadoDerecho ? boton.innerHTML + '' + svg : svg + '' + boton.innerHTML : boton.innerHTML
  boton.outerHTML = `<a href="${url}"><button ${contenidoBotonAzul(boton)}>${contenido}</button></a>`
}

function tipoBotonAzulSinUrl(boton, svg, esLadoDerecho) {
  let contenido = svg ? esLadoDerecho ? boton.innerHTML + '' + svg : svg + '' + boton.innerHTML : boton.innerHTML
  boton.outerHTML = `<button ${contenidoBotonAzul(boton)}>${contenido}</button>`
}

function contenidoBotonAzul(boton) {
  let { dataset, className, id, style } = boton
  return `class="btn btn-primary botonazul ${className ?? ''}" type="button" style="${style.cssText}" id="${id}"`
}

añadirCSS(`.botontitulo {
  padding: 0.6em 2em;
  font-size: 20px;
  border: none;
  outline: none;
  color: rgb(255, 255, 255);
  background: #192435;
  cursor: pointer;
  position: relative;
  z-index: 0;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  margin-top: 20px;
  align-self: center;

  &:focus{
    box-shadow: none;
    outline: none;
  }

  &::before {
    content: "";
    background: linear-gradient(45deg,#ff0000,#ff7300,#fffb00,#48ff00,#00ffd5,#002bff,#7a00ff,#ff00c8,#ff0000);
    position: absolute;
    top: -2px;
    left: -2px;
    background-size: 400%;
    z-index: -1;
    filter: blur(5px);
    -webkit-filter: blur(5px);
    width: calc(100% + 4px);
    height: calc(100% + 4px);
    animation: brillo-boton-titulo 20s linear infinite;
    transition: opacity 0.3s ease-in-out;
  }

  &::after {
    z-index: -1;
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    background: #0d1f3a;
    left: 0;
    top: 0;
  }

  &:hover:after {
    background: linear-gradient(#00ccff, #d500f9);
  }
}

@keyframes brillo-boton-titulo {
  0% {
    background-position: 0 0;
  }
  50% {
    background-position: 400% 0;
  }
  100% {
    background-position: 0 0;
  }
}`)

class cBotonTitulo2 extends HTMLElement {
  connectedCallback() {
    this.outerHTML = `<button class="botontitulo">${this.innerHTML}</button>`
  }
}

customElements.define("boton-titulo2", cBotonTitulo2)
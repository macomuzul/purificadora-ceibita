$("head").before(`<style>
.botonvolver{
  padding: 10px 20px;
  height: 55px;
  position: absolute;
  top: 0;
  left: 0;
}
.flecharotada {
  background-color: transparent;
  margin-left: 0px;
  margin-right: 10px;
  transform: rotate(180deg) scale(1.5);
  display: inline-block;
}

section-volver{
  position: relative;
  display: none;
  margin-top: 40px;
  justify-content: center;
}
</style>`)
class sectionConBotonVolver extends HTMLElement {
  connectedCallback() {
    this.animacionEntrada = "animate__backInUp"
    this.animacionSalida = "animate__backOutDown"
    $(this).addClass("animate__animated")
    $(this).append(`<button type="button" class="btn btn-primary botonazul botonvolver" id="${this.dataset.idboton}">
    <svg class="flecharotada" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white"><path d="M20 0zm-8.344 14.709-1.41-1.418L12.547 11H4V9h8.673l-2.38-2.379 1.414-1.414 4.737 4.736z"/></svg>
    Volver</button>`)
  }

  mostrar(display = "block") {
    this.borrarClases()
    $(this).css("display", display)
    $(this).addClass(this.animacionEntrada)
  }

  esconder() {
    this.borrarClases()
    $(this).addClass(this.animacionSalida)
    this.classList.contains("animate__animated") ? setTimeout(() => $(this).css("display", "none"), 300) : $(this).css("display", "none")
  }

  borrarClases() {
    this.classList.remove(this.animacionEntrada, this.animacionSalida)
  }
}

customElements.define("section-volver", sectionConBotonVolver)
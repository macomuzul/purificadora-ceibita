$("head").before(`<style>
.botonvolver{
  padding: 10px 20px;
  height: 55px;
  position: absolute;
  top: 0;
  left: 0;
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
    $(this).append(`<botonazul-flechaizquierdasinurl class="botonvolver" id="${this.dataset.idboton}">Volver</botonazul-flechaizquierdasinurl>`)
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
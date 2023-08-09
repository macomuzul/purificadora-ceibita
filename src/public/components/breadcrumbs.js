let animAgregarBread = "animate__wobble"
let animRemoverBread = "animate__backOutDown"
class customBreadcrumbs extends HTMLElement {
  connectedCallback() {
    this.style.display = "block"
    this.innerHTML = `<ul id="breadcrumb">${nivelesBC[0]()}</ul>`
    $(this).addClass("animate__animated")
    this.breadcrumbUL = $(this).find("#breadcrumb")
  }

  clickBreadAnterior = (seccion, bread, cb) => seccion.offsetParent === null ? this.transicion(bread, cb) : ""

  transicion(bread, cb) {
    while (bread.nextSibling) {
      bread.nextSibling.remove()
    }
    esconderSecciones()
    cb()
  }

  animar() {
    this.borrarClases()
    setTimeout(() => $(this).addClass(animAgregarBread), 50)
  }

  nivel(n, e) {
    this.animar()
    this.breadcrumbUL.html([...Array(n).keys()].map(x => nivelesBC[x]()).join(""))
  }

  mostrar() {
    this.borrarClases()
    $(this).css("display", "flex")
    $(this).addClass(animAgregarBread)
  }

  esconder() {
    this.borrarClases()
    $(this).addClass(animRemoverBread)
    setTimeout(() => $(this).css("display", "none"), 300)
  }

  borrarClases() {
    this.classList.remove(animAgregarBread)
    this.classList.remove(animRemoverBread)
  }
}

document.documentElement.style.setProperty('--animate-delay', '0.1s');
document.documentElement.style.setProperty('--animate-duration', '0.7s');

customElements.define("custom-breadcrumbs", customBreadcrumbs)
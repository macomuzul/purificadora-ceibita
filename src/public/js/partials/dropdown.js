let dropdownSeleccionado = null
$(window).on("click", e => dropdownSeleccionado?.cambiarEstado(-1));

class customDropdown extends HTMLElement {
  connectedCallback() {
    let { idmenu, idseleccionado, textopordefecto } = this.dataset
    this.innerHTML = `<div class="dropdown">
    <div class="select">
      <span class="selected" id="${idseleccionado}">${textopordefecto}</span>
      <div class="caret"></div>
    </div>
    <ul class="menu" id="${idmenu}">
      ${this.innerHTML}
    </ul>
  </div>`

    let select = this.querySelector(".select")
    let caret = this.querySelector(".caret")
    let menu = this.querySelector(".menu")
    let opciones = $(this).find(".menu li")
    let selected = this.querySelector(".selected")
    let estaActivo = 0

    $(this).on("click", function (e) {
      e.stopPropagation()
      if (dropdownSeleccionado !== this)
        dropdownSeleccionado?.cambiarEstado(-1)
      this.cambiarEstado(0)
      dropdownSeleccionado = this
    });

    let cambiarEstado = i => {
      if (!estaActivo && i === -1) return
      estaActivo = i === 0 ? true : false
      cambiarClase(select, "select-clicked", i)
      cambiarClase(caret, "caret-rotate", i)
      cambiarClase(menu, "menu-open", i)
    }

    this.cambiarEstado = cambiarEstado

    let cambiarClase = (el, clase, i) => {
      if (i === -1)
        $(el).removeClass(clase);
      else if (i === 0)
        $(el).toggleClass(clase);
    }

    $(this).on("click", "li", e => {
      let opcion = e.currentTarget
      e.stopPropagation()
      selected.innerText = opcion.innerText;
      cambiarEstado(-1)
      opciones.each((i, opcion) => $(opcion).removeClass("active"))
      $(opcion).addClass("active")
      metododropdown(opcion, menu)
    })
  }
}

customElements.define("custom-dropdown", customDropdown);
onload = q => { if (('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0)) $.getScript('/touch.js') }

class switchSortable extends HTMLElement {
  async connectedCallback() {
    await Promise.all([$.getScript('/popover.js'), $.getScript('/bootstrap-5.2.3.js')])
    this.className = "form-check form-switch"
    this.innerHTML = `<input class="form-check-input" type="checkbox" id="switchOrdenarFilas">
    <label class="form-check-label" for="switchOrdenarFilas">Reordenar filas</label>
    <custom-popover data-alineacion="text-top"><strong>A tomar en cuenta:</strong><br>Mientras la opción de reordenar filas esté activa no puedes escribir en las celdas, tienes que desactivarlo para poder volver a escribir en ellas</custom-popover>`
    $("body").on("click", "#switchOrdenarFilas", async q => $("tbody").sortable({ axis: "y", disabled: !q.currentTarget.checked }))
    var switchOrdenarFilas = $("#switchOrdenarFilas")[0]
  }
}

customElements.define("switch-sortable", switchSortable)

class preguntarAntesDeBorrar extends HTMLElement {
  connectedCallback() {
    this.className = "contenedorayuda"
    this.innerHTML = `<div class="form-check form-switch">
      <input class="form-check-input" type="checkbox" id="switchModoSeguro" checked>
      <label class="form-check-label" for="switchModoSeguro">Modo seguro</label>
    </div>
    <label class="form-check-label" style="font-size: 12px;">(preguntar antes de borrar)</label>`
    var switchModoSeguro = $("#switchModoSeguro")[0]
    $("body").on('click', ".botoneliminar", async function () {
      if (switchOrdenarFilas.checked) return
      if (!switchModoSeguro.checked) return this.closest("tr").remove()
      let fila = this.closest("tr").cloneNode(true)
        ;[...fila.cells].at(-1).remove()
      let html = `<table class="mx-auto"><tbody style="background: #0f0d35;">${fila.outerHTML}</tbody></table>`
      let { isConfirmed } = await swalConfirmarYCancelar.fire({
        icon: "warning",
        title: "Estás seguro que deseas borrar este producto?",
        html,
        showCancelButton: true,
        confirmButtonText: "Continuar",
        cancelButtonText: "No continuar",
      })
      if (isConfirmed) this.closest("tr").remove()
    })
  }
}

customElements.define("switch-preguntar", preguntarAntesDeBorrar)
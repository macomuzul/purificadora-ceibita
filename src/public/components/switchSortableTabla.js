añadirCSS(`.contenedorayuda {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: end;
  margin-left: auto;
  transform: translateY(10px);
}`)
añadirJS('/popover.js')
class switchSortable extends HTMLElement {
  async connectedCallback() {
    this.className = "form-check form-switch"
    this.innerHTML = `<label class="form-check-label"><input class="form-check-input" type="checkbox" id="switchOrdenarFilas"> Reordenar filas</label>
    <custom-popover data-alineacion="text-top"><strong>Importante:</strong><br>Mientras la opción de reordenar filas esté activa no puedes escribir en las celdas, tienes que desactivarlo para poder volver a escribir en ellas</custom-popover>`
  }
}

customElements.define("switch-sortable", switchSortable)

bodyOnClick("#switchOrdenarFilas", async c => $("tbody").sortable({ axis: "y", disabled: !c.checked }))
class preguntarAntesDeBorrar extends HTMLElement {
  connectedCallback() {
    this.className = "contenedorayuda"
    this.innerHTML = `<custom-popover style="position: absolute; top: 10px; left:-30px;"><b>Activado</b><br>Te preguntará si estás seguro que deseas borrar ese elemento<br><b>Desactivado</b><br>Borrará el elemento sin preguntarte nada</custom-popover>
    <div class="form-check form-switch"><label class="form-check-label"><input class="form-check-input" type="checkbox" id="switchModoSeguro" checked> Modo seguro</label></div>
    <label class="form-check-label" style="font-size: 12px;">(preguntar antes de borrar)</label>`
  }
}

bodyOnClick(".botoneliminar", async c => {
  if (qs("#switchOrdenarFilas").checked) return
  if (!qs("#switchModoSeguro").checked) return c.closest("tr").remove()
  let fila = c.closest("tr").clonar()
  fila.lastElementChild.remove()
  let html = `<table class="mx-auto"><tbody style="background: #0f0d35;">${fila.outerHTML}</tbody></table>`
  let { isConfirmed } = await swalConfirmarYCancelar.fire({
    icon: "warning",
    title: "Estás seguro que deseas borrar este producto?",
    html,
    showCancelButton: true,
    confirmButtonText: "Continuar",
    cancelButtonText: "No continuar",
  })
  if (isConfirmed) c.closest("tr").remove()
})

customElements.define("switch-preguntar", preguntarAntesDeBorrar)
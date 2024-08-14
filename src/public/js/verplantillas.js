let timeout = false
let favorito = qsd(".faved")
const swalConfirmarYCancelar = Swal.mixin({
  customClass: {
    confirmButton: "btn btn-success margenboton",
    cancelButton: "btn btn-danger margenboton",
  },
  buttonsStyling: false,
})

bodyOnClick(".vermas", function () {
  alternar(qs(padre(this), '.spanHoras'))
  this.style.rotate = this.style.rotate === '180deg' ? '0deg' : '180deg'
})

bodyOnClick('.fave', function () {
  if (timeout || tieneClase(this, 'faved')) return
  alternarClase(favorito, 'faved')
  alternarClase(this, 'faved')
  timeout = true
  favorito = this
  setTimeout(() => timeout = false, 300)
})

bodyOnClick(".svgeliminar", async function () {
  let filaborrar = this.closest("tr")
  let plantillaborrar = filaborrar.cells[0].innerText
  let { isConfirmed } = await swalConfirmarYCancelar.fire({
    icon: "warning",
    text: `Estas seguro que deseas borrar la plantilla ${plantillaborrar}?`,
    showCancelButton: true,
    confirmButtonText: "Continuar",
    cancelButtonText: "No continuar",
  })
  if (isConfirmed) {
    if (this.closest("tr") === favorito.closest("tr")) return Swal.fire("Error", "No puedes borrar la plantilla de default", "error")
    $.ajax({
      url: `/plantillas/${plantillaborrar}`,
      method: "DELETE",
      contentType: "application/json",
      success: q => {
        Swal.fire("Se ha borrado la plantilla exitosamente", "La plantilla ya ha sido borrada del sistema", "success")
        filaborrar.remove()
      },
      error: r => Swal.fire("Error", r.responseText, "error")
    })
  }
})

qsaforeachd(".svgver", e => {
  tippy(e, {
    trigger: 'click',
    placement: 'bottom',
    allowHTML: true,
    popperOptions: { modifiers: [{ name: 'flip', options: { fallbackPlacements: ['bottom', 'top', 'right', 'left'] } }] },
    arrow: false,
    content: "Cargando...",
    onCreate(instance) { Object.assign(instance, { _isFetching: false, _src: null, _error: null }) },
    async onShow(instance) {
      if (instance._isFetching || instance._src) return
      instance._isFetching = true
      let r = await fetch(`/plantillas/devuelveplantilla/${e.closest("tr").cells[0].innerText}`)
      if (r.ok) {
        let p = await r.json()
        plantilla = `<table>
        <thead><tr><th class="productos">Productos</th><th class="precio">Precio</th></tr></thead>
        <tbody>${p.map(x => `<tr><td>${x.producto}</td><td>${x.precio.toFixed(2).replace(/[.,]00$/, "")}</td></tr>`).join("")}</tbody>
      </table>`
        instance._src = plantilla
        instance.setContent(plantilla)
        instance.popperInstance.update()
      } else {
        instance._error = "Error al cargar la plantilla"
        instance.setContent("Error al cargar la plantilla")
      }
      instance._isFetching = false
    }
  })
})

qsclickd('#guardar', function () {
  let data = JSON.stringify({
    nombreDefault: favorito.closest('tr').cells[0].innerText,
    nombrePlantillas: qsarrd('tbody tr').map(x => x.cells[0].innerText)
  })
  $.ajax({
    url: "/plantillas",
    method: "PATCH",
    contentType: "application/json",
    data,
    success: q => Swal.fire("Se ha guardado exitosamente", "Se ha guardado el orden", "success"),
    error: r => Swal.fire("Error", r.responseText, "error")
  })
})

bodyOnClick('.svgeditar', e => location = "/plantillas/editar/" + e.currentTarget.closest("tr").cells[0].innerText)
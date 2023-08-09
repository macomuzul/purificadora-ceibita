let timeout = false
let clickeado = $(".faved")
const swalConfirmarYCancelar = Swal.mixin({
  customClass: {
    confirmButton: "btn btn-success margenboton",
    cancelButton: "btn btn-danger margenboton",
  },
  buttonsStyling: false,
})

onload = () => $(".spanHoras").toggle()

$(".vermas").on("click", function () {
  $(this).parent().find(".spanHoras").toggle()
  this.style.rotate = this.style.rotate === "180deg" ? "0deg" : "180deg"
})

$('.fave').on("click", function () {
  if (timeout || $(this).hasClass("faved")) return

  clickeado.toggleClass('faved')
  $(this).toggleClass('faved')
  timeout = true
  clickeado = $(this)
  setTimeout(() => timeout = false, 300)
})

$(".svgeliminar").on('click', async function () {
  let filaborrar = $(this).closest("tr")[0]
  let plantillaborrar = filaborrar.cells[0].innerText
  let { isConfirmed } = await swalConfirmarYCancelar.fire({
    icon: "warning",
    text: `Estas seguro que deseas borrar la plantilla ${plantillaborrar}?`,
    showCancelButton: true,
    confirmButtonText: "Continuar",
    cancelButtonText: "No continuar",
  })
  if (isConfirmed) {
    if ($(this).closest("tr").index() === $(".faved").closest("tr").index())
      return Swal.fire("Error", "No puedes borrar la plantilla de default", "error")
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


$(".svgver").each(function (e, btn) {
  tippy(this, {
    trigger: 'click',
    placement: 'bottom',
    allowHTML: true,
    popperOptions: { modifiers: [{ name: 'flip', options: { fallbackPlacements: ['bottom', 'top', 'right', 'left'] } }] },
    arrow: false,
    content: "Cargando...",
    onCreate(instance) {
      instance._isFetching = false
      instance._src = null
      instance._error = null
    },
    onShow(instance) {
      if (instance._isFetching || instance._src) return
      instance._isFetching = true
      $.ajax({
        url: `/plantillas/devuelveplantilla/${btn.closest("tr").cells[0].innerText}`,
        method: "POST",
        contentType: "application/json",
        success: p => {
          plantilla = `<table>
          <thead><tr><th class="productos">Productos</th><th class="precio">Precio</th></tr></thead>
            <tbody>
              ${p.map(x => `<tr><td>${x.producto}</td><td>${x.precio.toFixed(2).replace(/[.,]00$/, "")}</td></tr>`).join("")}
            </tbody>
          </table>`
          instance._src = plantilla
          instance.setContent(plantilla)
          instance.popperInstance.update()
        },
        error: q => {
          instance._error = "Error al cargar la plantilla";
          instance.setContent("Error al cargar la plantilla");
        },
        complete: q => instance._isFetching = false
      })
    },
  })
})

$("#guardar").on('click', function () {
  let data = JSON.stringify({
    nombreDefault: $(".faved").closest("tr")[0].cells[0].innerText,
    nombrePlantillas: [...$("#cuerpotabla tr")].map(x => x.cells[0].innerText)
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

$(".svgeditar").on('click', e => location = "/plantillas/editar/" + e.currentTarget.closest("tr").cells[0].innerText)
let click_disabled = false;
let clickeado = $(".faved");
const swalConfirmarYCancelar = Swal.mixin({
  customClass: {
    confirmButton: "btn btn-success margenboton",
    cancelButton: "btn btn-danger margenboton",
  },
  buttonsStyling: false,
});

window.onload = function () {
  $(".spanHoras").toggle()
}

$(".vermas").on("click", function () {
  $(this).parent().find(".spanHoras").toggle()
  this.style.rotate = this.style.rotate === "180deg" ? "0deg" : "180deg"
})

$('.fave').on("click", function () {
  if (click_disabled)
    return;

  if ($(this).hasClass("faved"))
    return;

  clickeado.toggleClass('faved');
  $(this).toggleClass('faved');

  click_disabled = true;
  clickeado = $(this);

  setTimeout(function () {
    click_disabled = false;
  }, 300);
});

$(".svgeliminar").on('click', async function () {
  let filaborrar = $(this).closest("tr")[0];
  let plantillaborrar = filaborrar.cells[0].innerText;
  let result = await swalConfirmarYCancelar.fire({
    icon: "warning",
    text: `Estas seguro que deseas borrar la plantilla ${plantillaborrar}?`,
    showCancelButton: true,
    confirmButtonText: "Continuar",
    cancelButtonText: "No continuar",
  })
  if (result.isConfirmed) {
    if ($(this).closest("tr").index() === $(".faved").closest("tr").index())
      return Swal.fire("Error", "No puedes borrar la plantilla de default", "error")
    $.ajax({
      url: `/plantillas/${plantillaborrar}`,
      method: "DELETE",
      contentType: "application/json",
      success: res => {
        Swal.fire("Se ha borrado la plantilla exitosamente", "La plantilla ya ha sido borrada del sistema", "success")
        filaborrar.remove()
      },
      error: res => Swal.fire("Error", res.responseText, "error")
    });
  }
})


$(".svgver").each(function (e, btn) {
  tippy(this, {
    trigger: 'click',
    placement: 'bottom',
    allowHTML: true,
    popperOptions: {
      modifiers: [
        {
          name: 'flip',
          options: {
            fallbackPlacements: ['bottom', 'top', 'right', 'left'],
          },
        },
      ],
    },
    arrow: false,
    content: "Cargando...",
    onCreate(instance) {
      instance._isFetching = false;
      instance._src = null;
      instance._error = null;
    },
    onShow(instance) {
      if (instance._isFetching || instance._src) {
        return;
      }
      instance._isFetching = true;
      let data = `{ "nombre": "${$(btn).closest("tr").children().first()[0].innerText}" }`
      $.ajax({
        url: "/plantillas/devuelveplantilla",
        method: "POST",
        contentType: "application/json",
        data,
        success: (res) => {
          plantilla = `<table>
                  <thead>
                    <tr>
                      <th class="productos">Productos</th>
                      <th class="precio">Precio</th>
                    </tr>
                  </thead>
                  <tbody>
              ${res.productos.map(x => `<tr><td>${x.producto}</td><td>${x.precio.toFixed(2).replace(/[.,]00$/, "")}</td></tr>`).join("")}
              </table>`
          instance._src = plantilla;
          instance.setContent(plantilla);
          instance.popperInstance.update();
        },
        error: res => {
          instance._error = "Error al cargar la plantilla";
          instance.setContent("Error al cargar la plantilla");
        },
        complete: res => {
          instance._isFetching = false;
        }
      });
    },
  });
});

$("#guardar").on('click', function () {
  let data = JSON.stringify({
    plantilladefault: $(".faved").closest("tr")[0].cells[0].innerText,
    plantillasorden: [[...$("#cuerpotabla tr")].map(x => ({ nombre: x.cells[0].innerText }))]
  })
  $.ajax({
    url: "/plantillas",
    method: "PATCH",
    contentType: "application/json",
    data,
    success: res => Swal.fire("Se ha guardado exitosamente", "Se ha guardado el orden", "success"),
    error: res => Swal.fire("Error", res.responseText, "error")
  });
});

$(".svgeditar").on('click', function () { location = "/plantillas/editar/" + $(this).closest("tr")[0].cells[0].innerText })
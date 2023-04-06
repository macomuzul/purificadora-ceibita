let click_disabled = false;
let clickeado = $(".faved");
const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: "btn btn-success margenboton",
    cancelButton: "btn btn-danger margenboton",
  },
  buttonsStyling: false,
});

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
  let tablaborrar = document.getElementById("cuerpotabla");
  let filaborrar = $(this).closest("tr")[0];
  let plantillaborrar = filaborrar.cells[0].innerText;
  let result = await swalWithBootstrapButtons.fire({
    icon: "warning",
    text: `Estas seguro que deseas borrar la plantilla ${plantillaborrar}?`,
    showCancelButton: true,
    confirmButtonText: "Continuar",
    cancelButtonText: "No continuar",
  })
  if (result.isConfirmed) {
    if ($(this).closest("tr").index() === $(".faved").closest("tr").index()) {
      Swal.fire({
        icon: "error",
        title: "Ups...",
        text: "No puedes borrar la plantilla de default",
      });
      return;
    }
    $.ajax({
      url: `/plantillas/${plantillaborrar}`,
      method: "DELETE",
      contentType: "application/json",
      success: res => {
        Swal.fire(
          "Se ha borrado la plantilla exitosamente",
          "La plantilla ya ha sido borrada del sistema",
          "success"
        );
        tablaborrar.removeChild(filaborrar);
      },
      error: res => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: res.responseText,
        });
      },
    });
  }
})


$(".svgver").each(function (e, btn) {
  tippy(this, {
    trigger: 'click',
    placement: 'bottom',
    arrow: false,
    content: "Cargando...",
    onCreate(instance) {
      instance._isFetching = false;
      instance._src = null;
      instance._error = null;
    },
    onShow(instance) {
      let nombreplantilla = $(btn).closest("tr").children().first()[0].innerText;
      if (instance._isFetching || instance._src) {
        return;
      }
      instance._isFetching = true;
      let mandar = `{ "nombreplantilla": "${nombreplantilla}" }`
      $.ajax({
        url: "/plantillas/devuelveplantilla",
        method: "POST",
        contentType: "application/json",
        data: mandar,
        success: res => {
          plantilla = `<table>
                  <thead>
                    <tr>
                      <th class="productos">Productos</th>
                      <th class="precio">Precio</th>
                    </tr>
                  </thead>
                  <tbody>`;
          for (let i = 0; i < res.productos.length; i++) {
            plantilla += `<tr>
                    <td>${res.productos[i].producto}</td>
                    <td>${res.productos[i].precio.toFixed(2).replace(/[.,]00$/, "")}</td>
                  </tr>`
          }
          plantilla += `</table>`;
          instance._src = plantilla;
          instance.setContent(plantilla);
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
  let guardar = `{
    "plantilladefault": "${$(".faved").closest("tr")[0].cells[0].innerText}",
    "plantillasorden": [ `
  let tabla = document.getElementById("cuerpotabla");
  let filas = tabla.rows.length;
  for (let i = 0; i < filas; i++) {
    guardar += ` { "nombreplantilla": "${tabla.rows[i].cells[0].innerText}" }`;
    if (i + 1 < filas)
      guardar += ",";
  }

  guardar += `] }`
  $.ajax({
    url: "/plantillas/actualizarverplantillas",
    method: "PATCH",
    contentType: "application/json",
    data: guardar,
    success: res => {
      Swal.fire(
        "Se ha guardado exitosamente",
        "Se ha guardado el orden",
        "success"
      );
    },
    error: res => {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: res.responseText,
      });
    },
  });
});

$(".svgeditar").on('click', function () {
  window.location = "/plantillas/editar/" + $(this).closest("tr")[0].cells[0].innerText;
});
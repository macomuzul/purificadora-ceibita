let url = "/plantillas/editar/"
let nombrePlantillaURL = window.location.pathname.replace(url, '')

$(".contenedoreliminar").on('click', async function () {
  let result = await swalConfirmarYCancelar.fire({
    icon: "warning",
    text: "Estas seguro que deseas borrar esta plantilla?",
    showCancelButton: true,
    confirmButtonText: "Continuar",
    cancelButtonText: "No continuar",
  })
  if (result.isConfirmed) {
    $.ajax({
      url: `/plantillas/${nombrePlantillaURL}`,
      method: "DELETE",
      contentType: "application/json",
      success: async q => {
        await Swal.fire("Se ha borrado la plantilla exitosamente", "Ahora será redireccionado al menú de plantillas", "success");
        window.location = "/plantillas"
      },
      error: r => mostrarError(r.responseText)
    });
  }
})


$("body").on('click', "#guardar", async function () {
  if (!await validarPlantillas()) return
  let nombre = $("#nombreplantilla").val()
  let data = JSON.stringify({ nombre, productos: [...$("tbody tr")].map(x => ({ producto: x.cells[0].innerText, precio: parseFloat(x.cells[1].innerText) })) })

  $.ajax({
    url: `/plantillas/${nombrePlantillaURL}`,
    method: "PATCH",
    contentType: "application/json",
    data,
    success: async q => {
      await Swal.fire("Se ha guardado exitosamente", "El archivo se ha almacenado en la base de datos", "success");
      window.location = (url + nombrePlantilla);
    },
    error: r => Swal.fire("Ups...", r.responseText, "error")
  })
})
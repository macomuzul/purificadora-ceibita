let url = "/plantillas/editar/";
let nombrePlantillaURL = window.location.pathname.replace(url, '');

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
      success: async res => {
        await Swal.fire("Se ha borrado la plantilla exitosamente", "Ahora será redireccionado al menú de plantillas", "success");
        window.location = "/plantillas"
      },
      error: res => mostrarError(res.responseText)
    });
  }
})


$("body").on('click', "#guardar", async function () {
  if (!await validarPlantillas())
    return
  let nombrePlantilla = $("#nombreplantilla").val()
  let data = JSON.stringify({
    nombre: nombrePlantilla,
    productos: [...$("tbody tr")].map(({ cells }) => ({
      producto: cells[0].innerText,
      precio: parseFloat(cells[1].innerText)
    }))
  })

  $.ajax({
    url: `/plantillas/${nombrePlantillaURL}`,
    method: "PATCH",
    contentType: "application/json",
    data,
    success: async q => {
      await Swal.fire("Se ha guardado exitosamente", "El archivo se ha almacenado en la base de datos", "success");
      window.location = (url + nombrePlantilla);
    },
    error: res => Swal.fire("Ups...", res.responseText, "error")
  })
})
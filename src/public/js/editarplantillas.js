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
      error: res => {
        mostrarError(res.responseText)
      },
    });
  }
})

//TODO ver si son necesarios estos trims

$("body").on('click', "#guardar", async function () {
  if (!await validarPlantillas())
    return
  let data = JSON.stringify({
    nombre: $("#nombreplantilla").val().trim(),
    productos: [...$("tbody tr")].map(fila => ({
      producto: fila.cells[0].innerText.trim(),
      precio: parseFloat(fila.cells[1].innerText.trim())
    }))
  })

  $.ajax({
    url: `/plantillas/${nombrePlantillaURL}`,
    method: "PATCH",
    contentType: "application/json",
    data,
    success: async res => {
      await Swal.fire("Se ha guardado exitosamente", "El archivo se ha almacenado en la base de datos", "success");
      window.location = (url + nombrePlantilla);
    },
    error: res => {
      Swal.fire("Ups...", res.responseText, "error");
    },
  });
})
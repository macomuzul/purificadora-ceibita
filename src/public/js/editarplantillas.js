let nombrePlantillaURL = location.pathname.split("/").at(-1)

$(".contenedoreliminar").on('click', async function () {
  let { isConfirmed } = await swalConfirmarYCancelar.fire({
    icon: "warning",
    text: "Estas seguro que deseas borrar esta plantilla?",
    showCancelButton: true,
    confirmButtonText: "Continuar",
    cancelButtonText: "No continuar",
  })
  if (isConfirmed) {
    $.ajax({
      url: `/plantillas/${nombrePlantillaURL}`,
      method: "DELETE",
      contentType: "application/json",
      success: async q => {
        await Swal.fire("Se ha borrado la plantilla exitosamente", "Ahora será redireccionado al menú de plantillas", "success")
        location = "/plantillas"
      },
      error: r => mostrarError(r.responseText)
    })
  }
})

//TODO revisar que los resumenesdia hacen que cambios sean true en las semanas meses y años, revisar los crons y los mensajes a docs y sheets
//TODO ver que funciona el location
$("body").on('click', "#guardar", async function () {
  if (!await validarPlantillas()) return
  let nombre = $("#nombreplantilla").val()
  let data = JSON.stringify({ nombre, productos: [...$("tbody tr")].map(x => ({ producto: x.cells[0].innerText, precio: parseFloat(x.cells[1].innerText) })) })

  $.ajax({
    url: location.pathname,
    method: "PATCH",
    contentType: "application/json",
    data,
    success: async q => {
      await Swal.fire("Se ha guardado exitosamente", "El archivo se ha almacenado en la base de datos", "success")
      if(nombrePlantillaURL !== nombre) location = "/plantillas/editar/" + nombre
    },
    error: r => Swal.fire("Ups...", r.responseText, "error")
  })
})
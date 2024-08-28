let nombrePlantillaURL = location.pathname.split("/").at(-1)

bodyOnClick(".contenedoreliminar", async e => {
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

bodyOnClick("#guardar", async e => {
  if (!await validarPlantillas()) return
  let nombre = qsd("#nombreplantilla").value
  let data = JSON.stringify({ nombre, productos: [...tbody.rows].map(x => ({ producto: x.cells[0].innerText, precio: parseFloat(x.cells[1].innerText) })) })

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
let nombrePlantillaURL = location.pathname.split("/").at(-1)

bodyOnClick(".contenedoreliminar", async e => {
  let { isConfirmed } = await swalConfirmarYCancelar.fire({
    icon: "warning",
    text: "Estas seguro que deseas borrar esta plantilla?",
    showCancelButton: true,
    confirmButtonText: "Continuar",
    cancelButtonText: "No continuar",
  })
  if (!isConfirmed) return
  hazDelete('', '', async q => {
    await Swal.fire("Se ha borrado la plantilla exitosamente", "Ahora será redireccionado al menú de plantillas", "success")
    location = "/plantillas"
  })
})

bodyOnClick("#guardar", async e => {
  if (!await validarPlantillas()) return
  let nombre = qsd("#nombreplantilla").value

  hazPatch('', JSON.stringify({ nombre, productos: [...tbody.rows].map(x => ({ producto: x.cells[0].innerText, precio: x.cells[1].innerText.aFloat() })) }), async q => {
    await Swal.fire("Se ha guardado exitosamente", "El archivo se ha almacenado en la base de datos", "success")
    if (nombrePlantillaURL !== nombre) location = "/plantillas/editar/" + nombre
  })
})
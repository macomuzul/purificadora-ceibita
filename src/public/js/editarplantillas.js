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

$("body").on('click', "#guardar", async function () {
  let valido = await validarPlantillas();
  if (!valido)
    return;
  let tabla = $("tbody")[0];
  let filas = tabla.rows.length;
  let nombrePlantilla = document.getElementById("nombreplantilla").value.trim();
  let guardar = "{";
  guardar += ` "nombreplantilla": "${nombrePlantilla}",
   "productos": [ `
  for (let i = 0; i < filas; i++) {
    guardar += ` { 
        "producto": "${tabla.rows[i].cells[0].innerText.trim()}", 
        "precio": ${tabla.rows[i].cells[1].innerText} 
       }`;
    if (i + 1 < filas) {
      guardar += ",";
    }
  }
  guardar += " ] }"
  $.ajax({
    url: `/plantillas/${nombrePlantillaURL}`,
    method: "PATCH",
    contentType: "application/json",
    data: guardar,
    success: async res => {
      await Swal.fire("Se ha guardado exitosamente", "El archivo se ha almacenado en la base de datos", "success");
      window.location = (url + nombrePlantilla);
    },
    error: res => {
      Swal.fire("Ups...", res.responseText, "error");
    },
  });
});
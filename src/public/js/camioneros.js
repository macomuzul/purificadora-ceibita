const swalConfirmarYCancelar = Swal.mixin({
  customClass: {
    confirmButton: "btn btn-success margenbotonswal",
    cancelButton: "btn btn-danger margenbotonswal",
  },
  buttonsStyling: false,
})

function mostrarError(error) {
  Swal.fire("Error", error, "error")
  return false
}

function validarCamioneros() {
  let nombres = [...$("tbody td:nth-child(1)")]
  let colores = [...$("tbody td:nth-child(2)")]
  nombres.forEach(x => x.textContent = x.innerText.trim())
  if (nombres.some(x => x.textContent === ""))
    return mostrarError("Error, hay un camionero sin nombre")
  if (colores.some(x => x.textContent === "indefinido"))
    return mostrarError("Error, hay un color con el valor de indefinido")
  return true
}

$("#guardar").on("click", async function () {
  if (!validarCamioneros())
    return
  let data = JSON.stringify({
    camioneros: [...$("tbody tr")].map(({ cells }) => ({
      nombre: cells[0].textContent,
      color: cells[1].textContent
    }))
  })
  $.ajax({
    url: "/empleados/camioneros",
    method: "POST",
    contentType: "application/json",
    data,
    success: q => Swal.fire("Éxito", "Se han guardado exitosamente", "success"),
    error: res => Swal.fire("Ups...", res.responseText, "error")
  });
})

$("body").on('click', ".botoneliminar", async function () {
  if ($("#switchModoSeguro")[0].checked) {
    let html = `<span style="font-size: 30px; font-weight: 500; color: #8b8b8b;">${this.closest("tr").cells[0].innerText}</span>`
    let { isConfirmed } = await swalConfirmarYCancelar.fire({
      title: "Estás seguro que deseas borrar a este camionero?",
      icon: "warning",
      width: window.innerWidth / 2,
      html,
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: "No",
    })
    if (isConfirmed)
      this.closest("tr").remove()
  }
})

$("body").on("input", `[type="color"]`, function (e) {
  $(this).parent().prev()[0].textContent = $(this).val()
})


$('#añadirproducto').on('click', function () {
  $("#cuerpotabla").append(`<tr><td contenteditable="true"></td>
  <td>indefinido</td>
  <td><input type="color"></td>
  <td><button type="button" class="botoneliminar"><svg class="svgeliminar" xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="red" class="bi bi-trash" viewBox="0 0 16 16"> <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" /> <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" /></svg></button></td>
  </tr>`)
})
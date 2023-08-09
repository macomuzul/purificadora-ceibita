$("#guardar").on("click", async function () {
  if (!await validarPlantillas()) return

  let data = JSON.stringify({
    nombre: nombreplantilla.val(),
    ultimaedicion: "",
    fechaultimaedicion: Date.now(),
    orden: 1,
    productos: [...$("tbody tr")].map(fila => ({
      producto: fila.cells[0].innerText.trim(),
      precio: parseFloat(fila.cells[1].innerText.trim())
    }))
  })
  $.ajax({
    url: "/plantillas/crear",
    method: "POST",
    contentType: "application/json",
    data,
    success: q => Swal.fire("Se ha guardado exitosamente", "El archivo se ha almacenado en la base de datos", "success"),
    error: r => mostrarError(r.responseText),
  })
})

function metododropdown(option) {
  $.ajax({
    url: `/plantillas/devuelveplantilla/${option.textContent}`,
    method: "POST",
    contentType: "application/json",
    success: async p => {
      let html = `<div style="display: flex; justify-content: center;"><table><thead><tr><th class="productos">Productos</th><th class="precio">Precio</th></tr></thead>
      ${p.map(x => `<tr><td>${x.producto}</td><td>${x.precio.normalizarPrecio()}</td></tr>`).join("")}</table></div>`
      let { isConfirmed } = await swalConfirmarYCancelar.fire({
        title: "Estás seguro que deseas utilizar esta plantilla?",
        icon: "warning",
        width: "703px",
        html,
        showCancelButton: true,
        confirmButtonText: "Sí",
        cancelButtonText: "No",
      })
      if (isConfirmed) {
        $("tbody")[0].innerHTML = p.map(x => `<tr>
        <td contenteditable="true">${x.producto}</td><td contenteditable="true">${x.precio.normalizarPrecio()}</td>
        <td><button type="button" class="botoneliminar"><svg class="svgeliminar" xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="red" class="bi bi-trash" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" /><path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" /></svg></button></td>
        </tr>`).join("")
      }
    },
    error: r => Swal.fire("Ups...", r.responseText, "error")
  })
}
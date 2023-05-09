$("#guardar").on("click", async function () {
  let valido = await validarPlantillas();
  if (!valido)
    return;

  let filas = $("tbody")[0].rows;
  let guardar = "{";
  guardar += ` "nombreplantilla": "${document.getElementById("nombreplantilla").value.trim()}",
  "ultimaedicion": "",
  "orden": 1,
  "esdefault": false,
  "productos": [ `
  for (let i = 0; i < filas.length; i++) {
    guardar += ` { 
      "producto": "${filas[i].cells[0].innerText.trim()}", 
      "precio": ${filas[i].cells[1].innerText} 
      }`;
    if (i + 1 < filas.length)
      guardar += ",";
  }
  guardar += " ] }"
  guardar = guardar.replace(/\&nbsp/g, '')
  $.ajax({
    url: "/plantillas/crear",
    method: "POST",
    contentType: "application/json",
    data: guardar,
    success: res => {
      Swal.fire("Se ha guardado exitosamente", "El archivo se ha almacenado en la base de datos", "success");
    },
    error: res => {
      mostrarError(res.responseText)
    },
  });
});

function metododropdown(option) {
  let mandar = `{ "nombreplantilla": "${option.textContent}" }`
  $.ajax({
    url: "/plantillas/devuelveplantilla",
    method: "POST",
    contentType: "application/json",
    data: mandar,
    success: async res => {
      let plantilla = "";
      res.productos.forEach(el => plantilla += `<tr>
            <td>${el.producto}</td>
            <td>${el.precio.toFixed(2).replace(/[.,]00$/, "")}</td>
        </tr>`);
      let html = `<div style="display: flex; justify-content: center;"><table><thead><tr><th class="productos">Productos</th><th class="precio">Precio</th></tr></thead>${plantilla}</table></div>`;
      let result = await swalConfirmarYCancelar.fire({
        title: "Estás seguro que deseas utilizar esta plantilla?",
        icon: "warning",
        width: "703px",
        html,
        showCancelButton: true,
        confirmButtonText: "Sí",
        cancelButtonText: "No",
      });
      if (result.isConfirmed){
        let formatotabla = "";
        res.productos.forEach(el => formatotabla += `<tr>
              <td contenteditable="true">${el.producto}</td>
              <td contenteditable="true">${el.precio.toFixed(2).replace(/[.,]00$/, "")}</td>
              <td><button type="button" class="botoneliminar"><svg class="svgeliminar" xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="red" class="bi bi-trash" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" /><path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" /></svg></button></td>
          </tr>`);
        $("tbody")[0].innerHTML = formatotabla;
      }
    },
    error: res => {
      Swal.fire("Ups...", res.responseText, "error");
    },
  });
}
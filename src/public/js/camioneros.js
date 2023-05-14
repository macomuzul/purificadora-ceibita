const swalConfirmarYCancelar = Swal.mixin({
  customClass: {
    confirmButton: "btn btn-success margenbotonswal",
    cancelButton: "btn btn-danger margenbotonswal",
  },
  buttonsStyling: false,
});

function mostrarError(error) {
  Swal.fire("Error", error, "error");
  return false;
}

function validarCamioneros(){
  let filas = $("tbody tr");
  
  for (let i = 0; i < filas.length; i++)
  {
    let nombre = filas[i].cells[0];
    let color = filas[i].cells[1];
    nombre.textContent = nombre.innerText.trim();
    if(nombre.textContent === "")
      return mostrarError("Error, hay un camionero sin nombre");
    color.textContent = color.innerText.trim();
    if(color.textContent === "indefinido")
      return mostrarError("Error, hay un color con el valor de indefinido");
  }

  return true;
}

$("#guardar").on("click", async function () {
  let valido = validarCamioneros();
  if (!valido)
    return;
  let filas = $("tbody tr");
    let guardar = `{ "camioneros": [`;
    for (let i = 0; i < filas.length; i++) {
      guardar += `{ "nombre": "${filas[i].cells[0].textContent}", 
      "color": "${filas[i].cells[1].textContent}" }`;
      if (i + 1 < filas.length)
        guardar += ",";
    }
    guardar += "] }"
    guardar = guardar.replace(/\&nbsp/g, '');
    console.log(guardar)
    $.ajax({
      url: "/empleados/camioneros",
      method: "POST",
      contentType: "application/json",
      data: guardar,
      success: res => {
        Swal.fire("Éxito", "Se han guardado exitosamente", "success");
      },
      error: res => {
        Swal.fire("Ups...", res.responseText, "error");
      },
    });
});

$("body").on('click', ".botoneliminar", async function () {
  if ($("#switchModoSeguro")[0].checked) {
    let mandar = this.closest("tr").cells[0].innerText;
    let html = `<span style="font-size: 30px; font-weight: 500; color: #8b8b8b;">${mandar}</span>`
    let result = await swalConfirmarYCancelar.fire({
      title: "Estás seguro que deseas borrar a este camionero?",
      icon: "warning",
      width: window.innerWidth * 1 / 2,
      html,
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: "No",
    })
    if(!result.isConfirmed)
      return
  }
  let tablaborrar = this.closest("tbody");
  let filaborrar = this.closest("tr");
  tablaborrar.removeChild(filaborrar);
});

$("body").on("input", `[type="color"]`, function(e){
  $(this).parent().prev()[0].textContent = $(this).val();
});


$('#añadirproducto').on('click', function () {
  let fila = `<tr><td contenteditable="true"></td>
  <td contenteditable="true">indefinido</td>
  <td contenteditable="true"><input type="color"></td>
  <td><button type="button" class="botoneliminar"><svg class="svgeliminar" xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="red" class="bi bi-trash" viewBox="0 0 16 16"> <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" /> <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" /></svg></button></td>
  </tr>`;
  $("#cuerpotabla").append(fila);
});
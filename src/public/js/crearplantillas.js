
$("#guardar").click(async function () {

  let valido = await validarcrear();
  if (valido) {
    let tabla = $("tbody")[0];
    let filas = tabla.rows.length;
    let guardar = "{";
    guardar += ` "nombreplantilla": "${document.getElementById("nombreplantilla").value.trim()}",
   "ultimaedicion": "",
   "orden": 1,
   "esdefault": false,
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

    guardar = guardar.replace(/\&nbsp/g, '')
    $.ajax({
      url: "/plantillas/guardarnuevo",
      method: "POST",
      contentType: "application/json",
      data: guardar,
      success: function (res) {
        $("body").scrollTop(0);
        Swal.fire(
          "Se ha guardado exitosamente",
          "El archivo se ha almacenado en la base de datos",
          "success"
        );
      },
      error: function (res) {
        if (res.responseText === "La plantilla ya existe") {
          $("body").scrollTop(0);
          Swal.fire({
            icon: "error",
            title: "Ups...",
            text: "Ya existe una plantilla con ese nombre",
          });
        }
        else {
          $("body").scrollTop(0);
          Swal.fire({
            icon: "error",
            title: "Ups...",
            text: "No se pudo guardar en la base de datos",
          });
        }

      },
    });
  }
});


$(document).on('click', ".botoneliminar", function () {
  if (switchbtn.checked)
    return;
  else {
    let tablaborrar = $(this).closest("tbody")[0];
    let filaborrar = $(this).parent().parent()[0];
    tablaborrar.removeChild(filaborrar);
  }
});


$('#añadirproducto').on('click', function () {
  let fila =
    `<tr>
  <td contenteditable="true"></td>
            <td contenteditable="true"></td>
            <td><button type="button" class="botoneliminar"><svg class="svgeliminar" xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="red" class="bi bi-trash" viewBox="0 0 16 16"> <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" /> <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" /></svg></button></td>
  </tr>`;
  $("#cuerpotabla").append(fila);

});

$("#botonvolver").on('click', function () {
  window.location = "/plantillas"
});

function metododropdown(option) {
  let mandar = `{ "nombreplantilla": "${option.innerHTML}" }`
  $.ajax({
    url: "/plantillas/datostabla",
    method: "POST",
    contentType: "application/json",
    data: mandar,
    success: function (res) {
      let formatotabla = "";
      for (let i = 0; i < res.productos.length; i++) {
        formatotabla += `<tr>
            <td contenteditable="true">${res.productos[i].producto}</td>
            <td contenteditable="true">${res.productos[i].precio.toFixed(2).replace(/[.,]00$/, "")}</td>
            <td><button type="button" class="botoneliminar">
            <svg class="svgeliminar" xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="red" class="bi bi-trash" viewBox="0 0 16 16">
            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
            <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
          </svg></button></td>
          </tr>`}
      $("tbody")[0].innerHTML = formatotabla;
    },
    error: function (res) {
      Swal.fire({
        icon: "error",
        title: "Ups...",
        text: "Ha habido un error, por favor recarga la página",
      });
    },
  });
}
$("body").on("click", ".svgeditar", function () {
  window.location = "/empleados/usuarios/editar/" + $(this).closest("tr")[0].cells[0].innerText;
})

$("body").on("click", ".fa-eye", function () {
  $(this).parent().prev().attr("type", "password");
});

$("body").on("click", ".fa-eye-slash", function () {
  if ($(this).closest(".modal-body")[0])
    return;
  this.classList.remove("escondido");
  $(this).prev()[0].classList.add("escondido");
  funcionEnviar = enviar(this);
  modal.show();
});


function enviar(ojo) {
  return function () {
    let usuario = $(ojo).closest("tr")[0].cells[0].innerText;
    let contraseñaVerificacion = $("#verificacionIdentidad")[0].value;
    let mandar = `{ "usuario": "${usuario}", "contraseñaVerificacion": "${contraseñaVerificacion}"}`
    modal.hide();
    $.ajax({
      url: `/empleados/usuarios/pedirContraseña`,
      method: "POST",
      contentType: "application/json",
      data: mandar,
      success: res => {
        Swal.fire(
          "ÉXITO",
          "Se ha realizado la petición con éxito",
          "success"
        );
        ojo.classList.add("escondido");
        $(ojo).prev()[0].classList.remove("escondido");
        $(ojo).closest("tr")[0].cells[1].textContent = res;
      },
      error: res => {
        Swal.fire({
          icon: "error",
          title: "Ups...",
          text: res.responseText,
        });
      },
    });
  }
}
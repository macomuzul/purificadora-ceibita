toastr.options = {
  "closeButton": true,
  "progressBar": true,
  "positionClass": "toast-bottom-right",
  "preventDuplicates": false,
  "timeOut": "10000",
  "extendedTimeOut": "10000",
  "newestOnTop": false,
}

const swalConfirmarYCancelar = Swal.mixin({
  customClass: {
    confirmButton: "btn btn-success botonconfirm margenbotonswal",
    cancelButton: "btn btn-danger botoncancel margenbotonswal",
  },
  buttonsStyling: false,
});

$("body").on("click", ".svgeditar", function () {
  window.location = "/empleados/usuarios/editar/" + $(this).closest("tr")[0].cells[0].innerText;
})

$("body").on("click", ".svgeliminar", async function () {
  let usuario = this.closest("tr").cells[0].innerText;
  let html = `<span style="font-size: 30px; font-weight: 500; color: #8b8b8b;">${usuario}</span>`
  let result = await swalConfirmarYCancelar.fire({
    title: "Estás seguro que deseas borrar este usuario?",
    icon: "warning",
    width: window.innerWidth / 2,
    html: html,
    showCancelButton: true,
    confirmButtonText: "Sí",
    cancelButtonText: "No",
  })
  if (result.isConfirmed) {
    funcionEnviar = devuelveBorrarUsuario(`{"usuario": "${usuario}"}`, this.closest("tr"), this.closest("tbody"));
    modal.show();
  }
})

function devuelveBorrarUsuario(data, fila, cuerpo){
  return function(){
    modal.hide();
    $.ajax({
      url: `/empleados/usuarios`,
      method: "DELETE",
      contentType: "application/json",
      data,
      success: res => {
        // toastr["success"]("Se ha borrado el usuario con éxito", "Éxito");
        Swal.fire("Éxito", "Se ha borrado el usuario con éxito", "success");
        cuerpo.removeChild(fila);
      },
      error: res => {
        Swal.fire("Error", res.responseText, "error");
        // toastr["error"](res.responseText, "Error");
      },
    });
  }
}

$("body").on("click", "td .fa-eye", function () {
  let counter = $(this).prev()[0];
  if(counter.style.display !== "none")
    counter.parar();
  $(this).closest("td").prev().text("********");
  $(this).toggle();
  $(this).next().toggle();
});

$("body").on("click", "td .fa-eye-slash", function () {
  funcionEnviar = devuelvePedirContraseña(this);
  modal.show();
});

function devuelvePedirContraseña(ojo) {
  return function () {
    let usuario = ojo.closest("tr").cells[0].innerText;
    let contraseñaVerificacion = $("#verificacionIdentidad").val();
    let data = JSON.stringify({usuario, contraseñaVerificacion})
    modal.hide();
    $.ajax({
      url: `/empleados/usuarios`,
      method: "POST",
      contentType: "application/json",
      data,
      success: res => {
        toastr["success"]("Se ha realizado la petición con éxito", "Éxito");
        $(ojo).toggle();
        $(ojo).prev().toggle();
        ojo.closest("tr").cells[1].textContent = res;
        let funcionCountdown = devuelveFuncionCountdown(ojo);
        $(ojo).prev().prev()[0].resetear(funcionCountdown);
      },
      error: res => {
        toastr["error"](res.responseText, "Error");
      },
    });
  }
}

function devuelveFuncionCountdown(ojo){
  return function(){
    $(ojo).closest("td").prev()[0].textContent = "********";
    $(ojo).prev().click();
  }
}
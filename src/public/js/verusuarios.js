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
  let mandar = this.closest("tr").cells[0].innerText;
  let html = `<span style="font-size: 30px; font-weight: 500; color: #8b8b8b;">${mandar}</span>`
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
    funcionEnviar = devuelveBorrarUsuario(`{"usuario": "${mandar}"}`, this.closest("tr"), this.closest("tbody"));
    modal.show();
  }
})

function devuelveBorrarUsuario(mandar, fila, cuerpo){
  return function(){
    modal.hide();
    $.ajax({
      url: `/empleados/usuarios`,
      method: "DELETE",
      contentType: "application/json",
      data: mandar,
      success: res => {
        // toastr["success"]("Se ha borrado el usuario con éxito", "Éxito");
        Swal.fire("Éxito", "Se ha borrado el usuario con éxito", "success");
        cuerpo.removeChild(fila);
      },
      error: res => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: res.responseText,
        });
        // toastr["error"](res.responseText, "Error");
      },
    });
  }
}

$("body").on("click", ".fa-eye", function () {
  let counter = $(this).prev()[0];
  if(counter.style.display !== "none"){
    counter.parar();
  }

  $(this).closest("td").prev()[0].textContent = "********";
});

$("body").on("click", ".fa-eye-slash", function () {
  if ($(this).closest(".modal-body")[0])
    return;
  this.classList.remove("escondido");
  $(this).prev()[0].classList.add("escondido");
  funcionEnviar = devuelvePedirContraseña(this);
  modal.show();
});

$("body").on("click", ".fa-eye-slash", function () {
  if ($(this).closest(".modal-body")[0])
    return;
  this.classList.remove("escondido");
  $(this).prev()[0].classList.add("escondido");
  funcionEnviar = devuelvePedirContraseña(this);
  modal.show();
});


function devuelvePedirContraseña(ojo) {
  return function () {
    let usuario = ojo.closest("tr").cells[0].innerText;
    let contraseñaVerificacion = $("#verificacionIdentidad")[0].value;
    let mandar = `{ "usuario": "${usuario}", "contraseñaVerificacion": "${contraseñaVerificacion}"}`
    modal.hide();
    $.ajax({
      url: `/empleados/usuarios`,
      method: "POST",
      contentType: "application/json",
      data: mandar,
      success: res => {
        toastr["success"]("Se ha realizado la petición con éxito", "Éxito");
        ojo.classList.add("escondido");
        $(ojo).prev()[0].classList.remove("escondido");
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
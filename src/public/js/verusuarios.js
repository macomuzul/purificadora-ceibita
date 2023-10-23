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
})

$("body").on("click", ".svgeditar", e => location = "/empleados/usuarios/editar/" + $(e.currentTarget).closest("tr")[0].cells[0].innerText)

$("body").on("click", ".svgeliminar", async function () {
  let usuario = this.closest("tr").cells[0].innerText
  let html = `<span style="font-size: 30px; font-weight: 500; color: #8b8b8b;">${usuario}</span>`
  let { isConfirmed } = await swalConfirmarYCancelar.fire({
    title: "Estás seguro que deseas borrar este usuario?",
    icon: "warning",
    width: innerWidth / 2,
    html,
    showCancelButton: true,
    confirmButtonText: "Sí",
    cancelButtonText: "No",
  })
  if (isConfirmed) modal.mostrar(devuelveBorrarUsuario(JSON.parse({ usuario }), this.closest("tr")))
})

function devuelveBorrarUsuario(data, fila) {
  return f => {
    $.ajax({
      url: `/empleados/usuarios`,
      method: "DELETE",
      contentType: "application/json",
      data,
      // toastr["success"]("Se ha borrado el usuario con éxito", "Éxito");
      success: q => {
        Swal.fire("Éxito", "Se ha borrado el usuario con éxito", "success")
        fila.remove()
      },
      // toastr["error"](res.responseText, "Error");
      error: r => Swal.fire("Error", r.responseText, "error")
    })
  }
}

$("body").on("click", "td .fa-eye", function () {
  let counter = $(this).prev()[0]
  if (counter.style.display !== "none") counter.parar()
  $(this).closest("td").prev().text("********")
  $(this).parent().find("i").toggle()
})

$("body").on("click", "td .fa-eye-slash", e => modal.mostrar(devuelvePedirContraseña(e.currentTarget)))

function devuelvePedirContraseña(ojo) {
  return f => {
    let usuario = ojo.closest("tr").cells[0].innerText
    let contraseñaVerificacion = $("#verificacionIdentidad").val()
    $.ajax({
      url: `/empleados/usuarios`,
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify({ usuario, contraseñaVerificacion }),
      success: s => {
        toastr["success"]("Se ha realizado la petición con éxito", "Éxito")
        $(ojo).parent().find("i").toggle()
        ojo.closest("tr").cells[1].textContent = s
        let funcionCountdown = devuelveFuncionCountdown(ojo)
        $(ojo).prev().prev()[0].resetear(funcionCountdown)
      },
      error: r => toastr["error"](r.responseText, "Error")
    })
  }
}

function devuelveFuncionCountdown(ojo) {
  return f => {
    $(ojo).closest("td").prev()[0].textContent = "********"
    $(ojo).prev().click()
  }
}
toastr.options = {
  "closeButton": true,
  "progressBar": true,
  "positionClass": "toast-bottom-right",
  "preventDuplicates": false,
  "timeOut": "10000",
  "extendedTimeOut": "10000",
  "newestOnTop": false,
}

bodyOnClick(".svgeditar", e => location = "/empleados/usuarios/editar/" + e.currentTarget.closest("tr").cells[0].innerText)

bodyOnClick(".svgeliminar", async function () {
  let usuario = this.closest("tr").cells[0].innerText
  if (await swalSíNo('Estás seguro que deseas borrar este usuario?', `<span style="font-size: 30px; font-weight: 500; color: #8b8b8b;">${usuario}</span>`), innerWidth / 2) modalAutenticacion.mostrar(devuelveBorrarUsuario(JSON.parse({ usuario }), this.closest("tr")))
})

function devuelveBorrarUsuario(data, fila) {
  return f => {
    hazDelete('', data, q => {
      swalExito("Se ha borrado el usuario con éxito")
      fila.remove()
    })
    //TODO estos no se si dejarlos
    // toastr["success"]("Se ha borrado el usuario con éxito", "Éxito");
    // toastr["error"](res.responseText, "Error");
  }
}

bodyOnClick("td .fa-eye", function () {
  let counter = anterior(this)
  if (!counter.hidden) counter.parar()
  anterior(this.closest("td")).innerText = "********"
  alternar(qs(padre(this)), "i")
})

bodyOnClick("td .fa-eye-slash", e => modalAutenticacion.mostrar(devuelvePedirContraseña(e.currentTarget)))

function devuelvePedirContraseña(ojo) {
  return f => {
    let usuario = ojo.closest("tr").cells[0].innerText
    let contraseñaVerificacion = qsd("#verificacionIdentidad").value
    hazPost('', JSON.stringify({ usuario, contraseñaVerificacion }), s => {
      toastr["success"]("Se ha realizado la petición con éxito", "Éxito")
      alternar(qs(padre(ojo), "i"))
      ojo.closest("tr").cells[1].textContent = s
      anterior(anterior(ojo)).resetear(devuelveFuncionCountdown(ojo))
    }, r => toastr["error"](r.responseText, "Error"))
  }
}

function devuelveFuncionCountdown(ojo) {
  return f => {
    anterior(ojo.closest("td")).textContent = "********"
    anterior(ojo).click()
  }
}
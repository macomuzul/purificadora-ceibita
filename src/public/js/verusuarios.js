alCargar(q => toastr.options = {
  "closeButton": true,
  "progressBar": true,
  "positionClass": "toast-bottom-right",
  "preventDuplicates": false,
  "timeOut": "10000",
  "extendedTimeOut": "10000",
  "newestOnTop": false,
})

bodyOnClick(".svgeditar", c => location = "/empleados/usuarios/editar/" + c.closest("tr").cells[0].innerText)

bodyOnClick(".svgeliminar", async c => {
  let usuario = c.closest("tr").cells[0].innerText
  if (await swalSíNo('Estás seguro que deseas borrar este usuario?', `<span style="font-size: 30px; font-weight: 500; color: #8b8b8b;">${usuario}</span>`), innerWidth / 2) modalAutenticacion.mostrar(q => {
    hazDelete('', data, q => {
      swalExito("Se ha borrado el usuario con éxito")
      fila.remove()
    })
    //TODO estos no se si dejarlos
    // toastr["success"]("Se ha borrado el usuario con éxito", "Éxito");
    // toastr["error"](res.responseText, "Error");
  })
})

bodyOnClick("td .fa-eye", c => {
  let counter = c.ant()
  if (!counter.hidden) counter.parar()
  c.closest("td").ant().innerText = "********"
  c.padre().qsafor('i', x => x.alternar())
})

bodyOnClick("td .fa-eye-slash", c => modalAutenticacion.mostrar(q => {
  let usuario = c.closest("tr").cells[0].innerText
  let contraseñaVerificacion = qs("#verificacionIdentidad").value
  hazPost('', JSON.stringify({ usuario, contraseñaVerificacion }), async s => {
    toastr["success"]("Se ha realizado la petición con éxito", "Éxito")
    c.padre().qsafor('i', x => x.alternar())
    c.closest("td").ant().innerText = await s.text()
    c.ant().ant().resetear(q => c.ant().click())
  }, r => toastr["error"](r.responseText, "Error"))
}))
let datepicker = $(`#datepicker`).datepicker({ weekStart: 1, language: 'es', autoclose: true, maxViewMode: 2, minViewMode: 1, todayHighlight: true, format: 'dd/mm/yyyy' })
$('#registrargastos').on('click', e => {
  let fecha = $('#calendario').val().replaceAll('/', '-')
  if (fecha === '') return Swal.fire('Campo de fecha vacío', 'Por favor selecciona una fecha para continuar', 'error')
  location = `/gastos/${fecha}`
})

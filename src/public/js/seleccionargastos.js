document.addEventListener('eventoDP', e => $(`#datepicker`).datepicker({ weekStart: 1, language: 'es', autoclose: true, maxViewMode: 2, minViewMode: 1, todayHighlight: true, format: 'dd/mm/yyyy' }))

qsclick('#registrargastos', q => {
  let fecha = qs('#calendario').value.replaceAll('/', '-')
  if (fecha === '') return Swal.fire('Campo de fecha vacío', 'Por favor selecciona una fecha para continuar', 'error')
  location = `/gastos/${fecha}`
})

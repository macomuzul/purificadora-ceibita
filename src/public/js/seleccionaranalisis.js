let unidadTiempo = 'dias', agruparPor = '', rango = ''

let calendario = $('#calendario')
let textoDatePicker = $('.textoDatePicker'), sectionunidadTiempo = $('.sectionunidadTiempo'), btnBorrarFechas = $('.btnBorrarFechas')
let filasIndice = [], listaFechas = []
let datepicker, objMinView = { dias: 0, semanas: 0, meses: 1, años: 2 }
moment.updateLocale('en', { week: { dow: 1 } })

onbeforeunload = q => {
  agruparPor = agruparPor.replace('agruparpor=', '')
  rango = rango.replace('rango=', '')
}

let devuelveCalendarios = (...calendarios) => calendarios.map(x => $('#' + x).val().replaceAll('/', '-'))
let destruirCalendario = q => {
  borrarFechas()
  datepicker.off()
  document.removeEventListener('click', capturarFecha, { capture: true })
  datepicker.datepicker('destroy')
}
let borrarFechas = q => {
  datepicker.datepicker('clearDates')
  textoDatePicker.text('')
  filasIndice = [], listaFechas = []
}

function ordenar(e) {
  let { dates, format } = e
  if (dates.length > 0) {
    let indices = [...dates.keys()]
    indices.sort((a, b) => dates[a] - dates[b])
    let ordendo = dates.map((_, i) => format(indices[i])).join(', ')
    textoDatePicker.text(ordendo)
    datepicker.find('input').val(ordendo)
  }
  let clase = { dias: 'day', semanas: 'week', meses: 'month', años: 'year' }[unidadTiempo]
  $(`.datepicker-${clase}s span.${clase}`).removeClass('focused')
}

function cambiarMes(e) {
  let inicioMes = moment(e.date).startOf('month')
  let empiezaLunes = inicioMes._d.getUTCDay() === 1
  let inicio = inicioMes.utc().startOf('week')._d
  if (empiezaLunes) inicio = moment(inicio).utc().subtract(7, 'days')._d
  filasIndice = [...Array(6).keys()].filter(i => listaFechas.includes(moment(inicio).add(i * 7, 'days').utc()._d.valueOf()))
}

function mostarValores() {
  listaFechas.sort((a, b) => a - b)
  let fechas = listaFechas.map(x => moment(x).day(1).format('DD/MM/YYYY') + '-' + moment(x).day(7).format('DD/MM/YYYY')).join(', ')
  calendario.val(fechas)
  textoDatePicker.text(fechas)
}
let mostrar = q => filasIndice.forEach(i => $(`.datepicker-days tbody tr:nth-child(${i + 1})`).addClass('active'))

let capturarFecha = e => {
  if (e.target.matches('td.day')) {
    alternarClase(e.target.closest('tr'), 'active')
    let inicioSemana = moment(parseInt(e.target.dataset.date)).utc().startOf('week')._d.valueOf()
    let index = listaFechas.indexOf(inicioSemana)
    index !== -1 ? listaFechas.splice(index, 1) : listaFechas.push(inicioSemana)
    mostarValores()

    e.stopPropagation()
    e.preventDefault()
  }
}

let swalConfirmarYCancelar = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-success margenbotonswal',
    cancelButton: 'btn btn-danger margenbotonswal',
  },
  buttonsStyling: false,
})

function crearDatePicker(opciones = {}) {
  try {
    destruirCalendario()
  } catch (e) { }
  datepicker = $(`#${rango === 'entre' ? 'datepickerEntre' : 'datepickerNormal'}`).datepicker({ weekStart: 1, language: 'es', autoclose: rango !== 'libre', maxViewMode: 2, minViewMode: objMinView[unidadTiempo], todayHighlight: true, multidate: rango === 'libre', multidateSeparator: ', ', format: 'dd/mm/yyyy', ...opciones })
}

function cambiarRango(opcion){
  rango = opcion.textContent.split(' ').at(0).toLowerCase()
  $('.textoDatePicker')[rango === 'libre' ? 'show' : 'hide']()
  let fechaEntre = rango === 'entre'
  $('#datepickerNormal').css('display', fechaEntre ? 'none' : 'flex')
  $('#datepickerEntre').css('display', fechaEntre ? 'flex' : 'none')
  crearDatePicker()
}

$('#rangomenu').on('click', w => metododropdown = cambiarRango)
$('#agruparmenu').on('click', w => { metododropdown = (opcion) => agruparPor = opcion.dataset.agrupar })
bodyOnClick('.dia', e => rehacerDatepicker('dias'))

function tercerNivel() {
  unidadTiempo = 'dias'
  sectionunidadTiempo.hide()
  btnBorrarFechas.text('Borrar fecha seleccionada')
  sectionVarios.mostrar('flex')
  breadcrumbs.nivel(3)
  crearDatePicker()
}

function tercerNivelLibre() {
  sectionunidadTiempo.show()
  btnBorrarFechas.text('Borrar fechas seleccionadas')
  sectionVarios.mostrar('flex')
  breadcrumbs.nivel(3)
  construirDatePicker(agruparPor)
}

function tercerNivelEntre() {
  unidadTiempo = 'dias'
  sectionunidadTiempo.hide()
  btnBorrarFechas.text('Borrar fecha seleccionada')
  sectionEntre.mostrar('flex')
  breadcrumbs.nivel(3)
  crearDatePicker()
}

function datepickerMultidate() {
  if (unidadTiempo !== 'semanas') {
    datepicker.on('show', e => ordenar(e))
    datepicker.on('hide', e => ordenar(e))
  } else {
    datepicker.on('show', mostrar)
    datepicker.on('hide', mostarValores)
    datepicker.on('changeMonth', e => cambiarMes(e))
    document.addEventListener('click', capturarFecha, { capture: true })
  }
}

bodyOnClick('#analizarVarios', function () {
  let [fecha] = devuelveCalendarios('calendario')
  if (fecha === '') return Swal.fire('Campo de fecha vacío', 'Por favor selecciona una fecha para continuar', 'error')
  if (rango === 'libre') {
    let fechas = unidadTiempo === 'semanas' ? listaFechas : datepicker.datepicker('getDates')
    fechas.sort((a, b) => a - b)
    fecha = fechas.map(x => new Intl.DateTimeFormat('es', { timeZone: 'UTC' }).format(x).replaceAll('/', '-')).join()
  }
  antesDeCambiarPagina()
  location = `/analisis/${agruparPor}&${rango}&${unidadTiempo}=${fecha}`
})
bodyOnClick('#analizarEntre', function () {
  let [fecha1, fecha2] = devuelveCalendarios('calendario1', 'calendario2')
  if (fecha1 === '' || fecha2 === '') return Swal.fire('Campo de fecha vacío', 'Por favor selecciona una fecha para continuar', 'error')
  antesDeCambiarPagina()
  location = `/analisis/${agruparPor}&${rango}&${unidadTiempo}=${fecha1}&y&${fecha2}`
})

function antesDeCambiarPagina() {
  agruparPor = agruparPor.replace('días', 'dias')
  unidadTiempo = unidadTiempo.replace('días', 'dias')
  agruparPor = 'agruparpor=' + agruparPor
  rango = 'rango=' + rango
}

bodyOnClick('.btnBorrarFechas', borrarFechas)
bodyOnClick('.input-group-append', e => anterior(e.currentTarget).focus())


async function rehacerDatepicker(UT) {
  let { isConfirmed } = await swalConfirmarYCancelar.fire({
    title: `Estás seguro que deseas seleccionar las fechas por ${UT}`,
    text: 'Si continuas se borrarán las fechas que seleccionaste en el calendario',
    fa: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí',
    cancelButtonText: 'No',
  })
  if (!isConfirmed) return
  construirDatePicker(UT)
}

function construirDatePicker(UT) {
  unidadTiempo = UT
  let opciones = {}
  if (UT === 'meses') opciones = { format: 'MM yyyy' }
  if (UT === 'años') opciones = { format: 'yyyy' }
  crearDatePicker(opciones)
  datepickerMultidate()
}

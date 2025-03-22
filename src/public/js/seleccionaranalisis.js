let unidadTiempo = 'dias', agruparPor = 'dias', rango = 'mayor', analizar = 'ventas'

let calendario = $('#calendario')
let textoDatePicker = qs('.textoDatePicker'), cambiarseleccionintercalada = qs('.cambiarseleccionintercalada'), btnBorrarFechas = qs('#borrarFechas')
let filasIndice = [], listaFechas = []
let datepicker, objMinView = { dias: 0, semanas: 0, meses: 1, años: 2 }
moment.updateLocale('en', { week: { dow: 1 } })

let devuelveCalendarios = (...calendarios) => calendarios.map(x => qs('#' + x).value.replaceAll('/', '-'))
let destruirCalendario = q => {
  borrarFechas()
  datepicker.off()
  document.removeEventListener('click', capturarFecha, { capture: true })
  datepicker.datepicker('destroy')
}
let borrarFechas = q => {
  datepicker.datepicker('clearDates')
  textoDatePicker.textContent = ''
  filasIndice = [], listaFechas = []
}

function ordenar(e) {
  let { dates, format } = e
  if (dates.length > 0) {
    let indices = [...dates.keys()]
    indices.sort((a, b) => dates[a] - dates[b])
    let ordenado = dates.map((_, i) => format(indices[i])).join(', ')
    textoDatePicker.textContent = ordenado
    datepicker.find('input').val(ordenado)
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
  textoDatePicker.textContent = fechas
}
let display = q => filasIndice.forEach(i => $(`.datepicker-days tbody tr:nth-child(${i + 1})`).addClass('active'))

let capturarFecha = e => {
  let x = e.target
  if (x.matches('td.day')) {
    x.closest('tr').alternarClase('active')
    let inicioSemana = moment(parseInt(x.dataset.date)).utc().startOf('week')._d.valueOf()
    let index = listaFechas.indexOf(inicioSemana)
    index !== -1 ? listaFechas.splice(index, 1) : listaFechas.push(inicioSemana)
    mostarValores()

    e.stopPropagation()
    e.preventDefault()
  }
}

function crearDatePicker(opciones = {}) {
  try {
    destruirCalendario()
  } catch (e) { }
  datepicker = $(`#${rango === 'entre' ? 'datepickerEntre' : 'datepickerNormal'}`).datepicker({ weekStart: 1, language: 'es', autoclose: rango !== 'libre', maxViewMode: 2, minViewMode: objMinView[unidadTiempo], todayHighlight: true, multidate: rango === 'libre', multidateSeparator: ', ', format: 'dd/mm/yyyy', ...opciones })
}

function crearDatPickerMultidate(UT) {
  let opciones = {}
  if (UT === 'meses') opciones = { format: 'MM yyyy' }
  if (UT === 'años') opciones = { format: 'yyyy' }
  crearDatePicker(opciones)
  if (UT !== 'semanas') {
    datepicker.on('show', ordenar)
    datepicker.on('hide', ordenar)
  } else {
    datepicker.on('show', display)
    datepicker.on('hide', mostarValores)
    datepicker.on('changeMonth', cambiarMes)
    document.addEventListener('click', capturarFecha, { capture: true })
  }
}

let visibilidad = (el, x) => el.hidden = !x
qs('[data-idseleccionado="analizar"]').metododropdown = opcion => analizar = opcion.dataset.analizar
qs('[data-idseleccionado="agrupar"]').metododropdown = opcion => agruparPor = opcion.dataset.agrupar
qs('[data-idseleccionado="rango"]').metododropdown = c => {
  let t = c.textContent
  let l = t.startsWith('Libre')
  rango = t.split(' ').at(0).toLowerCase()
  let entre = rango === 'entre'
  visibilidad(cambiarseleccionintercalada, l)
  visibilidad(textoDatePicker, l)
  visibilidad(qs('#datepickerNormal'), !entre)
  visibilidad(qs('#datepickerEntre'), entre)
  btnBorrarFechas.textContent = l ? 'Borrar fechas seleccionadas' : 'Borrar fecha seleccionada'
  if (l) crearDatPickerMultidate(agruparPor)
  else {
    unidadTiempo = 'dias'
    crearDatePicker()
  }
}
qs('[data-idseleccionado="intercalado"]').metododropdown = async c => {
  let UT = c.dataset.intercalar
  let { isConfirmed } = await swalConfirmarYCancelar.fire({
    title: `Estás seguro que deseas seleccionar las fechas por ${UT}`,
    text: 'Si continuas se borrarán las fechas que seleccionaste en el calendario',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí',
    cancelButtonText: 'No',
  })
  if (isConfirmed) crearDatPickerMultidate(UT)
}

bodyOnClick('#btnbuscar', c => {
  let f
  if (rango === 'entre') {
    let [fecha1, fecha2] = devuelveCalendarios('calendario1', 'calendario2')
    if (fecha1 === '' || fecha2 === '') return Swal.fire('Campo de fecha vacío', 'Por favor selecciona una fecha para continuar', 'error')
    f = `${fecha1}&y&${fecha2}`
  } else {
    let [fecha] = devuelveCalendarios('calendario')
    if (fecha === '') return Swal.fire('Campo de fecha vacío', 'Por favor selecciona una fecha para continuar', 'error')
    if (rango === 'libre') {
      let fechas = unidadTiempo === 'semanas' ? listaFechas : datepicker.datepicker('getDates')
      fechas.sort((a, b) => a - b)
      fecha = fechas.map(x => new Intl.DateTimeFormat('es', { timeZone: 'UTC' }).format(x).replaceAll('/', '-')).join()
    }
    f = fecha
  }
  location = `/analisis/agruparpor=${agruparPor}&rango=${rango}&${unidadTiempo}=${f}`
})

bodyOnClick('.btnBorrarFechas', borrarFechas)
crearDatePicker()
let unidadTiempo = "dias", agruparPor = "", rango = ""
String.prototype.capitalizar = function () { return this[0].toUpperCase() + this.slice(1) }

let calendario = $('#calendario')
let nivelesBC = [w => `<span class="fa fa-home" style="font-size: 18px;"></span>`, w => `<span class="fa fa-sort-numeric-asc"></span> ${agruparPor.capitalizar()}</a>`, w => `<span class="fa fa-sort"></span> ${rango.capitalizar()}`]
let textoDatePicker = $(".textoDatePicker")
let sectionunidadTiempo = $(".sectionunidadTiempo")
let btnBorrarFechas = $(".btnBorrarFechas")
let filasIndice = [], listaFechas = []
let datepicker, objMinView = { dias: 0, semanas: 0, meses: 1, años: 2 }
moment.locale('en', { week: { dow: 1 } })

window.onbeforeunload = q => {
  agruparPor = agruparPor.replace("agruparpor=", "")
  rango = rango.replace("rango=", "")
}

let devuelveCalendarios = (...calendarios) => calendarios.map(x => $("#" + x).val().replaceAll("/", "-"))
let destruirCalendario = q => {
  borrarFechas()
  datepicker.off()
  document.removeEventListener("click", capturarFecha, { capture: true })
  datepicker.datepicker("destroy")
}
let borrarFechas = q => {
  datepicker.datepicker("clearDates")
  textoDatePicker.text("")
  filasIndice = [], listaFechas = []
}


function ordenar(e) {
  let { dates, format } = e
  if (dates.length > 0) {
    let indices = [...dates.keys()]
    indices.sort((a, b) => dates[a] - dates[b])
    let ordendo = dates.map((_, i) => format(indices[i])).join(", ")
    textoDatePicker.text(ordendo)
    datepicker.find("input").val(ordendo)
  }
  let clase = { dias: "day", semanas: "week", meses: "month", años: "year" }[unidadTiempo]
  $(`.datepicker-${clase}s span.${clase}`).each((_, x) => x.classList.remove("focused"))
}

function cambiarMes(e) {
  let inicioMes = moment(e.date).startOf("month")
  let empiezaLunes = inicioMes._d.getUTCDay() === 1
  let inicio = inicioMes.utc().startOf("week")._d
  if (empiezaLunes) inicio = moment(inicio).utc().subtract(7, "days")._d
  filasIndice = [...Array(6).keys()].filter(i => listaFechas.includes(moment(inicio).add(i * 7, "days").utc()._d.valueOf()))
}

function mostarValores() {
  listaFechas.sort((a, b) => a - b)
  let fechas = listaFechas.map(x => (moment(x).day(1).format("DD/MM/YYYY") + "-" + moment(x).day(7).format("DD/MM/YYYY"))).join(", ")
  calendario.val(fechas)
  textoDatePicker.text(fechas)
}
let mostrar = q => filasIndice.forEach(i => $(`.datepicker-days tbody tr:nth-child(${i + 1})`).each((_, x) => x.classList.add("active")))

let capturarFecha = e => {
  if (e.target.matches("td.day")) {
    e.target.closest("tr").classList.toggle("active")
    let inicioSemana = moment(parseInt(e.target.dataset.date)).utc().startOf("week")._d.valueOf()
    let index = listaFechas.indexOf(inicioSemana)
    index !== -1 ? listaFechas.splice(index, 1) : listaFechas.push(inicioSemana)
    mostarValores()

    e.stopPropagation()
    e.preventDefault()
  }
}

let swalConfirmarYCancelar = Swal.mixin({
  customClass: {
    confirmButton: "btn btn-success margenbotonswal",
    cancelButton: "btn btn-danger margenbotonswal",
  },
  buttonsStyling: false
})

let sectionUnidadTiempo = $("#sectionUnidadTiempo")[0], sectionAgrupar = $("#sectionAgrupar")[0], sectionRangos = $("#sectionRangos")[0], sectionVarios = $("#sectionVarios")[0], sectionEntre = $("#sectionEntre")[0], breadcrumbs = $("#breadcrumbs")[0], sectionVolver = $("section-volver")
let esconderSecciones = () => sectionVolver.each((_, x) => x.offsetParent !== null ? x.esconder() : "")
let cambiarSeccion = (n, valor, cb) => {
  if (n === 1) agruparPor = valor
  else if (n === 2) rango = valor
  esconderSecciones()
  cb()
}
let volverSeccion = cb => {
  esconderSecciones()
  cb()
}
let clickBC = (e, cb) => {
  if (sectionVolver[$(e.currentTarget).index()].offsetParent === null) {
    esconderSecciones()
    cb()
  }
}

$("body").on("click", "#btnAgruparDias, #btnAgruparSemanas, #btnAgruparMeses, #btnAgruparAños", e => cambiarSeccion(1, e.target.value.split(" ").at(-1), segundoNivel))
$("body").on("click", "#btnMayor", w => cambiarSeccion(2, "mayor", tercerNivel))
$("body").on("click", "#btnMenor", w => cambiarSeccion(2, "menor", tercerNivel))
$("body").on("click", "#btnEntre", w => cambiarSeccion(2, "entre", tercerNivelEntre))
$("body").on("click", "#btnLibre", w => cambiarSeccion(2, "libre", tercerNivelLibre))

$("body").on("click", "#volverPrimerNivel", w => volverSeccion(primerNivel))
$("body").on("click", "#volverSegundoNivelVarios, #volverSegundoNivelEntre", async e => await preguntarSegundoNivel(volverSeccion, segundoNivel))

$("body").on("click", "#breadcrumb li:nth-child(1)", e => clickBC(e, primerNivel))
$("body").on("click", "#breadcrumb li:nth-child(2)", async e => await preguntarSegundoNivel(clickBC, e, segundoNivel))

async function preguntarSegundoNivel(cb, p1, p2) {
  if (datepicker.find("input").val()) {
    let { isConfirmed } = await swalConfirmarYCancelar.fire({
      title: "Estás seguro que deseas regresar?",
      text: "Si regresas se borrarán las fechas que seleccionaste en el calendario",
      fa: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: "No",
    })
    if (!isConfirmed) return
  }
  borrarFechas()
  cb(p1, p2)
}


function primerNivel() {
  sectionAgrupar.mostrar()
  breadcrumbs.nivel(1)
}

async function segundoNivel() {
  sectionRangos.mostrar()
  breadcrumbs.nivel(2)
}

function tercerNivel() {
  unidadTiempo = "dias"
  sectionunidadTiempo.hide()
  btnBorrarFechas.text("Borrar fecha seleccionada")
  sectionVarios.mostrar("flex")
  breadcrumbs.nivel(3)
  crearDatePicker()
}

function tercerNivelLibre() {
  sectionunidadTiempo.show()
  btnBorrarFechas.text("Borrar fechas seleccionadas")
  sectionVarios.mostrar("flex")
  breadcrumbs.nivel(3)
  construirDatePicker(agruparPor)
}

function tercerNivelEntre() {
  unidadTiempo = "dias"
  sectionunidadTiempo.hide()
  btnBorrarFechas.text("Borrar fecha seleccionada")
  sectionEntre.mostrar("flex")
  breadcrumbs.nivel(3)
  crearDatePicker()
}


function datepickerMultidate() {
  if (unidadTiempo !== "semanas") {
    datepicker.on("show", e => ordenar(e))
    datepicker.on("hide", e => ordenar(e))
  } else {
    datepicker.on("show", mostrar)
    datepicker.on("hide", mostarValores)
    datepicker.on("changeMonth", e => cambiarMes(e))
    document.addEventListener("click", capturarFecha, { capture: true })
  }
}

function crearDatePicker(opciones = {}) {
  try {
    destruirCalendario()
  } catch (error) {
  }
  $(".textoDatePicker")[rango === "libre" ? "show" : "hide"]()
  datepicker = $(`#${rango === "entre" ? "datepickerEntre" : "datepickerVarios"}`).datepicker({ weekStart: 1, language: "es", autoclose: rango !== "libre", maxViewMode: 2, minViewMode: objMinView[unidadTiempo], todayHighlight: true, multidate: rango === "libre", multidateSeparator: ", ", format: "dd/mm/yyyy", ...opciones })
}

$("body").on("click", "#analizarVarios", function () {
  let [fecha] = devuelveCalendarios("calendario")
  if (fecha === "") return Swal.fire("Campo de fecha vacío", "Por favor selecciona una fecha para continuar", "error")
  if (rango === "libre") {
    let fechas = listaFechas
    fechas.sort((a, b) => a - b)
    debugger
    fecha = fechas.map(x => new Intl.DateTimeFormat("es", { timeZone: "UTC" }).format(x).replaceAll("/", "-")).join()
  }
  antesDeCambiarPagina()
  location = `/analisis/${agruparPor}&${rango}&${unidadTiempo}=${fecha}`
})
$("body").on("click", "#analizarEntre", function () {
  let [fecha1, fecha2] = devuelveCalendarios("calendario1", "calendario2")
  if (fecha1 === "" || fecha2 === "") return Swal.fire("Campo de fecha vacío", "Por favor selecciona una fecha para continuar", "error")
  antesDeCambiarPagina()
  location = `/analisis/${agruparPor}&${rango}&${unidadTiempo}=${fecha1}&y&${fecha2}`
})

function antesDeCambiarPagina() {
  agruparPor = agruparPor.replace("días", "dias")
  unidadTiempo = unidadTiempo.replace("días", "dias")
  agruparPor = "agruparpor=" + agruparPor
  rango = "rango=" + rango
}

$("body").on("change", "#switchAnimaciones", function () {
  let opcion = this.checked ? "addClass" : "removeClass"
  sectionVolver.each((_, x) => $(x)[opcion]("animate__animated"))
  $(breadcrumbs)[opcion]("animate__animated")
})

$("body").on("click", ".btnBorrarFechas", borrarFechas)
$("body").on("click", ".input-group-append", e => $(e.currentTarget).prev().focus())


$("body").on("click", ".dia", e => rehacerDatepicker("dias"))
$("body").on("click", ".semana", e => rehacerDatepicker("semanas"))
$("body").on("click", ".mes", e => rehacerDatepicker("meses"))
$("body").on("click", ".año", e => rehacerDatepicker("años"))

async function rehacerDatepicker(UT) {
  let { isConfirmed } = await swalConfirmarYCancelar.fire({
    title: `Estás seguro que deseas seleccionar las fechas por ${UT}`,
    text: "Si continuas se borrarán las fechas que seleccionaste en el calendario",
    fa: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí",
    cancelButtonText: "No",
  })
  if (!isConfirmed) return
  construirDatePicker(UT)
}

function construirDatePicker(UT) {
  unidadTiempo = UT
  let opciones = {}
  if (UT === "meses") opciones = { format: "MM yyyy" }
  if (UT === "años") opciones = { format: "yyyy" }
  crearDatePicker(opciones)
  datepickerMultidate()
}

setTimeout(() => {
  const popoverTriggerList = document.querySelectorAll('[data-toggle="popover"]')
  const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl, { html: true }))
}, 500)
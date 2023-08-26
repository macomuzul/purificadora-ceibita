let unidadTiempo = "dias", agruparPor = "", rango = ""
String.prototype.capitalizar = function () { return this.charAt(0).toUpperCase() + this.slice(1) }

let calendario = $('#calendario')
let nivelesBC = [w => `<span class="icon icon-home" style="font-size: 18px;"></span>`, w => `<span class="icon icon-sort-by-order"></span> ${agruparPor.capitalizar()}</a>`, w => `<span class="icon icon-sort"></span> ${rango.capitalizar()}`]
let textoDatePicker = $(".textoDatePicker")
let filasIndice = [], listaFechas = []
let datepicker, objMinView = { dias: 0, semanas: 0, meses: 1, años: 2 }

let devuelveCalendarios = (...calendarios) => calendarios.map(x => $("#" + x).val().replaceAll("/", "-"))
let destruirCalendario = q => {
  borrarFechas()
  document.removeEventListener("click", capturarFecha)
  datepicker.datepicker("destroy")
}
let borrarFechas = q => {
  datepicker.datepicker("clearDates")
  textoDatePicker.text("")
  filasIndice = [], listaFechas = []
}

let mostarValores = q => {
  listaFechas.sort((a, b) => a - b)
  let fechas = listaFechas.map(x => (moment(x).day(1).format("DD/MM/YYYY") + "-" + moment(x).day(7).format("DD/MM/YYYY"))).join(", ")
  calendario.val(fechas)
  textoDatePicker.text(fechas)
}

let capturarFecha = e => {
  if (e.target.matches("td.day")) {
    e.target.closest("tr").classList.toggle("active")
    let inicioSemana = moment(parseInt(e.target.dataset.date)).startOf("week")._d.valueOf()
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
$("body").on("click", "#btnLibre", w => cambiarSeccion(2, "libre", tercerNivel))

$("body").on("click", "#volverPrimerNivel", w => volverSeccion(primerNivel))
$("body").on("click", "#volverSegundoNivelVarios, #volverSegundoNivelEntre", async e => await preguntarSegundoNivel(volverSeccion, segundoNivel))

$("body").on("click", "#breadcrumb li:nth-child(1)", e => clickBC(e, primerNivel))
$("body").on("click", "#breadcrumb li:nth-child(2)", async e => await preguntarSegundoNivel(clickBC, e, segundoNivel))

async function preguntarSegundoNivel(cb, p1, p2) {
  if (datepicker.find("input").val()) {
    let { isConfirmed } = await swalConfirmarYCancelar.fire({
      title: "Estás seguro que deseas regresar?",
      text: "Si regresas se borrarán las fechas que seleccionaste en el calendario",
      icon: "warning",
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
  sectionVarios.mostrar("flex")
  breadcrumbs.nivel(3)
  crearDatePicker()
  datepickerMultidate()
}

function datepickerMultidate() {
  if (unidadTiempo !== "semanas") {
    let ordenar = e => {
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
    datepicker.on("show", ordenar)
    datepicker.on("hide", ordenar)
  } else {
    let mostrar = e => filasIndice.forEach(i => $(`.datepicker-days tbody tr:nth-child(${i + 1})`).each((_, x) => x.classList.add("active")))
    datepicker.on("show", mostrar)
    datepicker.on("hide", mostarValores)
    datepicker.on("changeMonth", function (e) {
      let inicioMes = moment(e.date).startOf("month")
      let empiezaLunes = inicioMes._d.getUTCDay() === 1
      let inicio = inicioMes.startOf("week")._d
      if (empiezaLunes) inicio = moment(inicio).subtract(7, "days")._d
      filasIndice = [...Array(6).keys()].filter(i => listaFechas.includes(moment(inicio).add(i * 7, "days")._d.valueOf()))
    })
    document.addEventListener("click", capturarFecha, { capture: true })
  }
}

function tercerNivelEntre() {
  crearDatePicker()
  sectionEntre.mostrar("flex")
  breadcrumbs.nivel(3)
}

function crearDatePicker(opciones = {}) {
  $(".textoDatePicker")[rango === "libre" ? "show" : "hide"]()
  datepicker = $(`#${rango === "entre" ? "datepickerEntre" : "datepickerVarios"}`).datepicker({ weekStart: 1, language: "es", autoclose: rango !== "libre", maxViewMode: 2, minViewMode: objMinView[unidadTiempo], todayHighlight: true, multidate: rango === "libre", multidateSeparator: ", ", format: "dd/mm/yyyy", ...opciones })
}

$("body").on("click", "#analizarVarios", function () {
  let [fecha] = devuelveCalendarios("calendario")
  if (fecha === "") return Swal.fire("Campo de fecha vacío", "Por favor selecciona una fecha para continuar", "error")
  if (rango === "libre") {
    let fechas = datepicker.datepicker("getDates")
    fechas.sort((a, b) => a - b)
    fecha = fechas.map(x => new Intl.DateTimeFormat("es").format(x).replaceAll("/", "-")).join()
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
  agruparPor = "agruparpor=" + agruparPor
  rango = "rango=" + rango
}

$("body").on("change", "#switchAnimaciones", function () {
  let opcion = this.checked ? "addClass" : "removeClass"
  sectionVolver.each((_, el) => $(el)[opcion]("animate__animated"))
  $(breadcrumbs)[opcion]("animate__animated")
})

$("body").on("click", ".btnBorrarFechas", borrarFechas)
$("body").on("click", ".input-group-append", e => $(e.currentTarget).prev().focus())


$("body").on("click", ".dia", e => rehacerDatepicker("dia"))
$("body").on("click", ".semana", e => rehacerDatepicker("semana"))
$("body").on("click", ".mes", e => rehacerDatepicker("mes"))
$("body").on("click", ".año", e => rehacerDatepicker("año"))

async function rehacerDatepicker(UT) {
  let { isConfirmed } = await swalConfirmarYCancelar.fire({
    title: `Estás seguro que deseas seleccionar las fechas por ${UT}`,
    text: "Si continuas se borrarán las fechas que seleccionaste en el calendario",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí",
    cancelButtonText: "No",
  })
  if (!isConfirmed) return
  borrarFechas()
  destruirCalendario()
  unidadTiempo = `${UT}${UT.endsWith("s") ? "e" : ""}s`
  let opciones = {}
  if (UT === "mes") opciones = { format: "MM yyyy" }
  if (UT === "año") opciones = { format: "yyyy" }
  crearDatePicker(opciones)
  datepickerMultidate()
}

let mutacion = new MutationObserver(x => {
  if (x[0].target.style.display === "none") {
    destruirCalendario()
  } else {
    $(".cambiarUnidadTiempo")[rango === "libre" ? "show" : "hide"]()
  }
})

  ;[sectionVarios, sectionEntre].forEach(x => mutacion.observe(x, { attributes: true, attributeFilter: ["style"] }))
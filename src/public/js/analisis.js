let unidadTiempo = "", agruparPor = "", rango = ""
String.prototype.capitalizar = function () { return this.charAt(0).toUpperCase() + this.slice(1) }
let nivelesBC = [w => `<li><a><span class="icon icon-home" style="font-size: 18px;"></span></a></li>`, w => `<li><a><span class="icon icon-calendar"> </span> ${unidadTiempo.capitalizar()}</a></li>`, w => `<li><a><span class="icon icon-sort-by-order"></span> ${agruparPor.capitalizar()}</a></li>`, w => `<li><a><span class="icon icon-sort"></span> ${rango.capitalizar()}</a></li>`]
let textoDatePicker = $(".textoDatePicker")
let devuelveCalendarios = (...calendarios) => calendarios.map(x => $("#" + x).val().replaceAll("/", "-"))

let sectionUnidadTiempo = $("#sectionUnidadTiempo")[0], sectionAgrupar = $("#sectionAgrupar")[0], sectionRangos = $("#sectionRangos")[0], sectionVarios = $("#sectionVarios")[0], sectionEntre = $("#sectionEntre")[0], breadcrumbs = $("#breadcrumbs")[0], sectionVolver = $("section-volver")
let esconderSecciones = () => sectionVolver.each((_, x) => x.offsetParent !== null ? x.esconder() : "")
let cambiarSeccion = (n, valor, cb) => {
  if (n === 0)
    unidadTiempo = valor
  else if (n === 1)
    agruparPor = valor
  else if (n === 2)
    rango = valor
  esconderSecciones()
  cb()
}
let volverSeccion = cb => {
  esconderSecciones()
  cb()
}
let clickBC = (e, cb) => {
  if (sectionVolver[$(e.currentTarget).index()].offsetParent === null){
    esconderSecciones()
    cb()
  }
}

$("body").on("click", "#btnDias", w => cambiarSeccion(0, "días", segundoNivel))
$("body").on("click", "#btnSemanas", w => cambiarSeccion(0, "semanas", segundoNivel))
$("body").on("click", "#btnMeses", w => cambiarSeccion(0, "meses", segundoNivel))
$("body").on("click", "#btnAños", w => cambiarSeccion(0, "años", segundoNivel))
$("body").on("click", "#btnAgruparDias", w => cambiarSeccion(1, "días", tercerNivelRangos))
$("body").on("click", "#btnAgruparSemanas", w => cambiarSeccion(1, "semanas", tercerNivelRangos))
$("body").on("click", "#btnAgruparMeses", w => cambiarSeccion(1, "meses", tercerNivelRangos))
$("body").on("click", "#btnAgruparAños", w => cambiarSeccion(1, "años", tercerNivelRangos))
$("body").on("click", "#btnMayor", w => cambiarSeccion(2, "mayor", cuartoNivel))
$("body").on("click", "#btnMenor", w => cambiarSeccion(2, "menor", cuartoNivel))
$("body").on("click", "#btnEntre", w => cambiarSeccion(2, "entre", cuartoNivelEntre))
$("body").on("click", "#btnLibre", w => cambiarSeccion(2, "libre", cuartoNivel))

$("body").on("click", "#volverPrimerNivel", w => volverSeccion(primerNivel))
$("body").on("click", "#volverSegundoNivel", w => volverSeccion(segundoNivel))
$("body").on("click", "#volverTercerNivelVarios", w => volverSeccion(tercerNivelRangos))
$("body").on("click", "#volverTercerNivelEntre", w => volverSeccion(tercerNivelRangos))

$("body").on("click", "#breadcrumb li:nth-child(1)", e => clickBC(e, primerNivel))
$("body").on("click", "#breadcrumb li:nth-child(2)", e => clickBC(e, segundoNivel))
$("body").on("click", "#breadcrumb li:nth-child(3)", e => clickBC(e, tercerNivelRangos))


function primerNivel() {
  sectionUnidadTiempo.mostrar()
  breadcrumbs.nivel(1)
}

function segundoNivel() {
  $(sectionAgrupar).find(".tituloSeccion").text(`Escoge cómo deseas agrupar los ${unidadTiempo}`)
  sectionAgrupar.mostrar()
  breadcrumbs.nivel(2)
}

function tercerNivelRangos() {
  sectionRangos.mostrar()
  breadcrumbs.nivel(3)
}

function cuartoNivel() {
  crearDatePicker("sectionVarios", "datepickerVarios")
  sectionVarios.mostrar("flex")
  breadcrumbs.nivel(4)
}

function cuartoNivelEntre() {
  crearDatePickerEntre("sectionEntre", "datepickerEntre")
  sectionEntre.mostrar("flex")
  breadcrumbs.nivel(4)
}

function crearDatePickerEntre(idSeccion, idDatepicker) {
  $(`#${idSeccion}`).children().first().html(`<div class="contenedorentreflex input-group input-daterange" id="${idDatepicker}">
<div class="input-group date">
  <input type="text" class="form-control" readonly required id="calendarioentre1">
  <span class="input-group-append"><span class="input-group-text bg-white"><i class="fa fa-calendar"></i></span></span></div>
<div class="divseparador">y</div>
<div class="input-group date">
  <input type="text" class="form-control" readonly required id="calendarioentre2">
  <span class="input-group-append"><span class="input-group-text bg-white"><i class="fa fa-calendar"></i></span></span></div></div>`)
  propiedadesDatePicker(idDatepicker)
}

function crearDatePicker(idSeccion, idDatepicker) {
  $(`#${idSeccion}`).children().first().html(`<div class="input-group date">
<input required type="text" class="form-control" readonly id="${idDatepicker}">
<span class="input-group-append"><span class="input-group-text bg-white"><i class="fa fa-calendar"></i></span></span></div>`)
  propiedadesDatePicker(idDatepicker)
}

function propiedadesDatePicker(idDatepicker) {
  let objMinView = { dias: 0, semanas: 0, meses: 1, años: 2 }
  $(`#${idDatepicker}`).datepicker({ weekStart: 1, language: "es", autoclose: rango !== "libre", maxViewMode: 2, minViewMode: objMinView[unidadTiempo], todayHighlight: true, multidate: rango === "libre", multidateSeparator: " y ", format: "dd/mm/yyyy" })
  .on("changeDate", e => textoDatePicker.text(e.currentTarget.value))
}

$("body").on("click", "#analizarVarios", function () {
  let [fecha] = devuelveCalendarios("datepickerVarios")
  if (fecha === "") return Swal.fire("Campo de fecha vacío", "Por favor selecciona una fecha para continuar", "error")
  antesDeCambiarPagina()
  location = `/analisis/${agruparPor}&${rango}&${unidadTiempo}=${fecha}`
})
$("body").on("click", "#analizarEntre", function () {
  let [fecha1, fecha2] = devuelveCalendarios("calendarioentre1", "calendarioentre2")
  if (fecha1 === "" || fecha2 === "")
    return Swal.fire("Campo de fecha vacío", "Por favor selecciona una fecha para continuar", "error")
  antesDeCambiarPagina()
  location = `/analisis/${agruparPor}&${rango}&${unidadTiempo}=${fecha1}&y&${fecha2}`
})

function antesDeCambiarPagina() {
  unidadTiempo = unidadTiempo.replace("días", "dias")
  agruparPor = agruparPor.replace("días", "dias")
  agruparPor = "agruparpor=" + agruparPor
  rango = "rango=" + rango
}

$("body").on("change", "#switchAnimaciones", function () {
  let opcion = this.checked ? addClass : removeClass
  sectionVolver.each((_, el) => $(el)[opcion]("animate__animated"))
  $(breadcrumbs)[opcion]("animate__animated")
})
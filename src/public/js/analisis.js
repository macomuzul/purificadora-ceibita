let unidadTiempo = "", agruparPor = "", rango = "", sectionUnidadTiempo = $("#sectionUnidadTiempo")[0], sectionAgrupar = $("#sectionAgrupar")[0], sectionRangos = $("#sectionRangos")[0], sectionVarios = $("#sectionVarios")[0], sectionEntre = $("#sectionEntre")[0], breadcrumbs = $("#breadcrumbs")[0], sectionVolver = $("section-volver")
$("body").on("click", "#btnDias", function () {
  unidadTiempo = "días";
  segundoNivel();
});
$("body").on("click", "#btnSemanas", function () {
  unidadTiempo = "semanas";
  segundoNivel();
});
$("body").on("click", "#btnMeses", function () {
  unidadTiempo = "meses";
  segundoNivel();
});
$("body").on("click", "#btnAños", function () {
  unidadTiempo = "años";
  segundoNivel();
});

$("body").on("click", "#btnAgruparDias", function () {
  agruparPor = "días";
  tercerNivelRangos();
});
$("body").on("click", "#btnAgruparSemanas", function () {
  agruparPor = "semanas";
  tercerNivelRangos();
});
$("body").on("click", "#btnAgruparMeses", function () {
  agruparPor = "meses";
  tercerNivelRangos();
});
$("body").on("click", "#btnAgruparAños", function () {
  agruparPor = "años";
  tercerNivelRangos();
});


$("body").on("click", "#btnMayor", function () {
  rango = "mayor";
  cuartoNivel();
});
$("body").on("click", "#btnMenor", function () {
  rango = "menor";
  cuartoNivel();
});
$("body").on("click", "#btnEntre", function () {
  rango = "entre";
  cuartoNivelEntre();
});
$("body").on("click", "#btnLibre", function () {
  rango = "libre";
  cuartoNivel();
});


$("body").on("click", "#volverPrimerNivel", function () {
  primerNivel();
});
$("body").on("click", "#volverSegundoNivel, #volverSegundoNivelRangos", function () {
  segundoNivel();
});
$("body").on("click", "#volverTercerNivelVarios", function () {
  tercerNivelRangos();
});
$("body").on("click", "#volverTercerNivelEntre", function () {
  tercerNivelRangos();
});


function primerNivel() {
  esconder();
  sectionUnidadTiempo.mostrar();
  breadcrumbs.primerNivel();
}

function segundoNivel() {
  esconder();
  $(sectionAgrupar).find(".tituloSeccion").text(`Escoge cómo deseas agrupar los ${unidadTiempo}`)
  sectionAgrupar.mostrar();
  breadcrumbs.segundoNivel();
}

function tercerNivelRangos() {
  esconder();
  sectionRangos.mostrar();
  breadcrumbs.tercerNivel();
}

function cuartoNivel() {
  crearDatePicker("sectionVarios", "datepickerVarios");
  esconder();
  sectionVarios.mostrar("flex");
  breadcrumbs.cuartoNivel();
}

function cuartoNivelEntre() {
  crearDatePickerEntre("sectionEntre", "datepickerEntre");
  esconder();
  sectionEntre.mostrar("flex");
  breadcrumbs.cuartoNivel();
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
  propiedadesDatePicker(idDatepicker);
}

function crearDatePicker(idSeccion, idDatepicker) {
  $(`#${idSeccion}`).children().first().html(`<div class="input-group date">
<input required type="text" class="form-control" readonly id="${idDatepicker}">
<span class="input-group-append"><span class="input-group-text bg-white"><i class="fa fa-calendar"></i></span></span></div>`)
  propiedadesDatePicker(idDatepicker);
}

function propiedadesDatePicker(idDatepicker) {
  let multidate, minViewMode;
  if (rango === "libre")
    multidate = true;
  else
    multidate = false;

  if (unidadTiempo === "días" || unidadTiempo === "semanas")
    minViewMode = 0;
  else if (unidadTiempo === "meses")
    minViewMode = 1;
  else
    minViewMode = 2;

  $(`#${idDatepicker}`).datepicker({ weekStart: 1, language: "es", autoclose: true, maxViewMode: 2, minViewMode, todayHighlight: true, multidate, multidateSeparator: " y ", format: "dd/mm/yyyy" });
}

$("body").on("click", "#analizarVarios", function () {
  let [fecha] = devuelveCalendarios("datepickerVarios")
  if (fecha === "")
    return Swal.fire("Campo de fecha vacío", "Por favor selecciona una fecha para continuar", "error")
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

devuelveCalendarios = (...calendarios) => calendarios.map(x => $("#" + x).val().replaceAll("/", "-"))

function antesDeCambiarPagina() {
  unidadTiempo = unidadTiempo.replace("días", "dias")
  agruparPor = agruparPor.replace("días", "dias")
  agruparPor = "agruparpor=" + agruparPor
  rango = "rango=" + rango
}

function esconder() {
  sectionVolver.each((i, el) => {
    if (el.offsetParent !== null)
      el.esconder();
  });
};

$("body").on("change", "#switchAnimaciones", function () {
  if (this.checked) {
    sectionVolver.each((i, el) => $(el).addClass("animate__animated"))
    $(breadcrumbs).addClass("animate__animated")
  } else {
    sectionVolver.each((i, el) => $(el).removeClass("animate__animated"))
    $(breadcrumbs).removeClass("animate__animated")
  }
})
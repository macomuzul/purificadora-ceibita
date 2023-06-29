let unidadTiempo = "";
let cantidad = "";
let rango = "";
let sectionUnidadTiempo = $("#sectionUnidadTiempo")[0];
let sectionCantidad = $("#sectionCantidad")[0];
let sectionUnoSolo = $("#sectionUnoSolo")[0];
let sectionRangos = $("#sectionRangos")[0];
let sectionVarios = $("#sectionVarios")[0];
let sectionEntre = $("#sectionEntre")[0];
let breadcrumbs = $("#breadcrumbs")[0];
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
$("body").on("click", "#btnSoloUno", function () {
  cantidad = "uno";
  tercerNivelUnoSolo();
});

$("body").on("click", "#btnVarios", function () {
  cantidad = "varios";
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
  $(sectionCantidad).find(".tituloSeccion").text(`Escoge la cantidad de ${unidadTiempo} que deseas analizar`)
  sectionCantidad.mostrar();
  breadcrumbs.segundoNivel();
}

function tercerNivelUnoSolo() {
  crearDatePicker("sectionUnoSolo", "datepickerUnoSolo");
  esconder();
  sectionUnoSolo.mostrar("flex");
  breadcrumbs.tercerNivel();
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
  $(`#${idSeccion}`).children().first().html(`<div class="input-group date" id="${idDatepicker}">
<input required type="text" class="form-control" readonly>
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

  $(`#${idDatepicker}`).datepicker({ weekStart: 1, language: "es", autoclose: true, maxViewMode: 2, minViewMode, todayHighlight: true, multidate, multidateSeparator: " y ", format: "dd/mm/yyyy"});
}

$("body").on("click", "#analizarUno", function () {
  let fecha = $("#datepickerUnoSolo").find("input").val().replaceAll("/", "-");
  if(fecha === "")
    return Swal.fire("Campo de fecha vacío", "Por favor selecciona una fecha para continuar", "error");
  unidadTiempo = unidadTiempo.replace("días", "dias")
  window.location = `/analisis/${unidadTiempo}&${cantidad}&${fecha}`;
})
$("body").on("click", "#analizarVarios", function () {
  let fecha = $("#datepickerVarios").find("input").val().replaceAll("/", "-");
  if(fecha === "")
    return Swal.fire("Campo de fecha vacío", "Por favor selecciona una fecha para continuar", "error");
  unidadTiempo = unidadTiempo.replace("días", "dias")
  window.location = `/analisis/${unidadTiempo}&${cantidad}&${rango}&${fecha}`;
})
$("body").on("click", "#analizarEntre", function () {
  let fecha1 = $("#calendarioentre1").val().replaceAll("/", "-");
  let fecha2 = $("#calendarioentre2").val().replaceAll("/", "-");
  if(fecha1 === "" || fecha2 === "")
    return Swal.fire("Campo de fecha vacío", "Por favor selecciona una fecha para continuar", "error");
  unidadTiempo = unidadTiempo.replace("días", "dias");
  window.location = `/analisis/${unidadTiempo}&${cantidad}&${rango}&${fecha1}&y&${fecha2}`;
})

function esconder() {
  $("section-volver").each((i, el) => {
    if (el.offsetParent !== null)
      el.esconder();
  });
};

$("body").on("change", "#switchAnimaciones", function () {
  if (this.checked) {
    $("section-volver").each((i, el) => $(el).addClass("animate__animated"));
    $("custom-breadcrumbs").each((i, el) => $(el).addClass("animate__animated"));
  } else {
    $("section-volver").each((i, el) => $(el).removeClass("animate__animated"));
    $("custom-breadcrumbs").each((i, el) => $(el).removeClass("animate__animated"));
  }
})
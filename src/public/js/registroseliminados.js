let urlPag = location.pathname + "/"

function metododropdown(option, menu) {
  if (menu.id === "fechasdropdown") {
    if (option.innerText === "Fecha entre") {
      $("#datepickernormal").css("display", "none");
      $("#datepickerEntre").css("display", "inline-block");
    } else {
      $("#datepickerEntre").css("display", "none");
      $("#datepickernormal").css("display", "inline-block");
    }
  }
}

function crearDatePicker(idDatePicker) {
  let opciones = { weekStart: 1, language: "es", autoclose: true, maxViewMode: 2, todayHighlight: true, format: "dd/mm/yyyy" };
  $(`#${idDatePicker}`).datepicker(opciones).on("show", (e) => {
    if ($(".datepicker").is(":offscreen")) {
      $(".datepicker")[0].scrollIntoView();
    }
  });
}

crearDatePicker("datepickerNormal");
crearDatePicker("datepickerEntre");

jQuery.expr.filters.offscreen = function (el) {
  var rect = el.getBoundingClientRect();
  return ((rect.x + rect.width) > window.innerWidth || (rect.y + rect.height) > window.innerHeight);
};

$("body").on("click", "#btnMasReciente", () => {
  location = `${urlPag}masrecientes&pag=1`
});
$("body").on("click", "#btnMasAntiguo", () => {
  location = `${urlPag}masantiguos&pag=1`
});


function mostrarError(titulo, texto) {
  Swal.fire(titulo, texto, "error");
}

$("body").on("click", "#btnbuscar", () => {
  let buscarpor = $("#buscarpor")[0].innerText;
  let rango = $("#rangofecha")[0].innerText;
  let fecha = $("#calendario").val().replaceAll("/", "-");
  let fecha1 = $("#calendario1").val().replaceAll("/", "-");
  let fecha2 = $("#calendario2").val().replaceAll("/", "-");

  if (buscarpor === "Buscar por")
    return mostrarError("Campo de buscar por vacío", "Por favor selecciona un campo en la sección de buscar por para continuar")
  if (rango === "Elige un rango")
    return mostrarError("Campo de rango vacío", "Por favor selecciona un campo en la sección de rango para continuar")
  if (rango === "Fecha entre") {
    if (fecha1 === "")
      return mostrarError("Campo de fecha vacío", "No se ha seleccionado ninguna fecha para el primer calendario")
    if (fecha2 === "")
      return mostrarError("Campo de fecha vacío", "No se ha seleccionado ninguna fecha para el segundo calendario")
  } else {
    if (fecha === "")
      return mostrarError("Campo de fecha vacío", "No se ha seleccionado ninguna fecha en el calendario")
  }
  buscar = {
    "Fecha (calendario)": "fecha",
    "Fecha de eliminación": "fechaeliminacion"
  }
  rangos = {
    "Fecha igual a": "igual",
    "Fecha menor o igual a": "menor",
    "Fecha mayor o igual a": "mayor",
    "Fecha entre": "entre"
  }
  rango = rangos[rango]
  buscarpor = buscar[buscarpor]
  location = `${urlPag}${buscarpor}&${rango}&${rango === "entre" ? `${fecha1}y${fecha2}` : fecha}&pag=1`;
})
let urlPag = "/respaldos/registroseliminados/";

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
  window.location = `${urlPag}masrecientes&pag=1`
});
$("body").on("click", "#btnMasAntiguo", () => {
  window.location = `${urlPag}masantiguos&pag=1`
});


$("body").on("click", "#btnbuscar", () => {
  let buscarpor = $("#buscarpor")[0].innerText;
  let rango = $("#rangofecha")[0].innerText;
  let fecha = $("#calendario").val().replaceAll("/", "-");
  let fecha1 = $("#calendario1").val().replaceAll("/", "-");
  let fecha2 = $("#calendario2").val().replaceAll("/", "-");

  if(buscarpor === "Buscar por")
    return Swal.fire("Campo de buscar por vacío", "Por favor selecciona un campo en la sección de buscar por para continuar", "error");
  if(rango === "Elige un rango")
    return Swal.fire("Campo de rango vacío", "Por favor selecciona un campo en la sección de rango para continuar", "error");
  if(rango === "Fecha entre"){
    if(fecha1 === "")
      return Swal.fire("Campo de fecha vacío", "No se ha seleccionado la fecha para el calendario de arriba", "error");
    if(fecha2 === "")
      return Swal.fire("Campo de fecha vacío", "No se ha seleccionado la fecha para el calendario de abajo", "error");
  } else {
    if(fecha === "")
      return Swal.fire("Campo de fecha vacío", "No se ha seleccionado la fecha en el calendario", "error");
  }
  
  if (buscarpor === "Fecha (calendario)") buscarpor = "fecha"
  else if (buscarpor === "Fecha de eliminación") buscarpor = "fechaeliminacion"

  if (rango === "Fecha igual a") rango = "igual"
  else if (rango === "Fecha menor o igual a") rango = "menor"
  else if (rango === "Fecha mayor o igual a") rango = "mayor"
  else if (rango === "Fecha entre") rango = "entre"

  let url = `${urlPag}${buscarpor}&${rango}&`;
  if (rango === "entre")
    url += `${fecha1}&y&${fecha2}&`;
  else
    url += `${fecha}&`;
    
  url += "pag=1";
  window.location = url;
})
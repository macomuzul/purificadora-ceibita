let urlPag = "/respaldos/registroseliminados/";



function metododropdown(option, menu) {
  if (menu.id === "fechasdropdown") {
    if (option.innerText === "Fecha entre") {
      $("#divdatepickerescondido").css("display", "inline-block");
      $(".divseparador").css("display", "inline-block");
    } else {
      $("#divdatepickerescondido").css("display", "none");
      $(".divseparador").css("display", "none");
    }
  }
}

$(".date")
  .datepicker({ weekStart: 1, language: "es", autoclose: true, maxViewMode: 2, todayHighlight: true })
  .on("show", (e) => {
    if ($(".datepicker").is(":offscreen")) {
      $(".datepicker")[0].scrollIntoView();
    }
  });


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
  let fecha = $("#calendario1").val();

  if (buscarpor === "Buscar por" || rango === "Elige un rango" || fecha === "")
    return;

  if (buscarpor === "Fecha (calendario)") buscarpor = "fecha"
  else if (buscarpor === "Fecha de eliminación") buscarpor = "fechaeliminacion"

  if (rango === "Fecha igual a") rango = "igual"
  else if (rango === "Fecha menor o igual a") rango = "menor"
  else if (rango === "Fecha mayor o igual a") rango = "mayor"
  else if (rango === "Fecha entre") rango = "entre"
  fecha = fecha.replaceAll("/", "-");

  let url = `${urlPag}${buscarpor}&${rango}&${fecha}&`;
  if (rango === "entre"){
    let fecha2 = $("#calendario2").val().replaceAll("/", "-");
    url += `y&${fecha2}&`;
  }
  url += "pag=1";
  window.location = url;
})
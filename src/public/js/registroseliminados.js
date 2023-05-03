let txtnombre = document.getElementById("nombreplantilla");
window.addEventListener("click", (e) => {
  menuseleccionado?.classList.remove("menu-open");
});


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

document.getElementById("btnbuscar").addEventListener("click", () => {
  let buscarpor = $("#buscarpor")[0].innerText;
  let rango = $("#rangofecha")[0].innerText;
  let fecha = $("#calendario1")[0].value;

  if (buscarpor === "Buscar por" || rango === "Elige un rango" || fecha === "")
    return;

  if (buscarpor === "Fecha (calendario)") buscarpor = "fecha"
  else if (buscarpor === "Fecha de eliminación") buscarpor = "fechaeliminacion"

  if (rango === "Fecha igual a") rango = "igual"
  else if (rango === "Fecha menor o igual a") rango = "menor"
  else if (rango === "Fecha mayor o igual a") rango = "mayor"
  else if (rango === "Fecha entre") rango = "entre"
  fecha = fecha.replaceAll("/", "-");

  let url = `/respaldos/registroseliminados/${buscarpor}&${rango}&${fecha}&`
  if (rango !== "entre")
    window.location = `${url}pag=1`;
  else {
    let fecha2 = $("#calendario2")[0].value;
    fecha2 = fecha2.replaceAll("/", "-");
    window.location = `${url}y&${fecha2}&pag=1`;
  }
})
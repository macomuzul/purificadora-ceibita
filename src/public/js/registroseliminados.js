let urlPag = location.pathname + "/"
let mostrarError = (titulo, texto) => Swal.fire(titulo, texto, "error")
let crearDatePicker = idDatePicker => $(`#${idDatePicker}`).datepicker({ weekStart: 1, language: "es", autoclose: true, maxViewMode: 2, todayHighlight: true, format: "dd/mm/yyyy" }).on("show", q => mostrarOffscreen($(".datepicker")[0]))

function metododropdown(option, menu) {
  if (menu.id === "fechasdropdown") {
    let fechaEntre = option.innerText === "Fecha entre"
    $("#datepickerEntre").css("display", fechaEntre ? "inline-block" : "none")
    $("#datepickernormal").css("display", fechaEntre ? "none" : "inline-block")
  }
}

crearDatePicker("datepickerNormal")
crearDatePicker("datepickerEntre")

let mostrarOffscreen = x => {
  let rect = x.getBoundingClientRect()
  if(((rect.x + rect.width) > window.innerWidth || (rect.y + rect.height) > window.innerHeight)) x.scrollIntoView()
}

$("body").on("click", "#btnMasReciente", q => location = `${urlPag}masrecientes&pag=1`)
$("body").on("click", "#btnMasAntiguo", q => location = `${urlPag}masantiguos&pag=1`)

$("body").on("click", "#btnbuscar", () => {
  let buscarpor = $("#buscarpor")[0].innerText
  let rango = $("#rangofecha")[0].innerText
  let fecha = $("#calendario").val().replaceAll("/", "-")
  let fecha1 = $("#calendario1").val().replaceAll("/", "-")
  let fecha2 = $("#calendario2").val().replaceAll("/", "-")

  if (buscarpor === "Buscar por") return mostrarError("Campo de buscar por vacío", "Por favor selecciona un campo en la sección de buscar por para continuar")
  if (rango === "Elige un rango") return mostrarError("Campo de rango vacío", "Por favor selecciona un campo en la sección de rango para continuar")
  if (rango === "Fecha entre") {
    if (fecha1 === "") return mostrarError("Campo de fecha vacío", "No se ha seleccionado ninguna fecha para el primer calendario")
    if (fecha2 === "") return mostrarError("Campo de fecha vacío", "No se ha seleccionado ninguna fecha para el segundo calendario")
  } else if (fecha === "") return mostrarError("Campo de fecha vacío", "No se ha seleccionado ninguna fecha en el calendario")
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
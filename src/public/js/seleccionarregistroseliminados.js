let urlPag = location.pathname + "/"
let mostrarError = (titulo, texto) => Swal.fire(titulo, texto, "error")
let crearDatePicker = idDatePicker => $(`#${idDatePicker}`).datepicker({ weekStart: 1, language: "es", autoclose: true, maxViewMode: 2, todayHighlight: true, format: "dd/mm/yyyy" }).on("show", q => {
  let x = qs(".datepicker")
  let rect = x.getBoundingClientRect()
  if ((rect.x + rect.width) > innerWidth || (rect.y + rect.height) > innerHeight) x.scrollIntoView()
})

qs('custom-dropdown').metododropdown = (option, menu) => {
  if (menu.id === "fechasdropdown") {
    let fechaEntre = option.textContent === "Fecha entre"
    $("#datepickerEntre").css("display", fechaEntre ? "flex" : "none")
    $("#datepickerNormal").css("display", fechaEntre ? "none" : "flex")
  }
}

crearDatePicker("datepickerNormal")
crearDatePicker("datepickerEntre")

bodyOnClick("#btnMasReciente", q => location = `${urlPag}masrecientes&pag=1`)
bodyOnClick("#btnMasAntiguo", q => location = `${urlPag}masantiguos&pag=1`)

bodyOnClick("#btnbuscar", q => {
  let buscarpor = qs("#buscarpor").textContent
  let rango = qs("#rangofecha").textContent
  let formatear = x => qs(x)?.value?.replaceAll("/", "-")
  let fecha = formatear("#calendario")
  let fecha1 = formatear("#calendario1")
  let fecha2 = formatear("#calendario2")

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

bodyOnClick(".input-group-append", c => c.ant().focus())
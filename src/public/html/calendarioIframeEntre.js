
let mostrarOffscreen = x => {
  let rect = x.getBoundingClientRect()
  if((rect.x + rect.width) > window.innerWidth || (rect.y + rect.height) > window.innerHeight) x.scrollIntoView()
}

let validadorIframe = $(`#validadorIframe`)[0]
$(`#datepickerNormal`).datepicker({ weekStart: 1, language: "es", autoclose: true, maxViewMode: 2, todayHighlight: true, format: "dd/mm/yyyy" }).on("show", q => mostrarOffscreen($(".datepicker")[0]))
$(`#datepickerNormal`).datepicker("show")

$("#calendario").on("change", function() {
  this.classList.remove("is-invalid")
  validadorIframe.className = "valid-feedback"
})

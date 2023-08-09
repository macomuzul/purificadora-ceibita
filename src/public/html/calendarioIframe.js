
jQuery.expr.filters.offscreen = x => {
  let rect = x.getBoundingClientRect()
  return ((rect.x + rect.width) > window.innerWidth || (rect.y + rect.height) > window.innerHeight)
}

let validador = $(`#validadorIframe`)[0];
$(`#datepickerSimple`).datepicker({ weekStart: 1, language: "es", autoclose: true, maxViewMode: 2, todayHighlight: true, format: "dd/mm/yyyy" })
.on("show", q => $(".datepicker").is(":offscreen") ? $(".datepicker")[0].scrollIntoView() : "")
$(`#datepickerSimple`).datepicker("show")

$("#calendario").on("change", q => {
  this.classList.remove("is-invalid")
  validador.className = "valid-feedback"
})

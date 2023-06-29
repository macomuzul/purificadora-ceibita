
jQuery.expr.filters.offscreen = function (el) {
  var rect = el.getBoundingClientRect();
  return ((rect.x + rect.width) > window.innerWidth || (rect.y + rect.height) > window.innerHeight);
};

let validador = $(`#validadorIframe`)[0];
let opciones = { weekStart: 1, language: "es", autoclose: true, maxViewMode: 2, todayHighlight: true, format: "dd/mm/yyyy" };
$(`#datepickerSimple`).datepicker(opciones).on("show", (e) => {
  if ($(".datepicker").is(":offscreen")) {
    $(".datepicker")[0].scrollIntoView();
  }
});
$(`#datepickerSimple`).datepicker("show");

$("#calendario").on("change", function() {
  this.classList.remove("is-invalid");
  validador.className = "valid-feedback";
})

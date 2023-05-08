let sortable = false;
// let desdeElMobil = function () { return /Android|webOS|iPhone|iPad|tablet/i.test(navigator.userAgent) }
async function descargarTouch(){
  if (('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0)) {
    await $.getScript('/touch.js');
  }
}
descargarTouch();

$("body").on("click", "#switchOrdenarFilas", async function() {
  $("tbody").sortable({ axis: "y", disabled: sortable });
  sortable = !sortable;
});
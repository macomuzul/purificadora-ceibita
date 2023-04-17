let sortable = false;
let desdeElMobil = function () { return /Android|webOS|iPhone|iPad|tablet/i.test(navigator.userAgent) }

$(document).on("click", "#switchOrdenarFilas", async function() {
  if (typeof $.Widget === "undefined") {
    await $.getScript('/jquery-ui-1.13.js');
    if (desdeElMobil() && !yaSeRecibioTouch) {
      await $.getScript('/touch.js');
      yaSeRecibioTouch = true;
    }
  }
  $("tbody").sortable({ axis: "y", disabled: sortable });
  sortable = !sortable;
});
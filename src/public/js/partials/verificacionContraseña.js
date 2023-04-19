let $modal = document.getElementById('modal');
let modal = new bootstrap.Modal($modal);

$("body").on("click", ".fa-eye", function () {
  this.classList.add("escondido");
  $(this).next()[0].classList.remove("escondido");
  $(this).prev().attr("type", "password");
});

$("body").on("click", ".fa-eye-slash", function () {
  this.classList.add("escondido");
  $(this).prev()[0].classList.remove("escondido");
  $(this).prev().prev().attr("type", "text");
});

$("#modal").on("hide.bs.modal", () => {
  let inputVerificacion = $("#verificacionIdentidad")[0];
  inputVerificacion.value = "";
  if (!$(inputVerificacion).next()[0].classList.contains("escondido"))
    $(inputVerificacion).next().click();
});

$("body").on('click', '#enviarVerificacion', () => {
  funcionEnviar();
});
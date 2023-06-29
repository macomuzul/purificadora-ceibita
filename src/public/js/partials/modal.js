let $modal = document.getElementById('modal');
let modal = new bootstrap.Modal($modal);
let ojoNormal = $($modal).find(".fa-eye")
let ojoCerrado = $($modal).find(".fa-eye-slash")
let inputVerificacion = $($modal).find("input")

$("body").on("click", ".fa-eye", function () {
  ojoNormal.toggle()
  ojoCerrado.toggle()
  inputVerificacion.attr("type", "password")
});

$("body").on("click", ".fa-eye-slash", function () {
  ojoNormal.toggle()
  ojoCerrado.toggle()
  inputVerificacion.attr("type", "text")
});

$("#modal").on("hide.bs.modal", () => {
  inputVerificacion.value = "";
  if (!ojoNormal[0].style.display === "none")
    inputVerificacion.next().click();
});

$("body").on('click', '#enviarVerificacion', () => {
  let input = inputVerificacion[0];
  if (input.value === "") {
    input.setCustomValidity('Por favor escribe una contraseña')
    input.reportValidity()
  }
  else
    funcionEnviar();
});
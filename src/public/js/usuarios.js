$("body").on("click", ".svgeditar", function(){
  window.location = "/empleados/usuarios/editar/" + $(this).closest("tr")[0].cells[0].innerText;
})
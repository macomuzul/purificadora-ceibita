const switchModoSeguro = $("#switchModoSeguro")[0]
const switchOrdenarFilas = $("#switchOrdenarFilas")[0]
const swalConfirmarYCancelar = Swal.mixin({
  customClass: {
    confirmButton: "btn btn-success margenboton",
    cancelButton: "btn btn-danger margenboton",
  },
  buttonsStyling: false,
});

$('#añadirproducto').on('click', () => $("#cuerpotabla").append(`<tr><td contenteditable="true"></td><td contenteditable="true"></td><td><button type="button" class="botoneliminar"><svg class="svgeliminar" xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="red" class="bi bi-trash" viewBox="0 0 16 16"> <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" /> <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" /></svg></button></td></tr>`))

$("body").on('click', ".botoneliminar", async function () {
  if (switchOrdenarFilas.checked) return
  if (!switchModoSeguro.checked)
    return this.closest("tr").remove()
  let html = `<span style="font-size: 30px; font-weight: 500; color: #8b8b8b;">${this.closest("tr").children[0].innerText}</span>`
  let result = await swalConfirmarYCancelar.fire({
    icon: "warning",
    title: "Estás seguro que deseas borrar este producto?",
    html,
    showCancelButton: true,
    confirmButtonText: "Continuar",
    cancelButtonText: "No continuar",
  })
  if (result.isConfirmed)
    this.closest("tr").remove()
})
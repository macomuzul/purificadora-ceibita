String.prototype.normalizar = function () { return this.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '') }

const swalConfirmarYCancelar = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-success margenbotonswal',
    cancelButton: 'btn btn-danger margenbotonswal',
  },
  buttonsStyling: false,
})

function mostrarErrorHTML(html, title) {
  $(html).find('tr *:last-child()').remove()
  $(html).find('td').prop('contenteditable', 'false')
  Swal.fire({
    title,
    icon: 'error',
    width: innerWidth / 2,
    html,
    confirmButtonText: 'Continuar',
  })
}

function validarCamioneros() {
  let nombres = [...$('tbody td:nth-child(1)')]
  let colores = [...$('tbody td:nth-child(2)')]
  if (nombres.length === 0) {
    Swal.fire('Error', 'Error, la tabla está vacía, por favor agrega un camionero', 'error')
    return false
  }
  nombres.forEach(x => (x.textContent = x.innerText.trim()))

  let tablaCopia = $('table')[0].cloneNode(true)
  let camionerosCopia = [...$(tablaCopia).find('tbody td:nth-child(1)')]
  if (nombres.some(x => x.textContent === '')) {
    camionerosCopia.forEach(x => x.textContent === '' && x.classList.add('enfocar'))
    return mostrarErrorHTML(tablaCopia, 'Hay camioneros sin nombre')
  }
  if (colores.some(x => x.textContent === 'indefinido')) {
    $(tablaCopia).find('tbody td:nth-child(2)').each((_, x) => x.textContent === 'indefinido' && x.classList.add('enfocar'))
    return mostrarErrorHTML(tablaCopia, 'Hay colores con el valor de indefinido')
  }

  let arrayNormalizado = nombres.map(x => x.textContent.normalizar())
  let hayRepetidos = false
  arrayNormalizado.forEach((x, i) => {
    if (arrayNormalizado.indexOf(x) !== i) {
      let color = colorAleatorio()
      camionerosCopia.forEach(p => p.textContent.normalizar() === x && (p.style.background = color))
      hayRepetidos = true
    }
  })
  if (hayRepetidos) return mostrarErrorHTML(tablaCopia, 'Hay productos que tienen el mismo nombre')
  return true
}

function colorAleatorio() {
  const threshold = 128
  const color = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`
  const rgb = color.match(/\d+/g).map(Number)
  const brightness = 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]
  if (brightness > threshold) return colorAleatorio()
  return color
}

$('#guardar').on('click', async function () {
  if (!validarCamioneros()) return
  let data = JSON.stringify({ camioneros: [...$('tbody tr')].map(x => ({ nombre: x.cells[0].textContent, color: x.cells[1].textContent })) })
  $.ajax({
    url: location.pathname,
    method: 'POST',
    contentType: 'application/json',
    data,
    success: q => Swal.fire('Éxito', 'Se han guardado exitosamente', 'success'),
    error: r => Swal.fire('Ups...', r.responseText, 'error'),
  })
})

$('body').on('click', '.botoneliminar', async function () {
  if ($('#switchModoSeguro')[0].checked) {
    let html = `<span style="font-size: 30px; font-weight: 500; color: #8b8b8b;">${this.closest('tr').cells[0].innerText}</span>`
    let { isConfirmed } = await swalConfirmarYCancelar.fire({
      title: 'Estás seguro que deseas borrar a este camionero?',
      icon: 'warning',
      width: innerWidth / 2,
      html,
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
    })
    if (isConfirmed) this.closest('tr').remove()
  }
})

$('body').on('input', `[type="color"]`, e => ($(e.currentTarget).parent().prev()[0].textContent = $(e.currentTarget).val()))

$('#añadirproducto').on('click', q => $('tbody').append(`<tr><td contenteditable="true"></td><td>indefinido</td><td><input type="color"></td>
<td><button type="button" class="botoneliminar"><svg class="svgeliminar" width="30" height="30" fill="red" class="bi bi-trash" viewBox="0 0 16 16"> <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" /> <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" /></svg></button></td>
</tr>`))

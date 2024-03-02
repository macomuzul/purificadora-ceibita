let tabla = $('table')[0]
let nombreplantilla = $('#nombreplantilla')

const swalConfirmarYCancelar = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-success margenboton',
    cancelButton: 'btn btn-danger margenboton',
  },
  buttonsStyling: false,
})

$('#añadirproducto').on('click', q => $('tbody').append(`<tr><td contenteditable="true"></td><td contenteditable="true"></td><td><button type="button" class="botoneliminar"><svg class="svgeliminar" width="30" height="30" fill="red" class="bi bi-trash" viewBox="0 0 16 16"> <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" /> <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" /></svg></button></td></tr>`))

async function validarPlantillas() {
  nombreplantilla.val((_, val) => val.trim())
  $('tbody td:nth-child(1)').each((_, x) => (x.textContent = x.innerText.trim()))
  $('tbody td:nth-child(2)').each((_, x) => {
    let precio = x.innerText
    if (precio === '.') x.textContent = ''
    let p = parseFloat(precio)
    if (!isNaN(p)) x.textContent = p.normalizarPrecio()
  })

  let productos = [...$('tbody td:nth-child(1)')]
  let precios = [...$('tbody td:nth-child(2)')]
  let tablaCopia = tabla.cloneNode(true)
  let productosCopia = [...$(tablaCopia).find('tbody tr td:nth-child(1)')]
  let preciosCopia = [...$(tablaCopia).find('tbody tr td:nth-child(2)')]

  if (nombreplantilla.val() === '') return mostrarError('El nombre de la plantilla está vacío')
  if (productos.length < 1) return mostrarError('No hay productos qué guardar')
  if (productos.some(x => x.textContent === '')) {
    productosCopia.forEach(x => x.textContent === '' && x.classList.add('enfocar'))
    return mostrarErrorHTML(tablaCopia, 'Hay productos sin nombre en la tabla')
  }
  if (precios.some(x => x.innerText === '')) {
    preciosCopia.forEach(x => x.textContent === '' && x.classList.add('enfocar'))
    return mostrarErrorHTML(tablaCopia, 'Hay precios vacíos')
  }
  if (precios.some(x => x.innerText === '0')) {
    preciosCopia.forEach(x => x.textContent === '0' && x.classList.add('enfocar'))
    return mostrarErrorHTML(tablaCopia, 'Hay precios con valor igual a 0')
  }

  let arrayNormalizado = productos.map(x => x.textContent.normalizar())
  let hayRepetidos = false
  arrayNormalizado.forEach((x, i) => {
    if (arrayNormalizado.indexOf(x) !== i) {
      let color = colorAleatorio()
      productosCopia.forEach(p => p.textContent.normalizar() === x && (p.style.background = color))
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
String.prototype.normalizar = function () { return this.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '') }
String.prototype.normalizarPrecio = function () { return parseFloat(this).toFixed(2).replace(/[.,]00$/, '') }
Number.prototype.normalizarPrecio = function () { return this.toFixed(2).replace(/[.,]00$/, '') }

function mostrarError(error, title = 'Error') {
  Swal.fire(title, error, 'error')
  return false
}

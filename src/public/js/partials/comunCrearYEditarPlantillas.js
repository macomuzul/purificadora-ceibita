let tabla = qs('table')
let tbody = qs('tbody')
let nombreplantilla = qs('#nombreplantilla')

qsclick('#añadirproducto', q => tbody.innerHTML += `<tr><td contenteditable="true"></td><td contenteditable="true"></td><td><button class="botoneliminar"><svg-eliminar></svg-eliminar></button></td></tr>`)

async function validarPlantillas() {
  nombreplantilla.value = nombreplantilla.value.trim()
  tbody.qsafor('td:nth-child(1)', x => x.textContent = x.innerText.trim())
  tbody.qsafor('td:nth-child(2)', x => {
    let precio = x.innerText
    if (precio === '.') x.textContent = ''
    let p = precio.aFloat()
    if (!isNaN(p)) x.textContent = p.normalizarPrecio()
  })

  let productos = qsarr('tbody td:nth-child(1)')
  let precios = qsarr('tbody td:nth-child(2)')
  let tablaCopia = tabla.clonar()
  let productosCopia = tablaCopia.qsarr('tbody tr td:nth-child(1)')
  let preciosCopia = tablaCopia.qsarr('tbody tr td:nth-child(2)')

  if (nombreplantilla.value === '') return mostrarError('El nombre de la plantilla está vacío')
  if (productos.length < 1) return mostrarError('No hay productos qué guardar')
  if (productos.some(x => x.textContent === '')) {
    productosCopia.forEach(x => x.textContent === '' && x.añadirClase('enfocar'))
    return mostrarErrorHTML(tablaCopia, 'Hay productos sin nombre en la tabla')
  }
  if (precios.some(x => x.innerText === '')) {
    preciosCopia.forEach(x => x.textContent === '' && x.añadirClase('enfocar'))
    return mostrarErrorHTML(tablaCopia, 'Hay precios vacíos')
  }
  if (precios.some(x => x.innerText === '0')) {
    preciosCopia.forEach(x => x.textContent === '0' && x.añadirClase('enfocar'))
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
  html.qsafor('td:last-child', x => x.remove())
  html.qsafor('td', x => x.contentEditable = false)
  Swal.fire({
    title,
    icon: 'error',
    width: innerWidth / 2,
    html,
    confirmButtonText: 'Continuar',
  })
}

function mostrarError(error, title = 'Error') {
  Swal.fire(title, error, 'error')
  return false
}

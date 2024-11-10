String.prototype.normalizar = function () { return this.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '') }
let tbody = qs('tbody')

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

function validarCamioneros() {
  let nombres = tbody.qsarr('td:nth-child(1)')
  let colores = tbody.qsarr('td:nth-child(2)')
  if (nombres.length === 0) {
    swalError('Error, la tabla está vacía, por favor agrega un camionero')
    return false
  }
  nombres.forEach(x => x.textContent = x.innerText.trim())

  let tablaCopia = qs('table').clonar()
  let camionerosCopia = tablaCopia.qsarr('tbody td:nth-child(1)')
  if (nombres.some(x => x.textContent === '')) {
    camionerosCopia.forEach(x => x.textContent === '' && x.añadirClase('enfocar'))
    return mostrarErrorHTML(tablaCopia, 'Hay camioneros sin nombre')
  }
  if (colores.some(x => x.textContent === 'indefinido')) {
    tablaCopia.qsafor('tbody td:nth-child(2)', x => x.textContent === 'indefinido' && x.añadirClase('enfocar'))
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
  let limite = 128
  let numAleatorio = q => Math.floor(Math.random() * 256)
  let color = `rgb(${numAleatorio()}, ${numAleatorio()}, ${numAleatorio()})`
  let rgb = color.match(/\d+/g).map(Number)
  let brillo = 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]
  if (brillo > limite) return colorAleatorio()
  return color
}

qsclick('#guardar', async q => {
  if (!validarCamioneros()) return
  hazPost('', JSON.stringify({ camioneros: [...tbody.rows].map(x => ({ nombre: x.cells[0].textContent, color: x.cells[1].textContent })) }), q => swalExito('Se han guardado exitosamente'))
})

bodyOnClick('.botoneliminar', async c => {
  if (qs('#switchModoSeguro').checked && await swalSíNo('Estás seguro que deseas borrar a este camionero?', `<span style="font-size: 30px; font-weight: 500; color: #8b8b8b;">${c.closest('tr').cells[0].innerText}</span>`, innerWidth / 2)) c.closest('tr').remove()
})

bodyOn('input', '[type="color"]', c => c.padre().ant().textContent = c.value)

qsclick('#añadircamionero', q => tbody.añadirHTML(`<tr><td contenteditable="true"></td><td>#000000</td><td><input type="color" value="#000000"></td><td><button class="botoneliminar"><svg-eliminar></svg-eliminar></button></td></tr>`))
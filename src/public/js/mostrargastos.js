let decodificado = he.decode(datosString), datos = JSON.parse(decodificado)
let esTouch = () => 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0
let svgCalcu = `<svg fill="#FFF" width="20px" height="20px" viewBox="0 0 79.518 79.518" class="svgcalcu"><g><g><path d="M72.799,1.569L72.799,1.569C72.799,1.569,72.573,1.569,72.799,1.569C72.127,0.448,71.006,0,69.887,0l0,0H9.631l0,0    C7.614,0,6.047,1.569,6.047,3.584l0,0v3.137v11.647v6.496v11.648v6.494v11.648v6.496v11.646v3.137l0,0    c0,0.672,0.224,1.344,0.672,2.018l0,0l0,0c0.672,0.896,1.792,1.566,2.912,1.566l0,0h60.256l0,0c2.016,0,3.584-1.566,3.584-3.584    l0,0v-3.137V61.152v-6.495v-11.65v-6.494V24.865v-6.496V6.721V3.584l0,0C73.245,2.689,73.023,2.24,72.799,1.569z M28.895,68.32    c0,0.896-0.672,1.568-1.567,1.568h-8.287c-0.896,0-1.568-0.673-1.568-1.568v-3.584c0-0.896,0.672-1.567,1.568-1.567h8.287    c0.896,0,1.567,0.672,1.567,1.567V68.32z M28.895,56.225c0,0.896-0.672,1.567-1.567,1.567h-8.287    c-0.896,0-1.568-0.672-1.568-1.567v-3.584c0-0.896,0.672-1.567,1.568-1.567h8.287c0.896,0,1.567,0.672,1.567,1.567V56.225z     M28.895,44.354c0,0.896-0.672,1.565-1.567,1.565h-8.287c-0.896,0-1.568-0.672-1.568-1.565V40.77c0-0.896,0.672-1.568,1.568-1.568    h8.287c0.896,0,1.567,0.672,1.567,1.568V44.354z M45.245,68.32c0,0.896-0.672,1.568-1.565,1.568h-8.289    c-0.896,0-1.568-0.673-1.568-1.568v-3.584c0-0.896,0.673-1.567,1.568-1.567h8.289c0.896,0,1.565,0.672,1.565,1.567V68.32z     M45.245,56.225c0,0.896-0.672,1.567-1.565,1.567h-8.289c-0.896,0-1.568-0.672-1.568-1.567v-3.584    c0-0.896,0.673-1.567,1.568-1.567h8.289c0.896,0,1.565,0.672,1.565,1.567V56.225z M45.245,44.354c0,0.896-0.672,1.565-1.565,1.565    h-8.289c-0.896,0-1.568-0.672-1.568-1.565V40.77c0-0.896,0.673-1.568,1.568-1.568h8.289c0.896,0,1.565,0.672,1.565,1.568V44.354z     M61.822,68.32c0,0.896-0.672,1.568-1.567,1.568h-8.286c-0.896,0-1.568-0.673-1.568-1.568v-3.584c0-0.896,0.672-1.567,1.568-1.567    h8.286c0.896,0,1.567,0.672,1.567,1.567V68.32z M61.822,56.225c0,0.896-0.672,1.567-1.567,1.567h-8.286    c-0.896,0-1.568-0.672-1.568-1.567v-3.584c0-0.896,0.672-1.567,1.568-1.567h8.286c0.896,0,1.567,0.672,1.567,1.567V56.225z     M61.822,44.354c0,0.896-0.672,1.565-1.567,1.565h-8.286c-0.896,0-1.568-0.672-1.568-1.565V40.77c0-0.896,0.672-1.568,1.568-1.568    h8.286c0.896,0,1.567,0.672,1.567,1.568V44.354z M62.493,31.809L62.493,31.809c0,0.896-0.673,1.566-1.567,1.566H18.143    c-0.896,0-1.567-0.672-1.567-1.566V10.977c0-0.896,0.672-1.568,1.567-1.568h42.783c0.896,0,1.567,0.672,1.567,1.568V31.809z"/><path d="M28.447,19.712c-1.566-0.672-2.238-0.896-2.238-1.567c0-0.448,0.446-0.896,1.566-0.896c1.345,0,2.018,0.448,2.464,0.672    l0.448-2.016c-0.672-0.224-1.344-0.448-2.464-0.672v-1.568h-1.792v1.792c-1.792,0.448-2.912,1.568-2.912,3.136    c0,1.793,1.344,2.688,3.136,3.137c1.346,0.448,1.792,0.896,1.792,1.567s-0.672,1.121-1.792,1.121    c-1.119,0-2.238-0.448-2.911-0.672l-0.447,2.017c0.672,0.446,1.792,0.672,2.912,0.672v1.792h1.792v-2.018    c2.016-0.446,3.136-1.791,3.136-3.358C31.359,21.504,30.463,20.385,28.447,19.712z"/><path d="M40.543,19.712c-1.568-0.672-2.24-0.896-2.24-1.567c0-0.448,0.448-0.896,1.567-0.896c1.345,0,2.017,0.448,2.464,0.672    l0.448-2.016c-0.673-0.224-1.345-0.448-2.464-0.672v-1.568h-1.792v1.792c-1.792,0.448-2.912,1.568-2.912,3.136    c0,1.793,1.346,2.688,3.138,3.137c1.344,0.448,1.792,0.896,1.792,1.567s-0.673,1.121-1.792,1.121c-1.12,0-2.24-0.448-2.912-0.672    l-0.448,2.017c0.672,0.446,1.792,0.672,2.912,0.672v1.792h1.792v-2.018c2.016-0.446,3.137-1.791,3.137-3.358    C43.68,21.504,42.782,20.385,40.543,19.712z"/><path d="M52.863,19.712c-1.566-0.672-2.238-0.896-2.238-1.567c0-0.448,0.445-0.896,1.566-0.896c1.345,0,2.018,0.448,2.463,0.672    l0.449-2.016c-0.672-0.224-1.346-0.448-2.465-0.672v-1.568h-1.791v1.792c-1.793,0.448-2.912,1.568-2.912,3.136    c0,1.793,1.344,2.688,3.135,3.137c1.346,0.448,1.793,0.896,1.793,1.567s-0.672,1.121-1.793,1.121    c-1.118,0-2.239-0.448-2.911-0.672l-0.447,2.016c0.672,0.446,1.791,0.672,2.911,0.672v1.792h1.791v-2.018    c2.018-0.446,3.139-1.791,3.139-3.358C55.775,21.504,54.879,20.385,52.863,19.712z"/></g></g></svg>`
String.prototype.aFloat = function () { return parseFloat(this) }
String.prototype.aInt = function () { return parseInt(this) }
String.prototype.normalizar = function () { return this.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '') }
String.prototype.normalizarPrecio = function () { return this.aFloat().toFixed(2).replace(/[.,]00$/, '') }
Number.prototype.normalizarPrecio = function () { return this.toFixed(2).replace(/[.,]00$/, '') }

String.prototype.aQuetzales = function () { return new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'GTQ' }).format(this.aFloat()) }
String.prototype.cantidadFormateada = function () { return new Intl.NumberFormat('es-GT').format(this.aFloat()) }
let cerrarSwal = q => Swal.close()

let switchGastosFijosExcel = -1
let switchGastosMixtosExcel = -1
let switchGastosPorProductoExcel = -1
let switchGastosFijosPDF = -1
let switchGastosMixtosPDF = -1
let switchGastosPorProductoPDF = -1

onload = async q => {
  if (esTouch()) await $.getScript('/touch.js')
  let alargar = x => {
    if (x === '<-') return 'alargarancho'
    if (x === '=') return 'alargaralto'
    return ''
  }
  $('main').append(`<div class="calculadora" style="display: none;">
  <div class="movercalcu">
  <div class="divcerrarcalcu"><div class="cerrarcalcu">❌</div></div>
  <div class="pantallacalcu"></div>
  </div>
  <div class="botonescalcu">${grid.map((x, i) => `${x.map((x, j) => `<button class="botoncalcu ${alargar(x)}">${x}</button>`).join('')}`).join('')}</div>
  </div>`)

  $('.calculadora').draggable(esTouch() ? { handle: '.movercalcu' } : {})

  $(document).on('click', '.botoncalcu', e => {
    let eventos = {
      C: q => '',
      '<-': q => $('.pantallacalcu').text().slice(0, -1),
      '=': q => { try { return eval($('.pantallacalcu').text()) } catch { return 'Operación no válida' } },
    }
    let tecla = e.currentTarget.textContent
    let texto = eventos[tecla]?.() ?? $('.pantallacalcu').text() + tecla
    $('.pantallacalcu').text(texto)
  })
}

$('#gastosfijos')[0].inicializar(datos.fijos, 'Tabla de gastos fijos', 'tablagastosfijos', false)
$('#gastosmixtos')[0].inicializar(datos.mixtos, 'Tabla de gastos mixtos', 'tablagastosmixtos', false)
$('#gastosporproducto')[0].inicializar(datos.productos, 'Tabla de gastos por compra de productos', 'tablagastosproductos', true)

let url = '/gastos/'
let [_, fechaUrl] = location.pathname.split(url)
let inicioMes = moment(fechaUrl, 'DD-MM-YYYY').format('DD-MM-YYYY')
let finMes = moment(fechaUrl, 'DD-MM-YYYY').endOf('month').format('DD-MM-YYYY')
let esMesActual = moment().isSame(moment(fechaUrl, 'DD-MM-YYYY'), 'month')

let convierteDatePicker = datepickers => datepickers.datepicker({ weekStart: 1, language: 'es', autoclose: true, todayHighlight: true, format: 'dd/mm/yyyy', maxViewMode: 0, startDate: inicioMes, endDate: finMes })
convierteDatePicker($(`.divdatepicker`))
// $('#registrargastos').on('click', e => {
//   let fecha = $('#calendario').val().replaceAll('/', '-')
//   if (fecha === '') return Swal.fire('Campo de fecha vacío', 'Por favor selecciona una fecha para continuar', 'error')
//   location = `/gastos/${fecha}`
// })

const grid = [
  [7, 8, 9, '<-'],
  [4, 5, 6, '*', '/'],
  [1, 2, 3, '-', '='],
  ['C', 0, '.', '+'],
]

$('#mostrarcalculadora').on('click', e => {
  if ($('.calculadora').is(':visible')) esconderCalculadora()
  else {
    $('.calculadora').show()
    $('#mostrarcalculadora').html(svgCalcu + ' Esconder calculadora')
  }
})

$(document).on('click', '.cerrarcalcu', esconderCalculadora)

function esconderCalculadora() {
  $('.calculadora').hide()
  $('#mostrarcalculadora').html(svgCalcu + ' Mostrar calculadora')
}

$('#mesanterior').on('click', e => (location = url + moment(fechaUrl, 'DD-MM-YYYY').subtract(1, 'month').format('DD-MM-YYYY')))
$('#messiguiente').on('click', e => (location = url + moment(fechaUrl, 'DD-MM-YYYY').add(1, 'month').format('DD-MM-YYYY')))

let estilosSwal = (confirmButton, cancelButton = '') => Swal.mixin({ customClass: { confirmButton, cancelButton }, buttonsStyling: false })
let swalConfirmarYCancelar = estilosSwal('btn btn-success margenbotonswal', 'btn btn-danger margenbotonswal')
async function swalSíNo(title, html, width = (innerWidth * 3) / 4) {
  let { isConfirmed } = await swalConfirmarYCancelar.fire({
    title, icon: 'warning', width, html,
    showCancelButton: true,
    confirmButtonText: 'Sí',
    cancelButtonText: 'No',
  })
  return isConfirmed
}

let getCaretPosition = q => (getSelection().rangeCount ? getSelection().getRangeAt(0).endOffset : 0)

$('body').on('keydown', 'td', function (e) {
  let cellindex = $(this).index()
  let k = e.which
  let { atStart, atEnd } = k == 37 || k == 39 ? getSelectionTextInfo(this) : {}
  //flecha izquierda
  if (k == 37 && atStart)
    enfocarCelda($(this).prev(), e)
  //flecha derecha
  else if ((k == 39 && atEnd) || k === 13)
    enfocarCelda($(this).next(), e)
  //flecha arriba
  else if (k == 38)
    $(this).parent().index() === 0 ? enfocarCelda($(this).closest('tbody').find('tr').last().find('td').eq(cellindex - 1), e) : enfocarCelda($(this).closest('tr').prev().find('td').eq(cellindex), e)
  //enter y flecha abajo
  else if (k == 40)
    $(this).closest('tr')[0].rowIndex < $(this).closest('tbody')[0].rows.length ? enfocarCelda($(this).closest('tr').next().find('td').eq(cellindex), e) : enfocarCelda($(this).closest('tbody').find('tr').first().find('td').eq(cellindex + 1), e)
})

let mostrarOffscreen = x => {
  let rect = x.getBoundingClientRect()
  if (rect.x + rect.width > innerWidth || rect.y + rect.height > innerHeight) x.scrollIntoView()
}

function enfocarCelda([x], e) {
  e.preventDefault()
  if (x !== undefined) {
    if (x.contentEditable === 'true') {
      $(x).trigger('focus')
      irAlFinalDelTexto(x)
      mostrarOffscreen(x)
    } else if ($(x).find('input').length > 0) $(x).find('input').focus()
  }
}

$('body').on('keyup', '.tablagastosproductos td', function (e) {
  let k = e.which
  if (this.cellIndex === 2 || this.cellIndex === 3) {
    let celdaGasto = $(this).closest('tr').find('td:nth-child(5)')
    let resultado = parseFloat(celdaGasto.prev().text()) * parseFloat(celdaGasto.prev().prev().text())
    celdaGasto.text(!isNaN(resultado) ? resultado : '')
  }
})
function irAlFinalDelTexto(elem) {
  let range = document.createRange()
  let sel = getSelection()
  if (elem.innerText == '') return
  range.setStart(elem.childNodes[0], elem.innerText.length)
  range.collapse(false)

  sel.removeAllRanges()
  sel.addRange(range)
}

$('body').on('beforeinput', 'td', function (e) {
  let letra = event.data ?? ''
  let colindex = $(this).index()
  let texto = this.innerText
  let permiteDecimales = $(this).is(':nth-child(3)')
  let esUltimaCelda = $(this).is(':nth-last-child(1)')
  if (letra === '"' || letra == '\\' || letra == "'") e.preventDefault()
  if (isNaN(letra) && colindex != 0 && !permiteDecimales && !esUltimaCelda) e.preventDefault()
  if (colindex !== 0 && letra === ' ' && !esUltimaCelda) e.preventDefault()

  if (permiteDecimales) {
    let [, decimales] = texto.split('.')
    if (isNaN(letra) && letra !== '.') e.preventDefault()
    let dotPos = texto.indexOf('.')
    if (dotPos > -1 && letra === '.') e.preventDefault()
    if (getCaretPosition() > dotPos && decimales?.length >= 2 && letra != '') e.preventDefault()
  }

  if (texto === '0') this.innerText = ''
})

function getSelectionTextInfo(x) {
  let atStart = false, atEnd = false
  let selRange, testRange
  let sel = getSelection()
  if (sel.rangeCount) {
    selRange = sel.getRangeAt(0)
    testRange = selRange.cloneRange()

    testRange.selectNodeContents(x)
    testRange.setEnd(selRange.startContainer, selRange.startOffset)
    atStart = testRange.toString() == ''

    testRange.selectNodeContents(x)
    testRange.setStart(selRange.endContainer, selRange.endOffset)
    atEnd = testRange.toString() == ''
  }
  return { atStart, atEnd }
}

let mostrarError = async (e, titulo = 'Error') => (await Swal.fire(titulo, e, 'error'), false)
$('#guardarcambios').on('click', async e => {
  esValido = false
  let v = await validarDatos()
  if (!v) return
  let data = { ultimocambio: Date.now() }
  $('tabla-gastos').each((_, x) => (data[x.id.replace('tablagastos', '')] = [...$(x).find('tbody tr')].map(y => [...$(y).find('td')].map((z, i) => (i !== 1 ? z.textContent : $(z).find('input').val())))))
  data = JSON.stringify(data)
  $.ajax({
    url: location.pathname,
    method: 'POST',
    contentType: 'application/json',
    data,
    success: async q => await Swal.fire('ÉXITO', 'Se ha guardado el registro de los gastos exitosamente', 'success'),
    error: r => mostrarError(r.responseText),
  })
})

let borrarEnfocarFilas = tabla => $(tabla).find('.cuerpo td').removeClass('enfocar')
let esValido = false

async function validarDatos() {
  let valido = []
  let tablaGastos = $('tabla-gastos')
  await Promise.all([...tablaGastos].filter(x => $(x).find('table')[0]).map(async x => {
    let tabla = $(x).find('.divtablagastos')[0]
    let tablaCopia = tabla.cloneNode(true)
    let hayDatosVacios = false
    $(tablaCopia).find('tbody tr').each(async (_, fila) => {
      [...fila.cells].forEach((x, i) => {
        if (((i === 1 && $(x).find('input').val() === '') || (i !== 1 && x.textContent === '')) && !$(x).is(':last-child')) {
          hayDatosVacios = true
          $(x).closest('tr').addClass('enfocar')
        }
      })
    })

    if (!hayDatosVacios) {
      valido.push(true)
      return true
    }
    valido.push(false)
    let { isConfirmed } = await swalConfirmarYCancelar.fire({
      title: `<h3>Faltan datos en la ${tabla.closest('tabla-gastos').titulo.toLowerCase()}. Por favor llena la tabla antes de continuar</h3>`,
      icon: 'error',
      width: (innerWidth * 3) / 4,
      html: tablaCopia,
      showCancelButton: true,
      stopKeydownPropagation: false,
      confirmButtonText: 'Ya lo arreglé',
      cancelButtonText: 'Volver',
      didOpen: () => convierteDatePicker($(tablaCopia).find(`.divdatepicker`))
    })

    if (!isConfirmed) return false
    borrarEnfocarFilas(tablaCopia)
    let filasCopia = $(tablaCopia).find('tbody tr')
    $(tabla).find('tbody tr').each((i, fila) => {
      let filaCopia = filasCopia[i]
        ;[...fila.cells].forEach((x, j) => {
          let celdaCopia = filaCopia.cells[j]
          j === 1 ? ($(x).find('input').val($(celdaCopia).find('input').val())) : (x.textContent = celdaCopia.textContent)
        })
    })

    return await validarDatos()
  }))

  if (esValido) return true
  if (valido.every(x => x)) {
    esValido = true
    return true
  }
  return false
}

let convertirDatepickerATexto = tablaClon => $(tablaClon).find('input').each((i, x) => $(x).closest('td').text(x.value))

let botonpdf = $('boton-pdf')[0]
botonpdf.inicializar(() => {
  let tablas = $('table')
  if (tablas.length === 0) {
    mostrarError('No hay ninguna tabla para exportar')
    setTimeout(() => botonpdf.innerHTML = botonpdf.htmlOriginal, 2000)
    return
  }
  let opciones = $('.opcioncheckboxpdf input')
  return [...tablas].map((x, i) => {
    if (!opciones[i].checked) return ``
    let tablaClon = x.cloneNode(true)
    convertirDatepickerATexto(tablaClon)
    let { tituloHoja, esGastoPorProducto } = x.closest('tabla-gastos')
    return `<div class="tituloresumen" style="margin-left: ${x.offsetWidth / 2 + (esGastoPorProducto ? -80 : 0)}px; width: ${esGastoPorProducto ? 300 : 180}px;">${tituloHoja}</div><div class="divtablagastos" style="margin-left: ${x.offsetWidth / 2 + 55}px">${tablaClon.outerHTML}</div><br><br>`
  }).join('')
}, `Gastos del mes ${fechastr}`, 0.45, 20)

$('boton-excel')[0].inicializar(function () {
  let tablas = $('table')
  if (tablas.length === 0) return mostrarError('No hay ninguna tabla para exportar')

  let nombre = `Resumen de gastos del mes ${fechastr}.xlsx`
  let workbook = XLSX.utils.book_new()
  let opciones = $('.opcioncheckboxexcel input')

  tablas.each((i, x) => {
    if (!opciones[i].checked) return ``

    let tablaClon = x.cloneNode(true)
    convertirDatepickerATexto(tablaClon)
    $(tablaClon).find('td').each((_, x) => {
      if(x.textContent === '') x.textContent = '\u00A0'
    })
    let { tituloHoja, esGastoPorProducto } = x.closest('tabla-gastos')

    let ws = XLSX.utils.table_to_sheet(tablaClon, { raw: true, defval: 'hola' })
    let range = XLSX.utils.decode_range(ws['!ref'])
    ws['!cols'] = [{ width: 40 }, ...[...Array(esGastoPorProducto ? 4 : 2)].map(x => ({ width: 15 })), { width: 40 }]
    ws['!rows'] = [{ hpt: 35 }, ...[...Array(range.e.r - range.s.r)].map(x => ({ hpt: 24 }))]
    for (let i = range.s.r; i <= range.e.r; i++) {
      for (let j = range.s.c; j <= range.e.c; j++) {
        let cell_address = XLSX.utils.encode_cell({ r: i, c: j })
        let cell = ws[cell_address]
        if (cell) {
          this.ajustesCeldasExcel(cell)
          cell.s.fill = { fgColor: { rgb: i === 0 ? '192435' : '0f0d35' } }
        }
      }
    }
    XLSX.utils.book_append_sheet(workbook, ws, tituloHoja)
  })
  XLSX.writeFile(workbook, nombre)
})


function calculargastos(cuerpo) {
  let sumaGastos = 0, hayUnNumero = false
  $(cuerpo).find('td:nth-last-child(1)').each((_, x) => {
    let texto = x.innerText.aFloat()
    if (!isNaN(texto)) {
      hayUnNumero = true
      sumaGastos += texto
    }
  })

  if (!isNaN(sumaGastos)) $(cuerpo).parent().find('tfoot td')[1].innerText = sumaGastos === 0 && !hayUnNumero ? '0' : sumaGastos.normalizarPrecio()
  return sumaGastos
}

let formatearCeldas = ({ cells: [, gasto] }) => gasto.innerText = gasto.innerText.aQuetzales()

$('#resumengastos').on('click', async e => {
  let listaTablasValores = [...$('table')].map(tabla => {
    let productos = [...tabla.querySelectorAll('tbody td:first-child')]
    let gastos = [...tabla.querySelectorAll('tbody td:nth-last-child(2)')]
    return productos.map((_, i) => ({ producto: productos[i].innerText.normalizar(), gastos: gastos[i].innerText.aFloat() || 0, productoDesnormalizado: productos[i].innerText }))
  })

  let p = listaTablasValores.reduce((acc, table) => {
    table.forEach(fila => acc[fila.producto] ? acc[fila.producto].gastos += fila.gastos : acc[fila.producto] = { gastos: fila.gastos, productoDesnormalizado: fila.productoDesnormalizado })
    return acc
  }, {})

  Object.keys(p).forEach(x => (p[x].gastos = p[x].gastos.normalizarPrecio()))

  let html = `<table id="tablaresumen" class="mx-auto"><thead><tr>
    <th class="thresumengasto">Concepto de gasto</th>
    <th class="thresumencosto">Gasto total</th>
  </tr></thead><tbody class="cuerpo">
  ${Object.keys(p).map(key => `<tr><td>${p[key].productoDesnormalizado}</td><td>${p[key].gastos || 0}</td></tr>`).join('')}
  </tbody><tfoot><tr><td style="text-align: center">Total:</td><td class="totalresumen"></td></tr></tfoot></table>
  <div class="gastopordia">${`Gasto por día${esMesActual ? ` en lo que va del mes` : ``}: <span class="cambiarfecha"></span>`}</div>
  <div class="contenedorflex">
    <button class="btn btn-primary margenbotonswal btncontinuar2" onclick="cerrarSwal()">Continuar</button>
    <boton-pdf id="exportarAPDFResumen"></boton-pdf>
    <boton-excel id="exportarAExcelResumen"></boton-excel>
  </div>`


  await swal.fire({
    title: 'Resumen de lo que gastaste durante el mes ' + fechastr,
    width: innerWidth * 0.6,
    html,
    showConfirmButton: false,
    didOpen: () => {
      let cuerpo = $('#tablaresumen tbody')[0]
      let sumaGastos = calculargastos(cuerpo)
      $(cuerpo.rows).each((_, x) => formatearCeldas(x))
      formatearCeldas($('#tablaresumen tfoot tr')[0])
      let dividir = esMesActual ? moment().format('D') : moment(fechaUrl, 'DD-MM-YYYY').endOf('month').format('D') ?? 0
      $('.cambiarfecha').text((sumaGastos / dividir).normalizarPrecio().aQuetzales())

      $('#exportarAPDFResumen')[0].inicializar(() => {
        let tabla = $('#tablaresumen')[0]
        let tablaClon = tabla.cloneNode(true)
        tablaClon.id = 'tablaresumenclon'
        return `<div class="tituloresumen" style="margin-left: ${tabla.clientWidth / 2 - 200}px; width: 380px">Resumen  &nbsp;de gastos ${fechastr}</div>${tablaClon.outerHTML}<br><br>`
      }, `Resumen de gastos ${fechastr}`)

      $('#exportarAExcelResumen')[0].inicializar(function () {
        let nombre = `Resumen de ventas ${fechastr}.xlsx`
        let workbook = XLSX.utils.book_new()
        let ws = XLSX.utils.table_to_sheet($('#tablaresumen')[0], { raw: true })
        let range = XLSX.utils.decode_range(ws['!ref'])
        ws['!cols'] = [{ width: 30 }, { width: 18 }]
        ws['!rows'] = [{ hpt: 35 }, ...[...Array(range.e.r - range.s.r)].map(x => ({ hpt: 24 }))]
        for (let i = range.s.r; i <= range.e.r; i++) {
          for (let j = range.s.c; j <= range.e.c; j++) {
            let cell_address = XLSX.utils.encode_cell({ r: i, c: j })
            let cell = ws[cell_address]
            if (cell) {
              this.ajustesCeldasExcel(cell)
              cell.s.fill = { fgColor: { rgb: i === 0 ? '192435' : '0f0d35' } }
            }
          }
        }
        XLSX.utils.book_append_sheet(workbook, ws, `Gastos ${fechastr}`)
        XLSX.writeFile(workbook, nombre)
      })
    },
  })
})


$('body').on('click', '.guardarconfig', async q => {
  switchGastosFijosExcel = $('#switchGastosFijosExcel')[0].checked
  switchGastosMixtosExcel = $('#switchGastosMixtosExcel')[0].checked
  switchGastosPorProductoExcel = $('#switchGastosPorProductoExcel')[0].checked
  switchGastosFijosPDF = $('#switchGastosFijosPDF')[0].checked
  switchGastosMixtosPDF = $('#switchGastosMixtosPDF')[0].checked
  switchGastosPorProductoPDF = $('#switchGastosPorProductoPDF')[0].checked
})

function reseteaValoresConfig() {
  $('#switchGastosFijosExcel')[0].checked = switchGastosFijosExcel
  $('#switchGastosMixtosExcel')[0].checked = switchGastosMixtosExcel
  $('#switchGastosPorProductoExcel')[0].checked = switchGastosPorProductoExcel
  $('#switchGastosFijosPDF')[0].checked = switchGastosFijosPDF
  $('#switchGastosMixtosPDF')[0].checked = switchGastosMixtosPDF
  $('#switchGastosPorProductoPDF')[0].checked = switchGastosPorProductoPDF
}

$('#configs')[0].addEventListener('hidden.bs.modal', reseteaValoresConfig)



$('body').on('click', '#tablaresumen th', function () {
  let tabla = this.closest('table')
  let esResumen = tabla.id === 'tablaresumen'
  if (!esResumen) $('.restaurarplantilla').css('display', 'initial')
  let cuerpo = tabla.querySelector('.cuerpo')
  let flecha = getComputedStyle(this, ':after').content
  let order = flecha === '"↓"' ? 'asc' : 'desc'
  let separador = '-----'
  let objValores = {}
  let listaIdentifObjValores = []
  let listaReordenarPlantillasHelper = []
  let indiceColumna = this.cellIndex
  let nombreColumna = this.innerText

  if (nombreColumna === 'Vendidos') indiceColumna = cuerpo.rows[0].cells.length - 2
  else if (nombreColumna === 'Ingresos') indiceColumna = cuerpo.rows[0].cells.length - 1
  else if (nombreColumna === 'Sale' || nombreColumna === 'Entra') indiceColumna += colsinicio
  cuerpo.querySelectorAll('tr').forEach((fila, indice) => {
    listaReordenarPlantillasHelper.push(fila.cells[0].innerText.normalizar())
    let textoCelda = fila.cells[indiceColumna].innerText.toUpperCase()
    if (esResumen && nombreColumna !== 'Productos') textoCelda = textoCelda.replace(/[^0-9.]/g, '')
    objValores[textoCelda + separador + indice] = fila.outerHTML.replace(/(\t)|(\n)/g, '')
    listaIdentifObjValores.push(textoCelda + separador + indice)
  })

  if (!esResumen && !objReordenarPlantillas[tabla.closest('.tabs__content').dataset.tabid]) objReordenarPlantillas[tabla.closest('.tabs__content').dataset.tabid] = listaReordenarPlantillasHelper

  let listaElementosColumna = [...cuerpo.querySelectorAll(`td:nth-child(${indiceColumna + 1})`)]
  let todosSonNumeros = esResumen && nombreColumna !== 'Productos' ? true : listaElementosColumna.every(x => !isNaN(x.innerText.aFloat()))

  if (todosSonNumeros) {
    listaIdentifObjValores.sort((a, b) => {
      let aa = a.split(separador)
      let bb = b.split(separador)
      return aa[0] != bb[0] ? aa[0] - bb[0] : cuerpo.rows[aa[1].aInt()].cells[0].innerText.localeCompare(cuerpo.rows[bb[1].aInt()].cells[0].innerText)
    })
  } else listaIdentifObjValores.sort()

  if (order === 'desc') listaIdentifObjValores.reverse()
  this.style.setProperty('--flecha', order === 'desc' ? '"↓"' : '"↑"')

  tabla.querySelector('.activo')?.classList.remove('activo')
  this.classList.add('activo')
  cuerpo.innerHTML = listaIdentifObjValores.map(key => objValores[key]).join('')
})

let decodificarStr = s => s.replaceAll('&#34;', '"')
let decodificado = decodificarStr(datosString), datos = JSON.parse(decodificado)
let mb = qs('modal-body')

let svgCalcu = `<svg fill="#FFF" width="20px" height="20px" viewBox="0 0 79.518 79.518" class="svgcalcu"><g><g><path d="M72.799,1.569L72.799,1.569C72.799,1.569,72.573,1.569,72.799,1.569C72.127,0.448,71.006,0,69.887,0l0,0H9.631l0,0    C7.614,0,6.047,1.569,6.047,3.584l0,0v3.137v11.647v6.496v11.648v6.494v11.648v6.496v11.646v3.137l0,0    c0,0.672,0.224,1.344,0.672,2.018l0,0l0,0c0.672,0.896,1.792,1.566,2.912,1.566l0,0h60.256l0,0c2.016,0,3.584-1.566,3.584-3.584    l0,0v-3.137V61.152v-6.495v-11.65v-6.494V24.865v-6.496V6.721V3.584l0,0C73.245,2.689,73.023,2.24,72.799,1.569z M28.895,68.32    c0,0.896-0.672,1.568-1.567,1.568h-8.287c-0.896,0-1.568-0.673-1.568-1.568v-3.584c0-0.896,0.672-1.567,1.568-1.567h8.287    c0.896,0,1.567,0.672,1.567,1.567V68.32z M28.895,56.225c0,0.896-0.672,1.567-1.567,1.567h-8.287    c-0.896,0-1.568-0.672-1.568-1.567v-3.584c0-0.896,0.672-1.567,1.568-1.567h8.287c0.896,0,1.567,0.672,1.567,1.567V56.225z     M28.895,44.354c0,0.896-0.672,1.565-1.567,1.565h-8.287c-0.896,0-1.568-0.672-1.568-1.565V40.77c0-0.896,0.672-1.568,1.568-1.568    h8.287c0.896,0,1.567,0.672,1.567,1.568V44.354z M45.245,68.32c0,0.896-0.672,1.568-1.565,1.568h-8.289    c-0.896,0-1.568-0.673-1.568-1.568v-3.584c0-0.896,0.673-1.567,1.568-1.567h8.289c0.896,0,1.565,0.672,1.565,1.567V68.32z     M45.245,56.225c0,0.896-0.672,1.567-1.565,1.567h-8.289c-0.896,0-1.568-0.672-1.568-1.567v-3.584    c0-0.896,0.673-1.567,1.568-1.567h8.289c0.896,0,1.565,0.672,1.565,1.567V56.225z M45.245,44.354c0,0.896-0.672,1.565-1.565,1.565    h-8.289c-0.896,0-1.568-0.672-1.568-1.565V40.77c0-0.896,0.673-1.568,1.568-1.568h8.289c0.896,0,1.565,0.672,1.565,1.568V44.354z     M61.822,68.32c0,0.896-0.672,1.568-1.567,1.568h-8.286c-0.896,0-1.568-0.673-1.568-1.568v-3.584c0-0.896,0.672-1.567,1.568-1.567    h8.286c0.896,0,1.567,0.672,1.567,1.567V68.32z M61.822,56.225c0,0.896-0.672,1.567-1.567,1.567h-8.286    c-0.896,0-1.568-0.672-1.568-1.567v-3.584c0-0.896,0.672-1.567,1.568-1.567h8.286c0.896,0,1.567,0.672,1.567,1.567V56.225z     M61.822,44.354c0,0.896-0.672,1.565-1.567,1.565h-8.286c-0.896,0-1.568-0.672-1.568-1.565V40.77c0-0.896,0.672-1.568,1.568-1.568    h8.286c0.896,0,1.567,0.672,1.567,1.568V44.354z M62.493,31.809L62.493,31.809c0,0.896-0.673,1.566-1.567,1.566H18.143    c-0.896,0-1.567-0.672-1.567-1.566V10.977c0-0.896,0.672-1.568,1.567-1.568h42.783c0.896,0,1.567,0.672,1.567,1.568V31.809z"/><path d="M28.447,19.712c-1.566-0.672-2.238-0.896-2.238-1.567c0-0.448,0.446-0.896,1.566-0.896c1.345,0,2.018,0.448,2.464,0.672    l0.448-2.016c-0.672-0.224-1.344-0.448-2.464-0.672v-1.568h-1.792v1.792c-1.792,0.448-2.912,1.568-2.912,3.136    c0,1.793,1.344,2.688,3.136,3.137c1.346,0.448,1.792,0.896,1.792,1.567s-0.672,1.121-1.792,1.121    c-1.119,0-2.238-0.448-2.911-0.672l-0.447,2.017c0.672,0.446,1.792,0.672,2.912,0.672v1.792h1.792v-2.018    c2.016-0.446,3.136-1.791,3.136-3.358C31.359,21.504,30.463,20.385,28.447,19.712z"/><path d="M40.543,19.712c-1.568-0.672-2.24-0.896-2.24-1.567c0-0.448,0.448-0.896,1.567-0.896c1.345,0,2.017,0.448,2.464,0.672    l0.448-2.016c-0.673-0.224-1.345-0.448-2.464-0.672v-1.568h-1.792v1.792c-1.792,0.448-2.912,1.568-2.912,3.136    c0,1.793,1.346,2.688,3.138,3.137c1.344,0.448,1.792,0.896,1.792,1.567s-0.673,1.121-1.792,1.121c-1.12,0-2.24-0.448-2.912-0.672    l-0.448,2.017c0.672,0.446,1.792,0.672,2.912,0.672v1.792h1.792v-2.018c2.016-0.446,3.137-1.791,3.137-3.358    C43.68,21.504,42.782,20.385,40.543,19.712z"/><path d="M52.863,19.712c-1.566-0.672-2.238-0.896-2.238-1.567c0-0.448,0.445-0.896,1.566-0.896c1.345,0,2.018,0.448,2.463,0.672    l0.449-2.016c-0.672-0.224-1.346-0.448-2.465-0.672v-1.568h-1.791v1.792c-1.793,0.448-2.912,1.568-2.912,3.136    c0,1.793,1.344,2.688,3.135,3.137c1.346,0.448,1.793,0.896,1.793,1.567s-0.672,1.121-1.793,1.121    c-1.118,0-2.239-0.448-2.911-0.672l-0.447,2.016c0.672,0.446,1.791,0.672,2.911,0.672v1.792h1.791v-2.018    c2.018-0.446,3.139-1.791,3.139-3.358C55.775,21.504,54.879,20.385,52.863,19.712z"/></g></g></svg>`

String.prototype.aQuetzales = function () { return new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'GTQ' }).format(this.aFloat()) }
String.prototype.cantidadFormateada = function () { return new Intl.NumberFormat('es-GT').format(this.aFloat()) }
let cerrarSwal = q => Swal.close()

let switchGastosFijosExcel = -1
let switchGastosMixtosExcel = -1
let switchGastosPorProductoExcel = -1
let switchGastosFijosPDF = -1
let switchGastosMixtosPDF = -1
let switchGastosPorProductoPDF = -1
let fechastr = qs('#fechames').textContent.replace('del mes ', '')


let alargar = x => {
  if (x === '<-') return 'alargarancho'
  if (x === '=') return 'alargaralto'
  return ''
}

let grid = [
  [7, 8, 9, '<-'],
  [4, 5, 6, '*', '/'],
  [1, 2, 3, '-', '='],
  ['C', 0, '.', '+'],
]

qs('main').añadirHTML(`<div class="calculadora" hidden>
<div class="movercalcu">
<div class="divcerrarcalcu"><div class="cerrarcalcu">❌</div></div>
<div class="pantallacalcu"></div>
</div>
<div class="botonescalcu">${grid.map(x => `${x.map(y => `<button class="botoncalcu ${alargar(y)}">${y}</button>`).join('')}`).join('')}</div>
</div>`)


let pantallacalcu
let calculadora = qs('.calculadora')
let mostrarCalculadora = qs('#mostrarcalculadora')
$(calculadora).draggable(esTouch ? { handle: '.movercalcu' } : {})

pantallacalcu = qs('.pantallacalcu')
bodyOnClick('.botoncalcu', c => {
  let eventos = {
    C: q => '',
    '<-': q => pantallacalcu.textContent.slice(0, -1),
    '=': q => { try { return eval(pantallacalcu.textContent) } catch { return 'Operación no válida' } },
  }
  let tecla = c.textContent
  let texto = eventos[tecla]?.() ?? pantallacalcu.textContent + tecla
  pantallacalcu.textContent = texto
})

qs('#gastosfijos').inicializar(datos.fijos, 'Tabla de gastos fijos', 'tablagastosfijos', false)
qs('#gastosmixtos').inicializar(datos.mixtos, 'Tabla de gastos mixtos', 'tablagastosmixtos', false)
qs('#gastosporproducto').inicializar(datos.productos, 'Tabla de gastos por compra de productos', 'tablagastosproductos', true)

let url = '/gastos/'
let [_, fechaUrl] = location.pathname.split(url)
let inicioMes = moment(fechaUrl, 'DD-MM-YYYY').format('DD-MM-YYYY')
let finMes = moment(fechaUrl, 'DD-MM-YYYY').endOf('month').format('DD-MM-YYYY')
let esMesActual = moment().isSame(moment(fechaUrl, 'DD-MM-YYYY'), 'month')

let convierteDatePicker = dp => {
  dp.datepicker({ weekStart: 1, language: 'es', autoclose: true, todayHighlight: true, format: 'dd/mm/yyyy', maxViewMode: 0, startDate: inicioMes, endDate: finMes })
  dp.datepicker().on('changeDate', a => enfocarCelda(a.currentTarget.padre().sig()))
}
setTimeout(() => {
  convierteDatePicker($(`.divdatepicker`))
}, 200);

mostrarcalculadora.onclick = e => {
  if (!calculadora.hidden) esconderCalculadora()
  else {
    calculadora.mostrar()
    mostrarcalculadora.html(svgCalcu + ' Esconder calculadora')
  }
}

bodyOnClick('.cerrarcalcu', esconderCalculadora)

function esconderCalculadora() {
  calculadora.esconder()
  mostrarcalculadora.html(svgCalcu + ' Mostrar calculadora')
}

bodyOnClick('#mesanterior', q => location = url + moment(fechaUrl, 'DD-MM-YYYY').subtract(1, 'month').format('DD-MM-YYYY'))
bodyOnClick('#messiguiente', q => location = url + moment(fechaUrl, 'DD-MM-YYYY').add(1, 'month').format('DD-MM-YYYY'))

bodyOn('keydown', 'td', (c, e) => {
  let k = e.which
  let cellindex = c.indice()
  let filas = c.closest("tbody").rows
  let { atStart, atEnd } = k == 37 || k == 39 ? getSelectionTextInfo(c) : {}
  if (k == 37 && atStart) //flecha izquierda
    enfocarCelda(c.ant(), e)
  else if ((k == 39 && atEnd) || k === 13) //flecha derecha
  {
    if (cellindex === 0) {
      e.preventDefault()
      $(c.sig().children[0]).datepicker('show')
      c.blur()
    }
    else enfocarCelda(c.sig(), e)
  }
  else if (k == 38) //flecha arriba
    c.padre().indice() === 0 ? enfocarCelda([...filas].at(-1).cells[cellindex - 1], e) : enfocarCelda(c.closest("tr").ant().cells[cellindex], e)
  else if (k == 40) //enter y flecha abajo
    c.closest("tr").rowIndex < filas.length ? enfocarCelda(c.closest("tr").sig().cells[cellindex], e) : enfocarCelda(filas[0].cells[cellindex + 1], e)
})


function enfocarCelda(x, e) {
  e?.preventDefault()
  if (x !== undefined && x.contentEditable) {
    x.focus()
    let range = document.createRange()
    let sel = getSelection()
    if (x.textContent == '') return
    range.setStart(x.childNodes[0], x.textContent.length)
    range.collapse(false)

    sel.removeAllRanges()
    sel.addRange(range)

    let rect = x.getBoundingClientRect()
    if (rect.x + rect.width > innerWidth || rect.y + rect.height > innerHeight) x.scrollIntoView()
  } else if (x.qsa('input').length > 0) x.qs('input').focus()
}

bodyOn('keyup', '.tablagastosproductos td', c => {
  if (c.cellIndex === 2 || c.cellIndex === 3) {
    let celdaGasto = c.closest('tr').qs('td:nth-child(5)')
    let resultado = celdaGasto.ant().textContent.aFloat() * celdaGasto.ant().ant().textContent.aFloat()
    celdaGasto.textContent = !isNaN(resultado) ? resultado.normalizarPrecio() : ''
  }
})

bodyOn('beforeinput', 'td', (c, e) => {
  let letra = e.data ?? ''
  let colindex = c.indice()
  let texto = c.textContent
  let celdas = [...c.padre().cells]
  let permiteDecimales = c === celdas[2]
  let esUltimaCelda = c === celdas.at(-1)
  if (letra === '"' || letra === '\\' || letra === "'") e.preventDefault()
  if (isNaN(letra) && colindex != 0 && !permiteDecimales && !esUltimaCelda) e.preventDefault()
  if (colindex !== 0 && letra === ' ' && !esUltimaCelda) e.preventDefault()

  if (permiteDecimales) {
    if (isNaN(letra) && letra !== ".") e.preventDefault()
    let p = texto.indexOf(".")
    if (p > -1 && (letra === "." || (getSelection().baseOffset > p && texto.length - p >= 3 && letra != ""))) e.preventDefault()
  }

  if (texto === '0') c.textContent = ''
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
bodyOnClick('#guardarcambios', async q => {
  esValido = false
  if (!await validarDatos()) return
  let data = { ultimocambio: Date.now() }
  qsafor('tabla-gastos', x => (data[x.id.replace('tablagastos', '')] = x.qsarr('tbody tr').map(y => y.qsarr('td').map((z, i) => (i !== 1 ? z.textContent : z.qs('input').value)))))
  hazPost('', JSON.stringify(data), q => swalExito('Se ha guardado el registro de los gastos exitosamente'))
})

let borrarEnfocarFilas = tabla => tabla.qs('.cuerpo td').quitarClase('enfocar')
let esValido = false

async function validarDatos() {
  let valido = []
  await Promise.all(qsarr('tabla-gastos').filter(x => x.qs('table')).map(async x => {
    let tabla = x.qs('.divtablagastos')
    let tablaCopia = tabla.clonar()
    let hayDatosVacios = false
    tablaCopia.qsafor('tbody tr', async fila => {
      [...fila.cells].forEach((x, i) => {
        if (((i === 1 && x.qs('input').value === '') || (i !== 1 && x.textContent === '')) && !$(x).is(':last-child')) {
          hayDatosVacios = true
          x.closest('tr').añadirClase('enfocar')
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
      width: innerWidth * 3 / 4,
      html: tablaCopia,
      showCancelButton: true,
      stopKeydownPropagation: false,
      confirmButtonText: 'Ya lo arreglé',
      cancelButtonText: 'Volver',
      didOpen: q => convierteDatePicker(tablaCopia.qs(`.divdatepicker`))
    })

    if (!isConfirmed) return false
    borrarEnfocarFilas(tablaCopia)
    let filasCopia = tablaCopia.qs('tbody tr')
    tabla.qsafor('tbody tr', (i, fila) => {
      let filaCopia = filasCopia[i]
        ;[...fila.cells].forEach((x, j) => j === 1 ? (x.qs('input').value = filaCopia.cells[j].qs('input').value) : (x.textContent = filaCopia.cells[j].textContent))
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

let convertirDatepickerATexto = tablaClon => tablaClon.qsafor('input', (x, i) => x.closest('td').textContent = x.value)

let botonpdf = qs('boton-pdf')
botonpdf.inicializar(() => {
  let tablas = qsa('table')
  if (tablas.length === 0) {
    mostrarError('No hay ninguna tabla para exportar')
    setTimeout(() => botonpdf.innerHTML = botonpdf.htmlOriginal, 2000)
    return
  }
  let opciones = qsa('.opcioncheckboxpdf input')
  return [...tablas].map((x, i) => {
    if (!opciones[i].checked) return ``
    let tablaClon = x.clonar()
    convertirDatepickerATexto(tablaClon)
    let { tituloHoja, esGastoPorProducto } = x.closest('tabla-gastos')
    return `<div class="tituloresumen" style="margin-left: ${x.offsetWidth / 2 + (esGastoPorProducto ? -80 : 0)}px; width: ${esGastoPorProducto ? 300 : 180}px;">${tituloHoja}</div><div class="divtablagastos" style="margin-left: ${x.offsetWidth / 2 + 55}px">${tablaClon.outerHTML}</div><br><br>`
  }).join('')
}, `Gastos del mes ${fechastr}`, 0.45, 20)

qs('boton-excel').inicializar(function () {
  let tablas = qsa('table')
  if (tablas.length === 0) return mostrarError('No hay ninguna tabla para exportar')

  let nombre = `Resumen de gastos del mes ${fechastr}.xlsx`
  let workbook = XLSX.utils.book_new()
  let opciones = qsa('.opcioncheckboxexcel input')

  tablas.forEach((x, i) => {
    if (!opciones[i].checked) return ``

    let tablaClon = x.clonar()
    convertirDatepickerATexto(tablaClon)
    tablaClon.qsafor('td', x => { if (x.textContent === '') x.textContent = '\u00A0' })
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
  cuerpo.qsafor('td:nth-last-child(1)', x => {
    let texto = x.textContent.aFloat()
    if (!isNaN(texto)) {
      hayUnNumero = true
      sumaGastos += texto
    }
  })

  if (!isNaN(sumaGastos)) cuerpo.padre().qsa('tfoot td')[1].textContent = sumaGastos === 0 && !hayUnNumero ? '0' : sumaGastos.normalizarPrecio()
  return sumaGastos
}

let formatearCeldas = ({ cells: [, gasto] }) => gasto.textContent = gasto.textContent.aQuetzales()

bodyOnClick('#resumengastos', async q => {
  let listaTablasValores = qsarr('table').map(tabla => {
    let productos = tabla.qsarr('tbody td:first-child')
    let gastos = tabla.qsarr('tbody td:nth-last-child(2)')
    return productos.map((p, i) => ({ producto: p.textContent.normalizar(), gastos: gastos[i].textContent.aFloat() || 0, productoDesnormalizado: p.textContent }))
  })

  let p = {}
  listaTablasValores.forEach(tabla => {
    tabla.forEach(fila => p[fila.producto] ? p[fila.producto].gastos += fila.gastos : p[fila.producto] = { gastos: fila.gastos, productoDesnormalizado: fila.productoDesnormalizado })
  })
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
      let cuerpo = qs('#tablaresumen tbody')
      let sumaGastos = calculargastos(cuerpo)
        ;[...cuerpo.rows].forEach(x => formatearCeldas(x))
      formatearCeldas(qs('#tablaresumen tfoot tr'))
      let dividir = esMesActual ? moment().format('D') : moment(fechaUrl, 'DD-MM-YYYY').endOf('month').format('D') ?? 0
      qs('.cambiarfecha').textContent = (sumaGastos / dividir).normalizarPrecio().aQuetzales()

      qs('#exportarAPDFResumen').inicializar(() => {
        let tabla = qs('#tablaresumen')
        let tablaClon = tabla.clonar()
        tablaClon.id = 'tablaresumenclon'
        return `<div class="tituloresumen" style="margin-left: ${tabla.clientWidth / 2 - 200}px; width: 380px">Resumen  &nbsp;de gastos ${fechastr}</div>${tablaClon.outerHTML}<br><br>`
      }, `Resumen de gastos ${fechastr}`)

      qs('#exportarAExcelResumen').inicializar(function () {
        let nombre = `Resumen de ventas ${fechastr}.xlsx`
        let workbook = XLSX.utils.book_new()
        let ws = XLSX.utils.table_to_sheet(qs('#tablaresumen'), { raw: true })
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


bodyOnClick('.guardarconfig', async q => {
  switchGastosFijosExcel = mb.qs('#switchGastosFijosExcel').checked
  switchGastosMixtosExcel = mb.qs('#switchGastosMixtosExcel').checked
  switchGastosPorProductoExcel = mb.qs('#switchGastosPorProductoExcel').checked
  switchGastosFijosPDF = mb.qs('#switchGastosFijosPDF').checked
  switchGastosMixtosPDF = mb.qs('#switchGastosMixtosPDF').checked
  switchGastosPorProductoPDF = mb.qs('#switchGastosPorProductoPDF').checked
})

function reseteaValoresConfig() {
  mb.qs('#switchGastosFijosExcel').checked = switchGastosFijosExcel
  mb.qs('#switchGastosMixtosExcel').checked = switchGastosMixtosExcel
  mb.qs('#switchGastosPorProductoExcel').checked = switchGastosPorProductoExcel
  mb.qs('#switchGastosFijosPDF').checked = switchGastosFijosPDF
  mb.qs('#switchGastosMixtosPDF').checked = switchGastosMixtosPDF
  mb.qs('#switchGastosPorProductoPDF').checked = switchGastosPorProductoPDF
}

bodyOn('hidden.bs.modal', '#configs', reseteaValoresConfig)

bodyOnClick('#tablaresumen th', function () {
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
  let nombreColumna = this.textContent

  if (nombreColumna === 'Vendidos') indiceColumna = cuerpo.rows[0].cells.length - 2
  else if (nombreColumna === 'Ingresos') indiceColumna = cuerpo.rows[0].cells.length - 1
  else if (nombreColumna === 'Sale' || nombreColumna === 'Entra') indiceColumna += colsinicio
  cuerpo.querySelectorAll('tr').forEach((fila, indice) => {
    listaReordenarPlantillasHelper.push(fila.cells[0].textContent.normalizar())
    let textoCelda = fila.cells[indiceColumna].textContent.toUpperCase()
    if (esResumen && nombreColumna !== 'Productos') textoCelda = textoCelda.replace(/[^0-9.]/g, '')
    objValores[textoCelda + separador + indice] = fila.outerHTML.replace(/(\t)|(\n)/g, '')
    listaIdentifObjValores.push(textoCelda + separador + indice)
  })

  if (!esResumen && !objReordenarPlantillas[tabla.closest('.tabContent').dataset.tabid]) objReordenarPlantillas[tabla.closest('.tabContent').dataset.tabid] = listaReordenarPlantillasHelper

  let listaElementosColumna = cuerpo.qsarr(`td:nth-child(${indiceColumna + 1})`)
  let todosSonNumeros = esResumen && nombreColumna !== 'Productos' ? true : listaElementosColumna.every(x => !isNaN(x.textContent.aFloat()))

  if (todosSonNumeros) {
    listaIdentifObjValores.sort((a, b) => {
      let aa = a.split(separador)
      let bb = b.split(separador)
      return aa[0] != bb[0] ? aa[0] - bb[0] : cuerpo.rows[aa[1].aInt()].cells[0].textContent.localeCompare(cuerpo.rows[bb[1].aInt()].cells[0].textContent)
    })
  } else listaIdentifObjValores.sort()

  if (order === 'desc') listaIdentifObjValores.reverse()
  this.style.setProperty('--flecha', order === 'desc' ? '"↓"' : '"↑"')

  tabla.qs('.activo').quitarClase('activo')
  this.añadirClase('activo')
  cuerpo.innerHTML = listaIdentifObjValores.map(key => objValores[key]).join('')
})

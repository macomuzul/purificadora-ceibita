dayjs.extend(window.dayjs_plugin_utc)
let registrarVentas = true
let colsinicio = 2, colsfinal = 2
let [dia, mes, año] = qs('.fechanum').textContent.split('/')
let hoy = dayjs(año + '-' + mes + '-' + dia).utc(true)
let fechastr = hoy.format('D-M-YYYY')
let tiempoUltimoClick = 0, tiempoTouchUp = 600
let tablaValida = false, yaSeRecibioTouch = false, permitirFilasVacias = false, opcionSwal = false
let listaplantillas = {}, objReordenarPlantillas = [], tablaParaValidacion, plantillaSeleccionada = {}
let $grupotabs = qs('.grupotabs')
let $tabs = $grupotabs.qs('.tabs')
let $contents = $grupotabs.qs('.contenidotabs')
let inicioTabSortable
let antes = (el, x) => el.insertAdjacentHTML('beforebegin', x)

let $idTab = q => [...$contents.children].findIndex(x => x.style.display != 'none')
let $tabla = q => [...$contents.children].find(x => x.style.display != 'none').qs('table')
let $tablas = q => $contents.qsarr(`table`)
let $cuerpo = q => $tabla().qs('.cuerpo')
let $filas = q => [...$cuerpo().rows]
let $pie = q => $tabla().qs('tfoot')
let $pintarColumnas = q => $tabla().qs('.pintarcolumnas')
let $cantidadViajes = q => $pintarColumnas().children.length
let $saleYEntra = q => $tabla().qs('.saleYEntra')
let $cantidadSaleYEntra = q => $pintarColumnas().children.length * 2 + colsinicio + colsfinal


let borrarListaOrdenarPlantillasTablaActual = q => borrarListaOrdenarPlantillas($tabla(), $idTab())
let resaltarCelda = x => x.añadirClase('enfocar')
let resaltarCeldas = f => [...f.cells].forEach(x => x.añadirClase('enfocar'))
let borrarEnfocarFilas = tabla => tabla.qs('.cuerpo td').quitarClase('enfocar')

let soloHayUnCamion = async q => ($tablas().length === 1 ? (await mostrarError('No se puede borrar, debe haber al menos un camión'), true) : false)
let mostrarError = async (e, titulo = 'Error') => (await Swal.fire(titulo, e, 'error'), false)

let tablasSortable = q => $('.grupotabs .cuerpo').sortable({ axis: 'y', disabled: !_reordenarProductos })

let cerrarSwal = q => Swal.close()
let funcionOpcionSwal = x => { opcionSwal = x; Swal.close() }
let borrarFilasVaciasB = q => funcionOpcionSwal('borrarFilasVacias')
let conservarFilasVaciasB = q => funcionOpcionSwal('conservarFilasVacias')
let continuarSwalB = q => funcionOpcionSwal('continuar')
let removerCeroPuntoB = q => funcionOpcionSwal('removerCeroPunto')
let validarDatosB = q => funcionOpcionSwal('validarDatos')
let cancelarB = q => funcionOpcionSwal('cancelar')

let borrarEnfocarPreciosYProductos = t => t.qsafor('.cuerpo tr', x => $(x.cells).slice(0, 2).removeClass('enfocar'))

alCargar(cambiosConfig)

$contents.qsafor('.cuerpo td:last-child', x => x.añadirClase('borrarfilas'))
setTimeout(q => $tabs.qsafor('.tab-label', x => x.añadirClase('borrarcamiones')), 5)

bodyOnClick('.fecha', q => qsafor('.fecha', x => x.alternar()))
let _borrarFilasYColumnas = -1
let _borrarCamiones = -1
let _exportarPDF = -1
let _exportarExcel = -1
let _reordenarProductos = -1
let _reordenarCamiones = -1
let _ordenarOrdenAlfabetico = -1

let tabsTexto = (tablaOriginal, tablaNueva, texto) => `<custom-tabs class="swalTab">
  <div class="tabs"><tab-label>${texto}</tab-label><tab-label>Vista previa del resultado</tab-label></div>
  <div><tab-content>${tablaOriginal.outerHTML}</tab-content><tab-content>${tablaNueva.outerHTML}</tab-content></div>
</custom-tabs>`

bodyOnClick('.restaurarplantilla', q => {
  let tabla = $tabla()
  let cuerpo = tabla.qs('.cuerpo')
  let id = $idTab()
  cuerpo.html(restaurarOrdenPlantilla(objReordenarPlantillas[id], cuerpo))
  borrarListaOrdenarPlantillas(tabla, id)
})

function borrarListaOrdenarPlantillas(tabla, id) {
  tabla.qsafor('th:not([colspan="2"])', x => x.style.setProperty('--flecha', '"↓"'))
  tabla.qs('.activo')?.classList.remove('activo')
  qs('.restaurarplantilla').esconder()
  delete objReordenarPlantillas[id]
}

function restaurarOrdenPlantilla(ordenAnterior, cuerpo) {
  let filas = [...cuerpo.rows]
  let formatoTablaLlena = ''
  let ordenNuevo = filas.map(x => x.cells[0].textContent.normalizar())
  ordenAnterior.forEach(producto => {
    let i = ordenNuevo.findIndex(x => x === producto)
    if (i >= 0) formatoTablaLlena += filas[i].outerHTML
  })

  ordenNuevo.forEach((prod, i) => !ordenAnterior.includes(prod) && (formatoTablaLlena += filas[i].outerHTML))
  return formatoTablaLlena
}

async function guardarValoresConfig() {
  $tabs.alternarClase('cerrarconboton', _borrarCamiones === 1)
  $contents.alternarClase('cerrarconboton', _borrarFilasYColumnas === 1)
  $contents.alternarClase('ordenarAlfabeticamente', _ordenarOrdenAlfabetico)
  $contents.qsafor('.cuerpo td:not(:nth-last-child(1), :nth-last-child(2))', x => x.contentEditable = !_reordenarProductos)

  $('.tabs').sortable({
    axis: 'x',
    items: '.tab-label',
    disabled: !_reordenarCamiones,
    start: e => { inicioTabSortable = e.toElement.padre().indice() },
    stop: e => {
      let tabContent = i => $contents.qs(`tab-content:nth-child(${i + 1})`)
      let finTabSortable = e.toElement.padre().indice()
      tabContent(finTabSortable)[finTabSortable < inicioTabSortable ? 'before' : 'after'](tabContent(inicioTabSortable))
      reacomodarCamiones()
      Swal.fire('Se ha cambiado el orden', 'Se ha cambiado el orden de los camiones exitosamente', 'success')
    },
  })
  tablasSortable()
}

function cambiosConfig() {
  colocarValoresConfig()
  guardarValoresConfig()
}

bodyOnClick('.guardarconfig', cambiosConfig)

const configs = qs('#configs')
configs.addEventListener('hidden.bs.modal', reseteaValoresConfig)
let esconderOpciones = q => bootstrap.Modal.getInstance(configs).hide()

let opcionChequeada = x => x.findIndex(x => x.checked)
let $ordenarOrdenAlfabetico = configs.qs('#switchreordenalfabetico')
let $reordenarProductos = configs.qs('#switchreordenarproductos')
let $reordenarCamiones = configs.qs('#switchreordenarcamiones')
let $borrarCamiones = configs.qsarr('[name="borrarcamiones"]')
let $filasYColumnas = configs.qsarr('[name="borrarfilasycolumnas"]')
let $exportarPDF = configs.qsarr('[name="exportarpdf"]')
let $exportarExcel = configs.qsarr('[name="exportarexcel"]')

function colocarValoresConfig() {
  _ordenarOrdenAlfabetico = $ordenarOrdenAlfabetico.checked
  _reordenarProductos = $reordenarProductos.checked
  _reordenarCamiones = $reordenarCamiones.checked
  _borrarCamiones = opcionChequeada($borrarCamiones)
  _borrarFilasYColumnas = opcionChequeada($filasYColumnas)
  _exportarPDF = opcionChequeada($exportarPDF)
  _exportarExcel = opcionChequeada($exportarExcel)
}

let cambiarValorRB = (el, opcion) => el.forEach((x, i) => x.checked = i === opcion)
function reseteaValoresConfig() {
  $ordenarOrdenAlfabetico.checked = _ordenarOrdenAlfabetico
  $reordenarProductos.checked = _reordenarProductos
  $reordenarCamiones.checked = _reordenarCamiones
  cambiarValorRB($borrarCamiones, _borrarCamiones)
  cambiarValorRB($filasYColumnas, _borrarFilasYColumnas)
  cambiarValorRB($exportarPDF, _exportarPDF)
  cambiarValorRB($exportarExcel, _exportarExcel)
}

bodyOnClick('.grupotabs th:not([colspan="2"]), #tablaresumen th', c => {
  if (_ordenarOrdenAlfabetico) {
    let tabla = c.closest('table')
    let esResumen = tabla.id === 'tablaresumen'
    if (!esResumen) qs('.restaurarplantilla').mostrar()
    let cuerpo = tabla.qs('.cuerpo')
    let flecha = getComputedStyle(c, ':after').content
    let order = flecha === '"↓"' ? 'asc' : 'desc'
    let separador = '-----'
    let objValores = {}
    let listaIdentifObjValores = []
    let listaReordenarPlantillasHelper = []
    let indiceColumna = c.cellIndex
    let nombreColumna = c.textContent

    if (nombreColumna === 'Vendidos') indiceColumna = cuerpo.rows[0].cells.length - 2
    else if (nombreColumna === 'Ingresos') indiceColumna = cuerpo.rows[0].cells.length - 1
    else if (nombreColumna === 'Sale' || nombreColumna === 'Entra') indiceColumna += colsinicio
    cuerpo.qsafor('tr', (fila, indice) => {
      listaReordenarPlantillasHelper.push(fila.cells[0].textContent.normalizar())
      let textoCelda = fila.cells[indiceColumna].textContent.toUpperCase()
      if (esResumen && nombreColumna !== 'Productos') textoCelda = textoCelda.replace(/[^0-9.]/g, '')
      objValores[textoCelda + separador + indice] = fila.outerHTML.replace(/(\t)|(\n)/g, '')
      listaIdentifObjValores.push(textoCelda + separador + indice)
    })

    let index = tabla.closest('tab-content').indice()
    if (!esResumen && !objReordenarPlantillas[index]) objReordenarPlantillas[index] = listaReordenarPlantillasHelper

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
    c.style.setProperty('--flecha', order === 'desc' ? '"↓"' : '"↑"')

    tabla.qs('.activo')?.classList.remove('activo')
    c.añadirClase('activo')
    cuerpo.html(listaIdentifObjValores.map(key => objValores[key]).join(''))
  }
})

const swalContinuar = estilosSwal('btn btn-primary margenbotonswal btncontinuar')
const swal3Botones = estilosSwal('botonswal3 botonconfirm', 'botonswal3 botoncancel', 'botonswal3 botondeny')
const swal3BotonesInvertido = estilosSwal('botonswal3 botondeny', 'botonswal3 botoncancel', 'botonswal3 botonconfirm')

bodyOn('keyup', 'td', (c, e) => {
  let k = e.which
  if ((k >= 48 && k <= 57) || k === 229 || k === 8) {
    let cuerpo = e.target.closest('.cuerpo')
      ;[...cuerpo.rows].forEach(x => calcularvendidoseingresos(x))
    calcularvendidoseingresostotal(cuerpo)
  }
})

function calcularvendidoseingresos({ cells }) {
  let sumafila = 0
  let y = colsinicio
  let hayunnumero = false
  for (; y < cells.length - colsfinal; y++) {
    let valor = cells[y].textContent.aInt()
    if (!isNaN(valor)) {
      hayunnumero = true
      sumafila += y % 2 === 0 ? valor : -valor
    }
  }
  cells[y++].textContent = sumafila === 0 && !hayunnumero ? '' : sumafila
  let totalingresos = sumafila * cells[1].textContent.aFloat()
  cells[y].textContent = isNaN(totalingresos) || (sumafila === 0 && !hayunnumero) ? '' : totalingresos.normalizarPrecio()
}

function calcularvendidoseingresostotal(cuerpo) {
  let sumaVendidos = 0, sumaIngresos = 0, hayUnNumero = false
  cuerpo.qsafor('td:nth-last-child(2)', x => {
    let texto = x.textContent.aFloat()
    if (!isNaN(texto)) sumaVendidos += texto
  })
  cuerpo.qsafor('td:nth-last-child(1)', x => {
    let texto = x.textContent.aFloat()
    if (!isNaN(texto)) {
      hayUnNumero = true
      sumaIngresos += texto
    }
  })

  let [_, t1, t2] = cuerpo.padre().qsa('tfoot td')
  if (!isNaN(sumaVendidos)) t1.textContent = sumaVendidos === 0 && !hayUnNumero ? '' : sumaVendidos
  if (!isNaN(sumaIngresos)) t2.textContent = sumaIngresos === 0 && !hayUnNumero ? '' : sumaIngresos.normalizarPrecio()
}

qsclick('#añadirProducto', q => $cuerpo().añadirHTML(`<tr>${[...Array($cantidadSaleYEntra() - 2)].map(_ => `<td contenteditable="true"></td>`).join('')}<td></td><td class="borrarfilas"></td></tr>`))

qsclick('#añadirViaje', q => {
  antes($tabla().qs('.columnaVendidos'), `<th colspan="2" class="borrarcolumnas">Viaje No. ${$cantidadViajes() + 1}</th>`)
  $saleYEntra().añadirHTML(`<th>Sale</th><th>Entra</th>`)
  $pintarColumnas().añadirHTML(`<col span="2">`)
  let cantidadSaleYEntra = $cantidadSaleYEntra()
  $filas().forEach(x => {
    let indice = cantidadSaleYEntra - colsinicio - colsfinal
    for (let i = 0; i < 2; i++) { x.insertCell(indice).contentEditable = true }
  })
  $pie().qs('td:first-child').colSpan += 2
})

bodyOnClick('.borrarcolumnas', (c, e) => borrarElementos(e, _borrarFilasYColumnas, borrarColumnas))
bodyOnClick('.borrarfilas', (c, e) => borrarElementos(e, _borrarFilasYColumnas, borrarFilas))
bodyOnClick('.borrarcamiones', (c, e) => borrarElementos(e, _borrarCamiones, borrarCamiones))
bodyOn('pointerup', '.borrarcolumnas', (c, e) => borrarElementosTouchUp(e, _borrarFilasYColumnas, borrarCamiones))
bodyOn('pointerup', '.borrarfilas', (c, e) => borrarElementosTouchUp(e, _borrarFilasYColumnas, borrarFilas))
bodyOn('pointerup', '.borrarcamiones', (c, e) => borrarElementosTouchUp(e, _borrarCamiones, borrarCamiones))

function borrarElementosTouchUp(e, opcion, metodo) {
  if (opcion === 0 && e.timeStamp - tiempoUltimoClick >= tiempoTouchUp) metodo(e.target, e)
}

function borrarElementos(e, opcion, metodo) {
  let seleccionado = e.target
  if (opcion === 0) tiempoUltimoClick = e.timeStamp
  else if (opcion === 1 && seleccionado.clientWidth - e.offsetX <= 21 && e.offsetY <= 21) metodo(seleccionado, e)
}

async function borrarFilas(celda, e) {
  e.stopImmediatePropagation()
  let fila = celda.padre()
  let html = `<table class="mx-auto tablacompleta"><tbody style="background: #0f0d35;">${fila.clonar().outerHTML}</tbody></table>`
  if (await swalSíNo('Estás seguro que deseas borrar este producto de la tabla?', html)) {
    let cuerpo = fila.padre()
    if (cuerpo.rows.length === 1) return mostrarError('No puedes borrar todos los productos, debe haber al menos uno')
    fila.remove()
    calcularvendidoseingresostotal(cuerpo)
    Swal.fire('Se ha eliminado el producto', 'Se ha eliminado el producto y su contenido exitosamente', 'success')
  }
}

async function borrarColumnas(colborrar) {
  let tabla = colborrar.closest('table')
  let celdaABorrar = (colborrar.indice() - colsinicio) * 2 + colsinicio
  let cuerpo = tabla.qs('.cuerpo')
  let filas = cuerpo.qsarr('tr')
  let html = `<table class="mx-auto tablacompleta"><thead><tr>
  ${colborrar.outerHTML}</tr><tr><th>Sale</th><th>Entra</th></tr></thead><tbody style="background: #0f0d35;">
  ${filas.map(({ cells }) => `<tr>${cells[celdaABorrar].outerHTML} ${cells[celdaABorrar + 1].outerHTML}</tr>`).join('')}
  </tbody></table>`
  if (await swalSíNo('Estás seguro que deseas borrar esta columna y todos sus contenidos?', html, 600)) {
    if ($cantidadViajes() === 1) return mostrarError('No puedes borrar todos los viajes, debe haber al menos uno')

    filas.forEach(fila => $(fila.cells).slice(celdaABorrar, celdaABorrar + 2).remove())
    tabla.qs('tfoot td:first-child').colSpan -= 2
    colborrar.remove()

    tabla.qs('.saleYEntra>:last-child').remove()
    tabla.qs('.saleYEntra>:last-child').remove()
    tabla.qs('.pintarcolumnas>:last-child').remove()
    tabla.qsafor('.borrarcolumnas', (celdaViaje, i) => (celdaViaje.textContent = 'Viaje No. ' + (i + 1)))
    filas.forEach(f => calcularvendidoseingresos(f))
    calcularvendidoseingresostotal(cuerpo)
    Swal.fire('Se ha eliminado la columna', 'Se ha eliminado la columna y todos sus contenidos exitosamente', 'success')
  }
}

qsclick('#diaanterior', q => location = `/registrarventas/${hoy.subtract('1', 'day').format('D-M-YYYY')}`)
qsclick('#diasiguiente', q => location = `/registrarventas/${hoy.add('1', 'day').format('D-M-YYYY')}`)

function añadirceros(cuerpo) {
  cuerpo.qsafor('td:not(:nth-child(1),:nth-child(2))', celda => (celda.textContent ||= 0))
  calcularvendidoseingresostotal(cuerpo)
}

qsclick('#guardar', async q => {
  if (!(await borrarTablasVacias())) return
  let camioneros = $grupotabs.qsa('tab-content input')
  for (let i = 0; i < camioneros.length; i++) {
    if (!(await validarCamioneros(camioneros[i], i + 1))) return
  }

  let tablas = $tablas()
  for (let i = 0; i < tablas.length; i++) {
    tablaValida = false
    tablaParaValidacion = tablas[i]
    permitirFilasVacias = false
    if (!(await validarDatosTabla(tablas[i], i + 1))) return
  }

  let data = JSON.stringify({
    _id: hoy.valueOf(),
    ultimocambio: Date.now(),
    tablas: tablas.map(tabla => ({
      trabajador: tabla.closest('tab-content').qs('.trabajador').value,
      productos: tabla.qsarr('.cuerpo tr').map(fila => ({
        nombre: fila.cells[0].textContent,
        precio: fila.cells[1].textContent.aFloat(),
        viajes: [...Array(tabla.qsa('.pintarcolumnas>*').length * 2)].map((_, j) => fila.cells[j + colsinicio].textContent.aInt()),
        vendidos: fila.qs('td:nth-last-child(2)').textContent.aInt(),
        ingresos: fila.qs('td:nth-last-child(1)').textContent.aFloat(),
      })),
      totalvendidos: tabla.qs('tfoot tr').cells[1].textContent.aInt(),
      totalingresos: tabla.qs('tfoot tr').cells[2].textContent.aFloat(),
    })),
  })
  console.log(data)

  hazPost('/registrarventas/guardar', data, q => Swal.fire('Se ha guardado exitosamente', 'El archivo se ha almacenado en la base de datos', 'success'), e => swalError('No se pudo guardar en la base de datos'))
})

function formatearCeldas({ cells: [, prod, prec] }) {
  prod.textContent = prod.textContent.cantidadFormateada()
  prec.textContent = prec.textContent.aQuetzales()
}

qsclick('#resumen', async q => {
  let tablas = $tablas()
  let tablasValores = tablas.map(tabla => {
    let productos = tabla.qsarr('.cuerpo td:first-child')
    let vendidos = tabla.qsarr('.cuerpo td:nth-last-child(2)')
    let ingresos = tabla.qsarr('.cuerpo td:nth-last-child(1)')
    return productos.map((_, i) => ({ producto: productos[i].textContent.normalizar(), vendidos: vendidos[i].textContent.aInt() || 0, ingresos: ingresos[i].textContent.aFloat() || 0, productoDesnormalizado: productos[i].textContent }))
  })

  let p = {}
  tablasValores.forEach(tabla => {
    tabla.forEach(fila => {
      let { producto: n, vendidos, ingresos, productoDesnormalizado } = fila
      if (p[n]) {
        p[n].vendidos += vendidos
        p[n].ingresos += ingresos
      } else p[n] = { vendidos, ingresos, productoDesnormalizado }
    })
  })
  Object.keys(p).forEach(x => (p[x].ingresos = p[x].ingresos.normalizarPrecio()))

  let html = `<table id="tablaresumen" class="mx-auto tablacompleta"><thead><tr>
    <th class="thresumenproducto">Productos</th>
    <th class="thresumenvendidoseingresos">Vendidos</th>
    <th class="thresumenvendidoseingresos">Ingresos</th>
  </tr></thead><tbody class="cuerpo">
  ${Object.keys(p).map(key => `<tr><td>${p[key].productoDesnormalizado}</td><td>${p[key].vendidos || 0}</td><td>${p[key].ingresos || 0}</td></tr>`).join('')}
  </tbody><tfoot><tr><td style="text-align: center">Total:</td>
  <td class="totalresumen"></td><td class="totalresumen"></td></tr></tfoot></table>
  <div class="contenedorflex">
    <button class="btn btn-primary margenbotonswal btncontinuar2" onclick="cerrarSwal()">Continuar</button>
    <boton-pdf id="exportarAPDFResumen"></boton-pdf>
    <boton-excel id="exportarAExcelResumen"></boton-excel>
  </div>`

  await swal.fire({
    title: 'Resumen de todo lo que vendiste durante el día',
    width: innerWidth * 0.6,
    html,
    showConfirmButton: false,
    didOpen: swalResumen
  })
})

function swalResumen() {
  let tablaresumen = qs('#tablaresumen')
  let cuerpo = tablaresumen.qs('tbody')
  calcularvendidoseingresostotal(cuerpo)
    ;[...cuerpo.rows].forEach(x => formatearCeldas(x))
  formatearCeldas(tablaresumen.qs('tfoot tr'))

  qs('#exportarAPDFResumen').inicializar(q => `<div class="tituloresumen" style="margin-left: ${tablaresumen.clientWidth / 2 - 150}px">Resumen	&nbsp;del día ${fechastr}</div>${tablaresumen.outerHTML.replace('id="tablaresumen"', '')}<br><br>`, `Resumen de ventas ${fechastr}`)

  qs('#exportarAExcelResumen').inicializar(function () {
    let nombre = `Resumen de ventas ${fechastr}.xlsx`
    let workbook = XLSX.utils.book_new()
    let ws = XLSX.utils.table_to_sheet(tablaresumen, { raw: true })
    let range = XLSX.utils.decode_range(ws['!ref'])
    ws['!cols'] = [{ width: 20 }]
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
    XLSX.utils.book_append_sheet(workbook, ws, `Resumen	del día ${fechastr}`)
    XLSX.writeFile(workbook, nombre)
  })
}

async function borrarFilasVacias(tabla, numtabla) {
  let tablaCopia = tabla.clonar()
  let filasCopia = tablaCopia.qsarr('.cuerpo tr')
  let filasQueNoEstanVacias = filasCopia.filter(fila => {
    let celdasEspecificas = [...fila.cells].slice(colsinicio, -colsfinal)
    let res = celdasEspecificas.every(celda => celda.textContent === '0' || celda.textContent === '')
    if (res) resaltarCeldas(fila)
    return !res
  })
  if (filasQueNoEstanVacias.length === filasCopia.length) return clonaValores(tabla, tablaCopia)

  let tablaCopiaSinFilasVacias = tabla.clonar()
  let tablaSinFilasVacias = filasQueNoEstanVacias.map(x => x.outerHTML).join('')
  tablaCopiaSinFilasVacias.qs('.cuerpo').html(tablaSinFilasVacias)

  await swal3Botones.fire({
    title: 'Se han detectado filas vacias',
    icon: 'warning',
    width: innerWidth * 3 / 4,
    html: `<div class="textovista">Se han detectado filas vacias en la tabla ${numtabla}, qué desea hacer?</div>
    ${tabsTexto(tablaCopia, tablaCopiaSinFilasVacias, 'Ver filas vacías')}
    <div class="contenedorbotonesEnFila">
      <button class="botonswal3 botonconfirm" onclick="borrarFilasVaciasB()">Borrar las filas vacías</button>
      <button class="botonswal3 botondeny" onclick="conservarFilasVaciasB()">Conservar las filas vacías</button>
      <button class="botonswal3 botonconfirm" onclick="validarDatosB()">Ya lo arreglé</button>
      <button class="botonswal3 botoncancel" onclick="cancelarB()">Volver</button>
    </div>`,
    showCancelButton: false,
    showConfirmButton: false,
    showDenyButton: false,
  })

  if (opcionSwal === 'borrarFilasVacias') {
    if (filasQueNoEstanVacias.length === 0) return mostrarError('Error', `No se puede guardar la tabla ${numtabla} porque está vacía`)
    let filasVacias = [...tablaCopia.qs('.cuerpo').rows].filter(fila => {
      let res = [...fila.cells].slice(colsinicio, -colsfinal).every(celda => celda.textContent === '0' || celda.textContent === '')
      if (res) resaltarCeldas(fila)
      return res
    })
    filasVacias.forEach(fila => fila.remove())
    return clonaValores(tabla, tablaCopia)
  } else if (opcionSwal === 'conservarFilasVacias') {
    permitirFilasVacias = true
    return true
  } else if (opcionSwal === 'validarDatos') {
    //TODO este ver por que tiene getHtmlContainer
    let tablaCopia = swal3Botones.getHtmlContainer().querySelector('table')
    borrarEnfocarFilas(tablaCopia)
    return await validarDatosTabla(tablaCopia, numtabla)
  }
  return false
}

async function entraMasDeLoQueSale(tabla, numtabla) {
  let tablaCopia = tabla.clonar()
  let cuerpocopia = tablaCopia.qs('.cuerpo')
  let valido = true
  tablaCopia.qsafor('.cuerpo tr', ({ cells }, i) => {
    let fila = cuerpocopia.rows[i]
    for (let j = colsinicio; j < cells.length - colsfinal; j += 2) {
      let entra = fila.cells[j]
      let sale = fila.cells[j + 1]
      let invalido = sale.textContent.aInt() > entra.textContent.aInt()
      sale.alternarClase('enfocar', invalido)
      entra.alternarClase('enfocar', invalido)
      if (invalido) valido = false
    }
  })

  if (valido) {
    clonaValores(tabla, tablaCopia)
    tablaValida = true
    return true
  }

  let { isConfirmed } = await swalConfirmarYCancelar.fire({
    title: `<h3>Se ha detectado filas en la tabla ${numtabla} donde lo que sale es mayor que lo que entra, por favor corrígelos para poder guardar los datos</h3>`,
    icon: 'error',
    width: innerWidth * 3 / 4,
    html: tablaCopia,
    showCancelButton: true,
    stopKeydownPropagation: false,
    confirmButtonText: 'Ya lo arreglé',
    cancelButtonText: 'Volver',
  })

  if (isConfirmed) {
    borrarEnfocarFilas(tablaCopia)
    return await validarDatosTabla(tablaCopia, numtabla)
  } else return false
}

async function validarQueTablaNoTengaMismoNombre(tabla, numtabla) {
  let tablaCopia = tabla.clonar()
  let productosCopia = tablaCopia.qsarr('.cuerpo tr td:nth-child(1)')
  let arrayNormalizado = productosCopia.map(x => x.textContent.normalizar())
  let hayRepetidos = false
  arrayNormalizado.forEach((x, i) => {
    if (arrayNormalizado.indexOf(x) !== i) {
      let color = colorAleatorio()
      productosCopia.forEach(p => p.textContent.normalizar() === x && (p.style.background = color))
      hayRepetidos = true
    }
  })
  if (!hayRepetidos) return clonaValores(tabla, tablaCopia)
  let { isConfirmed } = await swalConfirmarYCancelar.fire({
    title: `Error, hay productos que tienen el mismo nombre en la tabla ${numtabla}`,
    icon: 'error',
    width: innerWidth * 3 / 4,
    html: tablaCopia,
    showCancelButton: true,
    stopKeydownPropagation: false,
    confirmButtonText: 'Ya lo arreglé',
    cancelButtonText: 'Volver',
  })
  if (isConfirmed) {
    tablaCopia.qsafor('.cuerpo tr td:nth-child(1)', x => x.style.background = '#0f0d35')
    return await validarDatosTabla(tablaCopia, numtabla)
  }
  return false
}

function colorAleatorio() {
  const limite = 128
  const color = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`
  const rgb = color.match(/\d+/g).map(Number)
  const brillo = 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]
  if (brillo > limite) return colorAleatorio()
  return color
}

async function validarQueLosPreciosNoTenganPuntoAlFinal(tabla, numtabla) {
  let tablaCopia = tabla.clonar()
  let hayTerminaConPunto = false
  tablaCopia.qsafor('.cuerpo td:nth-child(2)', x => {
    if (x.textContent.endsWith('.')) {
      resaltarCelda(x)
      hayTerminaConPunto = true
    }
  })

  if (!hayTerminaConPunto) return clonaValores(tabla, tablaCopia)

  let result = await swal3BotonesInvertido.fire({
    title: `Hay valores que terminan en . en la tabla ${numtabla}, te faltó escribir un número? Qué deseas hacer?`,
    icon: 'error',
    width: innerWidth * 3 / 4,
    html: tablaCopia,
    showCancelButton: true,
    showDenyButton: true,
    stopKeydownPropagation: false,
    confirmButtonText: 'Borrar los puntos al final',
    denyButtonText: `Ya lo arreglé`,
    cancelButtonText: 'Volver',
  })
  if (result.isConfirmed) {
    tabla.qsafor('.cuerpo td:nth-child(2)', x => {
      let precio = x.textContent
      if (precio.endsWith('.')) x.textContent = precio.replace('.', '')
    })
    return clonaValores(tabla, tablaCopia)
  } else if (result.isDenied) {
    borrarEnfocarPreciosYProductos(tablaCopia)
    return await validarDatosTabla(tablaCopia, numtabla)
  }
  return false
}

async function validarQueLosPreciosNoSeanMenorAUno(tabla, numtabla) {
  let tablaCopia = tabla.clonar()
  let hayEmpiezaConPunto = false
  tablaCopia.qsafor('.cuerpo td:nth-child(2)', x => {
    if (x.textContent.startsWith('0.')) {
      resaltarCelda(x)
      hayEmpiezaConPunto = true
    }
  })

  if (!hayEmpiezaConPunto) return clonaValores(tabla, tablaCopia)

  let html = tablaCopia.outerHTML + `<div class="contenedorbotonesEnFila">
    <button class="botonswal3 botonconfirm" onclick="continuarSwalB()">Sí estoy seguro, &nbsp;&nbsp; continuar</button>
    <button class="botonswal3 botondeny" onclick="removerCeroPuntoB()">Remueve los 0. al principio y continuar</button>
    <button class="botonswal3 botonconfirm" onclick="validarDatosB()">Ya lo arreglé</button>
    <button class="botonswal3 botoncancel" onclick="cancelarB()">No continuar</button>
  </div>`
  await swal3Botones.fire({
    title: `Hay valores menores a 1, en la tabla ${numtabla} estás seguro que no es un error? Deseas continuar?`,
    icon: 'error',
    width: innerWidth * 3 / 4,
    html,
    stopKeydownPropagation: false,
    showCancelButton: false,
    showDenyButton: false,
    showConfirmButton: false,
  })
  if (opcionSwal === 'removerCeroPunto') {
    tabla.qsafor('.cuerpo td:nth-child(2)', x => {
      let precio = x.textContent
      if (precio.startsWith('0.')) x.textContent = precio.replace('0.', '')
    })
    return true
  } else if (opcionSwal === 'validarDatos') {
    let tablaCopia = swal3Botones.getHtmlContainer().querySelector('table')
    borrarEnfocarPreciosYProductos(tablaCopia)
    return await validarDatosTabla(tablaCopia, numtabla)
  } else if (opcionSwal === 'continuar') return true
  return false
}

async function validarProductosYPrecios(tabla, numtabla) {
  tabla.qsafor('.cuerpo tr', ({ cells: [producto, precio] }) => {
    let p = precio.textContent
    producto.textContent = producto.textContent.trim()
    if (p === '.') precio.textContent = ''
    else if (!p.endsWith('.')) {
      let precioNormalizado = p.normalizarPrecio()
      if (!isNaN(precioNormalizado)) precio.textContent = precioNormalizado
    }
  })

  let tablaCopia = tabla.clonar()
  let filasCopia = tablaCopia.qsarr('.cuerpo tr')
  let verificacionProductos = true
  let verificacionPrecios = true

  filasCopia.forEach(({ cells: [producto, precio] }) => {
    if (producto.textContent === '') {
      resaltarCelda(producto)
      verificacionProductos = false
    }
    if (precio.textContent === '' || precio.textContent === '0') {
      resaltarCelda(precio)
      verificacionPrecios = false
    }
  })
  if (verificacionProductos && verificacionPrecios) return clonaValores(tabla, tablaCopia)

  let titulo = `<h3>Se ha detectado valores vacíos en la columna ${!verificacionProductos && !verificacionPrecios ? 'productos y la columna precios' : !verificacionProductos ? 'productos' : 'precios'} de la tabla ${numtabla}
  <br>Por favor corrígelos para poder guardar los datos</h3>`
  let result = await swalConfirmarYCancelar.fire({
    title: titulo,
    icon: 'error',
    width: innerWidth * 3 / 4,
    html: tablaCopia,
    showCancelButton: true,
    stopKeydownPropagation: false,
    confirmButtonText: 'Ya lo arreglé',
    cancelButtonText: 'Volver',
  })
  if (result.isConfirmed) {
    borrarEnfocarPreciosYProductos(tablaCopia)
    return await validarDatosTabla(tablaCopia, numtabla)
  } else return false
}

async function borrarTablasVacias() {
  let tablas = $contents.qsarr('table')
  let tablasVacias = tablas.filter(tabla => tabla.qs('tfoot td:nth-child(3)').textContent === '')

  if (tablasVacias.length === 0) return true

  let html = `<div class="textovista">${tablasVacias.length === 1 ? 'Se ha detectado que esta tabla está vacía así que será eliminada' : 'Se han detectado las siguientes tablas vacias las cuales serán eliminadas'}</div>
  <div class="swalTab"><div class="tabs">${tablasVacias.map(tabla => `<tab-label>Camión ${tabla.closest('tab-content').indice() + 1}</tab-label>`).join('')}</div>
  <div>${tablasVacias.map(tabla => `<tab-content>${tabla.clonar().outerHTML}</tab-content>`).join('')}</div>
  <div><br><div class="textovista">Desea continuar?</div>`

  if (await swalContinuarNoContinuar('Se han detectado tablas vacias', html)) {
    if (await soloHayUnCamion()) return false

    tablasVacias.forEach(tabla => {
      let contenidoTab = tabla.closest('tab-content')
      qs(`.tab:has([data-tabid=${contenidoTab.dataset.tabid}])`).remove()
      contenidoTab.remove()
    })

    reacomodarCamiones()
    Swal.fire('Se han eliminado las tablas vacías', 'Se han eliminado las tablas vacías exitosamente', 'success')
    return true
  }
  return false
}

async function swalContinuarNoContinuar(title, html) {
  let { isConfirmed } = await swalConfirmarYCancelar.fire({
    title,
    icon: 'warning',
    width: innerWidth * 3 / 4,
    html,
    showCancelButton: true,
    confirmButtonText: 'Continuar',
    cancelButtonText: 'No continuar',
  })
  return isConfirmed
}

async function borrarCamiones(label, e) {
  e.stopImmediatePropagation()
  let id = label.padre().indice() + 1
  let tabla = $contents.qs(`tab-content:nth-child(${id}) table`)
  let html = `<custom-tabs class="swalTab"><div class="tabs"><tab-label>Camión ${id}</tab-label></div>
  <div><tab-content>${tabla.clonar().outerHTML}</tab-content></div></custom-tabs>
  <br><div class="textovista">Deseas continuar?</div>`

  if (await swalContinuarNoContinuar('Estás seguro que deseas eliminar este camión?', html)) {
    if (await soloHayUnCamion()) return
    delete objReordenarPlantillas[id - 1]
    label.padre().remove()
    $contents.qs(`tab-content:nth-child(${id})`).remove()
    reacomodarCamiones()
    swalExito('Se ha eliminado el camión exitosamente')
  }
}

function reacomodarCamiones() {
  $tabs.qsafor('.tab-label', (tab, i) => tab.qs('label').html(`Camión ${i + 1}`))
  if (!$tabs.qs('.tab-label input:checked')) $tabs.qs('.tab-label:first-child label').click()
}

async function validarCamioneros(textbox, numerotabla) {
  textbox.value = textbox.value.trim()
  if (textbox.value !== '') return true
  let html = `<h3>El nombre del conductor del camión ${numerotabla} está vacío. <br> Escribe o elige un nombre para continuar </h3> <br>
<div style="display: flex; justify-content: center;"><span style="margin: auto 10px; font-weight: 500; font-size: 19px;">Escribe el nombre del conductor:</span><dropdown-camioneros></dropdown-camioneros></div>`
  let { isConfirmed } = await swalConfirmarYCancelar.fire({
    icon: 'warning',
    width: innerWidth * 3 / 4,
    html,
    showCancelButton: true,
    confirmButtonText: 'Continuar',
    cancelButtonText: 'Volver',
  })
  if (isConfirmed) {
    textbox.value = qs('#swal2-html-container input').value.trim()
    if (textbox.value !== '') return true
    return validarCamioneros(textbox, numerotabla)
  } else return false
}

async function validarDatosTabla(tabla, numtabla) {
  if (!permitirFilasVacias && !(await borrarFilasVacias(tabla, numtabla))) return false
  if (tablaValida) return true
  añadirceros(tabla.qs('.cuerpo'))
  let funcsValidar = [validarProductosYPrecios, validarQueTablaNoTengaMismoNombre, validarQueLosPreciosNoTenganPuntoAlFinal, validarQueLosPreciosNoSeanMenorAUno, entraMasDeLoQueSale]

  for (let x of funcsValidar) {
    if (!(await x(tabla, numtabla))) return false
    if (tablaValida) return true
  }
}

function clonaValores(tabla, tablaCopia) {
  tabla.html(tablaCopia.innerHTML)
  tablaParaValidacion.html(tablaCopia.innerHTML)
  return true
}

let añadidoNombre = o => o === 0 ? ' solo ' + $tabs.qs('.tabRadio:checked + label').textContent.toLowerCase() : ''
qs('#exportarexcel').inicializar(function () {
  let nombre = `registro ventas ${fechastr}${añadidoNombre(_exportarExcel)}.xlsx`
  let workbook = XLSX.utils.book_new()
  let tablas = _exportarExcel === 0 ? [$tabla()] : $tablas()

  tablas.forEach((tabla, i) => {
    let ws = XLSX.utils.table_to_sheet(tabla, { raw: true })
    let range = XLSX.utils.decode_range(ws['!ref'])
    ws['!cols'] = [{ width: 20 }]
    ws['!rows'] = [...Array(range.e.r - range.s.r + 1)].map(w => ({ hpt: 24 }))

    for (let i = range.s.r; i <= range.e.r; i++) {
      for (let j = range.s.c; j <= range.e.c; j++) {
        let cell_address = XLSX.utils.encode_cell({ r: i, c: j })
        let cell = ws[cell_address]
        if (cell) {
          this.ajustesCeldasExcel(cell)
          cell.s.fill = { fgColor: { rgb: i === 0 || i === 1 ? '192435' : j === 0 || j === 1 || j === range.e.c - 1 || j === range.e.c || i === range.e.r ? '0f0d35' : j % 4 === 2 || j % 4 === 3 ? '024649' : '192435' } }
          if (i === range.e.r && j === 0) cell.s.alignment.horizontal = 'right'
        }
      }
    }
    let celdaVacia = { t: 's', v: '' }
    let bordeCelda = { border: { right: { style: 'thin', color: { rgb: '000000' } } } }
    ws['A2'] = celdaVacia
    ws['A2'].s = bordeCelda
    let vend = XLSX.utils.encode_cell({ r: 1, c: range.e.c - 1 })
    ws[vend] = celdaVacia
    ws[vend].s = bordeCelda
    XLSX.utils.book_append_sheet(workbook, ws, `Camión ${_exportarExcel === 0 ? tabla.closest('tab-content').indice() + 1 : i + 1}`)
  })
  XLSX.writeFile(workbook, nombre)
})

qs('#exportarpdf').inicializar(() => {
  let tablas = _exportarPDF === 0 ? [$tabla()] : $tablas()
  let medirTabla = qs('#medirTabla')
  return tablas.map((tabla, i) => {
    medirTabla.html(tabla.clonar().outerHTML)
    let copiaTabla = medirTabla.qs('table')
    copiaTabla.qs('.pintarcolumnas').html('')
    return `<div class="titulopdf" style="margin-left: ${copiaTabla.clientWidth / 2 - 15}px">Camión ${_exportarPDF === 0 ? tabla.closest('tab-content').indice() + 1 : i + 1}</div>
    ${copiaTabla.outerHTML}<br><br>`
  }).join('')
}, q => `registro ventas ${fechastr}${añadidoNombre(_exportarPDF)}`)

async function pidePlantilla(nombre) {
  if (!listaplantillas[nombre]) {
    let r = await fetch(`/plantillas/devuelveplantilla/${nombre}`)
    if (!r.ok) return mostrarError('No se pudo recuperar la plantilla', 'Error de conexión')
    listaplantillas[nombre] = await r.json()
  }
  return listaplantillas[nombre]
}

qs('custom-dropdown').metododropdown = async option => {
  let p = await pidePlantilla(option.textContent)
  if (!p) return
  plantillaSeleccionada = p
  let html = `<table style="margin: 0 auto;" class="tablacompleta">
  <thead><tr><th class="prod">Productos</th><th class="tr">Precio</th></tr></thead>
  <tbody>${p.map(x => `<tr><td>${x.producto}</td><td>${x.precio.normalizarPrecio()}</td></tr>`).join('')}</tbody>
  </table>`
  if (await swalSíNo('Estás seguro que deseas utilizar esta plantilla?', html, null)) await opcionesPlantilla()
}

async function opcionesPlantilla() {
  let html = `<div class="contenedorbotones">
      <button class="botonswal4 botonconfirm" onclick="crearPlantillaVacia()">Crear plantilla vacía</button>
      <button class="botonswal4 botondeny" onclick="mezclarEliminandoHandler()">Mezclar y eliminar los productos que no estén en ambas plantillas</button>
      <button class="botonswal4 cuartaopcion" onclick="mezclarSinEliminarHandler()">Mezclar ambas plantillas sin eliminar productos</button>
      <button class="botonswal4 botoncancel" onclick="cerrarSwal()">Cancelar</button>
    </div>`
  await swal.fire({
    width: innerWidth / 2,
    focusConfirm: false,
    icon: 'question',
    title: 'Qué deseas hacer con esta plantilla?',
    showConfirmButton: false,
    html,
  })
}

async function crearPlantillaVacia() {
  let formatotablavacia = creaTablaVacia(plantillaSeleccionada)
  if (await swalSíNo('Estás seguro que deseas utilizar esta plantilla?', formatotablavacia, 850)) {
    $tabla().outerHTML = formatotablavacia
    borrarListaOrdenarPlantillasTablaActual()
    tablasSortable()
  }
  Swal.close()
}

let mezclarEliminandoHandler = async q => await ordenHandler(0)
let mezclarSinEliminarHandler = async q => await ordenHandler(1)

async function ordenHandler(sinEliminar) {
  let result = await swal3Botones.fire({
    title: 'Qué orden desea utilizar?',
    icon: 'question',
    width: innerWidth / 2,
    showCancelButton: true,
    showDenyButton: true,
    confirmButtonText: 'Usar orden de la tabla',
    denyButtonText: `Usar orden de la plantilla seleccionada`,
    cancelButtonText: 'Volver',
  })
  if (result.isConfirmed) await mezclarHandler(sinEliminar, 1)
  else if (result.isDenied) await mezclarHandler(sinEliminar, 0)
  else if (result.dismiss === Swal.DismissReason.cancel) opcionesPlantilla()
}

async function mezclarHandler(sinEliminar, ordenTabla) {
  let productos = plantillaSeleccionada
  let formatoTablaLlena = mezclarOrden(productos, sinEliminar, ordenTabla)
  let tabla = $tabla()
  let tablaCopia = tabla.clonar()
  let cuerpoCopia = tablaCopia.qs('.cuerpo')
  cuerpoCopia.html(formatoTablaLlena)
  calcularvendidoseingresostotal(cuerpoCopia)

  let result = await swalConfirmarYCancelar.fire({
    title: 'Aquí puedes ver las diferencias entre la tabla original y el resultado final',
    icon: 'warning',
    width: innerWidth * 3 / 4,
    html: tabsTexto(tabla, tablaCopia, 'Ver tabla original') + `<br><br><h2>Deseas conservar los cambios?</h2>`,
    showCancelButton: true,
    confirmButtonText: 'Conservar',
    cancelButtonText: 'Volver',
  })
  if (result.isConfirmed) tabla.outerHTML = tablaCopia.outerHTML
  else if (result.dismiss === Swal.DismissReason.cancel) ordenHandler(sinEliminar)
  borrarListaOrdenarPlantillasTablaActual()
  tablasSortable()
}

function mezclarOrden(productos, sinEliminar, ordenTabla) {
  let filas = $filas()
  let formatoTablaLlena = ''
  let pTabla = filas.map(x => x.cells[0].textContent.normalizar())
  let pSeleccionada = productos.map(x => x.producto.normalizar())
  let devuelveProductoVacio = producto => `<tr><td contenteditable="true">${producto.producto}</td><td contenteditable="true">${producto.precio.normalizarPrecio()}</td>${[...Array($cantidadSaleYEntra() - 4)].map(_ => `<td contenteditable="true"></td>`).join('')} <td></td><td class="borrarfilas"></td></tr>`
  let agregaProducto = (i, j) => {
    let filaCopia = filas[i].clonar()
    filaCopia.cells[0].textContent = productos[j].producto
    filaCopia.cells[1].textContent = productos[j].precio.normalizarPrecio()
    calcularvendidoseingresos(filaCopia)
    formatoTablaLlena += filaCopia.outerHTML
  }

  if (ordenTabla) {
    pTabla.forEach((x, i) => {
      let j = pSeleccionada.findIndex(y => y === x)
      if (j >= 0) agregaProducto(i, j)
      else if (sinEliminar) formatoTablaLlena += filas[i].outerHTML
    })
    pSeleccionada.forEach((x, i) => !pTabla.includes(x) && (formatoTablaLlena += devuelveProductoVacio(productos[i])))
  } else {
    pSeleccionada.forEach((x, i) => {
      let j = pTabla.findIndex(y => y === x)
      if (j >= 0) agregaProducto(j, i)
      else formatoTablaLlena += devuelveProductoVacio(productos[i])
    })
    if (sinEliminar) pTabla.forEach((x, i) => !pSeleccionada.includes(x) && (formatoTablaLlena += filas[i].outerHTML))
  }
  return formatoTablaLlena
}
String.prototype.aQuetzales = function () { return new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'GTQ' }).format(this.aFloat()) }
String.prototype.cantidadFormateada = function () { return new Intl.NumberFormat('es-GT').format(this.aFloat()) }

let creaTablaVacia = plantilla => `<table class="tablacompleta">
  <thead>
    <col><col><colgroup class="pintarcolumnas"><col span="2"></colgroup><col><col>
    <tr>
      <th rowspan="2" class="prod">Productos</th><th rowspan="2" class="tr">Precio</th>
      <th colspan="2" class="borrarcolumnas">Viaje No. 1</th>
      <th rowspan="2" class="tr columnaVendidos">Vendidos</th><th rowspan="2" class="tr">Ingresos</th>
    </tr>
    <tr class="saleYEntra"><th>Sale</th><th>Entra</th></tr>
  </thead>
  <tbody class="cuerpo">
  ${plantilla.map(x => `<tr><td contenteditable="true">${x.producto}</td><td contenteditable="true">${x.precio.normalizarPrecio()}</td><td contenteditable="true"></td><td contenteditable="true"></td><td></td><td class="borrarfilas"></td></tr>`).join('')}
  </tbody>
  <tfoot><tr><td colspan="4">Total:</td><td></td><td></td></tr></tfoot>
</table>`

bodyOnClick('.añadirCamion', async q => {
  let cantidadTabs = $contents.children.length
  antes(qs('.añadirCamion'), `<tab-label class="borrarcamiones">Camión ${cantidadTabs + 1}</tab-label>`)
  $contents.añadirHTML(`<tab-content><div class="contenedor-trabajador"><label class="label-trabajador">Nombre del conductor:</label><dropdown-camioneros></dropdown-camioneros><custom-popover data-alineacion="middle">${qs('.contenedor-trabajador svg').dataset.bsContent}</custom-popover></div>${creaTablaVacia(await pidePlantilla(plantillaDefault))}</tab-content>`)
  new bootstrap.Popover($contents.qs('tab-content:last-child [data-bs-toggle="popover"]'), { html: true })
  tablasSortable()
})

bodyOnClick('.grupotabs .dropdown-item', c => { c.closest('tab-content').qs('.trabajador').value = c.textContent })
bodyOn('hide.bs.dropdown', '#dropdowncamionero', c => { c.closest('.swal2-html-container').style.minHeight = '68.2px' })
bodyOnClick('.swal2-html-container .dropdown-toggle', c => c.closest('.swal2-html-container').style.minHeight = `${(c.sig().children.length - 4) * 30 + 135}px`)

bodyOnClick('.contenedoreliminar', async q => {
  if (await swalSíNo('Estás seguro que deseas borrar este registro?', '')) {
    modalAutenticacion.mostrar(q => {
      hazDelete('', JSON.stringify({ contraseñaVerificacion: qs('#verificacionIdentidad').value }), async q => {
        await swalExito('Se ha borrado el registro exitosamente')
        location.reload()
      })
    })
    esconderOpciones()
  }
})

bodyOnClick('.contenedormover', async q => {
  esconderOpciones()
  await moverReg(hoy.valueOf(), '/registrarventas/mover')
})
dayjs.extend(window.dayjs_plugin_utc)
let colsinicio = 2, colsfinal = 2
let [dia, mes, año] = document.querySelector('.fechanum').textContent.split('/') //este hay que ponerle textcontent porque si esta escondido con innertext no lo agarra
let hoy = dayjs(año + '-' + mes + '-' + dia).utc(true)
let fechastr = hoy.format('D-M-YYYY')
let timer, touchduration = 600
let tablaValida = false, yaSeRecibioTouch = false, permitirFilasVacias = false, opcionSwal = false
let listaplantillas = {}, objReordenarPlantillas = [], tablaParaValidacion, plantillaSeleccionada = {}

// let esTouch = function () { return /Android|webOS|iPhone|iPad|tablet/i.test(navigator.userAgent) }
let esTouch = () => 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0
let devuelveListaTablas = q => [...$('.grupotabs .tabs__radio')].map(x => document.querySelector(`.contenidotabs [data-tabid="${x.dataset.tabid}"] table`))
let borrarListaOrdenarPlantillasTablaActual = q => borrarListaOrdenarPlantillas(_tabla(), _idTab())
let devuelveCamioneros = q => $('.dropdown-menu').clone()[0].outerHTML
let borrarEnfocarFilas = tabla => $(tabla).find('.cuerpo td').removeClass('enfocar')
let soloHayUnCamion = async q => ($('.grupotabs table').length === 1 ? (await mostrarError('No se puede borrar, debe haber al menos un camión'), true) : false)
let mostrarError = async (e, titulo = 'Error') => (await Swal.fire(titulo, e, 'error'), false)
let tablasSortable = q => $('.grupotabs table .cuerpo').sortable({ axis: 'y', disabled: !switchReordenarProductos })

let cerrarSwal = q => Swal.close()
let borrarFilasVaciasB = q => ((opcionSwal = 'borrarFilasVacias'), Swal.close())
let conservarFilasVaciasB = q => ((opcionSwal = 'conservarFilasVacias'), Swal.close())
let continuarSwalB = q => ((opcionSwal = 'continuar'), Swal.close())
let removerCeroPuntoB = q => ((opcionSwal = 'removerCeroPunto'), Swal.close())
let validarDatosB = q => ((opcionSwal = 'validarDatos'), Swal.close())
let cancelarB = q => ((opcionSwal = 'cancelar'), Swal.close())

let borrarColumnasHandler = e => borrarElementos(e, opcionBorrarFilasYColumnas, borrarColumnas, e.currentTarget)
let borrarFilasHandler = e => borrarElementos(e, opcionBorrarFilasYColumnas, borrarFilas, e.currentTarget)
let borrarCamionesHandler = e => borrarElementos(e, opcionBorrarCamiones, borrarCamiones, e.currentTarget)
let borrarEnfocarPreciosYProductos = tabla => $(tabla).find('.cuerpo tr').each((_, x) => $(x.cells).slice(0, 2).removeClass('enfocar'))

onload = q => {
  if (esTouch()) $.getScript('/touch.js')
  colocarValoresConfig()
  guardarValoresConfig()
}

let _cantidadTabs = () => $('.contenidotabs').children().length
let _idTab = () => $('.grupotabs .tabs__radio:checked')[0].dataset.tabid
let _tabla = () => $(`.contenidotabs [data-tabid="${_idTab()}"] table`)[0]
let _cuerpo = () => _tabla().querySelector('.cuerpo')
let _filas = () => [..._cuerpo().rows]
let _pie = () => _tabla().querySelector('tfoot')
let _pintarColumnas = () => _tabla().querySelector('.pintarcolumnas')
let _cantidadViajes = () => _pintarColumnas().children.length
let _saleYEntra = () => _tabla().querySelector('.saleYEntra')
let _cantidadSaleYEntra = () => _pintarColumnas().children.length * 2 + colsinicio + colsfinal

$('.cuerpo td:not(:nth-last-child(1), :nth-last-child(2))').prop('contentEditable', true)
$('.cuerpo td:last-child').addClass('borrarfilas')
$('.tabs__label').addClass('borrarcamiones')

$('body').on('click', '.fecha', q => $('.fecha').toggle())
let opcionBorrarFilasYColumnas = -1
let opcionBorrarCamiones = -1
let opcionExportarPDF = -1
let opcionExportarExcel = -1
let switchReordenarProductos = -1
let switchReordenarCamiones = -1
let switchOrdenarOrdenAlfabetico = -1

$('body').on('click', '.grupotabs .tabs__label', e => $('.restaurarplantilla').css('display', objReordenarPlantillas[e.currentTarget.previousElementSibling.dataset.tabid] ? 'initial' : 'none'))
$('body').on('click', '.restaurarplantilla', e => {
  let tabla = _tabla()
  let cuerpo = $(tabla).find('.cuerpo')[0]
  let id = _idTab()
  cuerpo.innerHTML = restaurarOrdenPlantilla(objReordenarPlantillas[id], cuerpo)
  borrarListaOrdenarPlantillas(tabla, id)
})

function borrarListaOrdenarPlantillas(tabla, id) {
  $(tabla).find(`th:not([colspan="2"])`).each((_, x) => x.style.setProperty('--flecha', '"↓"'))
  tabla.querySelector('.activo')?.classList.remove('activo')
  $('.restaurarplantilla').css('display', 'none')
  delete objReordenarPlantillas[id]
}

function restaurarOrdenPlantilla(ordenAnterior, cuerpo) {
  let filas = [...cuerpo.rows]
  let formatoTablaLlena = ''
  let ordenNuevo = filas.map(x => x.cells[0].innerText.normalizar())
  ordenAnterior.forEach(producto => {
    let i = ordenNuevo.findIndex(x => x === producto)
    if (i >= 0) formatoTablaLlena += filas[i].outerHTML
  })

  ordenNuevo.forEach((prod, i) => !ordenAnterior.includes(prod) && (formatoTablaLlena += filas[i].outerHTML))
  return formatoTablaLlena
}

async function guardarValoresConfig() {
  //estos son solo para visualizar los iconos
  $('.tabs').toggleClass('cerrarconboton', opcionBorrarCamiones === 1)
  $('.contenidotabs').each((_, x) => {
    x.classList.toggle('cerrarconboton', opcionBorrarFilasYColumnas === 1)
    x.classList.toggle('ordenarAlfabeticamente', switchOrdenarOrdenAlfabetico)
  })

  $('.tabs').sortable({
    axis: 'x',
    items: '> div:not(:last-child)',
    disabled: !switchReordenarCamiones,
    stop: q => {
      reacomodarCamiones()
      Swal.fire('Se ha cambiado el orden', 'Se ha cambiado el orden de los camiones exitosamente', 'success')
    },
  })

  tablasSortable()
}

$('body').on('click', '.guardarconfig', async q => {
  await colocarValoresConfig()
  guardarValoresConfig()
})

function borrarEventosFilasYColumnas() {
  $('body').off('pointerdown', '.borrarcolumnas', borrarColumnasHandler)
  $('body').off('pointerdown', '.borrarfilas', borrarFilasHandler)
  $('body').off('click', '.borrarcolumnas', borrarColumnasHandler)
  $('body').off('click', '.borrarfilas', borrarFilasHandler)
}
function borrarEventosCamioneros() {
  $('body').off('pointerdown', '.borrarcamiones', borrarCamionesHandler)
  $('body').off('click', '.borrarcamiones', borrarCamionesHandler)
}

async function colocarValoresConfig() {
  switchOrdenarOrdenAlfabetico = $('#switchreordenalfabetico')[0].checked
  switchReordenarProductos = $('#switchreordenarproductos')[0].checked
  switchReordenarCamiones = $('#switchreordenarcamiones')[0].checked
  let opcionBorrarCamionesNuevo = $('[name="borrarcamiones"]:checked').parent().index()
  let opcionBorrarFilasYColumnasNuevo = $('[name="borrarfilasycolumnas"]:checked').parent().index()
  opcionExportarPDF = $('[name="exportarpdf"]:checked').parent().index()
  opcionExportarExcel = $('[name="exportarexcel"]:checked').parent().index()

  if (opcionBorrarFilasYColumnasNuevo !== opcionBorrarFilasYColumnas) {
    borrarEventosFilasYColumnas()
    if (opcionBorrarFilasYColumnasNuevo === 0) {
      $('body').on('pointerdown', '.borrarcolumnas', borrarColumnasHandler)
      $('body').on('pointerdown', '.borrarfilas', borrarFilasHandler)
    }
    if (opcionBorrarFilasYColumnasNuevo === 1) {
      $('body').on('click', '.borrarcolumnas', borrarColumnasHandler)
      $('body').on('click', '.borrarfilas', borrarFilasHandler)
    }
  }
  if (opcionBorrarCamionesNuevo !== opcionBorrarCamiones) {
    borrarEventosCamioneros()
    if (opcionBorrarCamionesNuevo === 0) $('body').on('pointerdown', '.borrarcamiones', borrarCamionesHandler)
    if (opcionBorrarCamionesNuevo === 1) $('body').on('click', '.borrarcamiones', borrarCamionesHandler)
  }

  opcionBorrarFilasYColumnas = opcionBorrarFilasYColumnasNuevo
  opcionBorrarCamiones = opcionBorrarCamionesNuevo
}

function reseteaValoresConfig() {
  $('#switchreordenalfabetico')[0].checked = switchOrdenarOrdenAlfabetico
  $('#switchreordenarproductos')[0].checked = switchReordenarProductos
  $('#switchreordenarcamiones')[0].checked = switchReordenarCamiones
  $(`[name="borrarcamiones"]`).prop('checked', (i, x) => (x = i === opcionBorrarCamiones))
  $(`[name="borrarfilasycolumnas"]`).prop('checked', (i, x) => (x = i === opcionBorrarFilasYColumnas))
  $(`[name="exportarpdf"]`).prop('checked', (i, x) => (x = i === opcionExportarPDF))
  $(`[name="exportarexcel"]`).prop('checked', (i, x) => (x = i === opcionExportarExcel))
}

const configs = $('#configs')[0]
configs.addEventListener('hidden.bs.modal', reseteaValoresConfig)
let esconderOpciones = q => bootstrap.Modal.getInstance(configs).hide()

$('body').on('click', '.grupotabs th:not([colspan="2"]), #tablaresumen th', function () {
  if (switchOrdenarOrdenAlfabetico) {
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
  }
})

let estilosSwal = (confirmButton, cancelButton = '', denyButton = '') => Swal.mixin({ customClass: { confirmButton, cancelButton, denyButton }, buttonsStyling: false })

const swalConfirmarYCancelar = estilosSwal('btn btn-success margenbotonswal', 'btn btn-danger margenbotonswal')
const swalContinuar = estilosSwal('btn btn-primary margenbotonswal btncontinuar')
const swal3Botones = estilosSwal('botonswal3 botonconfirm', 'botonswal3 botoncancel', 'botonswal3 botondeny')
const swal3BotonesInvertido = estilosSwal('botonswal3 botondeny', 'botonswal3 botoncancel', 'botonswal3 botonconfirm')

$('body').on('click', '.tabs input', function () {
  $('.tabs__content').each((_, x) => (x.style.display = 'none'))
  document.querySelector(`.contenidotabs [data-tabid="${this.dataset.tabid}"]`).style.display = 'initial'
})

$('body').on('keyup', 'td', e => {
  let k = e.which
  if ((k >= 48 && k <= 57) || k === 229 || k === 8) {
    let cuerpo = e.target.closest('.cuerpo')
    $(cuerpo.rows).each((_, x) => calcularvendidoseingresos(x))
    calcularvendidoseingresostotal(cuerpo)
  }
})

function calcularvendidoseingresos({ cells }) {
  let sumafila = 0
  let y = colsinicio
  let hayunnumero = false
  for (; y < cells.length - colsfinal; y++) {
    let valor = cells[y].innerText.aInt()
    if (!isNaN(valor)) {
      hayunnumero = true
      sumafila += y % 2 === 0 ? valor : -valor
    }
  }
  cells[y++].innerText = sumafila === 0 && !hayunnumero ? '' : sumafila
  let totalingresos = sumafila * cells[1].innerText.aFloat()
  cells[y].innerText = isNaN(totalingresos) || (sumafila === 0 && !hayunnumero) ? '' : totalingresos.normalizarPrecio()
}

function calcularvendidoseingresostotal(cuerpo) {
  let sumaVendidos = 0, sumaIngresos = 0, hayUnNumero = false
  $(cuerpo).find('td:nth-last-child(2)').each((_, x) => {
    let texto = x.innerText.aFloat()
    if (!isNaN(texto)) {
      hayUnNumero = true
      sumaVendidos += texto
    }
  })
  $(cuerpo).find('td:nth-last-child(1)').each((_, x) => {
    let texto = x.innerText.aFloat()
    if (!isNaN(texto)) sumaIngresos += texto
  })

  if (!isNaN(sumaVendidos)) $(cuerpo).parent().find('tfoot td')[1].innerText = sumaVendidos === 0 && !hayUnNumero ? '' : sumaVendidos
  if (!isNaN(sumaIngresos)) $(cuerpo).parent().find('tfoot td')[2].innerText = sumaIngresos === 0 && !hayUnNumero ? '' : sumaIngresos.normalizarPrecio()
}

$('#añadirProducto').on('click', e => $(_cuerpo()).append(`<tr>${[...Array(_cantidadSaleYEntra() - 2)].map(_ => `<td contenteditable="true"></td>`).join('')}<td></td><td class="borrarfilas"></td></tr>`))

$('#añadirViaje').on('click', e => {
  $(_tabla().querySelector('.columnaVendidos')).before(`<th colspan="2" class="borrarcolumnas">Viaje No. ${_cantidadViajes() + 1}</th>`)
  $(_saleYEntra()).append(`<th>Sale</th><th>Entra</th>`)
  $(_pintarColumnas()).append(`<col span="2">`)
  let cantidadSaleYEntra = _cantidadSaleYEntra()
  _filas().forEach(x => {
    let indice = cantidadSaleYEntra - colsinicio - colsfinal
    for (let i = 0; i < 2; i++) { x.insertCell(indice).setAttribute('contenteditable', true) }
  })
  _pie().querySelector('td:first-child').colSpan += 2
})

document.addEventListener('pointerup', e => {
  if (timer) {
    clearTimeout(timer)
    timer = null
  }
})
//TODO hacer que las fechas de ultima actualizacion digan... hace 3 dias ...hace 5 horas... ayer

function borrarElementos(e, opcion, metodo, elementoSeleccionado) {
  if (elementoSeleccionado.closest('.swal2-html-container')) return
  if (opcion === 0) {
    if (!timer) {
      timer = null
      timer = setTimeout(metodo, touchduration, elementoSeleccionado, e)
    }
  } else if (opcion === 1 && elementoSeleccionado.clientWidth - e.offsetX <= 21 && e.offsetY <= 21) metodo(elementoSeleccionado, e)
}

async function borrarFilas(celda) {
  let fila = $(celda).parent()[0]
  let html = `<table class="mx-auto"><tbody style="background: #0f0d35;">${fila.cloneNode(true).outerHTML}</tbody></table>`
  if (await swalSíNo('Estás seguro que deseas borrar este producto de la tabla?', html)) {
    let cuerpo = $(fila).parent()[0]
    if (cuerpo.rows.length === 1) return mostrarError('No puedes borrar todos los productos, debe haber al menos uno')
    fila.remove()
    calcularvendidoseingresostotal(cuerpo)
    Swal.fire('Se ha eliminado el producto', 'Se ha eliminado el producto y su contenido exitosamente', 'success')
  }
}

async function borrarColumnas(colborrar) {
  let tabla = $(colborrar).closest('table')[0]
  let celdaABorrar = ($(colborrar).index() - colsinicio) * 2 + colsinicio
  let cuerpo = $(tabla).find('.cuerpo')
  let filas = [...$(cuerpo).find('tr')]
  let html = `<table class="mx-auto"><thead><tr>
  ${colborrar.outerHTML}</tr><tr><th>Sale</th><th>Entra</th></tr></thead><tbody style="background: #0f0d35;">
  ${filas.map(({ cells }) => `<tr>${cells[celdaABorrar].outerHTML} ${cells[celdaABorrar + 1].outerHTML}</tr>`).join('')}
  </tbody></table>`
  if (await swalSíNo('Estás seguro que deseas borrar esta columna y todos sus contenidos?', html, 600)) {
    if (_cantidadViajes() === 1) return mostrarError('No puedes borrar todos los viajes, debe haber al menos uno')

    filas.forEach(fila => $(fila.cells).slice(celdaABorrar, celdaABorrar + 2).remove())
    $(tabla).find('tfoot td:first')[0].colSpan -= 2
    colborrar.remove()

    $(tabla).find('.saleYEntra>:last').remove()
    $(tabla).find('.saleYEntra>:last').remove()
    $(tabla).find('.pintarcolumnas>:last').remove()
    $(tabla).find('.borrarcolumnas').each((i, celdaViaje) => (celdaViaje.textContent = 'Viaje No. ' + (i + 1)))
    filas.forEach(fila => calcularvendidoseingresos(fila))
    calcularvendidoseingresostotal(cuerpo)
    Swal.fire('Se ha eliminado la columna', 'Se ha eliminado la columna y todos sus contenidos exitosamente', 'success')
  }
}

$('#diaanterior').on('click', q => (location = `/registrarventas/${hoy.subtract('1', 'day').format('D-M-YYYY')}`))
$('#diasiguiente').on('click', q => (location = `/registrarventas/${hoy.add('1', 'day').format('D-M-YYYY')}`))

function añadirceros(cuerpo) {
  cuerpo.querySelectorAll('td:not(:nth-child(1),:nth-child(2))').forEach(celda => (celda.innerText ||= 0))
  calcularvendidoseingresostotal(cuerpo)
}

$('#guardar').on('click', async function () {
  if (!(await borrarTablasVacias())) return
  let listaCamioneros = document.querySelectorAll('.grupotabs .tabs__content input')
  for (let i = 0; i < listaCamioneros.length; i++) {
    if (!(await validarCamioneros(listaCamioneros[i], i + 1))) return
  }

  let listaTablas = devuelveListaTablas()
  let cantidadTablas = listaTablas.length
  for (let i = 0; i < cantidadTablas; i++) {
    tablaValida = false
    tablaParaValidacion = listaTablas[i]
    permitirFilasVacias = false
    if (!(await validarDatosTabla(listaTablas[i], i + 1))) return
  }

  let data = JSON.stringify({
    _id: hoy.valueOf(),
    ultimocambio: Date.now(),
    tablas: listaTablas.map(tabla => ({
      trabajador: $(tabla).closest('.tabs__content').find('.trabajador').val(),
      productos: [...$(tabla).find('.cuerpo tr')].map(fila => ({
        nombre: fila.cells[0].textContent,
        precio: fila.cells[1].innerText.aFloat(),
        viajes: [...Array($(tabla).find('.pintarcolumnas>*').length * 2)].map((_, j) => fila.cells[j + colsinicio].innerText.aInt()),
        vendidos: fila.querySelector('td:nth-last-child(2)').innerText.aInt(),
        ingresos: fila.querySelector('td:nth-last-child(1)').innerText.aFloat(),
      })),
      totalvendidos: tabla.querySelector('tfoot tr').cells[1].innerText.aInt(),
      totalingresos: tabla.querySelector('tfoot tr').cells[2].innerText.aFloat(),
    })),
  })
  console.log(data)

  $.ajax({
    url: '/registrarventas/guardar',
    method: 'POST',
    contentType: 'application/json',
    data,
    success: q => Swal.fire('Se ha guardado exitosamente', 'El archivo se ha almacenado en la base de datos', 'success'),
    error: q => Swal.fire('Ups...', 'No se pudo guardar en la base de datos', 'error'),
  })
})

function formatearCeldas({ cells: [, prod, prec] }) {
  prod.innerText = prod.innerText.cantidadFormateada()
  prec.innerText = prec.innerText.aQuetzales()
}

$('#resumen').on('click', async () => {
  let listaTablas = devuelveListaTablas()
  let listaTablasValores = listaTablas.map(tabla => {
    let productos = [...tabla.querySelectorAll('.cuerpo td:first-child')]
    let vendidos = [...tabla.querySelectorAll('.cuerpo td:nth-last-child(2)')]
    let ingresos = [...tabla.querySelectorAll('.cuerpo td:nth-last-child(1)')]
    return productos.map((_, i) => ({ producto: productos[i].innerText.normalizar(), vendidos: vendidos[i].innerText.aInt() || 0, ingresos: ingresos[i].innerText.aFloat() || 0, productoDesnormalizado: productos[i].innerText }))
  })

  let p = listaTablasValores.reduce((acc, table) => {
    table.forEach(fila => {
      if (acc[fila.producto]) {
        acc[fila.producto].vendidos += fila.vendidos
        acc[fila.producto].ingresos += fila.ingresos
      } else acc[fila.producto] = { vendidos: fila.vendidos, ingresos: fila.ingresos, productoDesnormalizado: fila.productoDesnormalizado }
    })
    return acc
  }, {})

  Object.keys(p).forEach(x => (p[x].ingresos = p[x].ingresos.normalizarPrecio()))

  let html = `<table id="tablaresumen" class="mx-auto"><thead><tr>
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
    didOpen: () => {
      let cuerpo = $('#tablaresumen tbody')[0]
      calcularvendidoseingresostotal(cuerpo)
      $(cuerpo.rows).each((_, x) => formatearCeldas(x))
      formatearCeldas($('#tablaresumen tfoot tr')[0])

      $('#exportarAPDFResumen')[0].inicializar(() => {
        let tabla = $('#tablaresumen')[0]
        let tablaClon = tabla.cloneNode(true)
        tablaClon.id = 'tablaresumenclon'
        return `<div class="tituloresumen" style="margin-left: ${tabla.clientWidth / 2 - 150}px">Resumen	&nbsp;del día ${fechastr}</div>${tablaClon.outerHTML}<br><br>`
      }, `Resumen de ventas ${fechastr}`)

      $('#exportarAExcelResumen')[0].inicializar(function () {
        let nombre = `Resumen de ventas ${fechastr}.xlsx`
        let workbook = XLSX.utils.book_new()
        let ws = XLSX.utils.table_to_sheet($('#tablaresumen')[0], { raw: true })
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
    },
  })
})

//TODO este no se si ponerlo
// function exportarExcel(){
// doc.output("dataurlnewwindow", {
//   filename: "archivohtml2pdf.pdf"
// })
// let nombre = `registro ventas ${fechastr} ${document.querySelector(".grupotabs .tabs__radio:checked + label").innerText}.pdf`;
// if (esTouch()) {
//   var blob = doc.output("blob", {
//     filename: nombre
//   });
//   window.open(URL.createObjectURL(blob));
// }
// else
//   doc.save(nombre);
// }

async function borrarFilasVacias(tabla, numtabla) {
  let tablaCopia = tabla.cloneNode(true)
  let filasCopia = [...$(tablaCopia).find('.cuerpo tr')]
  let filasQueNoEstanVacias = filasCopia.filter(fila => {
    let celdasEspecificas = [...fila.cells].slice(colsinicio, -colsfinal)
    let res = celdasEspecificas.every(celda => celda.innerText === '0' || celda.innerText === '')
    if (res) $(fila).children().addClass('enfocar')
    return !res
  })
  if (filasQueNoEstanVacias.length === filasCopia.length) return clonaValores(tabla, tablaCopia)

  let tablaCopiaSinFilasVacias = tabla.cloneNode(true)
  let tablaSinFilasVacias = filasQueNoEstanVacias.map(x => x.outerHTML).join('')
  $(tablaCopiaSinFilasVacias).find('.cuerpo').html(tablaSinFilasVacias)
  let botones = `<div class="contenedorbotonesEnFila">
    <button class="botonswal3 botonconfirm" onclick="borrarFilasVaciasB()">Borrar las filas vacías</button>
    <button class="botonswal3 botondeny" onclick="conservarFilasVaciasB()">Conservar las filas vacías</button>
    <button class="botonswal3 botonconfirm" onclick="validarDatosB()">Ya lo arreglé</button>
    <button class="botonswal3 botoncancel" onclick="cancelarB()">Volver</button>
  </div>`

  await swal3Botones.fire({
    title: 'Se han detectado filas vacias',
    icon: 'warning',
    width: (innerWidth * 3) / 4,
    html: `<div class="textovista">Se han detectado filas vacias en la tabla ${numtabla}, qué desea hacer?</div>
    ${tabsTexto(tablaCopia, tablaCopiaSinFilasVacias, 'Ver filas vacías')}${botones}`,
    showCancelButton: false,
    showConfirmButton: false,
    showDenyButton: false,
  })

  if (opcionSwal === 'borrarFilasVacias') {
    if (filasQueNoEstanVacias.length === 0) return mostrarError('Error', `No se puede guardar la tabla ${numtabla} porque está vacía`)
    let filasVacias = [...tablaCopia.querySelector('.cuerpo').rows].filter(fila => {
      let res = [...fila.cells].slice(colsinicio, -colsfinal).every(celda => celda.innerText === '0' || celda.innerText === '')
      if (res) $(fila).children().addClass('enfocar')
      return res
    })
    filasVacias.forEach(fila => fila.remove())
    return clonaValores(tabla, tablaCopia)
  } else if (opcionSwal === 'conservarFilasVacias') {
    permitirFilasVacias = true
    return true
  } else if (opcionSwal === 'validarDatos') {
    let tablaCopia = swal3Botones.getHtmlContainer().querySelector('table')
    borrarEnfocarFilas(tablaCopia)
    return await validarDatosTabla(tablaCopia, numtabla)
  }
  return false
}

async function entraMasDeLoQueSale(tabla, numtabla) {
  let tablaCopia = tabla.cloneNode(true)
  let cuerpocopia = $(tablaCopia).find('.cuerpo')[0]
  let valido = true
  $(tablaCopia).find('.cuerpo tr').each((i, { cells }) => {
    for (let j = colsinicio; j < cells.length - colsfinal; j += 2) {
      let entra = cuerpocopia.rows[i].cells[j]
      let sale = cuerpocopia.rows[i].cells[j + 1]
      let invalido = sale.innerText.aInt() > entra.innerText.aInt()
      sale.classList.toggle('enfocar', invalido)
      entra.classList.toggle('enfocar', invalido)
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
    width: (innerWidth * 3) / 4,
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
  let tablaCopia = tabla.cloneNode(true)
  let productosCopia = [...$(tablaCopia).find('.cuerpo tr td:nth-child(1)')]
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
    width: (innerWidth * 3) / 4,
    html: tablaCopia,
    showCancelButton: true,
    stopKeydownPropagation: false,
    confirmButtonText: 'Ya lo arreglé',
    cancelButtonText: 'Volver',
  })
  if (isConfirmed) {
    $(tablaCopia).find('.cuerpo tr td:nth-child(1)').each((_, x) => (x.style.background = '#0f0d35'))
    return await validarDatosTabla(tablaCopia, numtabla)
  }
  return false
}

function colorAleatorio() {
  const threshold = 128
  const color = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`
  const rgb = color.match(/\d+/g).map(Number)
  const brightness = 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]
  if (brightness > threshold) return colorAleatorio()
  return color
}

async function validarQueLosPreciosNoTenganPuntoAlFinal(tabla, numtabla) {
  let tablaCopia = tabla.cloneNode(true)
  let hayTerminaConPunto = false
  $(tablaCopia).find('.cuerpo tr td:nth-child(2)').each((_, x) => {
    if (x.innerText.endsWith('.')) {
      x.classList.add('enfocar')
      hayTerminaConPunto = true
    }
  })

  if (!hayTerminaConPunto) return clonaValores(tabla, tablaCopia)

  let result = await swal3BotonesInvertido.fire({
    title: `Hay valores que terminan en . en la tabla ${numtabla}, te faltó escribir un número? Qué deseas hacer?`,
    icon: 'error',
    width: (innerWidth * 3) / 4,
    html: tablaCopia,
    showCancelButton: true,
    showDenyButton: true,
    stopKeydownPropagation: false,
    confirmButtonText: 'Borrar los puntos al final',
    denyButtonText: `Ya lo arreglé`,
    cancelButtonText: 'Volver',
  })
  if (result.isConfirmed) {
    $(tabla).find('.cuerpo tr td:nth-child(2)').each((_, x) => {
      let precio = x.innerText
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
  let tablaCopia = tabla.cloneNode(true)
  let hayEmpiezaConPunto = false
  $(tablaCopia).find('.cuerpo tr td:nth-child(2)').each((_, x) => {
    if (x.innerText.startsWith('0.')) {
      x.classList.add('enfocar')
      hayEmpiezaConPunto = true
    }
  })

  if (!hayEmpiezaConPunto) return clonaValores(tabla, tablaCopia)

  let html =
    tablaCopia.outerHTML +
    `<div class="contenedorbotonesEnFila">
    <button class="botonswal3 botonconfirm" onclick="continuarSwalB()">Sí estoy seguro, &nbsp;&nbsp; continuar</button>
    <button class="botonswal3 botondeny" onclick="removerCeroPuntoB()">Remueve los 0. al principio y continuar</button>
    <button class="botonswal3 botonconfirm" onclick="validarDatosB()">Ya lo arreglé</button>
    <button class="botonswal3 botoncancel" onclick="cancelarB()">No continuar</button>
  </div>`
  await swal3Botones.fire({
    title: `Hay valores menores a 1, en la tabla ${numtabla} estás seguro que no es un error? Deseas continuar?`,
    icon: 'error',
    width: (innerWidth * 3) / 4,
    html,
    stopKeydownPropagation: false,
    showCancelButton: false,
    showDenyButton: false,
    showConfirmButton: false,
  })
  if (opcionSwal === 'removerCeroPunto') {
    $(tabla).find('.cuerpo tr td:nth-child(2)').each((_, x) => {
      let precio = x.innerText
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
  $(tabla).find('.cuerpo tr').each((_, { cells: [producto, precio] }) => {
    let prec = precio.innerText
    producto.textContent = producto.innerText.trim()
    if (prec === '.') precio.textContent = ''
    else if (!prec.endsWith('.')) {
      let precioNormalizado = prec.normalizarPrecio()
      if (!isNaN(precioNormalizado)) precio.textContent = precioNormalizado
    }
  })

  let tablaCopia = tabla.cloneNode(true)
  let filasCopia = [...$(tablaCopia).find('.cuerpo tr')]
  let verificacionProductos = true
  let verificacionPrecios = true

  filasCopia.forEach(({ cells: [producto, precio] }) => {
    if (producto.textContent === '') {
      producto.classList.add('enfocar')
      verificacionProductos = false
    }
    if (precio.textContent === '' || precio.textContent === '0') {
      precio.classList.add('enfocar')
      verificacionPrecios = false
    }
  })
  if (verificacionProductos && verificacionPrecios) return clonaValores(tabla, tablaCopia)

  let titulo = `<h3>Se ha detectado valores vacíos en la columna ${!verificacionProductos && !verificacionPrecios ? 'productos y la columna precios' : !verificacionProductos ? 'productos' : 'precios'} de la tabla ${numtabla}
  <br>Por favor corrígelos para poder guardar los datos</h3>`
  let result = await swalConfirmarYCancelar.fire({
    title: titulo,
    icon: 'error',
    width: (innerWidth * 3) / 4,
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
  let tablas = [...$('.contenidotabs table')]
  let tablasVacias = tablas.filter(tabla => tabla.querySelector('tfoot td:nth-child(3)').innerText === '')

  if (tablasVacias.length === 0) return true

  let html = `${tablasVacias.length === 1 ? '<div class="textovista">Se ha detectado que esta tabla está vacía así que será eliminada</div>' : '<div class="textovista">Se han detectado las siguientes tablas vacias las cuales serán eliminadas</div>'}
  <div class="tabs-swal">
  ${tablasVacias
      .map(
        (tabla, i) => `<input type="radio" class="tabs__radio" name="tabs-swal" id="tabswal${i}" checked />
    <label for="tabswal${i}" class="tabs__label label-swal">Camión ${tabla.closest('.tabs__content').dataset.tabid.aInt() + 1}</label>
    <div class="tabs__content">${tabla.cloneNode(true).outerHTML}</div>`
      )
      .join('')}
  </div><br><div class="textovista">Desea continuar?</div>`

  if (await swalContinuarNoContinuar('Se han detectado tablas vacias', html)) {
    if (await soloHayUnCamion()) return false

    tablasVacias.forEach(tabla => {
      let contenidoTab = $(tabla).closest('.tabs__content')
      $(`.tab:has([data-tabid=${contenidoTab[0].dataset.tabid}])`).remove()
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
    width: (innerWidth * 3) / 4,
    html,
    showCancelButton: true,
    confirmButtonText: 'Continuar',
    cancelButtonText: 'No continuar',
  })
  return isConfirmed
}
async function swalSíNo(title, html, width = (innerWidth * 3) / 4) {
  let { isConfirmed } = await swalConfirmarYCancelar.fire({
    title,
    icon: 'warning',
    width,
    html,
    showCancelButton: true,
    confirmButtonText: 'Sí',
    cancelButtonText: 'No',
  })
  return isConfirmed
}

async function borrarCamiones(label, e) {
  let id = label.previousElementSibling.dataset.tabid
  let tabla = document.querySelector(`.grupotabs .tabs__content[data-tabid="${id}"] table`)
  let html = `<div class="tabs-swal">
  <input type="radio" class="tabs__radio" name="tabs-swal" id="tabswal0" checked />
  <label for="tabswal0" class="tabs__label label-swal">Camión ${id.aInt() + 1}</label>
    <div class="tabs__content" style="display:initial !important;">${tabla.cloneNode(true).outerHTML}
  </div></div><br><div class="textovista">Deseas continuar?</div>`
  e.preventDefault()
  e.stopPropagation()

  if (await swalContinuarNoContinuar('Estás seguro que deseas eliminar este camión?', html)) {
    if (await soloHayUnCamion()) return false
    delete objReordenarPlantillas[id]
    $(label).parent().remove()
    $(`.grupotabs .tabs__content[data-tabid=${id}]`).remove()
    reacomodarCamiones()
    Swal.fire('Se ha eliminado el camión', 'Se ha eliminado el camión exitosamente', 'success')
    return true
  }
  return false
}

function reacomodarCamiones() {
  let listaContenido = [...$('.grupotabs .tab')].map(x => $(`.grupotabs .tabs__content[data-tabid="${$(x).find('input')[0].dataset.tabid}"]`)[0])

  $('.grupotabs .tab').each((i, tab) => {
    listaContenido[i].dataset.tabid = i
    let checkbox = tab.querySelector('input')
    let idNuevo = `tab${i}`
    checkbox.dataset.tabid = i
    checkbox.id = idNuevo
    let label = tab.querySelector('label')
    label.setAttribute('for', idNuevo)
    label.innerText = `Camión ${i + 1}`
  })
  if ($('.grupotabs .tab .tabs__radio:checked').length === 0) $('.grupotabs .tab:first-child .tabs__label')[0].trigger('click')
}

async function validarCamioneros(textbox, numerotabla) {
  textbox.value = textbox.value.trim()
  if (textbox.value !== '') return true
  let html = `<h3>El nombre del conductor del camión ${numerotabla} está vacío. <br> Escribe o elige un nombre para continuar </h3> <br>
<div class="divtrabajadorrevisar">
<input type="text" class="form-control trabajador" style="height: 35px; min-width: 228px" id="trabajadorrevisar" style="width: 260px; max-width: 260px; text-align:center;" placeholder="Escribe el nombre del conductor" />
<div class="btn-group dropend">
<button type="button" class="btn btn-sm btn-secondary dropdown-toggle dropdown-toggle-split" id="dropdowncamionero" data-bs-toggle="dropdown"></button>
${devuelveCamioneros()}
</div></div>`
  let { isConfirmed } = await swalConfirmarYCancelar.fire({
    icon: 'warning',
    width: (innerWidth * 3) / 4,
    html,
    showCancelButton: true,
    confirmButtonText: 'Continuar',
    cancelButtonText: 'Volver',
  })
  if (isConfirmed) {
    textbox.value = $('#trabajadorrevisar').val().trim()
    if (textbox.value !== '') return true
    return validarCamioneros(textbox, numerotabla)
  } else return false
}

async function validarDatosTabla(tabla, numtabla) {
  if (!permitirFilasVacias && !(await borrarFilasVacias(tabla, numtabla))) return false
  if (tablaValida) return true
  añadirceros(tabla.querySelector('.cuerpo'))
  let funcsValidar = [validarProductosYPrecios, validarQueTablaNoTengaMismoNombre, validarQueLosPreciosNoTenganPuntoAlFinal, validarQueLosPreciosNoSeanMenorAUno, entraMasDeLoQueSale]

  for (let x of funcsValidar) {
    if (!(await x(tabla, numtabla))) return false
    if (tablaValida) return true
  }
}

function clonaValores(tabla, tablaCopia) {
  tabla.innerHTML = tablaCopia.innerHTML
  tablaParaValidacion.innerHTML = tablaCopia.innerHTML
  return true
}

$('#exportarexcel')[0].inicializar(function () {
  let nombre = `registro ventas ${fechastr} ${document.querySelector('.grupotabs .tabs__radio:checked + label').innerText}.xlsx`
  let workbook = XLSX.utils.book_new()
  let listaTablas = opcionExportarExcel === 0 ? [_tabla()] : devuelveListaTablas()

  listaTablas.forEach((tabla, indice) => {
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
    XLSX.utils.book_append_sheet(workbook, ws, `Camión ${opcionExportarExcel === 0 ? tabla.closest('.tabs__content').dataset.tabid.aInt() + 1 : indice + 1}`)
  })
  XLSX.writeFile(workbook, nombre)
})

$('#exportarpdf')[0].inicializar(() => {
  let listaTablas = opcionExportarPDF === 0 ? [_tabla()] : devuelveListaTablas()
  let html = ``
  listaTablas.forEach((tabla, indice) => {
    let copiaTabla = tabla.cloneNode(true)
    let medirTabla = copiaTabla.cloneNode(true)
    $('body').append(medirTabla)
    $(medirTabla).css({ position: 'absolute', visibility: 'hidden', display: 'table' })
    html += `<div class="titulopdf" style="margin-left: ${medirTabla.clientWidth / 2 - 55}px">Camión ${opcionExportarPDF === 0 ? tabla.closest('.tabs__content').dataset.tabid.aInt() + 1 : indice + 1}</div>`
    medirTabla.remove()
    copiaTabla.querySelector('.pintarcolumnas').innerHTML = ''

    html += `${copiaTabla.outerHTML}<br><br>`
  })
  return html
}, `registro ventas ${fechastr} ${document.querySelector('.grupotabs .tabs__radio:checked + label').innerText}`)

async function pidePlantilla(nombre) {
  if (!listaplantillas[nombre]) {
    let r = await fetch(`/plantillas/devuelveplantilla/${nombre}`)
    if (!r.ok) return mostrarError('No se pudo recuperar la plantilla', 'Error de conexión')
    listaplantillas[nombre] = await r.json()
  }
  return listaplantillas[nombre]
}

async function metododropdown(option) {
  let p = await pidePlantilla(option.textContent)
  if (!p) return
  plantillaSeleccionada = p
  let html = `<table style="margin: 0 auto;">
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
    _tabla().outerHTML = formatotablavacia
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
  let tabla = _tabla()
  let tablaCopia = tabla.cloneNode(true)
  let cuerpoCopia = tablaCopia.querySelector('.cuerpo')
  cuerpoCopia.innerHTML = formatoTablaLlena
  calcularvendidoseingresostotal(cuerpoCopia)

  let result = await swalConfirmarYCancelar.fire({
    title: 'Aquí puedes ver las diferencias entre la tabla original y el resultado final',
    icon: 'warning',
    width: (innerWidth * 3) / 4,
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

function tabsTexto(tablaOriginal, tablaNueva, texto) {
  return `<div class="tabs-swal">
  <input type="radio" class="tabs__radio" name="tabs-swal" id="tabswal0" checked>
  <label for="tabswal0" class="tabs__label label-swal">${texto}</label>
  <div class="tabs__content">${tablaOriginal.outerHTML}</div>

  <input type="radio" class="tabs__radio" name="tabs-swal" id="tabswal1">
  <label for="tabswal1" class="tabs__label label-swal">Vista previa del resultado</label>
  <div class="tabs__content">${tablaNueva.outerHTML}</div>
</div>`
}

function mezclarOrden(productos, sinEliminar, ordenTabla) {
  let filas = _filas()
  let formatoTablaLlena = ''
  let pTabla = filas.map(x => x.cells[0].innerText.normalizar())
  let pSeleccionada = productos.map(x => x.producto.normalizar())
  let devuelveProductoVacio = producto => `<tr><td contenteditable="true">${producto.producto}</td><td contenteditable="true">${producto.precio.normalizarPrecio()}</td>${[...Array(_cantidadSaleYEntra() - 4)].map(_ => `<td contenteditable="true"></td>`).join('')} <td></td><td class="borrarfilas"></td></tr>`

  if (ordenTabla) {
    pTabla.forEach((x, i) => {
      let j = pSeleccionada.findIndex(y => y === x)
      if (j >= 0) {
        let filaCopia = filas[i].cloneNode(true)
        filaCopia.cells[0].textContent = productos[j].producto
        filaCopia.cells[1].textContent = productos[j].precio.normalizarPrecio()
        calcularvendidoseingresos(filaCopia)
        formatoTablaLlena += filaCopia.outerHTML
      } else if (sinEliminar) formatoTablaLlena += filas[i].outerHTML
    })
    pSeleccionada.forEach((x, i) => !pTabla.includes(x) && (formatoTablaLlena += devuelveProductoVacio(productos[i])))
  } else {
    pSeleccionada.forEach((x, i) => {
      let j = pTabla.findIndex(y => y === x)
      if (j >= 0) {
        let filaCopia = filas[j].cloneNode(true)
        filaCopia.cells[0].textContent = productos[i].producto
        filaCopia.cells[1].textContent = productos[i].precio.normalizarPrecio()
        calcularvendidoseingresos(filaCopia)
        formatoTablaLlena += filaCopia.outerHTML
      } else formatoTablaLlena += devuelveProductoVacio(productos[i])
    })
    if (sinEliminar) pTabla.forEach((x, i) => !pSeleccionada.includes(x) && (formatoTablaLlena += filas[i].outerHTML))
  }
  return formatoTablaLlena
}
String.prototype.aFloat = function () { return parseFloat(this) }
String.prototype.aInt = function () { return parseInt(this) }
String.prototype.normalizar = function () { return this.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '') }
String.prototype.normalizarPrecio = function () { return this.aFloat().toFixed(2).replace(/[.,]00$/, '') }
Number.prototype.normalizarPrecio = function () { return this.toFixed(2).replace(/[.,]00$/, '') }

String.prototype.aQuetzales = function () { return new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'GTQ' }).format(this.aFloat()) }
String.prototype.cantidadFormateada = function () { return new Intl.NumberFormat('es-GT').format(this.aFloat()) }

function creaTablaVacia(plantilla) {
  return `<table>
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
}

$('body').on('click', '.agregarcamion', async () => {
  let cantidadTabs = _cantidadTabs()
  let formatotablavacia = creaTablaVacia(await pidePlantilla(plantillaDefault))
  let nuevoCamion = `<div data-tabid="${cantidadTabs}" class="tabs__content">
<div class="contenedor-trabajador">
<label class="label-trabajador">Nombre del conductor:</label>
<div class="contenedor-input-trabajador">
<input type="text" class="form-control trabajador"><div class="btn-group dropend">
<button type="button" class="btn btn-sm btn-secondary dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown"></button>
${devuelveCamioneros()}
</div></div></div>
${formatotablavacia}</div>`
  let nuevaTab = `<div class="tab">
  <input data-tabid="${cantidadTabs}" type="radio" class="tabs__radio" name="tab" id="tab${cantidadTabs}"/>
  <label for="tab${cantidadTabs}" class="tabs__label borrarcamiones">Camión ${cantidadTabs + 1}</label>
</div>`
  $('.agregarcamion').before(nuevaTab)
  $('.contenidotabs').append(nuevoCamion)
  tablasSortable()
})

$('body').on('click', '.grupotabs .dropdown-item', function () { $(this).closest('.tabs__content').find('.trabajador').val(this.innerText) })
$('body').on('click', '.swal2-html-container .dropdown-item', function () { $(this).closest('.dropend').prev().val(this.innerText) })
$('body').on('hide.bs.dropdown', '#dropdowncamionero', function () { this.closest('.swal2-html-container').style.minHeight = '68.2px' })

$('body').on('click', '.swal2-html-container .dropdown-toggle', function (e) {
  let altura = ($(this).next().children().length - 4) * 30 + 135
  this.closest('.swal2-html-container').style.minHeight = `${altura}px`
})

$('body').on('click', '.contenedoreliminar', async function () {
  let { isConfirmed } = await swalConfirmarYCancelar.fire({
    title: 'Estás seguro que deseas borrar este registro?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí',
    cancelButtonText: 'No',
  })
  if (isConfirmed) {
    modal.mostrar(function () {
      let contraseñaVerificacion = $('#verificacionIdentidad').val()
      let data = JSON.stringify({ contraseñaVerificacion })
      $.ajax({
        url: location.pathname,
        method: 'DELETE',
        contentType: 'application/json',
        data,
        success: async q => {
          await Swal.fire('ÉXITO', 'Se ha borrado el registro exitosamente', 'success')
          location.reload()
        },
        error: r => mostrarError(r.responseText),
      })
    })
    esconderOpciones()
  }
})

$('body').on('click', '.contenedormover', async q => {
  esconderOpciones()
  await moverReg(hoy.valueOf(), '/registrarventas/mover')
})

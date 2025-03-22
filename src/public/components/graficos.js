let contador = 0
let sumar = x => x.reduce((p, c) => p + c)
let opcionChequeada = x => [...x.qsa('input')].findIndex(x => x.checked)
class graficos extends HTMLElement {
  devuelveSonIngresos = q => (this.sonIngresos ? 'ingresos' : 'ventas')
  radiobutton = (label, checked, esconder) => `<custom-radiobutton ${esconder ? 'hidden' : ''} ${checked ? `data-checked="1"` : ''}>${label}</custom-radiobutton>`
  acordeonItem = (html, id, titulo) => `<custom-acordeonitem data-id="${id}${contador}" data-titulo="${titulo}">${html}</custom-acordeonitem>`
  devuelveCantidadFormateada = context => (this.sonIngresos ? context.raw.aQuetzales() : context.formattedValue)
  chartVisible = true
  multiple = true
  fechaOpcion = 'long'
  colocarHTMLGrafica() {
    let html = `<article class="articleGrafico"><div class="contenedormedio"><div class="dropdown">
    <label for="rol">Tipo de gráfico</label>
    <button class="btn dropdown-toggle form-control" data-bs-toggle="dropdown">De barra</button>
    <ul class="dropdown-menu">
      ${['De barra', 'Circular 1', 'Circular 2', 'De línea', 'De radar'].map(el => `<li><a class="dropdown-item">${el}</a></li>`).join('')}
    </ul></div>
    <boton-convertira>Convertir a tabla</boton-convertira>
    <boton-pdf></boton-pdf></div><div class="contenedorCanvas"><canvas id="canvas${contador}"></canvas></div></article>
    <article class="articleTabla" hidden>
    <div class="contenedormedio" style="align-items: center;"><boton-excel id="a"></boton-excel><boton-convertira>Convertir a gráfico</boton-convertira><boton-pdf id="b"></boton-pdf></div>
    <div class="contenedortabla"><div class="tituloTabla">${this.titulo}</div>
    <table></table>
    </div>
    </article>
    <div class="contenedorAbajoDeLosDatos">
    <div class="gridBotonesTamaño"><button class="btnTamaño aumentar">+</i></button><button class="btnTamaño disminuir">-</i>
    <button class="btnTamaño restaurarTamaño" hidden>Restaurar</i></button><span class="textoTamaño">Tamaño</span></div>
    <boton-azul class="uneOSeparaDatos">Unifica los datos <svg fill="#FFF" width="30px" height="30px" viewBox="0 0 20 20" style="transform: rotate(90deg);"><path d="M17.89 17.707L16.892 20c-3.137-1.366-5.496-3.152-6.892-5.275-1.396 2.123-3.755 3.91-6.892 5.275l-.998-2.293C5.14 16.389 8.55 14.102 8.55 10V7H5.5L10 0l4.5 7h-3.05v3c0 4.102 3.41 6.389 6.44 7.707z"/></svg></boton-azul>
    </div>
    <div class="contenedorEliminarData">
    ${checkbox('Eliminar data al tocarla', null, 'eliminarDataGrafico')}
    ${popover(`La eliminación de data usando este método es temporal, la próxima vez que actualices volverá a aparecer, si no quieres que aparezcan quítalos desde las opciones del gráfico. <br><strong>Importante: </strong> borra los datos en base a las etiquetas que están abajo de los datos. Si solo hay una etiqueta borrará todos los datos en esa etiqueta (no te preocupes los datos no se pierden) solo presiona restaurar datos o actualizar y volverán a aparecer`)}
    </div>
    <div class="restaurarDataEliminada" hidden><boton-azul>Restaurar datos borrados</boton-azul></div>`
    this.añadirHTML(html)
    this.canvas = this.qs('canvas')
    this.metodosOpcionesGrafico()
    this.metodosBotonesGrafico()
    this.metodosBotonesAbajo()
    this.metodosBotonesTabla()
  }

  metodosBotonesAbajo() {
    this.contenedorCanvas = this.qs('.contenedorCanvas')
    this.restaurarTamaño = this.qs('.restaurarTamaño')
  }

  metodosBotonesGrafico() {
    this.elclick('.articleGrafico .botonpdf', c => c.exportarGrafico(this.canvas, this.titulo))
    this.elclick('.eliminarDataGrafico', c => {
      this.chart.options.onClick = c.qs('input').checked
        ? () => { }
        : (event, activeElements) => {
          let { chart } = event
          let { datasets, labels } = structuredClone(chart.data)
          if (activeElements[0]) {
            const selectedIndex = activeElements[0].index
            datasets.forEach(x => x.data.splice(selectedIndex, 1))
            labels.splice(selectedIndex, 1)
            this.actualizarChart(datasets, labels)
            this.restaurarDataEliminada.mostrar()
          }
        }
    })
    this.elclick('.dropdown-item', c => {
      let texto = c.textContent
      c.closest('.dropdown-menu').ant().textContent = texto
      const graficos = {
        'De barra': 'bar',
        'Circular 1': 'doughnut',
        'Circular 2': 'pie',
        'De línea': 'line',
        'De radar': 'radar',
      }
      let { type } = this
      this.type = graficos[texto]
      this.chart.config.type = this.type
      if (type === 'radar' || this.type === 'radar') {
        this.chart.destroy()
        this.colocarDatos()
        this.actualizarDatos(this.datasetsActuales, this.labelsActuales)
      } else this.chart.update()
    })
  }

  metodosBotonesTabla() {
    this.qsa('.botonpdf')[1].inicializar(() => {
      let contenedor = this.qs('.contenedortabla')
      let contenedorClon = contenedor.clonar()
      contenedorClon.style.width = contenedor.qs('table').offsetWidth + 'px'
      let titulo = contenedorClon.qs('.tituloTabla')
      titulo.style.background = '#0f0924'
      titulo.style.padding = '15px'
      return contenedorClon.outerHTML
    }, this.titulo)
    let titulo = this.titulo
    let that = this
    this.qs('.botonexcel').inicializar(function () {
      let nombre = `${titulo}.xlsx`
      let workbook = XLSX.utils.book_new()
      let tabla = that.qs('table')
      let ws = XLSX.utils.table_to_sheet(tabla, { raw: true })
      var range = XLSX.utils.decode_range(ws['!ref'])
      // ws['!cols'] = that.multiple ? [that.agrupadoPorFecha ? { wch: Math.max(...tabla.qsarr('tbody td:first-child').map(x => x.textContent.length)) } : { width: 24 }, ...[...tabla.rows[1].cells].map(x => (that.agrupadoPorFecha ? { width: 18 } : { wch: x.textContent.length })), { width: 19 }] : [...[...tabla.rows[2].cells].map(x => (that.agrupadoPorFecha ? { wch: x.textContent.length } : { width: 18 })), { width: 20 }]
      ws['!cols'] = [{ wch: Math.max(...tabla.qsarr('tbody td:first-child').map(x => x.textContent.length)) + 10 }, ]
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
      XLSX.utils.book_append_sheet(workbook, ws, `Resumen del día de hoy`)
      XLSX.writeFile(workbook, nombre)
    })
  }

  colocarColores(contenedorColores, checkboxes, datasets) {
    let colores = contenedorColores.qsarr("[type='color']").filter((_, i) => checkboxes[i]).map(el => el.value)
    if (this.multiple && contenedorColores.tieneClase('graficoDias')) {
      let coloresAlfa = colores.map(x => x + '20')
      datasets.forEach((x, i) => {
        x.borderColor = colores[i]
        x.backgroundColor = coloresAlfa[i]
      })
    } else {
      colores = devuelveColores(colores)
      let coloresAlfa = devuelveColores(colores, 1)
      datasets.forEach(x => {
        x.borderColor = colores
        x.backgroundColor = coloresAlfa
      })
    }
  }
  devuelveFechaOProducto = siEsAgrupadoPorFecha => (siEsAgrupadoPorFecha === this.agrupadoPorFecha ? UTPluralMayuscula : 'Productos')
  devuelveFechaOProductoSingular = siEsAgrupadoPorFecha => (siEsAgrupadoPorFecha === this.agrupadoPorFecha ? UTSingular : 'Producto')

  actualizarTabla(datasets, labels) {
    let html
    if (this.multiple) {
      html = `<table class="multiple"><thead><tr><th class="primeraCelda" rowspan="2">${this.devuelveFechaOProducto(0)}</th>
      <th colspan="${labels.length}">${this.devuelveFechaOProducto(1)}</th>
      ${`<th rowspan="2">Total ${this.devuelveSonIngresos()}:</th>`}</tr>
      <tr>${labels.map(x => `<th>${x.partirFechas()}</th>`).join('')}</tr></thead>
      <tbody>${datasets.map(d => `<tr><td>${d.label}</td>${d.data.map(x => `<td>${x}</td>`).join('')}<td></td></tr>`).join('')}</tbody>
    <tfoot><tr><td>Total:</td>${labels.map(() => '<td></td>').join('')}<td></td></tr></tfoot>
  </table>`
    } else {
      let data = datasets[0].data
      html = `<table><thead><tr><th colspan="${labels.length + 1}">${this.titulo.split('agrupado')[0]}durante el período del ${formatearFecha(this.fechaOpcion, tiempoMenor)} al ${formatearFecha(this.fechaOpcion, tiempoMayor)}</th></tr><tr><th colspan="${data.length}">${this.devuelveFechaOProducto(1)}</th><th rowspan="2">Total ${this.devuelveSonIngresos()}:</th></tr>
      <tr>${labels.map(x => `<th>${x}</th>`).join('')}</tr></thead><tbody><tr>
        ${data.map(x => `<td>${x}</td>`).join('')}
        <td>${sumar(data)}</td></tr></tbody></table>`
    }
    this.qs('table').outerHTML = html
    if (this.multiple) {
      let totalDerecha = datasets.map(x => sumar(x.data))
      this.qsafor('tbody td:last-child', (x, i) => (x.textContent = totalDerecha[i]))
      this.qs('tfoot td:last-child').textContent = sumar(totalDerecha)
      this.qsarr('tfoot td').slice(1, -1).forEach((x, i) => (x.textContent = datasets.reduce((p, c) => p + c.data[i], 0)))
      this.normalizarCeldas(this.qsarr('tbody td:not(:first-child)'))
      this.normalizarCeldas(this.qsarr('tfoot td:not(:first-child)'))
    } else this.normalizarCeldas(this.qsarr('tbody td'))
  }

  normalizarCeldas(arr) {
    arr.forEach(x => (x.textContent = this.sonIngresos ? x.textContent.normalizarPrecio().aQuetzales() : x.textContent.cantidadFormateada()))
  }

  actualizarDatos() {
    let { multiple, agrupadoPorFecha } = this
    let checkboxesInternos = this.graficoDias.qsarr('.form-check-input').map(x => x.checked)
    let checkboxesExternos = this.graficoProductos.qsarr('.form-check-input').map(x => x.checked)
    if (multiple && checkboxesInternos.every(x => !x)) return Swal.fire('Error', 'Por favor seleccionar por lo menos un elemento', 'error')
    if (checkboxesExternos.every(x => !x)) return Swal.fire('Error', 'Por favor seleccionar por lo menos un elemento', 'error')

    let labels = UTDiaOSemana && agrupadoPorFecha ? fechas.filter((_, i) => checkboxesExternos[i]) : this.labels.filter((_, i) => checkboxesExternos[i])
    let datasets = structuredClone(this.datasets)

    if (this.chartVisible) this.chart.options.scales.y.type = opcionChequeada(this.qs('.escalaOpcion')) === 0 ? 'linear' : 'logarithmic'

    let coloresOpcion = opcionChequeada(this.qs('.coloresOpcion'))
    if (coloresOpcion) datasets = datasets.filter((_, i) => checkboxesInternos[i])
    datasets.forEach(el => (el.data = el.data.filter((_, i) => checkboxesExternos[i])))
    coloresOpcion === 0 ? this.colocarColores(this.graficoDias, checkboxesInternos, datasets) : this.colocarColores(this.graficoProductos, checkboxesExternos, datasets)

    if (UTDiaOSemana) {
      let fechaOpcion = opcionChequeada(this.graficoFechaOpcion)
      let opcion = fechaOpcion === 0 ? 'full' : fechaOpcion === 1 ? 'long' : 'short'
      this.fechaOpcion = opcion
      if (UTDia) {
        if (agrupadoPorFecha) labels = labels.map(x => formatearFecha(opcion, x))
        else datasets.forEach(x => (x.label = formatearFecha(opcion, fechas[x.indice])))
      } else {
        if (agrupadoPorFecha) {
          let indices = [...Array(checkboxesExternos.length).keys()].filter((_, i) => checkboxesExternos[i])
          labels = labels.map((x, i) => formatearRango(opcion, x, indices[i]))
        } else datasets.forEach(x => (x.label = formatearRango(opcion, fechas[x.indice], x.indice)))
      }
    }

    if (!multiple) {
      let nuevoDataset = Array.of(structuredClone(datasets[0]))
      Object.assign(nuevoDataset[0], { borderColor: colores, backgroundColor: coloresAlfa, data: labels.map((_, i) => parseFloat(datasets.reduce((acc, curr) => acc + curr.data[i], 0).normalizarPrecio())) })
      datasets = nuevoDataset
    }

    let ordenarOpcion = opcionChequeada(this.qs('.ordenarOpcion'))
    if (ordenarOpcion != 6) {
      const funcionesOrdenar = [
        (a, b) => labels[a].localeCompare(labels[b]),
        (a, b) => labels[b].localeCompare(labels[a]),
        (a, b) => fechas[b] - fechas[a],
        (a, b) => fechas[a] - fechas[b],
        (a, b) => datasets[0].data[b] - datasets[0].data[a],
        (a, b) => datasets[0].data[a] - datasets[0].data[b],
      ]
      let funcionOrdenar = funcionesOrdenar[ordenarOpcion]
      let indices = [...datasets[0].data.keys()]
      if (multiple && funcionOrdenar === 2) {
        let data = labels.map((_, i) => parseFloat(datasets.reduce((acc, curr) => acc + curr.data[i], 0).normalizarPrecio()))
        indices.sort((a, b) => data[b] - data[a])
      } else if (multiple && funcionOrdenar === 3) {
        let data = labels.map((_, i) => parseFloat(datasets.reduce((acc, curr) => acc + curr.data[i], 0).normalizarPrecio()))
        indices.sort((a, b) => data[a] - data[b])
      } else indices.sort(funcionOrdenar)
      labels = indices.map(i => labels[i]).filter(x => x != null)
      datasets.forEach(el => {
        el.data = indices.map(i => el.data[i])
        if (el.backgroundColor instanceof Array) el.backgroundColor = indices.map(i => el.backgroundColor[i])
        if (el.borderColor instanceof Array) el.borderColor = indices.map(i => el.borderColor[i])
      })
    }

    if (!multiple) {
      let { titulo, fechaOpcion } = this
      datasets[0].label = `${titulo.split('agrupado')[0]}durante el período del ${formatearFecha(fechaOpcion, tiempoMenor)} al ${formatearFecha(fechaOpcion, tiempoMayor)} `
    }

    this.datasetsActuales = datasets
    this.labelsActuales = labels
    this.chartVisible ? this.actualizarChart(datasets, labels) : this.actualizarTabla(datasets, labels)
  }

  actualizarChart(datasets, labels) {
    let { chart } = this
    chart.data.labels = labels
    chart.data.datasets = datasets
    chart.update()
    this.restaurarDataEliminada.esconder()
  }

  opcionHTMLColores(datos, arriba) {
    return `<div class="camioneros ${arriba ? 'graficoDias' : 'graficoProductos'}">
    ${datos.map((el, i) => `<div class="camionero">
    <div class="contenedor-color"><input type="color" value="${colores[i]}"></div>
      ${checkbox('Poner en el gráfico', 1)}
    <div class="nombreCamionero">${arriba ? el.label : el}</div>
    </div>`).join('')}</div>
  <div class="contenedorabajo botonreset ${arriba ? 'resetdias' : 'resetproductos'}">
  <div class="seleccionarTodos">${checkbox('Seleccionar todos los elementos', 1)}${popover('Permite seleccionar o remover todos los elementos')}</div>
  <boton-azul>Resetear los colores a los valores de default</boton-azul></div>`
  }

  agregarOpciones() {
    let { acordeonItem } = this
    let html = `<hr class="separadorCharts"><custom-acordeon>
      <custom-acordeonitem data-titulo="Opciones del gráfico" data-id="listaCamioneros${contador}" class="acordeonPrincipal">
    <custom-acordeon id="acordeonsegundonivel${contador}">
    ${acordeonItem(this.opcionHTMLColores(this.datasets, 1), `acordeondias`, this.devuelveFechaOProducto(0))}
    ${acordeonItem(this.opcionHTMLColores(this.labels, 0), `acordeonproductos`, this.devuelveFechaOProducto(1))}`
    let f = this.agrupadoPorFecha

    let htmlOtrasOpciones = `<div class="contenedorotrasopciones">
    <div class="contenedorColoresDeLosGrafios">
    <div class="tituloopciones">Colores de los gráficos ${popover('Permite invertir los colores de los gráficos, es más útil con los gráficos circulares')}</div>
    <hr>
    <div class="contenedoropcion">
    <custom-radiogroup class="coloresOpcion" id="coloresRadioButton${contador}">
      ${this.radiobutton(`Utilizar los colores de ${UTPluralGenero}`, 1)}
      ${this.radiobutton('Utilizar colores de los productos')}
    </custom-radiogroup></div>
    </div>

    ${UTDiaOSemana ? `<div class="tituloopciones">Cambiar formato de la fecha</div>
    <hr><div class="contenedoropcion"><custom-radiogroup class="graficoFechaOpcion" id="fechaRadioButton${contador}">
    ${this.radiobutton('Usar formato: "Lunes, 1 de enero de 2023"') + this.radiobutton('Usar formato: "1 de enero de 2023"', 1) + this.radiobutton('Usar formato: "1/1/2023"')}
    </custom-radiogroup></div>` : ''}

    <div class="tituloopciones">Ordenar los datos por ${popover(`Las opciones de ordenar por ${this.devuelveSonIngresos()} de mayor a menor y  ${this.devuelveSonIngresos()} de menor a mayor suma todos los datos y luego los ordena de mayor a menor`)}</div>
    <hr><div class="contenedoropcion"><custom-radiogroup class="ordenarOpcion" id="ordenarRadioButton${contador}">
    ${this.radiobutton('Ordenar productos por orden alfabético ascendentemente A-Z', null, f) + this.radiobutton('Ordenar productos por orden alfabético descendentemente Z-A', null, f)}
    ${this.radiobutton(`Ordenar por fecha de mayor a menor`, null, !f) + this.radiobutton(`Ordenar por fecha de menor a mayor`, null, !f)}
    ${this.radiobutton(`Ordenar por ${this.devuelveSonIngresos()} de mayor a menor`) + this.radiobutton(`Ordenar por ${this.devuelveSonIngresos()} de menor a mayor`)}
    ${this.radiobutton('Restaurar orden original', 1)}
    </custom-radiogroup></div>

    <div class="contenedorEscalas">
    <hr>
    <div class="tituloopciones">Escalas ${popover('Permite cambiar cómo se visualiza la data y dar mayor visibilidad a los datos pequeños (solo funciona en gráficos de barra y lineal)')}</div>
    <hr><div class="contenedoropcion"><custom-radiogroup class="escalaOpcion" id="escalaRadioButton${contador}">
    ${this.radiobutton('Escala lineal (normal)', 1) + this.radiobutton('Escala logarítmica')}
    </custom-radiogroup></div></div>
    </div>`

    html += `${acordeonItem(htmlOtrasOpciones, `acordeonotrasopciones`, 'Otras opciones')}
    <div class="contenedorabajo"><boton-azul class="actualizarGrafico">Actualizar gráfico</boton-azul></div>
    </custom-acordeon></custom-acordeonitem></custom-acordeon>`
    this.innerHTML = html
  }

  metodosOpcionesGrafico() {
    this.graficoDias = this.qs('.graficoDias')
    this.graficoProductos = this.qs('.graficoProductos')
    this.graficoFechaOpcion = this.qs('.graficoFechaOpcion')
    this.restaurarDataEliminada = this.qs('.restaurarDataEliminada')
    if (this.multiple) this.elclick('.resetdias button', async q => await this.resetearColores(this.graficoDias))
  }

  async resetearColores(el) {
    let { isConfirmed } = await swalConfirmarYCancelar.fire({
      title: 'Estás seguro que deseas resetear los colores a los valores de default?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
    })
    if (isConfirmed) {
      el.qsafor("[type='color']", (x, i) => (x.value = colores[i]))
      Swal.fire('Se han reseteado los colores correctamente', 'Para visualizar los cambios presionar el botón de actualizar gráfico', 'success')
    }
  }

  crearGrafico(labels, datasets, titulo, label, agrupadoPorFecha, sonIngresos, esCamionero) {
    contador++
    Object.assign(this, { labels, datasets, titulo, label, agrupadoPorFecha, sonIngresos, ordenar: 0, esCamionero, multiple: 1, datasetsActuales: datasets, labelsActuales: labels, type: 'bar' })
    this.agregarOpciones()
    this.colocarHTMLGrafica()
    this.colocarDatos()
    this.chart.update()
  }

  colocarDatos() {
    let { labels, datasets, titulo, label, agrupadoPorFecha, sonIngresos, type } = this
    this.chart = new Chart(this.canvas.getContext('2d'), {
      type,
      data: { labels, datasets },
      options: {
        hover: { animationDuration: 0 },
        responsiveAnimationDuration: 0,
        responsive: true,
        maintainAspectRatio: false,
        scales: { y: { beginAtZero: true } },
        plugins: {
          title: { display: true, text: titulo, font: { size: 28, weight: 500 }, padding: 30 },
          tooltip: {
            enabled: false,
            external: externalTooltipHandler,
            callbacks: {
              title: ([context]) => {
                let { multiple, fechaOpcion, esCamionero } = this
                let title = `${!agrupadoPorFecha ? `${esCamionero ? 'Camionero' : 'Producto'}: ${context.label}` : `Fecha: ${context.label}`}`
                return title
              },
              label: context => {
                let { multiple, esCamionero } = this
                return multiple ? [agrupadoPorFecha ? `${esCamionero ? 'Camionero' : 'Producto'}: ${context.dataset.label}` : `Fecha: ${context.dataset.label}`, `${sonIngresos ? 'Ingresos generados' : 'Cantidad vendidos'}: ${this.devuelveCantidadFormateada(context)}`] : `${sonIngresos ? 'Total ingresos generados' : `Cantidad ${agrupadoPorFecha ? 'de productos ' : ''}vendidos`}: ${this.devuelveCantidadFormateada(context)}`
              }
            }
          }
        }
      }
    })
    if (type === 'radar') this.chart.options.scales.r.ticks.backdropColor = 'transparent'
  }
}

function getOrCreateTooltip(chart) {
  let padreCanvas = chart.canvas.padre()
  if (!chart.tooltipEl) {
    padreCanvas.añadirHTML(`<div style="background: rgba(0, 0, 0, 0.7); border-radius: 3px; color: white; opacity: 1; pointer-events: none; position: absolute; transform: translate(-50%, 0px); transition: all 0.1s ease 0s;"></div>`)
    chart.tooltipEl = padreCanvas.qs('div')
  }
}


function externalTooltipHandler(context) {
  let { chart, tooltip } = context
  getOrCreateTooltip(chart)
  let tooltipEl = chart.tooltipEl
  let estilo = tooltipEl.style
  if (tooltip.opacity === 0) return (estilo.opacity = 0)
  if (tooltip.body) {
    tooltipEl.html(`<div style="font-size: 14px;">${(tooltip.title || []).map((title, i) => `<span style="background: ${tooltip.labelColors[i].backgroundColor.slice(0, -2) + '40'}; border: 1px solid ${tooltip.labelColors[i].borderColor}; margin-right: 5px; height: 10px; width: 10px; display: inline-block;"></span>${title}`).join('')}</div>
    ${tooltip.body.map(b => b.lines).map(body => body.map(x => `<div style="font-size: 14px;">${x}</div>`).join('')).join('')}`)
  }

  let { offsetLeft, offsetTop } = chart.canvas
  estilo.opacity = 1
  let long = tooltipEl.getBoundingClientRect().width / 2 + 5
  estilo.left = offsetLeft + tooltip.caretX + (tooltip.caretX > chart.width / 2 ? -long : long) + 'px'
  estilo.top = offsetTop + tooltip.caretY + 'px'
  estilo.font = tooltip.options.bodyFont.string
  estilo.padding = '5px 10px 7px'
}

customElements.define('custom-graficos', graficos)

class botonConvertira extends HTMLElement {
  connectedCallback() {
    this.outerHTML = `<boton-azul class="convertira">${this.innerHTML} <svg width="27px" height="27px" viewBox="0 0 24 24" fill="white"><path d="M15.2929 10.2929C14.9024 10.6834 14.9024 11.3166 15.2929 11.7071C15.6834 12.0976 16.3166 12.0976 16.7071 11.7071L20.7071 7.70711C20.8306 7.58361 20.9151 7.43586 20.9604 7.27919C20.9779 7.2191 20.9895 7.1577 20.9954 7.09585C20.9976 7.07319 20.999 7.05048 20.9996 7.02774C21.0002 7.00709 21.0001 6.98642 20.9994 6.96578C20.9905 6.6971 20.8755 6.45528 20.695 6.28079L16.7071 2.29289C16.3166 1.90237 15.6834 1.90237 15.2929 2.29289C14.9024 2.68342 14.9024 3.31658 15.2929 3.70711L17.5856 5.99981L3.99999 5.99999C3.4477 5.99999 2.99999 6.44772 3 7C3.00001 7.55228 3.44773 7.99999 4.00001 7.99999L17.586 7.99981L15.2929 10.2929Z"/><path d="M20 16L6.41423 16L8.70712 13.7071C9.09764 13.3166 9.09764 12.6834 8.70712 12.2929C8.3166 11.9024 7.68343 11.9024 7.29291 12.2929L3.29291 16.2929C2.90238 16.6834 2.90238 17.3166 3.29291 17.7071L7.29291 21.7071C7.68343 22.0976 8.3166 22.0976 8.70712 21.7071C9.09764 21.3166 9.09764 20.6834 8.70712 20.2929L6.41423 18L20 18C20.5523 18 21 17.5523 21 17C21 16.4477 20.5523 16 20 16Z"/></svg></boton-azul>`
  }
}

customElements.define('boton-convertira', botonConvertira)

class resumenDatos extends HTMLElement {
  agregarCantidad() {
    this.innerHTML = `<div class="tituloGrupoPodios" style="padding: 15px;">Total ingresos generados en este período: ${datasetIngresosAgrupadosPorProducto.reduce((p, c) => p + sumar(c.data), 0).normalizarPrecio().aQuetzales()}</div>`
  }
}

customElements.define('resumen-datos', resumenDatos)

let graficoCercano = c => c.closest('custom-graficos')
bodyOnClick('.resetproductos button', async c => await graficoCercano(c).resetearColores(c.graficoProductos))
bodyOnClick('.actualizarGrafico', c => graficoCercano(c).actualizarDatos())
bodyOnClick('.actualizarTabla', c => graficoCercano(c).actualizarTabla())
bodyOnClick('.restaurarDataEliminada', c => graficoCercano(c).actualizarDatos())

bodyOnClick('.seleccionarTodos custom-checkbox', c => {
  let checkeado = c.qs('input').checked
  c.closest('.accordion-body').qsafor('.camionero custom-checkbox input', x => x.checked = e.target.matches('input') ? checkeado : !checkeado)
})

bodyOnClick('.restaurarTamaño', c => {
  let g = graficoCercano(c)
  g.style.width = '1179px'
  g.contenedorCanvas.style.height = '589px'
  g.restaurarTamaño.esconder()
})

bodyOnClick('.uneOSeparaDatos', c => {
  let g = graficoCercano(c)
  let textoAnterior = c.innerHTML
  c.innerHTML = g.uneOSeparaDatosTexto || 'Separa los datos <svg width="30px" height="30px" viewBox="0 0 16 16" style="transform: rotate(-90deg);"><path fill="#FFF" d="M14 13v-1c0-0.2 0-4.1-2.8-5.4-2.2-1-2.2-3.5-2.2-3.6v-3h-2v3c0 0.1 0 2.6-2.2 3.6-2.8 1.3-2.8 5.2-2.8 5.4v1h-2l3 3 3-3h-2v-1c0 0 0-2.8 1.7-3.6 1.1-0.5 1.8-1.3 2.3-2 0.5 0.8 1.2 1.5 2.3 2 1.7 0.8 1.7 3.6 1.7 3.6v1h-2l3 3 3-3h-2z"/></svg>'
  g.uneOSeparaDatosTexto = textoAnterior
  g.multiple = !g.multiple
  g.actualizarDatos()
  g.qs('.contenedortabla').scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start' })
})

bodyOnClick('.btnTamaño.aumentar', c => {
  let g = graficoCercano(c)
  let [longitud] = g.style.width.split('px')
  let [altura] = g.contenedorCanvas.style.height.split('px')
  g.style.width = (longitud.aInt() || 1179) + 500 + 'px'
  g.contenedorCanvas.style.height = (altura.aInt() || 589) + 250 + 'px'
  g.restaurarTamaño.mostrar()
})
bodyOnClick('.btnTamaño.disminuir', c => {
  let g = graficoCercano(c)
  let [longitud] = g.style.width.split('px')
  let [altura] = g.contenedorCanvas.style.height.split('px')
  longitud = longitud.aInt() || 1179
  if (longitud <= 1179) return
  g.style.width = longitud - 500 + 'px'
  g.contenedorCanvas.style.height = (altura.aInt() || 589) - 250 + 'px'
  if (longitud <= 1679) g.restaurarTamaño.esconder()
})

bodyOnClick('.convertira', c => {
  let g = graficoCercano(c)
  g.qs('.articleGrafico').alternar()
  g.qs('.articleTabla').alternar()
  g.qs('.gridBotonesTamaño').alternar()
  g.qs('.contenedorEliminarData').alternar()
  g.qs('.contenedorEscalas').alternar()
  g.qs('.contenedorColoresDeLosGrafios').alternar()
  if (g.chartVisible) {
    g.actualizarTabla(g.datasetsActuales, g.labelsActuales)
    g.qs('.actualizarGrafico').textContent = 'Actualizar tabla'
    g.qs('.acordeonPrincipal > .headeracordeon .tituloProductos').textContent = 'Opciones de la tabla'
    g.qs('.camioneros label').textContent = 'Poner en la tabla'
  } else {
    g.actualizarChart(g.datasetsActuales, g.labelsActuales)
    g.qs('.actualizarGrafico').textContent = 'Actualizar gráfico'
    g.qs('.acordeonPrincipal > .headeracordeon .tituloProductos').textContent = 'Opciones del gráfico'
    g.qs('.camioneros label').textContent = 'Poner en el gráfico'
  }
  g.qsa('.convertira')[g.chartVisible ? 1 : 0].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
  g.chartVisible = !g.chartVisible
})
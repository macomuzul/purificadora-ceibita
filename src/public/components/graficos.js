let contador = 0;
class graficos extends HTMLElement {
  devuelveSonIngresos = () => this.sonIngresos ? "ingresos" : "ventas";
  radiobutton = (id, label, checked) => `<custom-radiobutton data-id="${id}${contador}" ${checked ? `data-checked="1"` : ""}>${label}</custom-radiobutton>`
  acordeonItem = (html, id, titulo) => `<custom-acordeonitem data-id="${id}${contador}" data-titulo="${titulo}">${html}</custom-acordeonitem>`
  devuelveCantidadFormateada = context => this.sonIngresos ? context.raw.aQuetzales() : context.formattedValue
  chartVisible = true
  multiple = true
  fechaOpcion = "long"
  colocarHTMLGrafica() {
    let html = `<article class="articleGrafico"><div class="contenedormedio"><div class="dropdown">
    <label for="rol">Tipo de gráfico</label>
    <button class="btn dropdown-toggle form-control" type="button" data-bs-toggle="dropdown">De barra</button>
    <ul class="dropdown-menu">
      ${['De barra', 'Circular 1', 'Circular 2', 'De línea', 'De radar'].map(el => `<li><a class="dropdown-item">${el}</a></li>`).join('')}
    </ul></div>
    <boton-convertira>Convertir a tabla</boton-convertira>
    <boton-pdf></boton-pdf></div><div class="contenedorCanvas"><canvas id="canvas${contador}"></canvas></div></article>
    <article class="articleTabla" style="display: none;">
    <div class="contenedormedio" style="align-items: center;"><boton-excel id="a"></boton-excel><boton-convertira>Convertir a gráfico</boton-convertira><boton-pdf id="b"></boton-pdf></div>
    <div class="contenedortabla"><div class="tituloTabla">${this.titulo}</div>
    <table></table>
    </div>
    </article>
    <div class="contenedorAbajoDeLosDatos">
    <div class="gridBotonesTamaño"><button class="btnTamaño aumentar">+</i></button><button class="btnTamaño disminuir">-</i>
    <button class="btnTamaño restaurarTamaño">Restaurar</i></button><span class="textoTamaño">Tamaño</span></div>
    <button class="btn btn-primary botonazul uneOSeparaDatos">Unifica los datos <svg xmlns="http://www.w3.org/2000/svg" fill="#FFF" width="30px" height="30px" viewBox="0 0 20 20" style="transform: rotate(90deg);"><path d="M17.89 17.707L16.892 20c-3.137-1.366-5.496-3.152-6.892-5.275-1.396 2.123-3.755 3.91-6.892 5.275l-.998-2.293C5.14 16.389 8.55 14.102 8.55 10V7H5.5L10 0l4.5 7h-3.05v3c0 4.102 3.41 6.389 6.44 7.707z"/></svg></button>
    </div>
    <div class="contenedorEliminarData">
    ${checkbox("Eliminar data al tocarla", null, "eliminarDataGrafico")}
    ${popover(`La eliminación de data usando este método es temporal, la próxima vez que actualices volverá a aparecer, si no quieres que aparezcan quítalos desde las opciones del gráfico. <br><strong>Importante: </strong> borra los datos en base a las etiquetas que están abajo de los datos. Si solo hay una etiqueta borrará todos los datos en esa etiqueta (no te preocupes los datos no se pierden) solo presiona restaurar datos o actualizar y volverán a aparecer`)}
    </div>
    <div class="restaurarDataEliminada" style="display: none"><button class="btn btn-primary botonazul">Restaurar datos borrados</button></div>`
    this.html += html;

    this.innerHTML = this.html
    this.canvas = $(this).find("canvas")[0];
    this.$chart = this.canvas.getContext('2d')
    this.metodosOpcionesGrafico()
    this.metodosBotonesGrafico()
    this.metodosBotonesAbajo()
    this.metodosBotonesTabla()
  }

  metodosBotonesAbajo() {
    this.contenedorCanvas = $(this).find(".contenedorCanvas")[0]
    this.restaurarTamaño = $(this).find(".restaurarTamaño")[0]
    $(this).on("click", ".btnTamaño.aumentar", () => {
      let [longitud] = this.style.width.split("px")
      let [altura] = this.contenedorCanvas.style.height.split("px")
      this.style.width = (parseInt(longitud) || 1179) + 500 + "px"
      this.contenedorCanvas.style.height = (parseInt(altura) || 589) + 250 + "px"
      this.restaurarTamaño.style.display = "initial"
    })
    $(this).on("click", ".btnTamaño.disminuir", () => {
      let [longitud] = this.style.width.split("px")
      let [altura] = this.contenedorCanvas.style.height.split("px")
      longitud = parseInt(longitud) || 1179
      if (longitud <= 1179)
        return
      this.style.width = longitud - 500 + "px"
      this.contenedorCanvas.style.height = (parseInt(altura) || 589) - 250 + "px"
      if (longitud <= 1679)
        this.restaurarTamaño.style.display = "none"
    })
    $(this).on("click", ".restaurarTamaño", () => {
      this.style.width = "1179px"
      this.contenedorCanvas.style.height = "589px"
      this.restaurarTamaño.style.display = "none"
    })
    $(this).on("click", ".uneOSeparaDatos", e => {
      let textoAnterior = e.currentTarget.innerHTML
      e.currentTarget.innerHTML = this.uneOSeparaDatosTexto || 'Separa los datos <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="30px" height="30px" viewBox="0 0 16 16" version="1.1" style="transform: rotate(-90deg);"><path fill="#FFF" d="M14 13v-1c0-0.2 0-4.1-2.8-5.4-2.2-1-2.2-3.5-2.2-3.6v-3h-2v3c0 0.1 0 2.6-2.2 3.6-2.8 1.3-2.8 5.2-2.8 5.4v1h-2l3 3 3-3h-2v-1c0 0 0-2.8 1.7-3.6 1.1-0.5 1.8-1.3 2.3-2 0.5 0.8 1.2 1.5 2.3 2 1.7 0.8 1.7 3.6 1.7 3.6v1h-2l3 3 3-3h-2z"/></svg>'
      this.uneOSeparaDatosTexto = textoAnterior
      this.multiple = !this.multiple
      this.actualizarDatos()
    })
  }

  metodosBotonesGrafico() {
    $(this).on("click", ".convertira", () => {
      this.chartVisible = !this.chartVisible
      $(this).find(".articleGrafico").toggle()
      $(this).find(".articleTabla").toggle()
      $(this).find(".gridBotonesTamaño").toggle()
      $(this).find(".contenedorEliminarData").toggle()
      if (this.chartVisible) {
        this.actualizarChart(this.datasetsActuales, this.labelsActuales)
        $(this).find(".camioneros label").text("Poner en el gráfico")
        $(this).find(".actualizarGrafico").text("Actualizar gráfico")
        $(this).find(".acordeonPrincipal > .headeracordeon .tituloProductos").text("Opciones del gráfico")
      }
      else {
        this.actualizarTabla(this.datasetsActuales, this.labelsActuales)
        $(this).find(".camioneros label").text("Poner en la tabla")
        $(this).find(".actualizarGrafico").text("Actualizar tabla")
        $(this).find(".acordeonPrincipal > .headeracordeon .tituloProductos").text("Opciones de la tabla")
      }
    })
    $(this).on("click", ".articleGrafico .botonpdf", e => e.currentTarget.exportarGrafico(this.canvas, this.titulo))
    $(this).on("click", ".eliminarDataGrafico", e => {
      this.chart.options.onClick = $(e.currentTarget).find("input")[0].checked ? () => { } : (event, activeElements) => {
        let { chart } = event
        let { datasets, labels } = structuredClone(chart.data)
        if (activeElements[0]) {
          const selectedIndex = activeElements[0].index
          datasets.forEach(x => x.data.splice(selectedIndex, 1))
          labels.splice(selectedIndex, 1)
          this.actualizarChart(datasets, labels)
          $(this.restaurarDataEliminada).show()
        }
      }
    })
    $(this).on("click", ".dropdown-item", e => {
      let texto = e.currentTarget.innerText
      $(e.currentTarget).closest(".dropdown-menu").prev()[0].innerText = texto
      const graficos = {
        "De barra": "bar",
        "Circular 1": "doughnut",
        "Circular 2": "pie",
        "De línea": "line",
        "De radar": "radar"
      }
      let { type } = this
      this.type = graficos[texto]
      this.chart.config.type = this.type
      if (type === "radar" || this.type === "radar") {
        this.chart.destroy()
        this.colocarDatos()
        this.actualizarDatos(this.datasetsActuales, this.labelsActuales)
      } else
        this.chart.update()
    })
  }


  metodosBotonesTabla() {
    $(this).find(".botonpdf")[1].inicializar(() => {
      let contenedor = $(this).find(".contenedorTabla")[0];
      let contenedorClon = contenedor.cloneNode(true);
      contenedorClon.style.width = contenedor.offsetWidth;
      let titulo = $(contenedorClon).find(".tituloTabla")[0];
      titulo.style.background = "#0f0924";
      titulo.style.padding = "15px";
      return contenedorClon.outerHTML;
    }, this.titulo)
    let titulo = this.titulo
    let that = this
    $(this).find(".botonexcel")[0].inicializar(function () {
      let nombre = `${titulo}.xlsx`;
      let workbook = XLSX.utils.book_new();
      let tabla = $(that).find("table")[0]
      let ws = XLSX.utils.table_to_sheet(tabla, { raw: true })
      var range = XLSX.utils.decode_range(ws["!ref"])
      if (that.multiple)
        ws['!cols'] = [that.agrupadoPorFecha ? { wch: Math.max(...[...$(tabla).find("tbody td:first-child")].map(x => x.textContent.length)) } : { width: 24 }, ...[...tabla.rows[1].cells].map(x => (that.agrupadoPorFecha ? { width: 18 } : { wch: x.textContent.length })), { width: 19 }]
      else
        ws['!cols'] = [...[...tabla.rows[2].cells].map(x => (that.agrupadoPorFecha ? { wch: x.textContent.length } : { width: 18 })), { width: 20 }]
      ws['!rows'] = [{ hpt: 35 }, ...[...Array(range.e.r - range.s.r)].map(x => ({ hpt: 24 }))]
      for (var i = range.s.r; i <= range.e.r; i++) {
        for (var j = range.s.c; j <= range.e.c; j++) {
          var cell_address = XLSX.utils.encode_cell({ r: i, c: j })
          var cell = ws[cell_address]
          if (cell) {
            this.ajustesCeldasExcel(cell)
            cell.s.fill = { fgColor: { rgb: i === 0 ? "192435" : "0f0d35" } }
          }
        }
      }
      XLSX.utils.book_append_sheet(workbook, ws, `Resumen del día de hoy`)
      XLSX.writeFile(workbook, nombre)
    })
  }

  colocarColores(contenedorColores, checkboxes, datasets) {
    let colores = [...contenedorColores.find("[type='color']")].filter((_, i) => checkboxes[i]).map(el => el.value)
    if (this.multiple && contenedorColores[0].classList.contains("graficoDias")) {
      let coloresAlfa = colores.map(x => x + "20")
      datasets.forEach((x, i) => {
        x.borderColor = colores[i]
        x.backgroundColor = coloresAlfa[i]
      })
    }
    else {
      colores = devuelveColores(colores)
      let coloresAlfa = devuelveColores(colores, 1)
      datasets.forEach(x => {
        x.borderColor = colores
        x.backgroundColor = coloresAlfa
      })
    }
  }
  devuelveFechaOProducto = siEsAgrupadoPorFecha => siEsAgrupadoPorFecha === this.agrupadoPorFecha ? unidadTiempoPluralMayuscula : "Productos"
  devuelveFechaOProductoSingular = siEsAgrupadoPorFecha => siEsAgrupadoPorFecha === this.agrupadoPorFecha ? unidadTiempoSingular : "Producto"

  actualizarTabla(datasets, labels) {
    let html
    if (this.multiple) {
      html = `<table class="multiple"><thead><tr><th class="primeraCelda" rowspan="2">${this.devuelveFechaOProducto(1)}</th>
      <th colspan="${datasets.length}">${this.devuelveFechaOProducto(0)}</th>
      ${`<th rowspan="2">Total ${this.devuelveSonIngresos()}:</th>`}</tr>
      <tr>${datasets.map(el => `<th>${el.label}</th>`).join("")}</tr></thead>
      <tbody>${datasets[0].data.map((_, i) => `<tr><td>${labels[i].partirFechas()}</td>${datasets.map(x => `<td>${x.data[i]}</td>`).join("")}<td></td></tr>`).join("")}</tbody>
    <tfoot><tr><td>Total:</td>${datasets.map(() => "<td></td>").join("")}<td></td></tr></tfoot>
  </table>`
    }
    else {
      let data = datasets[0].data
      html = `<table><thead><tr><th colspan="${(labels.length + 1)}">${this.titulo.split("agrupado")[0]}durante el período del ${formatearFecha(this.fechaOpcion, tiempoMenor)} al ${formatearFecha(this.fechaOpcion, tiempoMayor)}</th></tr><tr><th colspan="${data.length}">${this.devuelveFechaOProducto(1)}</th><th rowspan="2">Total ${this.devuelveSonIngresos()}:</th></tr>
      <tr>${labels.map(x => `<th>${x}</th>`).join("")}</tr></thead><tbody><tr>
        ${data.map(el => `<td>${el}</td>`).join("")}
        <td>${data.reduce((a, t) => a += t)}</td></tr></tbody></table>`
    }
    $(this).find("table")[0].outerHTML = html
    if (this.multiple) {
      let totalDerecha = datasets[0].data.map((_, i) => datasets.reduce((p, c) => p += c.data[i], 0))
        ;[...$(this).find("tbody td:last-child")].forEach((x, i) => x.textContent = totalDerecha[i])
      $(this).find("tfoot td:last-child").text(totalDerecha.reduce((p, c) => p += c))
        ;[...$(this).find("tfoot td")].slice(1, -1).forEach((x, i) => x.textContent = datasets[i].data.reduce((p, c) => p += c))
      this.normalizarCeldas([...$(this).find("tbody td:not(:first-child)")])
      this.normalizarCeldas([...$(this).find("tfoot td:not(:first-child)")])
    } else
      this.normalizarCeldas([...$(this).find("tbody td")])
  }

  normalizarCeldas(arr) {
    arr.forEach(x => x.textContent = this.sonIngresos ? x.textContent.normalizarPrecio().aQuetzales() : x.textContent.cantidadFormateada())
  }

  actualizarDatos() {
    let { multiple, agrupadoPorFecha } = this
    let checkboxesInternos = [...$(this.graficoDias).find(".form-check-input")].map(el => el.checked);
    let checkboxesExternos = [...$(this.graficoProductos).find(".form-check-input")].map(el => el.checked);
    if (multiple && checkboxesInternos.every(x => !x))
      return Swal.fire("Error", "Por favor seleccionar por lo menos un elemento", "error")
    if (checkboxesExternos.every(x => !x))
      return Swal.fire("Error", "Por favor seleccionar por lo menos un elemento", "error")

    let labels = unidadTiempoEsDiaOSemana ? agrupadoPorFecha ? fechas.filter((_, i) => checkboxesExternos[i]) : this.labels.filter((_, i) => checkboxesExternos[i]) : this.labels
    let datasets = structuredClone(this.datasets)

    if (this.chartVisible)
      this.chart.options.scales.y.type = $(this).find(".escalaOpcion input:checked")[0].id.includes("linear") ? "linear" : "logarithmic"

    //ve cuales colores tiene que usar
    let coloresOpcion = $(this).find(".coloresOpcion input:checked")[0]?.id
    if (coloresOpcion) datasets = datasets.filter((_, i) => checkboxesInternos[i])
    datasets.forEach(el => el.data = el.data.filter((_, i) => checkboxesExternos[i]))
    coloresOpcion?.includes("color1") ? this.colocarColores(this.graficoDias, checkboxesInternos, datasets) : this.colocarColores(this.graficoProductos, checkboxesExternos, datasets)

    //cambia fechas
    if (unidadTiempoEsDiaOSemana) {
      let fechaOpcion = $(this.graficoFechaOpcion).find("input:checked")[0]?.id
      let opcion = fechaOpcion.includes("fecha1") ? "full" : fechaOpcion.includes("fecha2") ? "long" : "short"
      this.fechaOpcion = opcion
      if (unidadTiempoEsDia) {
        if (agrupadoPorFecha) labels = labels.map(x => formatearFecha(opcion, x))
        else datasets.forEach(x => x.label = formatearFecha(opcion, fechas[x.indice]))
      } else {
        if (agrupadoPorFecha) {
          let indices = [...Array(checkboxesExternos.length).keys()].filter((_, i) => checkboxesExternos[i])
          labels = labels.map((x, i) => formatearRango(opcion, x, indices[i]))
        }
        else datasets.forEach(x => x.label = formatearRango(opcion, fechas[x.indice], x.indice))
      }
    }

    if (!multiple) {
      let nuevoDataset = Array.of(structuredClone(datasets[0]))
      Object.assign(nuevoDataset[0], { borderColor: colores, backgroundColor: coloresAlfa, data: labels.map((_, i) => parseFloat(datasets.reduce((acc, curr) => acc + curr.data[i], 0).normalizarPrecio())) })
      datasets = nuevoDataset
    }

    //ordenar
    let ordenarOpcion = $(this).find(".ordenarOpcion input:checked")[0].id
    if (!ordenarOpcion.includes("default")) {
      const funcionesOrdenar = {
        ordenar1: (a, b) => labels[a].localeCompare(labels[b]),
        ordenar2: (a, b) => labels[b].localeCompare(labels[a]),
        ordenar3: (a, b) => datasets[0].data[b] - datasets[0].data[a],
        ordenar4: (a, b) => datasets[0].data[a] - datasets[0].data[b],
        ordenar5: (a, b) => fechas[b] - fechas[a],
        ordenar6: (a, b) => fechas[a] - fechas[b],
      }
      let [nombre, funcionOrdenar] = Object.entries(funcionesOrdenar).find(([key]) => ordenarOpcion.includes(key))
      let indices = [...datasets[0].data.keys()]
      if (multiple && nombre.includes("ordenar3")) {
        let data = labels.map((_, i) => parseFloat(datasets.reduce((acc, curr) => acc + curr.data[i], 0).normalizarPrecio()))
        indices.sort((a, b) => data[b] - data[a])
      }
      else if (multiple && nombre.includes("ordenar4")) {
        let data = labels.map((_, i) => parseFloat(datasets.reduce((acc, curr) => acc + curr.data[i], 0).normalizarPrecio()))
        indices.sort((a, b) => data[a] - data[b])
      }
      else indices.sort(funcionOrdenar)
      labels = indices.map(i => labels[i]).filter(x => x != null)
      datasets.forEach(el => {
        el.data = indices.map(i => el.data[i]);
        if (el.backgroundColor instanceof Array) el.backgroundColor = indices.map(i => el.backgroundColor[i]);
        if (el.borderColor instanceof Array) el.borderColor = indices.map(i => el.borderColor[i]);
      })
    }

    if (!multiple) {
      let { titulo, fechaOpcion } = this
      datasets[0].label = `${titulo.split("agrupado")[0]}durante el período del ${formatearFecha(fechaOpcion, tiempoMenor)} al ${formatearFecha(fechaOpcion, tiempoMayor)} `
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
    $(this.restaurarDataEliminada).hide()
  }

  opcionHTMLColores(datos, arriba) {
    return `<div class="camioneros ${arriba ? "graficoDias" : "graficoProductos"}">
    ${datos.map((el, i) => `<div class="camionero">
    <div class="contenedor-color"><input type="color" value="${colores[i]}"></div>
      ${checkbox("Poner en el gráfico", 1)}
    <div class="nombreCamionero">${arriba ? el.label : el}</div>
    </div>`).join("")}</div>
  <div class="contenedorabajo botonreset ${arriba ? "resetdias" : "resetproductos"}">
  <div class="seleccionarTodos">${checkbox("Seleccionar todos los elementos", 1)}${popover("Permite seleccionar o remover todos los elementos")}</div>
  <button class="btn btn-primary botonazul">Resetear los colores a los valores de default</button></div>`
  }

  agregarOpciones() {
    let { acordeonItem } = this
    let html = `<hr class="separadorCharts"><custom-acordeon>
      <custom-acordeonitem data-titulo="Opciones del gráfico" data-id="listaCamioneros${contador}" class="acordeonPrincipal">
    <custom-acordeon id="acordeonsegundonivel${contador}">
    ${acordeonItem(this.opcionHTMLColores(this.datasets, 1), `acordeondias`, this.devuelveFechaOProducto(0))}
    ${acordeonItem(this.opcionHTMLColores(this.labels, 0), `acordeonproductos`, this.devuelveFechaOProducto(1))}`

    let htmlOtrasOpciones = `<div class="contenedorotrasopciones">
    <div class="tituloopciones">Colores de los gráficos ${popover("Permite invertir los colores de los gráficos, es más útil con los gráficos circulares")}</div>
    <hr>
    <div class="contenedoropcion">
    <custom-radiogroup class="coloresOpcion" id="coloresRadioButton${contador}">
      ${this.radiobutton("color1", `Utilizar los colores de ${unidadTiempoPluralGenero}`, 1)}
      ${this.radiobutton("color2", "Utilizar colores de los productos")}
    </custom-radiogroup></div>

    ${unidadTiempoEsDiaOSemana ? `<div class="tituloopciones">Cambiar formato de la fecha</div>
    <hr><div class="contenedoropcion"><custom-radiogroup class="graficoFechaOpcion" id="fechaRadioButton${contador}">
    ${this.radiobutton("fecha1", 'Usar formato: "Lunes, 1 de enero de 2023"') + this.radiobutton("fecha2", 'Usar formato: "1 de enero de 2023"', 1) + this.radiobutton("fecha3", 'Usar formato: "1/1/2023"')}
    </custom-radiogroup></div>` : ""}

    <div class="tituloopciones">Ordenar los datos por ${popover(`Las opciones de ordenar por ${this.devuelveSonIngresos()} de mayor a menor y  ${this.devuelveSonIngresos()} de menor a mayor suma todos los datos y luego los ordena de mayor a menor`)}</div>
    <hr><div class="contenedoropcion"><custom-radiogroup class="ordenarOpcion" id="ordenarRadioButton${contador}">
    ${!this.agrupadoPorFecha ? this.radiobutton("ordenar1", "Ordenar productos por orden alfabético ascendentemente A-Z") + this.radiobutton("ordenar2", "Ordenar productos por orden alfabético descendentemente Z-A") : ""}
    ${this.agrupadoPorFecha ? this.radiobutton("ordenar5", `Ordenar por fecha de mayor a menor`) + this.radiobutton("ordenar6", `Ordenar por fecha de menor a mayor`) : ""}
    ${this.radiobutton("ordenar3", `Ordenar por ${this.devuelveSonIngresos()} de mayor a menor`) + this.radiobutton("ordenar4", `Ordenar por ${this.devuelveSonIngresos()} de menor a mayor`)}
    ${this.radiobutton("ordenardefault", "Restaurar orden original", 1)}
    </custom-radiogroup></div>

    <div class="contenedorEscalas">
    <hr>
    <div class="tituloopciones">Escalas ${popover("Permite cambiar cómo se visualiza la data y dar mayor visibilidad a los datos pequeños (solo funciona en gráficos de barra y lineal)")}</div>
    <hr><div class="contenedoropcion"><custom-radiogroup class="escalaOpcion" id="escalaRadioButton${contador}">
    ${this.radiobutton("linear", "Escala lineal (normal)", 1) + this.radiobutton("logaritmica", "Escala logarítmica")}
    </custom-radiogroup></div></div>
    </div>`

    html += `${acordeonItem(htmlOtrasOpciones, `acordeonotrasopciones`, "Otras opciones")}
    <div class="contenedorabajo"><button class="btn btn-primary botonazul actualizarGrafico">Actualizar gráfico</button></div>
    </custom-acordeon></custom-acordeonitem></custom-acordeon>`;
    this.html = html
  }

  metodosOpcionesGrafico() {
    this.graficoDias = $(this).find(".graficoDias")
    this.tablaDias = $(this).find(".tablaDias")
    this.graficoProductos = $(this).find(".graficoProductos")
    this.tablaProductos = $(this).find(".tablaProductos")
    this.graficoFechaOpcion = $(this).find(".graficoFechaOpcion")
    this.tablaFechaOpcion = $(this).find(".tablaFechaOpcion")
    this.restaurarDataEliminada = $(this).find(".restaurarDataEliminada")
    if (this.multiple) $(this).on("click", ".resetdias button", async () => await this.resetearColores(this.graficoDias))
    $(this).on("click", ".resetproductos button", async () => await this.resetearColores(this.graficoProductos))
    $(this).on("click", ".actualizarGrafico", () => this.actualizarDatos())
    $(this).on("click", ".actualizarTabla", () => this.actualizarTabla())
    $(this).on("click", ".restaurarDataEliminada", () => this.actualizarDatos())
    $(this).on("click", ".seleccionarTodos", e => $(e.currentTarget).closest(".accordion-body").find(".camioneros input").prop("checked", !$(e.currentTarget).find("input")[0].checked))
  }

  async resetearColores(el) {
    let { isConfirmed } = await swalConfirmarYCancelar.fire({
      title: "Estás seguro que deseas resetear los colores a los valores de default?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: "No",
    })
    if (isConfirmed) {
      $(el).find("[type='color']").each((i, x) => x.value = colores[i]);
      Swal.fire("Se han reseteado los colores correctamente", "Para visualizar los cambios presionar el botón de actualizar gráfico", "success");
    }
  }

  crearGrafico(labels, datasets, titulo, label, agrupadoPorFecha, sonIngresos, ordenar, type = "bar") {
    contador++
    Object.assign(this, { labels, datasets, titulo, label, agrupadoPorFecha, sonIngresos, ordenar, type, multiple: 1, datasetsActuales: datasets, labelsActuales: labels })
    this.agregarOpciones()
    this.colocarHTMLGrafica()
    this.colocarDatos()
    this.chart.update()
  }

  colocarDatos() {
    let { labels, datasets, titulo, label, agrupadoPorFecha, sonIngresos, type } = this
    this.chart = new Chart(this.$chart, {
      type,
      data: { labels, datasets },
      options: {
        hover: { animationDuration: 0, },
        responsiveAnimationDuration: 0,
        responsive: true,
        maintainAspectRatio: false,
        scales: { y: { beginAtZero: true } },
        plugins: {
          title: { display: true, text: titulo, font: { size: 28, weight: 500 }, padding: 30 },
          tooltip: {
            callbacks: {
              title: ([context]) => {
                let { multiple, fechaOpcion } = this
                let title = ""
                if (multiple)
                  title = `${!agrupadoPorFecha ? `Producto: ${context.label}, ${sonIngresos ? "vendidos" : "ingresos generados"}: ${this.devuelveCantidadFormateada(context)}` : `Fecha: ${context.label}`}`
                else
                  title = `${sonIngresos ? "Total de ingresos generados" + (agrupadoPorFecha ? "" : ` por ${context.label}`) : "Cantidad de " + (agrupadoPorFecha ? "productos" : context.label) + " vendidos"}: ${this.devuelveCantidadFormateada(context)} `
                return title
              },
              label: context => {
                let { multiple, fechaOpcion } = this
                let label = ""
                if (multiple) {
                  label = `${agrupadoPorFecha ? `Producto: ${context.dataset.label}, ${sonIngresos ? "ingresos generados" : "vendidos"}: ${this.devuelveCantidadFormateada(context)}` : `Fecha: ${context.dataset.label}`} `
                }
                else {
                  if (rango !== "libre") {
                    label = `Durante el período de${agrupadoPorFecha ? " " + context.label : `l ${formatearFecha(fechaOpcion, tiempoMenor)} al ${formatearFecha(fechaOpcion, tiempoMayor)}`} `
                  } else {
                    label = `Durante las fechas ${formatearFecha(fechaOpcion, tiempoMenor)} al ${formatearFecha(fechaOpcion, tiempoMayor)} `
                  }
                }
                return label
              },
            }
          }
        }
      }
    })
    if (type === "radar") {
      this.chart.options.scales.r.ticks.backdropColor = "transparent"
    }
  }
}
customElements.define("custom-graficos", graficos)
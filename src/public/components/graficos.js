let contador = 0;
class graficos extends HTMLElement {
  devuelveSonIngresos = () => this.sonIngresos ? "ingresos" : "ventas";
  radiobutton = (id, label, checked) => `<custom-radiobutton data-id="${id}${contador}${this.contador2}" ${checked ? `data-checked="1"` : ""}>${label}</custom-radiobutton>`;
  acordeonItem = (html, id, titulo) => `<custom-acordeonitem data-id="${id}${contador}${this.contador2}" data-titulo="${titulo}">${html}</custom-acordeonitem>`;
  checkbox = (html, checked) => `<custom-checkbox ${checked ? `data-checked="1"` : ""}>${html}</custom-checkbox>`;

  colocarHTMLGrafica() {
    let graficas = ['De barra', 'Circular 1', 'Circular 2', 'De línea', 'De radar'];

    let html = `<div class="contenedormedio"><div class="dropdown">
    <label for="rol">Tipo de gráfico</label>
    <button class="btn dropdown-toggle form-control" type="button" data-bs-toggle="dropdown">De barra</button>
    <ul class="dropdown-menu">
      ${graficas.map(el => `<li><a class="dropdown-item">${el}</a></li>`).join('')}
    </ul></div>
    <button class="btn btn-primary botonazul convertira">Convertir a tabla <svg xmlns="http://www.w3.org/2000/svg" width="27px" height="27px" viewBox="0 0 24 24" fill="white"><path d="M15.2929 10.2929C14.9024 10.6834 14.9024 11.3166 15.2929 11.7071C15.6834 12.0976 16.3166 12.0976 16.7071 11.7071L20.7071 7.70711C20.8306 7.58361 20.9151 7.43586 20.9604 7.27919C20.9779 7.2191 20.9895 7.1577 20.9954 7.09585C20.9976 7.07319 20.999 7.05048 20.9996 7.02774C21.0002 7.00709 21.0001 6.98642 20.9994 6.96578C20.9905 6.6971 20.8755 6.45528 20.695 6.28079L16.7071 2.29289C16.3166 1.90237 15.6834 1.90237 15.2929 2.29289C14.9024 2.68342 14.9024 3.31658 15.2929 3.70711L17.5856 5.99981L3.99999 5.99999C3.4477 5.99999 2.99999 6.44772 3 7C3.00001 7.55228 3.44773 7.99999 4.00001 7.99999L17.586 7.99981L15.2929 10.2929Z"/><path d="M20 16L6.41423 16L8.70712 13.7071C9.09764 13.3166 9.09764 12.6834 8.70712 12.2929C8.3166 11.9024 7.68343 11.9024 7.29291 12.2929L3.29291 16.2929C2.90238 16.6834 2.90238 17.3166 3.29291 17.7071L7.29291 21.7071C7.68343 22.0976 8.3166 22.0976 8.70712 21.7071C9.09764 21.3166 9.09764 20.6834 8.70712 20.2929L6.41423 18L20 18C20.5523 18 21 17.5523 21 17C21 16.4477 20.5523 16 20 16Z"/></svg></button>
    <button is="boton-pdf"></button></div><div class="contenedorCanvas"><canvas id="canvas${contador}"></canvas></div></article>`;
    this.html += html;
    this.agregarTabla();

    this.canvas = $(this).find("canvas")[0];
    this.metodosOpcionesGrafico();
    this.metodosBotonesGrafico();

    this.metodosBotonesTabla();
    if (!this.esTotal)
      this.sumarTabla();
  }

  sumarTabla() {
    let filas = [...$(this).find("tbody tr")];
    if (this.multiple)
      filas.forEach(el => {
        let suma = [...$(el).find("td:not(:first-child,:last-child)")].reduce((prev, curr) => prev += parseFloat(curr.textContent), 0);
        $(el).find("td:last-child")[0].textContent = suma;
      });

    let pie = [...$(this).find("tfoot td")];
    [...filas[0].cells].slice(1).forEach((_, i) => {
      let suma = filas.reduce((prev, curr) => prev += parseFloat(curr.cells[i + 1].textContent), 0)
      pie[i + 1].textContent = suma.normalizarPrecio();
    });
  }

  opcionesTabla() {
    let html = `<article class="articleTabla" style="display: none;"><hr class="conMargen"><custom-acordeon>
    <custom-acordeonitem data-titulo="Opciones de la tabla" data-id="listaCamioneros2${contador}">
      <custom-acordeon id="acordeonsegundonivel2${contador}">`
    if (this.multiple)
      html += this.acordeonItem(this.opcionDiasTabla(), `acordeondias`, "Días");
    html += this.acordeonItem(this.opcionProductosTabla(), `acordeonproductos`, this.esTotal ? "Días" : "Productos");
    let htmlOtrasOpciones = `<div class="contenedorotrasopciones">`
    // htmlOtrasOpciones += this.otrasOpcionesOrdenarHTML();
    htmlOtrasOpciones += this.otrasOpcionesFechaHTML("tablaFechaOpcion");
    htmlOtrasOpciones += `</div>`;
    html += this.acordeonItem(htmlOtrasOpciones, `acordeonotrasopciones`, "Otras opciones")
    html += `<div class="contenedorabajo"><button class="btn btn-primary botonazul actualizarTabla">Actualizar tabla</button></div>
  </custom-acordeon></custom-acordeonitem></custom-acordeon>
      <div class="contenedormedio" style="align-items: center;"><button is="boton-excel" id="a"></button><button class="btn btn-primary botonazul convertira">Convertir a gráfico <svg xmlns="http://www.w3.org/2000/svg" width="27px" height="27px" viewBox="0 0 24 24" fill="white"><path d="M15.2929 10.2929C14.9024 10.6834 14.9024 11.3166 15.2929 11.7071C15.6834 12.0976 16.3166 12.0976 16.7071 11.7071L20.7071 7.70711C20.8306 7.58361 20.9151 7.43586 20.9604 7.27919C20.9779 7.2191 20.9895 7.1577 20.9954 7.09585C20.9976 7.07319 20.999 7.05048 20.9996 7.02774C21.0002 7.00709 21.0001 6.98642 20.9994 6.96578C20.9905 6.6971 20.8755 6.45528 20.695 6.28079L16.7071 2.29289C16.3166 1.90237 15.6834 1.90237 15.2929 2.29289C14.9024 2.68342 14.9024 3.31658 15.2929 3.70711L17.5856 5.99981L3.99999 5.99999C3.4477 5.99999 2.99999 6.44772 3 7C3.00001 7.55228 3.44773 7.99999 4.00001 7.99999L17.586 7.99981L15.2929 10.2929Z"/><path d="M20 16L6.41423 16L8.70712 13.7071C9.09764 13.3166 9.09764 12.6834 8.70712 12.2929C8.3166 11.9024 7.68343 11.9024 7.29291 12.2929L3.29291 16.2929C2.90238 16.6834 2.90238 17.3166 3.29291 17.7071L7.29291 21.7071C7.68343 22.0976 8.3166 22.0976 8.70712 21.7071C9.09764 21.3166 9.09764 20.6834 8.70712 20.2929L6.41423 18L20 18C20.5523 18 21 17.5523 21 17C21 16.4477 20.5523 16 20 16Z"/></svg></button>
    <button is="boton-pdf" id="b"></button></div>`;
    this.html += html;
  }

  agregarTabla() {
    this.contador2++;
    this.opcionesTabla();
    let datasets = this.datasets;
    let html = `<div class="contenedortabla"><div class="tituloTabla">${this.titulo}</div>`;
    html += this.esTotal ? this.crearTabla2(datasets, this.labels) : this.crearTabla(datasets, labelsdesnormalizados);
    html += "</div></article>";
    this.innerHTML = this.html + html;
  }

  crearTabla2(datasets, labels) {
    let data = datasets[0].data;
    let html = `<table>
        <thead><tr>
        ${labels.map(x => `<th>${x}</th>`).join("")}
      <th>Total ${this.devuelveSonIngresos()}:</th></tr></thead><tbody><tr>
      ${data.map(el => `<td>${el}</td>`).join("")}
      <td>${data.reduce((a, t) => a += t).normalizarPrecio()}</td></tr></tbody></table>`
    return html;
  }

  crearTabla(datasets, productos) {
    let data = datasets[0].data;
    let html = `<table ${(datasets.length > 1) ? `class="multiple"` : ""} >
        <thead><tr><th>Productos</th>
        ${datasets.map(el => `<th>${el.label}</th>`).join("")}
        ${this.multiple ? `<th>Total ${this.devuelveSonIngresos()}:</th>` : ""}</tr></thead><tbody>`;

    data.forEach((_, i) => {
      html += `<tr><td>${productos[i]}</td>
      ${datasets.map(el => `<td>${el.data[i]}</td>`).join("")}
      ${this.multiple ? "<td></td>" : ""}</tr>`
    });

    html += `</tbody><tfoot><tr><td>Total:</td>
    ${datasets.map(() => "<td></td>").join("")}
    ${this.multiple ? "<td></td>" : ""}</tr></tfoot>
    </table>`;
    return html;
  }

  metodosBotonesGrafico() {
    let botonPDF = $(this).find(".botonpdf")[0];
    $(this).on("click", ".convertira", () => {
      $(this).find(".articleGrafico").toggle();
      $(this).find(".articleTabla").toggle();
    });
    botonPDF.addEventListener("click", () => botonPDF.exportarGrafico(this.canvas, this.titulo));
    $(this).find(".dropdown-item").each((i, el) => {
      el.addEventListener("click", () => {
        let texto = el.innerText;
        $(el).closest(".dropdown-menu").prev()[0].innerText = texto;
        const graficos = {
          "De barra": "bar",
          "Circular 1": "doughnut",
          "Circular 2": "pie",
          "De línea": "line",
          "De radar": "radar"
        };
        let type = graficos[texto];
        let chart = this.chart;
        this.type = type;
        chart.config.type = type;
        chart.destroy();
        this.colocarDatos();
      });
    });
  }


  metodosBotonesTabla() {
    let botonPDF = $(this).find(".botonpdf")[1];
    botonPDF.inicializar(() => {
      let contenedor = $(this).find(".contenedorTabla")[0];
      let contenedorClon = contenedor.cloneNode(true);
      contenedorClon.style.width = contenedor.offsetWidth;
      let titulo = $(contenedorClon).find(".tituloTabla")[0];
      titulo.style.background = "#0f0924";
      titulo.style.padding = "15px";
      return contenedorClon.outerHTML;
    }, this.titulo);
    let tabla = $(this).find("table")[0];
    let titulo = this.titulo;
    let that = this;
    $(this).find(".botonexcel")[0].inicializar(function () {
      let nombre = `${titulo}.xlsx`;
      let workbook = XLSX.utils.book_new();
      let ws = XLSX.utils.table_to_sheet($(that).find("table")[0]);
      var range = XLSX.utils.decode_range(ws["!ref"]);
      if (tabla.rows[0].cells[0].textContent === "Productos") {
        let filasMenosUno = [...tabla.rows[0].cells].slice(1);
        ws['!cols'] = [...[{ width: 20 }], ...filasMenosUno.map(x => ({ wch: x.textContent.length }))];
      }
      else
        ws['!cols'] = [...tabla.rows[0].cells].map(x => ({ wch: x.textContent.length }));
      ws['!rows'] = [{ hpt: 35 }];
      for (var i = (range.s.r + 1); i <= range.e.r; i++) {
        ws['!rows'].push({ hpt: 24 });
      }
      for (var i = range.s.r; i <= range.e.r; i++) {
        for (var j = range.s.c; j <= range.e.c; j++) {
          var cell_address = XLSX.utils.encode_cell({ r: i, c: j });
          var cell = ws[cell_address];
          if (cell) {
            this.ajustesCeldasExcel(cell)
            if (i === 0) {
              cell.s.fill = { fgColor: { rgb: "192435" } }
            } else {
              cell.s.fill = { fgColor: { rgb: "0f0d35" } }
            }
          }
        }
      }
      XLSX.utils.book_append_sheet(workbook, ws, `Resumen del día de hoy`);
      XLSX.writeFile(workbook, nombre);
    });
  }

  colocarColores(contenedorColores, checkboxes, datasets) {
    let colores = [...contenedorColores.find("[type='color']")].filter((_, i) => checkboxes[i]).map(el => el.value);
    if (this.multiple && contenedorColores[0].classList.contains("graficoDias")) {
      let coloresAlfa = colores.map(x => x + "20");
      datasets.forEach((el, i) => {
        el.borderColor = colores[i];
        el.backgroundColor = coloresAlfa[i];
      });
    }
    else {
      colores = devuelveColores(colores)
      let coloresAlfa = devuelveColores(colores, 1);
      datasets.forEach(el => {
        el.borderColor = colores;
        el.backgroundColor = coloresAlfa;
      });
    }
  }

  actualizarTabla() {
    let checkboxesDias = [...$(this.tablaDias).find(".form-check-input")].map(el => el.checked);
    let checkboxesProductos = [...$(this.tablaProductos).find(".form-check-input")].map(el => el.checked);
    let datasets = structuredClone(this.datasets).filter((_, i) => checkboxesDias[i]);
    datasets.forEach(el => el.data = el.data.filter((_, i) => checkboxesProductos[i]));
    let fechaOpcion = $(this.tablaFechaOpcion).find("input:checked")[0];
    this.cambiarFechaDatasets(fechaOpcion, datasets);
    let productos = labelsdesnormalizados.filter((_, i) => checkboxesProductos[i]);
    let labels;
    if (this.esTotal) {
      datasets = structuredClone(this.datasets);
      datasets[0].data = datasets[0].data.filter((_, i) => checkboxesProductos[i]);
      if (fechaOpcion.id.includes("fecha1"))
        labels = this.labels.map((_, i) => formatearFecha("full", fechas[i])).filter((_, i) => checkboxesProductos[i]);
      else if (fechaOpcion.id.includes("fecha2"))
        labels = this.labels.map((_, i) => formatearFecha("long", fechas[i])).filter((_, i) => checkboxesProductos[i]);
      else
        labels = this.labels.map((_, i) => formatearFecha("short", fechas[i])).filter((_, i) => checkboxesProductos[i]);
    }
    $(this).find("table")[0].outerHTML = this.esTotal ? this.crearTabla2(datasets, labels) : this.crearTabla(datasets, productos);
    if (!this.esTotal)
      this.sumarTabla();
  }

  cambiarFechaDatasets(fechaOpcion, datasets) {
    if (this.multiple) {
      if (fechaOpcion.id.includes("fecha1"))
        datasets.forEach((el, i) => el.label = formatearFecha("full", fechas[i]));
      else if (fechaOpcion.id.includes("fecha2"))
        datasets.forEach((el, i) => el.label = formatearFecha("long", fechas[i]));
      else
        datasets.forEach((el, i) => el.label = formatearFecha("short", fechas[i]));
    } else if (!this.esTotal) {
      if (fechaOpcion.id.includes("fecha1"))
        datasets[0].label = unirTexto(fechas.map(el => formatearFecha("full", el)));
      else if (fechaOpcion.id.includes("fecha2"))
        datasets[0].label = unirTexto(fechas.map(el => formatearFecha("long", el)));
      else
        datasets[0].label = unirTexto(fechas.map(el => formatearFecha("short", el)));
    }
  }

  actualizarGrafico() {
    let checkboxesDias = [...$(this.graficoDias).find(".form-check-input")].map(el => el.checked);
    let checkboxesProductos = [...$(this.graficoProductos).find(".form-check-input")].map(el => el.checked);
    if(checkboxesDias.every(x => !x) && checkboxesDias.length > 0){
      Swal.fire("Error", "Por favor seleccionar por lo menos un elemento", "error");
      return;
    }
    if(checkboxesProductos.every(x => !x) && checkboxesProductos.length > 0){
      Swal.fire("Error", "Por favor seleccionar por lo menos un elemento", "error");
      return;
    }
    let labels = [...$(this.graficoProductos).find(".nombreCamionero")].filter((_, i) => checkboxesProductos[i]).map(el => el.textContent);
    let datasets;
    let coloresOpcion = $(this).find(".coloresOpcion input:checked")[0];
    if (coloresOpcion) {
      datasets = structuredClone(this.datasets).filter((_, i) => checkboxesDias[i]);
      datasets.forEach(el => el.data = el.data.filter((_, i) => checkboxesProductos[i]));
      if (coloresOpcion.id.includes("color1"))
        this.colocarColores(this.graficoDias, checkboxesDias, datasets);
      else
        this.colocarColores(this.graficoProductos, checkboxesProductos, datasets);
    } else {
      datasets = structuredClone(this.datasets);
      datasets.forEach(el => el.data = el.data.filter((_, i) => checkboxesProductos[i]));
      this.colocarColores(this.graficoProductos, checkboxesProductos, datasets);
    }
    let fechaOpcion = $(this.graficoFechaOpcion).find("input:checked")[0];
    this.cambiarFechaDatasets(fechaOpcion, datasets);
    let ordenarOpcion = $(this).find(".ordenarOpcion input:checked")[0];
    if (ordenarOpcion) {
      let indices = [...Array(datasets[0].data.length).keys()];
      if (ordenarOpcion.id.includes("ordenar1"))
        indices.sort((a, b) => labels[a].localeCompare(labels[b]));
      else if (ordenarOpcion.id.includes("ordenar2"))
        indices.sort((a, b) => labels[b].localeCompare(labels[a]));
      else if (ordenarOpcion.id.includes("ordenar3"))
        indices.sort((a, b) => datasets[0].data[b] - datasets[0].data[a]);
      else if (ordenarOpcion.id.includes("ordenar4"))
        indices.sort((a, b) => datasets[0].data[a] - datasets[0].data[b]);
      labels = indices.map(i => labels[i]).filter(x => x != null);
      datasets.forEach(el => {
        el.data = indices.map(i => el.data[i]);
        if (el.backgroundColor instanceof Array)
          el.backgroundColor = indices.map(i => el.backgroundColor[i]);
        if (el.borderColor instanceof Array)
          el.borderColor = indices.map(i => el.borderColor[i]);
      });
    }
    if (this.esTotal) {
      if (fechaOpcion.id.includes("fecha1"))
        labels = this.labels.map((_, i) => formatearFecha("full", fechas[i])).filter((_, i) => checkboxesProductos[i]);
      else if (fechaOpcion.id.includes("fecha2"))
        labels = this.labels.map((_, i) => formatearFecha("long", fechas[i])).filter((_, i) => checkboxesProductos[i]);
      else
        labels = this.labels.map((_, i) => formatearFecha("short", fechas[i])).filter((_, i) => checkboxesProductos[i]);
    }
    this.chart.data.labels = labels;
    this.chart.data.datasets = datasets;
    this.chart.update();
    this.chart.update("none");
  }

  opcionDiasHTML() {
    let html = `<div class="camioneros graficoDias">`;
    this.datasets.forEach((el, i) => {
      html += `<div class="camionero">
            <div class="contenedor-color"><input type="color" value="${colores[i]}"></div>
              ${this.checkbox("Poner en el gráfico", 1)}
            <div class="nombreCamionero">${el.label}</div>
          </div>`
    });
    html += `</div>
<div class="contenedorabajo botonreset resetdias"><button class="btn btn-primary botonazul">Resetear los colores a los valores de default</button></div>`
    return html;
  }
  opcionDiasTabla() {
    let html = `<div class="camioneros camioneros2 tablaDias">`;
    this.datasets.forEach(el => html += `<div class="camionero2">${this.checkbox("Poner la tabla", 1)}${el.label}</div>`);
    html += `</div>`
    return html;
  }

  opcionProductosHTML() {
    let html = `<div class="camioneros graficoProductos">`;
    this.labels.forEach((el, i) => {
      html += `<div class="camionero">
              <div class="contenedor-color"><input type="color" value="${colores[i]}"></div>
              ${this.checkbox("Poner en el gráfico", 1)}
              <div class="nombreCamionero">${el}</div>
            </div>`
    });
    html += `</div>
    <div class="contenedorabajo botonreset resetproductos"><button class="btn btn-primary botonazul">Resetear los colores a los valores de default</button></div>`;
    return html;
  }
  opcionProductosTabla() {
    let html = `<div class="camioneros camioneros2 tablaProductos">`;
    this.labels.forEach((el, i) => {
      html += `<div class="camionero2">
      ${this.checkbox("Poner la tabla", 1)}
              ${el}
            </div>`
    });
    html += `</div>`;
    return html;
  }

  otrasOpcionesColoresHTML() {
    return `<div class="tituloopciones">Colores de los gráficos</div>
    <hr>
    <div class="contenedoropcion">
    <custom-radiogroup class="coloresOpcion" id="coloresRadioButton${contador}">
      ${this.radiobutton("color1", "Utilizar los colores de los días", 1)}
      ${this.radiobutton("color2", "Utilizar colores de los productos")}
    </custom-radiogroup></div>`
  }

  otrasOpcionesOrdenarHTML() {
    let html = `<div class="tituloopciones">Ordenar los productos</div>
    <hr><div class="contenedoropcion"><custom-radiogroup class="ordenarOpcion" id="ordenarRadioButton${contador}">`;
    let ordenar = this.ordenar;
    if (ordenar === "alf" || ordenar === "ambos")
      html += this.radiobutton("ordenar1", "Ordenar por orden alfabético ascendentemente") + this.radiobutton("ordenar2", "Ordenar por orden alfabético descendentemente");
    if (ordenar === "cant" || ordenar === "ambos")
      html += this.radiobutton("ordenar3", `Ordenar por ${this.devuelveSonIngresos()} de mayor a menor`) + this.radiobutton("ordenar4", `Ordenar por ${this.devuelveSonIngresos()} de menor a mayor`);
    html += this.radiobutton("ordenardefault", "Restaurar orden original", 1);
    html += "</custom-radiogroup></div>"
    return html;
  }
  otrasOpcionesFechaHTML(opcion) {
    let html = `<div class="tituloopciones">Cambiar formato de la fecha</div>
    <hr><div class="contenedoropcion"><custom-radiogroup class="${opcion}" id="fechaRadioButton${contador}${this.contador2}">`;
    html += this.radiobutton("fecha1", 'Usar formato: "Lunes, 1 de enero de 2023"', 1) + this.radiobutton("fecha2", 'Usar formato: "1 de enero de 2023"') + this.radiobutton("fecha3", 'Usar formato: "1/1/2023"');
    html += "</custom-radiogroup></div>"
    return html;
  }

  agregarOpciones() {
    let html = `<article class="articleGrafico"><hr class="conMargen"><custom-acordeon>
      <custom-acordeonitem data-titulo="Opciones del gráfico" data-id="listaCamioneros${contador}">
        <custom-acordeon id="acordeonsegundonivel${contador}">`;

    if (this.multiple)
      html += this.acordeonItem(this.opcionDiasHTML(), `acordeondias`, "Días");

    html += this.acordeonItem(this.opcionProductosHTML(), `acordeonproductos`, this.esTotal ? "Días" : "Productos");


    let htmlOtrasOpciones = `<div class="contenedorotrasopciones">`
    if (this.multiple)
      htmlOtrasOpciones += this.otrasOpcionesColoresHTML();

    htmlOtrasOpciones += this.otrasOpcionesFechaHTML("graficoFechaOpcion");
    if (!this.esTotal)
      htmlOtrasOpciones += this.otrasOpcionesOrdenarHTML();
    htmlOtrasOpciones += `</div>`;
    html += this.acordeonItem(htmlOtrasOpciones, `acordeonotrasopciones`, "Otras opciones")
    html += `<div class="contenedorabajo"><button class="btn btn-primary botonazul actualizarGrafico">Actualizar gráfico</button></div>
    </custom-acordeon></custom-acordeonitem></custom-acordeon>`;
    this.html = html;
  }

  metodosOpcionesGrafico() {
    this.graficoDias = $(this).find(".graficoDias");
    this.tablaDias = $(this).find(".tablaDias");
    this.graficoProductos = $(this).find(".graficoProductos");
    this.tablaProductos = $(this).find(".tablaProductos");
    this.graficoFechaOpcion = $(this).find(".graficoFechaOpcion");
    this.tablaFechaOpcion = $(this).find(".tablaFechaOpcion");
    if (this.multiple)
      $(this).find(".resetdias button")[0].addEventListener("click", async () => await this.resetearColores(this.graficoDias));
    $(this).find(".resetproductos button")[0].addEventListener("click", async () => await this.resetearColores(this.graficoProductos));
    $(this).find(".actualizarGrafico")[0].addEventListener("click", () => this.actualizarGrafico());
    $(this).find(".actualizarTabla")[0].addEventListener("click", () => this.actualizarTabla());
  }

  async resetearColores(el) {
    let result = await swalConfirmarYCancelar.fire({
      title: "Estás seguro que deseas resetear los colores a los valores de default?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: "No",
    })
    if (result.isConfirmed) {
      $(el).find("[type='color']").each((i, el) => el.value = colores[i]);
      Swal.fire("Se han reseteado los colores correctamente", "Para visualizar los cambios presionar el botón de actualizar gráfico", "success");
    }
  }

  crearGrafico(labels, datasets, titulo, label, multiple, sonIngresos, ordenar, esTotal, type = "bar") {
    Object.assign(this, { labels, datasets, titulo, label, multiple, sonIngresos, ordenar, esTotal, type });
    contador++;
    this.contador2 = 0;
    this.agregarOpciones();
    this.colocarHTMLGrafica();
    this.$chart = this.canvas.getContext('2d');
    this.colocarDatos();
  }

  colocarDatos() {
    let { labels, datasets, titulo, label, multiple, sonIngresos, esTotal, type } = this;
    this.chart = new Chart(this.$chart, {
      type,
      data: {
        labels,
        datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true
          },
        },
        plugins: {
          title: {
            display: true,
            text: titulo,
            font: {
              size: 28,
              weight: 500
            },
            padding: 30
          },
          tooltip: {
            callbacks: {
              label: context => {
                let label = "";
                if (multiple)
                  label = "Fecha: " + context.dataset.label;
                else {
                  if (esTotal && sonIngresos)
                    label = `Ingresos durante la fecha ${context.dataset.label}`;
                  else if (esTotal)
                    label = `Vendidos durante la fecha ${context.dataset.label}`;
                  else
                    label = context.dataset.label;
                }
                return label;
              },
              title: function (context) {
                let title = `Producto: ${context[0].label}, ${label}: ${sonIngresos ? new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'GTQ' }).format(context[0].raw) : context[0].formattedValue}`;
                return title;
              }
            }
          }
        }
      }
    });
    if (type === "radar") {
      this.chart.options.scales.r.ticks.backdropColor = "transparent";
    }
    if (type === "line") {
      this.chart.options.elements.line.backgroundColor = "green";
      this.chart.options.elements.line.borderColor = "black";

    }
    this.chart.update();
  }
}
customElements.define("custom-graficos", graficos);
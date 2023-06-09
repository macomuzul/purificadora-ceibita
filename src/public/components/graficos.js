let contador = 0;
class graficos extends HTMLElement {
  devuelveSonIngresos = () => this.sonIngresos ? "ingresos" : "ventas";

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
    this.metodosOpciones();
    this.metodosBotonesGrafico();
    this.sumarTabla();
  }

  sumarTabla() {
    let filas = $(this).find("tbody tr");
    if (this.multiple)
      filas.each((i, el) => {
        let suma = [...$(el).find("td:not(:first-child,:last-child)")].reduce((prev, curr) => prev += parseFloat(curr.textContent), 0);
        $(el).find("td:last-child")[0].textContent = suma;
      });

    let pie = [...$(this).find("tfoot td")];
    [...filas[0].cells].slice(1).forEach((_, i) => {
      let suma = [...filas[i + 1].cells].slice(1).reduce((prev, curr) => prev += parseFloat(curr.textContent), 0);
      pie[i + 1].textContent = suma;
    });
  }

  opcionesTabla(){
    let html = `<article class="articleTabla" style="display: none;"><hr class="conMargen"><custom-acordeon>
    <custom-acordeonitem data-titulo="Opciones de la tabla" data-id="listaCamioneros2${contador}">
      <custom-acordeon data-id="acordeonsegundonivel2${contador}">`
  if (this.multiple)
    html += this.acordeonItem(this.opcionDiasTabla(), `acordeondias`, "Días");
  html += this.acordeonItem(this.opcionProductosTabla(), `acordeonproductos`, "Productos");
  let htmlOtrasOpciones = `<div class="contenedorotrasopciones">`
  // htmlOtrasOpciones += this.otrasOpcionesOrdenarHTML();
  htmlOtrasOpciones += this.otrasOpcionesFechaHTML();
  htmlOtrasOpciones += `</div>`;
  html += this.acordeonItem(htmlOtrasOpciones, `acordeonotrasopciones`, "Otras opciones")
  html += `<div class="contenedorabajo"><button class="btn btn-primary botonazul actualizarDatos">Actualizar tabla</button></div>
  </custom-acordeon></custom-acordeonitem></custom-acordeon>
      <div class="contenedormedio" style="align-items: center;"><button is="boton-excel"></button><button class="btn btn-primary botonazul convertira">Convertir a tabla <svg xmlns="http://www.w3.org/2000/svg" width="27px" height="27px" viewBox="0 0 24 24" fill="white"><path d="M15.2929 10.2929C14.9024 10.6834 14.9024 11.3166 15.2929 11.7071C15.6834 12.0976 16.3166 12.0976 16.7071 11.7071L20.7071 7.70711C20.8306 7.58361 20.9151 7.43586 20.9604 7.27919C20.9779 7.2191 20.9895 7.1577 20.9954 7.09585C20.9976 7.07319 20.999 7.05048 20.9996 7.02774C21.0002 7.00709 21.0001 6.98642 20.9994 6.96578C20.9905 6.6971 20.8755 6.45528 20.695 6.28079L16.7071 2.29289C16.3166 1.90237 15.6834 1.90237 15.2929 2.29289C14.9024 2.68342 14.9024 3.31658 15.2929 3.70711L17.5856 5.99981L3.99999 5.99999C3.4477 5.99999 2.99999 6.44772 3 7C3.00001 7.55228 3.44773 7.99999 4.00001 7.99999L17.586 7.99981L15.2929 10.2929Z"/><path d="M20 16L6.41423 16L8.70712 13.7071C9.09764 13.3166 9.09764 12.6834 8.70712 12.2929C8.3166 11.9024 7.68343 11.9024 7.29291 12.2929L3.29291 16.2929C2.90238 16.6834 2.90238 17.3166 3.29291 17.7071L7.29291 21.7071C7.68343 22.0976 8.3166 22.0976 8.70712 21.7071C9.09764 21.3166 9.09764 20.6834 8.70712 20.2929L6.41423 18L20 18C20.5523 18 21 17.5523 21 17C21 16.4477 20.5523 16 20 16Z"/></svg></button>
    <button is="boton-pdf"></button></div>`;
    this.html += html;
  }

  agregarTabla() {
    this.opcionesTabla();
    let datasets = this.datasets;
    let data = datasets[0].data;
    let html = `<div class="contenedortabla"><table ${(datasets.length > 1) ? `class="multiple"` : ""} >
        <thead><tr><th>Productos</th>`;
    datasets.forEach(el => html += `<th>${el.label}</th>`);
    html += `${this.multiple ? `<th>Total ${this.devuelveSonIngresos()}:</th>` : ""}</tr></thead><tbody>`;

    data.forEach((_, i) => {
      html += `<tr><td>${labelsdesnormalizados[i]}</td>`
      datasets.forEach(el => html += `<td>${el.data[i]}</td>`);
      html += `${this.multiple ? "<td></td>" : ""}</tr>`
    });

    html += `</tbody><tfoot><tr><td>Total:</td>`;
    datasets.forEach(() => html += "<td></td>");
    html += `${this.multiple ? "<td></td>" : ""}</tr></tfoot>
      </table></div></article>`;

    this.innerHTML = this.html + html;
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

  actualizarDatosDropdown() {
    let checkboxesDias = [...$(this.graficoDias).find(".form-check-input")].map(el => el.checked);
    let checkboxesProductos = [...$(this.graficoProductos).find(".form-check-input")].map(el => el.checked);
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
      debugger;
      datasets.forEach(el => el.data = el.data.filter((_, i) => checkboxesProductos[i]));
      this.colocarColores(this.graficoProductos, checkboxesProductos, datasets);
    }

    let fechaOpcion = $(this.graficoFechaOpcion).find("input:checked")[0];
    if(fechaOpcion.id.includes("fecha1"))
      datasets.forEach((el,i) => el.label = new Intl.DateTimeFormat('es', { dateStyle: 'full' }).format(new Date(fechas[i])));
    else if(fechaOpcion.id.includes("fecha2"))
      datasets.forEach((el,i) => el.label = new Intl.DateTimeFormat('es', { dateStyle: 'long' }).format(new Date(fechas[i])));
    else
      datasets.forEach((el,i) => el.label = new Intl.DateTimeFormat('es', { dateStyle: 'short' }).format(new Date(fechas[i])));
    
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
            <div class="form-check">
              <label class="form-check-label"><input class="form-check-input" type="checkbox" checked>Poner en el gráfico</label>
            </div>
            <div class="nombreCamionero">${el.label}</div>
          </div>`
    });
    html += `</div>
<div class="contenedorabajo botonreset resetdias"><button class="btn btn-primary botonazul">Resetear los colores a los valores de default</button></div>`
    return html;
  }
  opcionDiasTabla() {
    let html = `<div class="camioneros camioneros2 graficoDias">`;
    this.datasets.forEach((el, i) => {
      html += `<div class="camionero2">
            <div class="form-check">
              <label class="form-check-label"><input class="form-check-input" type="checkbox" checked>Poner en la tabla</label>
            </div>
            ${el.label}
          </div>`
    });
    html += `</div>`
    return html;
  }

  opcionProductosHTML() {
    let html = `<div class="camioneros graficoProductos">`;
    this.labels.forEach((el, i) => {
      html += `<div class="camionero">
              <div class="contenedor-color"><input type="color" value="${colores[i]}"></div>
              <div class="form-check">
                <label class="form-check-label"><input class="form-check-input" type="checkbox" checked>Poner en el gráfico</label>
              </div>
              <div class="nombreCamionero">${el}</div>
            </div>`
    });
    html += `</div>
    <div class="contenedorabajo botonreset resetproductos"><button class="btn btn-primary botonazul">Resetear los colores a los valores de default</button></div>`;
    return html;
  }
  opcionProductosTabla() {
    let html = `<div class="camioneros camioneros2 graficoProductos">`;
    this.labels.forEach((el, i) => {
      html += `<div class="camionero2">
              <div class="form-check">
                <label class="form-check-label"><input class="form-check-input" type="checkbox" checked>Poner en la tabla</label>
              </div>
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
  otrasOpcionesFechaHTML() {
    this.contador2++;
    let html = `<div class="tituloopciones">Cambiar formato de la fecha</div>
    <hr><div class="contenedoropcion"><custom-radiogroup class="fechaOpcion" id="fechaRadioButton${this.contador2}">`;
    html += this.radiobutton("fecha1", 'Usar formato: "Lunes, 1 de enero de 2023"', 1) + this.radiobutton("fecha2", 'Usar formato: "1 de enero de 2023"') + this.radiobutton("fecha3", 'Usar formato: "1/1/2023"');
    html += "</custom-radiogroup></div>"
    return html;
  }

  radiobutton(id, label, checked) {
    return `<custom-radiobutton data-id="${id}${contador}" ${checked ? `data-checked="1"` : ""}>${label}</custom-radiobutton>`;
  }

  acordeonItem(html, id, titulo) {
    return `<custom-acordeonitem data-id="${id}${contador}" data-titulo="${titulo}">${html}</custom-acordeonitem>`
  }

  agregarOpciones() {
    let html = `<article class="articleGrafico"><hr class="conMargen"><custom-acordeon>
      <custom-acordeonitem data-titulo="Opciones del gráfico" data-id="listaCamioneros${contador}">
        <custom-acordeon data-id="acordeonsegundonivel${contador}">`;

    if (this.multiple)
      html += this.acordeonItem(this.opcionDiasHTML(), `acordeondias`, "Días");

    html += this.acordeonItem(this.opcionProductosHTML(), `acordeonproductos`, "Productos");


    let htmlOtrasOpciones = `<div class="contenedorotrasopciones">`
    if (this.multiple)
      htmlOtrasOpciones += this.otrasOpcionesColoresHTML();

      htmlOtrasOpciones += this.otrasOpcionesFechaHTML();
      htmlOtrasOpciones += this.otrasOpcionesOrdenarHTML();
    htmlOtrasOpciones += `</div>`;
    html += this.acordeonItem(htmlOtrasOpciones, `acordeonotrasopciones`, "Otras opciones")
    html += `<div class="contenedorabajo"><button class="btn btn-primary botonazul actualizarDatos">Actualizar gráfico</button></div>
    </custom-acordeon></custom-acordeonitem></custom-acordeon>`;
    this.html = html;
  }

  metodosOpciones() {
    this.graficoDias = $(this).find(".graficoDias");
    this.graficoProductos = $(this).find(".graficoProductos");
    this.graficoFechaOpcion = $(this).find(".fechaOpcion");
    try {
      $(this).find(".resetdias button")[0].addEventListener("click", async () => {
        let result = await swalConfirmarYCancelar.fire({
          title: "Estás seguro que deseas resetear los colores a los valores de default?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Sí",
          cancelButtonText: "No",
        })
        if (result.isConfirmed) {
          $(this.graficoDias).find("[type='color']").each((i, el) => {
            el.value = colores[i];
          })
        }
      });
    } catch {

    }
    $(this).find(".resetproductos button")[0].addEventListener("click", async () => {
      let result = await swalConfirmarYCancelar.fire({
        title: "Estás seguro que deseas resetear los colores a los valores de default?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí",
        cancelButtonText: "No",
      })
      if (result.isConfirmed) {
        $(this.graficoProductos).find("[type='color']").each((i, el) => el.value = colores[i]);
      }
    });
    //este necesita a puro huevo la arrow function
    $(this).find(".actualizarDatos")[0].addEventListener("click", () => {
      this.actualizarDatosDropdown();
    });
  }

  crearGrafico(labels, datasets, titulo, label, multiple, sonIngresos, ordenar, type = "bar") {
    Object.assign(this, { labels, datasets, titulo, label, multiple, sonIngresos: sonIngresos, ordenar, type });
    contador++;
    this.contador2 = 0;
    this.agregarOpciones();
    this.colocarHTMLGrafica();
    this.dibujarGrafica();
  }


  dibujarGrafica() {
    this.$chart = this.canvas.getContext('2d');
    this.colocarDatos();
  }

  colocarDatos() {
    let { labels, datasets, titulo, label, multiple, sonIngresos, type } = this;
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
              label: function (context) {
                let label = "";
                if (multiple)
                  label = "Fecha: " + context.dataset.label;
                else
                  label = context.dataset.label;
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
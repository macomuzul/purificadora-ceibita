let contador = 0;
let contador2 = 0;
class graficos extends HTMLElement {
  constructor() {
    super();
    let html = `<div class="contenedormedio"><div class="dropdown">
    <label for="rol">Tipo de gráfico</label>
    <button class="btn dropdown-toggle form-control" type="button" data-bs-toggle="dropdown">De barra</button>
    <ul class="dropdown-menu">
      <li><a class="dropdown-item">De barra</a></li>
      <li><a class="dropdown-item">Circular 1</a></li>
      <li><a class="dropdown-item">Circular 2</a></li>
      <li><a class="dropdown-item">De línea</a></li>
      <li><a class="dropdown-item">De radar</a></li>
    </ul></div><button class="btn btn-danger botonpdf"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" height="30px" width="30px" viewBox="0 0 56 56" xml:space="preserve"><g><path style="fill:#E9E9E0;" d="M36.985,0H7.963C7.155,0,6.5,0.655,6.5,1.926V55c0,0.345,0.655,1,1.463,1h40.074   c0.808,0,1.463-0.655,1.463-1V12.978c0-0.696-0.093-0.92-0.257-1.085L37.607,0.257C37.442,0.093,37.218,0,36.985,0z"/><polygon style="fill:#D9D7CA;" points="37.5,0.151 37.5,12 49.349,12  "/><path style="fill:#CC4B4C;" d="M19.514,33.324L19.514,33.324c-0.348,0-0.682-0.113-0.967-0.326   c-1.041-0.781-1.181-1.65-1.115-2.242c0.182-1.628,2.195-3.332,5.985-5.068c1.504-3.296,2.935-7.357,3.788-10.75   c-0.998-2.172-1.968-4.99-1.261-6.643c0.248-0.579,0.557-1.023,1.134-1.215c0.228-0.076,0.804-0.172,1.016-0.172   c0.504,0,0.947,0.649,1.261,1.049c0.295,0.376,0.964,1.173-0.373,6.802c1.348,2.784,3.258,5.62,5.088,7.562   c1.311-0.237,2.439-0.358,3.358-0.358c1.566,0,2.515,0.365,2.902,1.117c0.32,0.622,0.189,1.349-0.39,2.16   c-0.557,0.779-1.325,1.191-2.22,1.191c-1.216,0-2.632-0.768-4.211-2.285c-2.837,0.593-6.15,1.651-8.828,2.822   c-0.836,1.774-1.637,3.203-2.383,4.251C21.273,32.654,20.389,33.324,19.514,33.324z M22.176,28.198   c-2.137,1.201-3.008,2.188-3.071,2.744c-0.01,0.092-0.037,0.334,0.431,0.692C19.685,31.587,20.555,31.19,22.176,28.198z    M35.813,23.756c0.815,0.627,1.014,0.944,1.547,0.944c0.234,0,0.901-0.01,1.21-0.441c0.149-0.209,0.207-0.343,0.23-0.415   c-0.123-0.065-0.286-0.197-1.175-0.197C37.12,23.648,36.485,23.67,35.813,23.756z M28.343,17.174   c-0.715,2.474-1.659,5.145-2.674,7.564c2.09-0.811,4.362-1.519,6.496-2.02C30.815,21.15,29.466,19.192,28.343,17.174z    
    M27.736,8.712c-0.098,0.033-1.33,1.757,0.096,3.216C28.781,9.813,27.779,8.698,27.736,8.712z"/><path style="fill:#CC4B4C;" d="M48.037,56H7.963C7.155,56,6.5,55.345,6.5,54.537V39h43v15.537C49.5,55.345,48.845,56,48.037,56z"/><g><path style="fill:#FFFFFF;" d="M17.385,53h-1.641V42.924h2.898c0.428,0,0.852,0.068,1.271,0.205    c0.419,0.137,0.795,0.342,1.128,0.615c0.333,0.273,0.602,0.604,0.807,0.991s0.308,0.822,0.308,1.306    c0,0.511-0.087,0.973-0.26,1.388c-0.173,0.415-0.415,0.764-0.725,1.046c-0.31,0.282-0.684,0.501-1.121,0.656    s-0.921,0.232-1.449,0.232h-1.217V53z M17.385,44.168v3.992h1.504c0.2,0,0.398-0.034,0.595-0.103    c0.196-0.068,0.376-0.18,0.54-0.335c0.164-0.155,0.296-0.371,0.396-0.649c0.1-0.278,0.15-0.622,0.15-1.032    c0-0.164-0.023-0.354-0.068-0.567c-0.046-0.214-0.139-0.419-0.28-0.615c-0.142-0.196-0.34-0.36-0.595-0.492    c-0.255-0.132-0.593-0.198-1.012-0.198H17.385z"/><path style="fill:#FFFFFF;" d="M32.219,47.682c0,0.829-0.089,1.538-0.267,2.126s-0.403,1.08-0.677,1.477s-0.581,0.709-0.923,0.937    s-0.672,0.398-0.991,0.513c-0.319,0.114-0.611,0.187-0.875,0.219C28.222,52.984,28.026,53,27.898,53h-3.814V42.924h3.035    c0.848,0,1.593,0.135,2.235,0.403s1.176,0.627,1.6,1.073s0.74,0.955,0.95,1.524C32.114,46.494,32.219,47.08,32.219,47.682z     M27.352,51.797c1.112,0,1.914-0.355,2.406-1.066s0.738-1.741,0.738-3.09c0-0.419-0.05-0.834-0.15-1.244    c-0.101-0.41-0.294-0.781-0.581-1.114s-0.677-0.602-1.169-0.807s-1.13-0.308-1.914-0.308h-0.957v7.629H27.352z"/><path style="fill:#FFFFFF;" d="M36.266,44.168v3.172h4.211v1.121h-4.211V53h-1.668V42.924H40.9v1.244H36.266z"/></g></g></svg> Exportar a PDF</button></div><div class="contenedorCanvas"><canvas id="canvoso${contador2}"></canvas></div>`;
    contador2++;
    this.innerHTML = html;
    let that = this;
    $(this).find(".dropdown-item").each((i, el) => {
      el.addEventListener("click", () => {
        let texto = el.innerText;
        $(el).closest(".dropdown-menu").prev()[0].innerText = texto;
        let tipo;
        if (texto === "De barra")
          tipo = "bar"
        else if (texto === "Circular 1")
          tipo = "doughnut"
        else if (texto === "Circular 2")
          tipo = "pie"
        else if (texto === "De línea")
          tipo = "line"
        else if (texto === "De radar")
          tipo = "radar"
        let chart = that.chart;
        this.tipo = tipo;
        chart.config.type = tipo;
        // this.chart.update();
        this.chart.destroy();
        this.colocarDatos(this.labels, this.datasets, this.titulo, this.label, this.multiple, this.esDinero, tipo);
      });
    });
  }

  colocarColores(contenedorColores, checkboxes, datasets) {
    let colores = [...contenedorColores.find("[type='color']")].filter((_, i) => checkboxes[i]).map(el => el.value);
    let coloresAlfa = devuelveColores(1, colores);
    datasets.forEach(el => {
      el.borderColor = colores;
      el.backgroundColor = coloresAlfa;
    });
  }

  actualizarDatosDropdown() {
    let checkboxesDias = [...$(this.graficoDias).find(".form-check-input")].map(el => el.checked);
    let checkboxesProductos = [...$(this.graficoProductos).find(".form-check-input")].map(el => el.checked);
    let labels = [...$(this.graficoProductos).find(".nombreCamionero")].filter((_, i) => checkboxesProductos[i]).map(el => el.textContent);
    let datasets;
    let coloresOpcion = $(this).find(".coloresOpcion:checked")[0];
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
      debugger;
      this.colocarColores(this.graficoProductos, checkboxesProductos, datasets);
    }
    let ordenarOpcion = $(this).find(".ordenarOpcion:checked")[0];
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
    let html = `<div class="accordion-item">
    <h2 class="accordion-header headeracordeon">
      <button class="accordion-button tituloacordeon" type="button" data-bs-toggle="collapse" data-bs-target="#acordeondias${contador}"><div class="tituloProductos">Días</div></button>
    </h2>
<div id="acordeondias${contador}" class="accordion-collapse collapse show" data-bs-parent="#acordeonsegundonivel${contador}">
<div class="accordion-body">
  <div class="camioneros graficoDias">`;
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
<div class="contenedorabajo botonreset resetdias"><button class="btn btn-primary botonazul">Resetear los colores a los valores de default</button></div>
</div>
</div>
</div>`
    return html;
  }

  opcionProductosHTML() {
    let html = `<div class="accordion-item">
    <h2 class="accordion-header headeracordeon">
      <button class="accordion-button tituloacordeon collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#acordeonproductos${contador}"><div class="tituloProductos">Productos</div></button>
    </h2>
<div id="acordeonproductos${contador}" class="accordion-collapse collapse" data-bs-parent="#acordeonsegundonivel${contador}">
<div class="accordion-body">
            <div class="camioneros graficoProductos">`;
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
    <div class="contenedorabajo botonreset resetproductos"><button class="btn btn-primary botonazul">Resetear los colores a los valores de default</button></div>
    </div>
    </div>
    </div>`;
    return html;
  }

  otrasOpcionesColoresHTML() {
    return `<div class="tituloopciones">Colores de los gráficos</div>
<hr>
<div class="contenedoropcion">
  <div class="form-check radiobuttons">
    <input class="form-check-input coloresOpcion" type="radio" name="coloresRadioButton${contador}" id="color1${contador}" checked>
    <label class="form-check-label" for="color1${contador}">Utilizar los colores de los días</label>
  </div>
  <div class="form-check radiobuttons">
    <input class="form-check-input coloresOpcion" type="radio" name="coloresRadioButton${contador}" id="color2${contador}">
    <label class="form-check-label" for="color2${contador}">Utilizar colores de los productos</label>
  </div>
</div>`
  }

  otrasOpcionesOrdenarHTML() {
    let html = `<div class="tituloopciones">Ordenar los productos</div>
<hr>
<div class="contenedoropcion">`;
    let ordenar = this.ordenar;
    if (ordenar === "alf" || ordenar === "ambos") {
      html += `<div class="form-check radiobuttons">
  <input class="form-check-input ordenarOpcion" type="radio" name="ordenarRadioButton${contador}" id="ordenar1${contador}">
  <label class="form-check-label" for="ordenar1${contador}">Ordenar por orden alfabético ascendentemente</label>
</div>
<div class="form-check radiobuttons">
  <input class="form-check-input ordenarOpcion" type="radio" name="ordenarRadioButton${contador}" id="ordenar2${contador}">
  <label class="form-check-label" for="ordenar2${contador}">Ordenar por orden alfabético descendentemente</label>
</div>`
    }
    if (ordenar === "cant" || ordenar === "ambos") {
      html += `<div class="form-check radiobuttons">
<input class="form-check-input ordenarOpcion" type="radio" name="ordenarRadioButton${contador}" id="ordenar3${contador}">
<label class="form-check-label" for="ordenar3${contador}">Ordenar por ventas de mayor a menor</label>
</div>
<div class="form-check radiobuttons">
<input class="form-check-input ordenarOpcion" type="radio" name="ordenarRadioButton${contador}" id="ordenar4${contador}">
<label class="form-check-label" for="ordenar4${contador}">Ordenar por ventas de menor a mayor</label>
</div>`
    }
    html += `<div class="form-check radiobuttons">
    <input class="form-check-input ordenarOpcion" type="radio" name="ordenarRadioButton${contador}" id="ordenardefault${contador}" checked>
    <label class="form-check-label" for="ordenardefault${contador}">Restaurar orden original</label>
  </div>
</div>`
    return html;
  }

  agregarOpciones() {
    let html = `<hr class="conMargen"><div class="accordion">
      <div class="accordion-item">
        <h2 class="accordion-header"><button class="accordion-button acordeonroot collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#listaCamioneros${contador}">Opciones del gráfico</button></h2>
        <div id="listaCamioneros${contador}" class="accordion-collapse collapse">
          <div class="accordion-body">
            <div class="accordion" id="acordeonsegundonivel${contador}">`;
    if (this.multiple)
      html += this.opcionDiasHTML();

    html += this.opcionProductosHTML();
    html += `<div class="accordion-item">
    <h2 class="accordion-header headeracordeon">
      <button class="accordion-button tituloacordeon collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#acordeonopciones${contador}"><div class="tituloProductos">Otras opciones</div></button>
    </h2>
<div id="acordeonopciones${contador}" class="accordion-collapse collapse" data-bs-parent="#acordeonsegundonivel${contador}">
<div class="accordion-body">
<div class="contenedorotrasopciones">`
    if (this.multiple)
      html += this.otrasOpcionesColoresHTML();

    html += this.otrasOpcionesOrdenarHTML();
    html += `</div>
</div>
</div>
</div>
    <div class="contenedorabajo"><button class="btn btn-primary botonazul actualizarDatos">Actualizar gráfico</button></div>
    </div>
</div>
</div>
</div>
</div>`;
    $(this).prepend(html);
    this.graficoDias = $(this).find(".graficoDias");
    this.graficoProductos = $(this).find(".graficoProductos");
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
    $(this).find(".actualizarDatos")[0].addEventListener("click", () => {
      this.actualizarDatosDropdown();
    });
    contador++;
  }

  crearGrafico(labels, datasets, titulo, label, multiple, esDinero, ordenar, type = "bar") {
    this.$chart = $(this).find("canvas")[0].getContext('2d');
    this.labels = labels;
    this.datasets = datasets;
    this.titulo = titulo;
    this.label = label;
    this.multiple = multiple;
    this.esDinero = esDinero;
    this.ordenar = ordenar;
    this.tipo = type;
    this.colocarDatos(labels, datasets, titulo, label, multiple, esDinero, type);
    this.agregarOpciones();
  }

  colocarDatos(labels, datasets, titulo, label, multiple, esDinero, type) {
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
                let title = `Producto: ${context[0].label}, ${label}: ${esDinero ? new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'GTQ' }).format(context[0].raw) : context[0].formattedValue}`;
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
    if(type === "line"){
      this.chart.options.elements.line.backgroundColor = "green";
      this.chart.options.elements.line.borderColor = "black";

    }
    this.chart.update();
  }
}
customElements.define("custom-graficos", graficos);
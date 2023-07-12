let decodificado = he.decode(datosString);
let datos = JSON.parse(decodificado);

// document.body.style.width = "2000px"
let [, url] = window.location.pathname.split("analisis/")
let [unidadTiempo] = url.split("&")
let datasetVendidos = [], datasetIngresos = [];
let labels = [...new Set(datos.flatMap(data => Object.keys(data.prods)))].sort()
let labelsdesnormalizados = labels.map(label => datos.find(el => el.prods[label])?.prods[label].p);
const swalConfirmarYCancelar = Swal.mixin({
  customClass: {
    confirmButton: "btn btn-success margenbotonswal",
    cancelButton: "btn btn-danger margenbotonswal",
  },
  buttonsStyling: false,
});

let colores = devuelveColores();
let coloresAlfa = devuelveColores(undefined, 1);

function devuelveColores(colores = ["#ff6384", "#136ba7", "#ffce56", "#4bc0c0", "#9966ff", "#f20034", "#1f00c0", "#004d1a", "#1b005a", "#2bb01a"], opacidad) {
  let mayor = Math.max(colores.length, labels.length, datos.length);
  return [...Array(mayor).keys()].map(i => {
    while (i >= colores.length)
      i -= colores.length;
    let color = colores[i];
    if (opacidad)
      color += "20";
    return color;
  })
}

String.prototype.normalizar = function () { return this.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, "") }
String.prototype.normalizarPrecio = function () { return parseFloat(this).toFixed(2).replace(/[.,]00$/, "") }
Number.prototype.normalizarPrecio = function () { return this.toFixed(2).replace(/[.,]00$/, "") }
String.prototype.aUTC = function () {
  const [datePart] = this.split('T');
  const [year, month, day] = datePart.split('-').map(Number);
  return new Date(year, month - 1, day);
}

Date.prototype.aUTC = function () { return this.toISOString().aUTC() }

datos.forEach((data, i) => {
  let vendidos = labels.map(label => data.prods[label]?.v || 0);
  let ingresos = labels.map(label => data.prods[label]?.i || 0);
  let objVendidos = {
    label: new Intl.DateTimeFormat('es', { dateStyle: 'full' }).format(data._id.aUTC()),
    data: vendidos,
    backgroundColor: coloresAlfa[i],
    borderColor: colores[i],
    borderWidth: 1
  }
  datasetVendidos.push(objVendidos);
  let objIngresos = structuredClone(objVendidos);
  objIngresos.data = ingresos;
  datasetIngresos.push(objIngresos);
});

let fechas = datos.map(x => x._id.aUTC());

let datasetVendidosProductosTotales = Array.of(structuredClone(datasetVendidos[0]));
let datasetIngresosProductosTotales = Array.of(structuredClone(datasetIngresos[0]));
inicializarDatasets(datasetVendidosProductosTotales, datasetVendidos, 0);
inicializarDatasets(datasetIngresosProductosTotales, datasetIngresos, 1);

let fechasCompletas = datasetVendidos.map(x => x.label);
let datasetVendidosTotal = Array.of(structuredClone(datasetVendidos[0]));
let datasetIngresosTotal = Array.of(structuredClone(datasetIngresos[0]));
datasetVendidosTotal[0].data = datos.map(x => x.vt);
datasetIngresosTotal[0].data = datos.map(x => x.it);
datasetVendidosTotal[0].label = fechasCompletas;
datasetIngresosTotal[0].label = fechasCompletas;
inicializarDatasets2(datasetVendidosTotal, 0);
inicializarDatasets2(datasetIngresosTotal, 1);

function inicializarDatasets(dataset, origen, sonIngresos) {
  dataset[0].data = labels.map((_, i) => origen.reduce((acc, curr) => acc + curr.data[i], 0).normalizarPrecio());
  dataset[0].borderColor = colores;
  dataset[0].backgroundColor = coloresAlfa;
  if (unidadTiempo === "semanas")
    dataset[0].label = unirTexto(origen.map(el => el.label))
  else if (unidadTiempo === "meses")
    dataset[0].label = `${sonIngresos ? "ingresos" : "ventas"} durante el mes de ${new Intl.DateTimeFormat('es', { month: "long" }).format(fechas[0])}`
}
function inicializarDatasets2(dataset, i) {
  dataset[0].borderColor = colores;
  dataset[0].backgroundColor = coloresAlfa;
  if (i)
    dataset[0].label = "Total Ingresos";
  else
    dataset[0].label = "Total Ventas";
}

let formatearFecha = (dateStyle, fecha) => new Intl.DateTimeFormat('es', { dateStyle }).format(fecha.aUTC());
let formatearFechaUno = (dateStyle, fecha) => new Intl.DateTimeFormat('es', { dateStyle }).format(fecha.aUTC());
let formatearFechaVarios = (datasets, dateStyle, checkbox) => datasets[0].label = unirTexto(fechas.filter(el => checkbox ? formatearFecha(dateStyle, el) : null));

let unidadTiempoSingularGenero, unidadTiempoSingular, unidadTiempoPlural, unidadTiempoSubunidadPlural

if (unidadTiempo === "semanas") {
  unidadTiempoSingularGenero = "la semana"
  unidadTiempoSingular = "semana"
  unidadTiempoPlural = "semanas"
  unidadTiempoSubunidadPlural = "días"
}
if (unidadTiempo === "meses") {
  unidadTiempoSingularGenero = "el mes"
  unidadTiempoSingular = "mes"
  unidadTiempoPlural = "meses"
  unidadTiempoSubunidadPlural = "días"
}

//labels, datasets, titulo, label, multiple, sonIngresos, esTotal, type
$("#chartVendidos")[0].crearGrafico(labelsdesnormalizados, datasetVendidos, `Productos vendidos durante ${unidadTiempoSingularGenero}`, "vendidos", 1, 0, "alf", 0);
$("#chartIngresos")[0].crearGrafico(labelsdesnormalizados, datasetIngresos, `Ingresos generados por cada producto durante ${unidadTiempoSingularGenero}`, "ingresos", 1, 1, "alf", 0);
$("#chartVentasProductosTotales")[0].crearGrafico(labelsdesnormalizados, datasetVendidosProductosTotales, `Resumen de ventas por producto durante ${unidadTiempoSingularGenero}`, `total vendidos durante ${unidadTiempoSingularGenero}`, 0, 0, "ambos", 0);
$("#chartIngresosProductosTotales")[0].crearGrafico(labelsdesnormalizados, datasetIngresosProductosTotales, `Resumen de ingresos por producto durante ${unidadTiempoSingularGenero}`, `total ingresos durante ${unidadTiempoSingularGenero}`, 0, 1, "ambos", 0);
$("#chartVentasTotal")[0].crearGrafico(fechasCompletas, datasetVendidosTotal, `Resumen de ventas por dia`, `Total ventas durante ${unidadTiempoSingularGenero}`, 0, 0, "ambos", 1);
$("#chartIngresosTotal")[0].crearGrafico(fechasCompletas, datasetIngresosTotal, `Resumen de ingresos por dia`, `Total ingresos durante ${unidadTiempoSingularGenero}`, 0, 1, "ambos", 1);

function unirTexto(arr) {
  if (arr.length === 1)
    return arr[0];
  else {
    let ultimo = arr.pop();
    return "Dias: " + arr.join(" - ") + " y " + ultimo;
  }
}
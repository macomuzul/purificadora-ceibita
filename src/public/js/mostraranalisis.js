let decodificado = he.decode(datosString);
let datos = JSON.parse(decodificado);

// document.body.style.width = "2000px"
let [, url] = location.pathname.split("analisis/")
let [agruparPorP, rangoP, tiempoEscogidoP] = url.split("&")
let [, unidadTiempo] = agruparPorP.split("=")
let datasetVendidos = [], datasetIngresos = [];
//TODO este no se si dejarle el .sort al final
let labels = [...new Set(datos.flatMap(data => Object.keys(data.prods)))]
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
  return [...Array(mayor)].map((_, i) => {
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
  let fechaUTC = data._id.aUTC()
  let objVendidos = {
    label: new Intl.DateTimeFormat('es', { dateStyle: 'full' }).format(fechaUTC),
    data: vendidos,
    backgroundColor: coloresAlfa[i],
    borderColor: colores[i],
    fechas: fechaUTC,
    borderWidth: 1
  }
  datasetVendidos.push(objVendidos);
  let objIngresos = structuredClone(objVendidos);
  objIngresos.data = ingresos;
  datasetIngresos.push(objIngresos);
});

let fechas = datos.map(x => x._id.aUTC());
let objInicializarDatasets = { borderColor: colores, backgroundColor: coloresAlfa, fechas }
let inicializarDatasets = (dataset, origen, sonIngresos) => {
  Object.assign(dataset[0], { origen, fechasCompletas, productos: labelsdesnormalizados, ...objInicializarDatasets, data: labels.map((_, i) => origen.reduce((acc, curr) => acc + curr.data[i], 0).normalizarPrecio()) })
  if (unidadTiempo === "semanas")
    dataset[0].label = unirTexto(origen.map(el => el.label))
  else if (unidadTiempo === "meses")
    dataset[0].label = `${sonIngresos ? "ingresos" : "ventas"} durante el mes de ${new Intl.DateTimeFormat('es', { month: "long" }).format(fechas[0])}`
}
let inicializarDatasets2 = (dataset, data, i) => Object.assign(dataset[0], { data, productos: labelsdesnormalizados, ...objInicializarDatasets, label: i ? "Total Ingresos" : "Total Ventas" })

let fechasCompletas = datasetVendidos.map(x => x.label)

let datasetVendidosProductosTotales = Array.of(structuredClone(datasetVendidos[0]));
let datasetIngresosProductosTotales = Array.of(structuredClone(datasetIngresos[0]));
inicializarDatasets(datasetVendidosProductosTotales, datasetVendidos, 0);
inicializarDatasets(datasetIngresosProductosTotales, datasetIngresos, 1);

let datasetVendidosTotal = Array.of(structuredClone(datasetVendidos[0]));
let datasetIngresosTotal = Array.of(structuredClone(datasetIngresos[0]));
inicializarDatasets2(datasetVendidosTotal, datos.map(x => x.vt), 0);
inicializarDatasets2(datasetIngresosTotal, datos.map(x => x.it), 1);

let formatearFecha = (dateStyle, fecha) => new Intl.DateTimeFormat('es', { dateStyle }).format(fecha.aUTC());
let formatearFechaUno = (dateStyle, fecha) => new Intl.DateTimeFormat('es', { dateStyle }).format(fecha.aUTC());
let formatearFechaVarios = (datasets, dateStyle, checkbox) => datasets[0].label = unirTexto(fechas.filter(el => checkbox ? formatearFecha(dateStyle, el) : null));

let unidadTiempoSingularGenero, unidadTiempoSingular, unidadTiempoPlural, unidadTiempoSubunidadPlural

if (unidadTiempo === "semanas") {
  unidadTiempoSingularGenero = "la semana"
  unidadTiempoSingularGeneroEscogido = "la semana escogida"
  unidadTiempoPluralGeneroEscogido = "las semanas escogidas"
  unidadTiempoSingular = "semana"
  unidadTiempoPlural = "semanas"
  unidadTiempoSubunidadPlural = "días"
} if (unidadTiempo === "meses") {
  unidadTiempoSingularGenero = "el mes"
  unidadTiempoSingularGeneroEscogido = "el mes escogido"
  unidadTiempoPluralGeneroEscogido = "los meses escogidos"
  unidadTiempoSingular = "mes"
  unidadTiempoPlural = "meses"
  unidadTiempoSubunidadPlural = "días"
} if (unidadTiempo === "a%C3%B1os") {
  unidadTiempoSingularGenero = "el año"
  unidadTiempoSingularGeneroEscogido = "el año escogido"
  unidadTiempoPluralGeneroEscogido = "los años escogidos"
  unidadTiempoSingular = "año"
  unidadTiempoPlural = "años"
  unidadTiempoSubunidadPlural = "meses"
}


//labels, datasets, titulo, label, multiple, sonIngresos, esTotalFechas esTotalProductos, ordenarPor type
$("#chartVendidos")[0].crearGrafico(labelsdesnormalizados, datasetVendidos, `Número de productos vendidos agrupados por ${unidadTiempoSingular}`, "vendidos", 1, 0, 0, 0, "alf")
$("#chartIngresos")[0].crearGrafico(labelsdesnormalizados, datasetIngresos, `Ingresos generados por cada producto agrupados por ${unidadTiempoSingular}`, "ingresos", 1, 1, 0, 0, "alf")
$("#chartVentasProductosTotales")[0].crearGrafico(labelsdesnormalizados, datasetVendidosProductosTotales, `Número total de ventas por producto durante las fechas ...falta`, `total vendidos durante ${unidadTiempoSingularGenero}`, 0, 0, 0, 1, "alfcant")
$("#chartIngresosProductosTotales")[0].crearGrafico(labelsdesnormalizados, datasetIngresosProductosTotales, `Total de ingresos generados por producto durante las fechas ...falta`, `total ingresos durante ${unidadTiempoSingularGenero}`, 0, 1, 0, 1, "alfcant")
$("#chartVentasTotal")[0].crearGrafico(fechasCompletas, datasetVendidosTotal, `Cantidad de productos vendidos por ${unidadTiempoSingular}`, `Total ventas durante ${unidadTiempoPluralGeneroEscogido}`, 0, 0, 1, 0, "cantfecha")
$("#chartIngresosTotal")[0].crearGrafico(fechasCompletas, datasetIngresosTotal, `Ingresos totales generados por ${unidadTiempoSingular}`, `Total ingresos durante ${unidadTiempoPluralGeneroEscogido}`, 0, 1, 1, 0, "cantfecha")

function unirTexto(arr) {
  if (arr.length === 1)
    return arr[0];
  else {
    let ultimo = arr.pop();
    return "Dias: " + arr.join(" - ") + " y " + ultimo;
  }
}
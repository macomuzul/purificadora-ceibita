let decodificado = he.decode(datosString);
let datos = JSON.parse(decodificado);
let labelsSet = new Set();
let datasetVendidos = [], datasetIngresos = [];
datos.forEach(data => Object.keys(data.productos).map(el => labelsSet.add(el)));
let labels = [...labelsSet].sort();
let labelsdesnormalizados = labels.map(label => datos.find(el => el.productos[label]?.productoDesnormalizado).productos[label].productoDesnormalizado);

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
  let arr = [...Array(mayor).keys()];
  let res = arr.map(i => {
    while (i >= colores.length)
      i -= colores.length;
    let color = colores[i];
    if (opacidad)
      color += "20";
    return color;
  })
  return res;
}

datos.forEach((data, i) => {
  let vendidos = labels.map(label => data.productos[label]?.vendidos || 0);
  let ingresos = labels.map(label => data.productos[label]?.ingresos || 0);
  let objVendidos = {
    label: new Intl.DateTimeFormat('es', { dateStyle: 'full' }).format(new Date(data._id)),
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

let fechas = datos.map(x => new Date(x._id));

let datasetVendidosTotales = Array.of(structuredClone(datasetVendidos[0]));
let datasetIngresosTotales = Array.of(structuredClone(datasetIngresos[0]));
inicializarDatasets(datasetVendidosTotales);
inicializarDatasets(datasetIngresosTotales);

function inicializarDatasets(dataset){
  dataset[0].data = datasetVendidos[0].data.map((_, i) => datasetVendidos.reduce((acc, curr) => acc + curr.data[i], 0));
  dataset[0].borderColor = colores;
  dataset[0].backgroundColor = coloresAlfa;
  dataset[0].label = unirTexto(datasetVendidos.map(el => el.label));
}

let unidadTiempoSingularGenero = "la semana";
let unidadTiempoSingular = "semana";
let unidadTiempoPlural = "semanas";
let unidadTiempoSubunidadPlural = "dias";

$("#chartVendidos")[0].crearGrafico(labelsdesnormalizados, datasetVendidos, `Productos vendidos durante ${unidadTiempoSingularGenero} agrupados por producto`, "vendidos", 1, 0, "alf");
$("#chartIngresos")[0].crearGrafico(labelsdesnormalizados, datasetIngresos, `Ingresos generados por cada producto durante ${unidadTiempoSingularGenero} agrupados por producto`, "ingresos", 1, 1, "alf");
$("#chartVentasTotales")[0].crearGrafico(labelsdesnormalizados, datasetVendidosTotales, `Resumen del total de ventas durante ${unidadTiempoSingularGenero}`, `total vendidos durante ${unidadTiempoSingularGenero}`, 0, 0, "ambos");
$("#chartIngresosTotales")[0].crearGrafico(labelsdesnormalizados, datasetIngresosTotales, `Resumen del total de ingresos durante ${unidadTiempoSingularGenero}`, `total ingresos durante ${unidadTiempoSingularGenero}`, 0, 1, "ambos");

function unirTexto(arr) {
  if (arr.length === 1)
    return arr[0];
  else {
    let ultimo = arr.pop();
    return "Dias: " + arr.join(" - ") + " y " + ultimo;
  }
}
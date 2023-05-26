let decodificado = he.decode(datosString);
let datos = JSON.parse(decodificado);
let labelsSet = new Set();
let datasetVendidos = [];
let datasetIngresos = [];
datos.forEach(data => Object.keys(data.productos).map(el => labelsSet.add(el)));
let labels = [...labelsSet].sort();
let labelsdesnormalizados = labels.map(label => datos.find(el => el.productos[label]?.productoDesnormalizado).productos[label].productoDesnormalizado);

let colores = devuelveColores();
let coloresAlfa = devuelveColores(0.2);

function devuelveColores(opacidad = 1){
  let colores = [
    `rgba(255, 99, 132, ${opacidad})`,
    `rgba(54, 162, 235, ${opacidad})`,
    `rgba(255, 206, 86, ${opacidad})`,
    `rgba(75, 192, 192, ${opacidad})`,
    `rgba(153, 102, 255, ${opacidad})`,
    `rgba(255, 159, 64, ${opacidad})`
  ];
  return colores;
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
  let objIngresos = JSON.parse(JSON.stringify(objVendidos));
  objIngresos.data = ingresos;
  datasetIngresos.push(objIngresos);
})

$("#chartVendidos")[0].crearGrafico(labelsdesnormalizados, datasetVendidos, "Productos vendidos durante la semana agrupados por producto")
$("#chartIngresos")[0].crearGrafico(labelsdesnormalizados, datasetIngresos, "Ingresos generados por cada producto durante la semana agrupados por producto")

//TODO cambiar estos
async function pedirPDF() {
  if (typeof jsPDF === "undefined") {
    // await $.getScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/1.5.3/jspdf.debug.js');
    // await $.getScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.3.2/html2canvas.js');
    await $.getScript('/jspdf-1.5.3.js');
    await $.getScript('/html2canvas-1.3.2.js');
  }
}

$("body").on("click", ".botonpdf", async function () {
  await pedirPDF();
  html2canvas($(this).closest("custom-graficos").find("canvas")[0]).then(function (canvas) {
    var chartImage = canvas.toDataURL('image/jpeg', 1.0);
    var pdf = new jsPDF({ orientation: 'landscape' });

    var pdfWidth = pdf.internal.pageSize.getWidth();
    var pdfHeight = pdf.internal.pageSize.getHeight();
    var chartWidth = 280;
    var chartHeight = 150;
    var xPos = (pdfWidth - chartWidth) / 2;
    var yPos = (pdfHeight - chartHeight) / 2;

    pdf.addImage(chartImage, 'JPEG', xPos, yPos, chartWidth, chartHeight);
    pdf.save('chart.pdf');
  });
});
let decodificado = he.decode(datosString);
let datos = JSON.parse(decodificado);

// document.body.style.width = "2000px"
String.prototype.aFloat = function () { return parseFloat(this) }

String.prototype.normalizar = function () { return this.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, "") }
String.prototype.normalizarPrecio = function () { return this.aFloat().toFixed(2).replace(/[.,]00$/, "") }
String.prototype.normalizarPrecioNum = function () { return this.normalizarPrecio().aFloat() }
Number.prototype.normalizarPrecio = function () { return this.toFixed(2).replace(/[.,]00$/, "") }
Number.prototype.normalizarPrecioNum = function () { return this.normalizarPrecio().aFloat() }
Number.prototype.aQuetzales = function () { return new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'GTQ' }).format(this) }
Number.prototype.cantidadFormateada = function () { return new Intl.NumberFormat('es-GT').format(this) }
String.prototype.aQuetzales = function () { return new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'GTQ' }).format(this.aFloat()) }
String.prototype.cantidadFormateada = function () { return new Intl.NumberFormat('es-GT').format(this.aFloat()) }

Date.prototype.aUTC = function () { return this.toISOString().aUTC() }
String.prototype.aUTC = function () {
  const [datePart] = this.split('T');
  const [year, month, day] = datePart.split('-').map(Number);
  return new Date(year, month - 1, day);
}


String.prototype.partirFechas = function () {
  let [fecha1, fecha2] = this.split("-")
  if (fecha2)
    return fecha1 + " - " + fecha2
  else
    return fecha1
}


let [, url] = location.pathname.split("analisis/")
let [agruparPorP, rangoP, tiempoEscogidoP] = url.split("&")
let [, unidadTiempo] = agruparPorP.split("=")
let [, rango] = rangoP.split("=")
let unidadTiempoEsDia = unidadTiempo === "dias"
let unidadTiempoEsSemana = unidadTiempo === "semanas"
let unidadTiempoEsDiaOSemana = unidadTiempoEsDia || unidadTiempoEsSemana
let unidadTiempoEsMes = unidadTiempo === "meses"
let unidadTiempoEsAño = unidadTiempo === "años"
let tiempoMenor = datos.at(0)._id.aUTC()
let tiempoMayor = datos.at(-1).f?.aUTC() || datos.at(-1)._id?.aUTC()

let datasetVendidosAgrupadosPorProducto = [], datasetIngresosAgrupadosPorProducto = [], datasetVendidosAgrupadosPorFecha = [], datasetIngresosAgrupadosPorFecha = []
//TODO este no se si dejarle el .sort al final
let productos = [...new Set(datos.flatMap(data => Object.keys(data.prods)))]
let productosDesnormalizados = productos.map(label => datos.find(el => el.prods[label])?.prods[label].p);
const swalConfirmarYCancelar = Swal.mixin({
  customClass: {
    confirmButton: "btn btn-success margenbotonswal",
    cancelButton: "btn btn-danger margenbotonswal",
  },
  buttonsStyling: false,
})

function devuelveColores(colores = ["#ff6384", "#136ba7", "#ffce56", "#4bc0c0", "#9966ff", "#f20034", "#1f00c0", "#004d1a", "#cb005a", "#2bb01a"], opacidad) {
  let mayor = Math.max(colores.length, productos.length, datos.length)
  return [...Array(mayor)].map((_, i) => {
    let color = colores[i % colores.length]
    if (opacidad)
      color += "20"
    return color
  })
}

let colores = devuelveColores()
let coloresAlfa = devuelveColores(undefined, 1)
let fechas = datos.map(x => x._id.aUTC())
let fechasFin
if (!unidadTiempoEsDia)
  fechasFin = datos.map(x => x.f.aUTC())

let formatearFechaObj = (opciones, fecha) => new Intl.DateTimeFormat('es', opciones).format(fecha.aUTC())
let formatearFecha = (dateStyle, fecha) => new Intl.DateTimeFormat('es', { dateStyle }).format(fecha.aUTC())
let formatearFechaUno = (dateStyle, fecha) => new Intl.DateTimeFormat('es', { dateStyle }).format(fecha.aUTC())
let formatearFechaVarios = (datasets, dateStyle, checkbox) => datasets[0].label = unirTexto(fechas.filter(el => checkbox ? formatearFecha(dateStyle, el) : null))
let formatearRango = (opciones, fecha, i) => fecha.valueOf() === fechasFin[i].valueOf() ? formatearFecha(opciones, fecha) : formatearFecha(opciones, fecha) + " - " + formatearFecha(opciones, fechasFin[i])

let popover = contenido => `<custom-popover>${contenido}</custom-popover>`
let checkbox = (html, checked, clase) => `<custom-checkbox ${checked ? `data-checked="1"` : ""} ${clase ? `data-clase="${clase}"` : ""}>${html}</custom-checkbox>`
let podio = (titulo, ar1, ar2, ar3, ab1, ab2, ab3) => `<custom-podio data-titulo="${titulo}" data-ar1="${ar1}" data-ar2="${ar2}" data-ar3="${ar3}" data-ab1="${ab1}" data-ab2="${ab2}" data-ab3="${ab3}"></custom-podio>`

let opcionesFechaDefault = unidadTiempoEsMes ? { month: "long", year: "numeric" } : { year: "numeric" }
let fechasStr = fechas.map((x, i) => {
  if (unidadTiempoEsDia)
    return formatearFecha("long", x)
  if (unidadTiempoEsSemana)
    return formatearRango("long", x, i)
  if (unidadTiempoEsMes) {
    if (i === 0 && x.getDate() !== 1)
      return formatearRango("long", x, i)
    else if (i === fechas.length - 1 && !esFinDeMes(datos[i].f))
      return formatearRango("long", x, i)
    else
      return formatearFechaObj(opcionesFechaDefault, x)
  } else {
    if (i === 0 && x.getDate() !== 1)
      return formatearRango("long", x, i)
    else if (i === fechas.length - 1 && !esFinDeMes(datos[i].f))
      return formatearRango("long", x, i)
    else
      return formatearFechaObj(opcionesFechaDefault, x)
  }
})


function esFinDeMes(date) {
  date = new Date(date)
  const nextDay = new Date(date)
  nextDay.setDate(nextDay.getDate() + 1)
  return nextDay.getMonth() !== date.getMonth()
}


datos.forEach((data, i) => {
  let vendidos = productos.map(prod => data.prods[prod]?.v || 0)
  let ingresos = productos.map(prod => data.prods[prod]?.i || 0)
  let objVendidos = {
    label: fechasStr[i],
    data: vendidos,
    ...{ backgroundColor: coloresAlfa[i], borderColor: colores[i], borderWidth: 1 },
    indice: i,
  }
  datasetVendidosAgrupadosPorProducto.push(objVendidos)
  let objIngresos = structuredClone(objVendidos)
  objIngresos.data = ingresos
  datasetIngresosAgrupadosPorProducto.push(objIngresos)
})

productos.forEach((prod, i) => {
  let vendidos = datos.map(dato => dato.prods[prod]?.v || 0)
  let ingresos = datos.map(dato => dato.prods[prod]?.i || 0)
  let objVendidos = {
    label: productosDesnormalizados[i],
    data: vendidos,
    ...{ backgroundColor: coloresAlfa[i], borderColor: colores[i], borderWidth: 1 },
    indice: i,
  }
  datasetVendidosAgrupadosPorFecha.push(objVendidos)
  let objIngresos = structuredClone(objVendidos)
  objIngresos.data = ingresos
  datasetIngresosAgrupadosPorFecha.push(objIngresos)
})

let unidadTiempoSingularGenero, unidadTiempoPluralGenero, unidadTiempoSingularGeneroEscogido, unidadTiempoPluralGeneroEscogido, unidadTiempoSingular, unidadTiempoSingularMayuscula, unidadTiempoPlural, unidadTiempoPluralMayuscula, unidadTiempoSubunidadPlural

function crearUnidadesTiempo() {

}

if (unidadTiempo === "dias") {
  unidadTiempoSingularGenero = "el dia"
  unidadTiempoPluralGenero = "los días"
  unidadTiempoSingularGeneroEscogido = "el día escogido"
  unidadTiempoPluralGeneroEscogido = "los días escogidos"
  unidadTiempoSingular = "día"
  unidadTiempoSingularMayuscula = "Día"
  unidadTiempoPlural = "días"
  unidadTiempoPluralMayuscula = "Días"
  unidadTiempoSubunidadPlural = "días"
} if (unidadTiempo === "semanas") {
  unidadTiempoSingularGenero = "la semana"
  unidadTiempoPluralGenero = "las semanas"
  unidadTiempoSingularGeneroEscogido = "la semana escogida"
  unidadTiempoPluralGeneroEscogido = "las semanas escogidas"
  unidadTiempoSingular = "semana"
  unidadTiempoSingularMayuscula = "Semana"
  unidadTiempoPlural = "semanas"
  unidadTiempoPluralMayuscula = "Semanas"
  unidadTiempoSubunidadPlural = "días"
} if (unidadTiempo === "meses") {
  unidadTiempoSingularGenero = "el mes"
  unidadTiempoPluralGenero = "los meses"
  unidadTiempoSingularGeneroEscogido = "el mes escogido"
  unidadTiempoPluralGeneroEscogido = "los meses escogidos"
  unidadTiempoSingular = "mes"
  unidadTiempoSingularMayuscula = "Mes"
  unidadTiempoPlural = "meses"
  unidadTiempoPluralMayuscula = "Meses"
  unidadTiempoSubunidadPlural = "días"
} if (unidadTiempo === "a%C3%B1os") {
  unidadTiempoSingularGenero = "el año"
  unidadTiempoPluralGenero = "los años"
  unidadTiempoSingularGeneroEscogido = "el año escogido"
  unidadTiempoPluralGeneroEscogido = "los años escogidos"
  unidadTiempoSingular = "año"
  unidadTiempoSingularMayuscula = "Año"
  unidadTiempoPlural = "años"
  unidadTiempoPluralMayuscula = "Años"
  unidadTiempoSubunidadPlural = "meses"
}

let devuelveTop3 = (data, indices) => [data, indices.sort((a, b) => data[b] - data[a]).slice(0, 3)]
let listaCanvasConfeti
let agregarConfeti = w => {
  listaCanvasConfeti = [...$("#podios").find("canvas")].map(x => new ConfettiGenerator({ target: x }))
  listaCanvasConfeti.forEach(x => x.render())
}
let quitarConfeti = w => listaCanvasConfeti.forEach(x => x.clear())
function crearPodio() {
  let i = productos.length < 3 ? [0, 1, 2] : [...productos.keys()]
  let [data, primeros3] = devuelveTop3(productos.map((_, i) => datasetVendidosAgrupadosPorProducto.reduce((acc, curr) => acc + curr.data[i], 0)?.normalizarPrecioNum()), i)
  let html = `<div class="tituloSalonDeLaFama"><span>Salón de la fama</span></div><div class="tituloGrupoPodios">Productos<hr></div><div class="grupoPodios">
  ${podio("Productos más vendidos", ...primeros3.map(i => productosDesnormalizados[i]), ...primeros3.map(i => data[i]?.cantidadFormateada()))}`;

  [data, primeros3] = devuelveTop3(productos.map((_, i) => datasetIngresosAgrupadosPorProducto.reduce((acc, curr) => acc + curr.data[i], 0)?.normalizarPrecioNum()), i)
  html += `${podio("Productos que generaron más ingresos", ...primeros3.map(i => productosDesnormalizados[i]), ...primeros3.map(i => data[i]?.aQuetzales()))}
  </div><div class="tituloGrupoPodios">Fechas<hr></div><div class="grupoPodios">`;

  i = datos.length < 3 ? [0, 1, 2] : [...datos.keys()];
  [data, primeros3] = devuelveTop3(datos.map(x => x.vt), i)
  html += podio("Fechas en las que se vendio más", ...primeros3.map(i => fechasStr[i]), ...primeros3.map(i => data[i]?.cantidadFormateada()));

  [data, primeros3] = devuelveTop3(datos.map(x => x.it), i)
  html += `${podio("Fechas en la que se generaron más ingresos", ...primeros3.map(i => fechasStr[i]), ...primeros3.map(i => data[i]?.aQuetzales()))}
    </div>${checkbox("Animación", 1, "checkboxAnimacion")}`

  $("#podios")[0].innerHTML = html
  agregarConfeti()
  $(".checkboxAnimacion")[0].addEventListener("click", e => $(e.currentTarget).find("input")[0].checked ? quitarConfeti() : agregarConfeti(), { capture: true })
}
crearPodio()


//labels, datasets, titulo, label, agrupadoPorFecha, sonIngresos, type
$("#chartVendidosAgrupadosPorFecha")[0].crearGrafico(fechasStr, datasetVendidosAgrupadosPorFecha, `Cantidad de productos vendidos agrupados por ${unidadTiempoSingular}`, `total vendidos durante ${unidadTiempoSingularGenero}`, 1, 0,)
$("#chartIngresosAgrupadosPorFecha")[0].crearGrafico(fechasStr, datasetIngresosAgrupadosPorFecha, `Ingresos generados agrupados por ${unidadTiempoSingular}`, `total ingresos durante ${unidadTiempoSingularGenero}`, 1, 1)
$("#chartVendidosAgrupadosPorProducto")[0].crearGrafico(productosDesnormalizados, datasetVendidosAgrupadosPorProducto, "Cantidad de productos vendidos agrupados por producto", "vendidos", 0, 0)
$("#chartIngresosAgrupadosPorProducto")[0].crearGrafico(productosDesnormalizados, datasetIngresosAgrupadosPorProducto, "Ingresos generados agrupados por producto", "ingresos", 0, 1)

function unirTexto(arr) {
  if (arr.length === 1)
    return arr[0];
  else {
    let ultimo = arr.pop();
    return "Dias: " + arr.join(" - ") + " y " + ultimo;
  }
}
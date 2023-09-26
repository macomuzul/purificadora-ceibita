let decodificado = he.decode(datosString), datos = JSON.parse(decodificado)

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
String.prototype.primeraLetraMayuscula = function () { return this.charAt(0).toUpperCase() + this.slice(1); }

Date.prototype.aUTC = function () { return this.toISOString().aUTC() }
String.prototype.aUTC = function () {
  const [datePart] = this.split('T')
  const [year, month, day] = datePart.split('-').map(Number)
  return new Date(year, month - 1, day)
}


String.prototype.partirFechas = function () {
  let [fecha1, fecha2] = this.split("-")
  return `${fecha1}${fecha2 ? " - " + fecha2 : ""}`
}


let [, url] = location.pathname.split("analisis/")
let [agruparPorP, rangoP, tiempoEscogidoP] = url.split("&")
let [, unidadTiempo] = agruparPorP.split("=")
let [, rango] = rangoP.split("=")
if (unidadTiempo === "a%C3%B1os") unidadTiempo = "años"
let unidadTiempoEsDia = unidadTiempo === "dias"
let unidadTiempoEsSemana = unidadTiempo === "semanas"
let unidadTiempoEsMes = unidadTiempo === "meses"
let unidadTiempoEsAño = unidadTiempo === "años"
let unidadTiempoEsDiaOSemana = unidadTiempoEsDia || unidadTiempoEsSemana

let tiempoMenor = datos.at(0)._id.aUTC()
let tiempoMayor = datos.at(-1).f?.aUTC() || datos.at(-1)._id?.aUTC()

let datasetVendidosAgrupadosPorProducto = [], datasetIngresosAgrupadosPorProducto = [], datasetVendidosAgrupadosPorFecha = [], datasetIngresosAgrupadosPorFecha = []
//TODO este no se si dejarle el .sort al final
let productos = [...new Set(datos.flatMap(data => Object.keys(data.prods)))]
let productosDesnormalizados = productos.map(label => datos.find(el => el.prods[label])?.prods[label].p)
let swalConfirmarYCancelar = Swal.mixin({
  customClass: {
    confirmButton: "btn btn-success margenbotonswal",
    cancelButton: "btn btn-danger margenbotonswal",
  },
  buttonsStyling: false
})

function devuelveColores(colores = ["#ff6384", "#136ba7", "#ffce56", "#4bc0c0", "#9966ff", "#f20034", "#1f00c0", "#004d1a", "#cb005a", "#2bb01a"], opacidad) {
  let mayor = Math.max(colores.length, productos.length, datos.length)
  return [...Array(mayor)].map((_, i) => `${colores[i % colores.length]}${opacidad ? "20" : ""}`)
}

let colores = devuelveColores()
let coloresAlfa = devuelveColores(undefined, 1)
let fechas = datos.map(x => x._id.aUTC())
let fechasFin = unidadTiempoEsDia ? null : datos.map(x => x.f.aUTC())
let unirTexto = arr => arr.length === 1 ? arr[0] : `Dias: ${arr.slice(0, -1).join(" - ")} y ${arr.at(-1)}`

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
  if (unidadTiempoEsDia) return formatearFecha("long", x)
  if (unidadTiempoEsSemana) return formatearRango("long", x, i)
  else return x.getDate() === 1 && esFinDeMes(datos[i].f) ? formatearFechaObj(opcionesFechaDefault, x) : formatearRango("long", x, i)
})


function esFinDeMes(date) {
  date = new Date(date)
  let nextDay = new Date(date)
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

let masculino = unidadTiempo !== "semanas"
let unidadTiempoSingular = unidadTiempo.slice(0, unidadTiempo === "meses" ? -2 : -1)
let unidadTiempoPlural = unidadTiempoSingular + (unidadTiempo === "meses" ? "e" : "") + "s"
let unidadTiempoSingularGenero = masculino ? "el" : "la" + unidadTiempoSingular
let unidadTiempoPluralGenero = `${masculino ? "los" : "las"} ${unidadTiempoPlural}`
let unidadTiempoPluralMayuscula = unidadTiempoPlural.primeraLetraMayuscula()
let escogido = " escogid" + (masculino ? "o" : "a")
let unidadTiempoSingularGeneroEscogido = unidadTiempoSingularGenero + escogido
let unidadTiempoPluralGeneroEscogido = `${unidadTiempoPluralGenero}${escogido}s`

let devuelveTop3 = (data, indices) => [data, indices.sort((a, b) => data[b] - data[a]).slice(0, 3)]

function crearPodio() {
  let i = productos.length < 3 ? [0, 1, 2] : [...productos.keys()]
  let [data, primeros3] = devuelveTop3(productos.map((_, i) => datasetVendidosAgrupadosPorProducto.reduce((acc, curr) => acc + curr.data[i], 0)?.normalizarPrecioNum()), i)
  let html = `<div class="tituloSalonDeLaFama"><span>Salón de la fama</span></div><div class="tituloGrupoPodios">Productos<hr></div><div class="grupoPodios">
  ${podio("Productos más vendidos", ...primeros3.map(i => productosDesnormalizados[i]), ...primeros3.map(i => data[i]?.cantidadFormateada()))}`

    ;[data, primeros3] = devuelveTop3(productos.map((_, i) => datasetIngresosAgrupadosPorProducto.reduce((acc, curr) => acc + curr.data[i], 0)?.normalizarPrecioNum()), i)
  html += `${podio("Productos que generaron más ingresos", ...primeros3.map(i => productosDesnormalizados[i]), ...primeros3.map(i => data[i]?.aQuetzales()))}
  </div><div class="tituloGrupoPodios">Fechas<hr></div><div class="grupoPodios">`

  i = datos.length < 3 ? [0, 1, 2] : [...datos.keys()]
    ;[data, primeros3] = devuelveTop3(datos.map(x => x.vt), i)
  html += podio("Fechas en las que se vendio más", ...primeros3.map(i => fechasStr[i]), ...primeros3.map(i => data[i]?.cantidadFormateada()))

    ;[data, primeros3] = devuelveTop3(datos.map(x => x.it), i)
  html += `${podio("Fechas en la que se generaron más ingresos", ...primeros3.map(i => fechasStr[i]), ...primeros3.map(i => data[i]?.aQuetzales()))}
    </div>${checkbox("Animación", 1, "checkboxPodio")}`

  $("#podios")[0].innerHTML = html
  agregarConfeti()
  $("body").on("click", ".checkboxPodio", e => e.currentTarget.querySelector("input").checked ? agregarConfeti() : quitarConfeti())
}
crearPodio()


//labels, datasets, titulo, label, agrupadoPorFecha, sonIngresos, type
$("#chartVendidosAgrupadosPorFecha")[0].crearGrafico(fechasStr, datasetVendidosAgrupadosPorFecha, `Cantidad de productos vendidos agrupados por ${unidadTiempoSingular}`, `total vendidos durante ${unidadTiempoSingularGenero}`, 1, 0,)
$("#chartIngresosAgrupadosPorFecha")[0].crearGrafico(fechasStr, datasetIngresosAgrupadosPorFecha, `Ingresos generados agrupados por ${unidadTiempoSingular}`, `total ingresos durante ${unidadTiempoSingularGenero}`, 1, 1)
$("#chartVendidosAgrupadosPorProducto")[0].crearGrafico(productosDesnormalizados, datasetVendidosAgrupadosPorProducto, "Cantidad de productos vendidos agrupados por producto", "vendidos", 0, 0)
$("#chartIngresosAgrupadosPorProducto")[0].crearGrafico(productosDesnormalizados, datasetIngresosAgrupadosPorProducto, "Ingresos generados agrupados por producto", "ingresos", 0, 1)
dayjs.extend(window.dayjs_plugin_utc);
let colsinicio = 2, colsfinal = 2;
let [dia, mes, año] = document.querySelector(".fechanum").textContent.split("/") //este hay que ponerle textcontent porque si esta escondido con innertext no lo agarra
let hoy = dayjs(año + "-" + mes + "-" + dia).utc(true)
let fechastr = hoy.format("D-M-YYYY")
let timer, touchduration = 600
let tablaValida = false, yaSeRecibioTouch = false, permitirFilasVacias = false, opcionSwal = false
let listaplantillas = {}, objReordenarPlantillas = [], tablaParaValidacion, plantillaSeleccionada = {}

// let desdeElMobil = function () { return /Android|webOS|iPhone|iPad|tablet/i.test(navigator.userAgent) }
let desdeElMobil = () => (('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0))
let devuelveListaTablas = q => [...$(".grupotabs .tabs__radio")].map(x => document.querySelector(`.contenidotabs [data-tabid="${x.dataset.tabid}"] table`))
let borrarListaOrdenarPlantillasTablaActual = q => borrarListaOrdenarPlantillas(_tabla(), _idTab())
let devuelveCamioneros = q => camioneros.map(x => `<li class="dropdown-item">${x}</li>`).join("")
let devuelveProductoVacio = producto => `<tr><td contenteditable="true">${producto.producto}</td><td contenteditable="true">${producto.precio.normalizarPrecio()}</td>${[...Array(_cantidadSaleYEntra() - 4)].map(_ => `<td contenteditable="true"></td>`).join("")} <td></td><td class="borrarfilas"></td></tr>`
let borrarEnfocarFilas = tabla => $(tabla).find(".cuerpo td").each((_, x) => x.classList.remove("enfocar"))

$(async function () {
  setTimeout(async () => {
    colocarValoresConfig()
    guardarValoresConfig()
    if (desdeElMobil())
      await $.getScript('/touch.js')
  }, 5)
})

const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]') //estos son para el bootstrap
const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl));

let _cantidadTabs = () => $(".contenidotabs").children().length
let _idTab = () => $(".grupotabs .tabs__radio:checked")[0].dataset.tabid
let _tabla = () => $(`.contenidotabs [data-tabid="${_idTab()}"] table`)[0]
let _cuerpo = () => _tabla().querySelector(".cuerpo")
let _filas = () => [..._cuerpo().rows]
let _pie = () => _tabla().querySelector("tfoot")
let _pintarColumnas = () => _tabla().querySelector(".pintarcolumnas")
let _cantidadViajes = () => _pintarColumnas().children.length
let _saleYEntra = () => _tabla().querySelector(".saleYEntra")
let _cantidadSaleYEntra = () => (_pintarColumnas().children.length * 2 + colsinicio + colsfinal)

$(".cuerpo td:not(:nth-last-child(1), :nth-last-child(2))").prop("contentEditable", true)
$(".cuerpo td:last-child").each((_, x) => x.classList.add("borrarfilas"))
$(".tabs__label").each((_, x) => x.classList.add("borrarcamiones"))

$("body").on("click", ".fecha", () => $(".fecha").each((_, x) => $(x).toggle()))
let opcionBorrarFilasYColumnas = -1
let opcionBorrarCamiones = -1
let opcionExportarPDF = -1
let opcionExportarExcel = -1
let switchReordenarProductos = -1
let switchReordenarCamiones = -1
let switchOrdenarOrdenAlfabetico = -1

$("body").on("click", ".grupotabs .tabs__label", function (e) {
  let encontrado = objReordenarPlantillas[this.previousElementSibling.dataset.tabid];
  if (encontrado)
    $(".restaurarplantilla").css("display", "initial");
  else
    $(".restaurarplantilla").css("display", "none");
})

$("body").on("click", ".restaurarplantilla", function (e) {
  let tabla = _tabla()
  let cuerpo = $(tabla).find(".cuerpo")[0]
  let id = _idTab()
  cuerpo.innerHTML = restaurarOrdenPlantilla(objReordenarPlantillas[id], cuerpo)
  borrarListaOrdenarPlantillas(tabla, id)
})

function borrarListaOrdenarPlantillas(tabla, id) {
  $(tabla).find(`th:not([colspan="2"])`).each((_, el) => el.style.setProperty("--flecha", '"↓"'));
  tabla.querySelector('.activo')?.classList.remove("activo");
  $(".restaurarplantilla").css("display", "none");
  delete objReordenarPlantillas[id]
}

function restaurarOrdenPlantilla(ordenAnterior, cuerpo) {
  let filas = [...cuerpo.rows]
  let formatoTablaLlena = ""
  let ordenNuevo = filas.map(x => x.cells[0].innerText.normalizar())
  ordenAnterior.forEach(producto => {
    let i = ordenNuevo.findIndex(x => x === producto)
    if (i >= 0)
      formatoTablaLlena += filas[i].outerHTML
  })

  ordenNuevo.forEach((prod, i) => !ordenAnterior.includes(prod) ? formatoTablaLlena += filas[i].outerHTML : "")
  return formatoTablaLlena
}

async function guardarValoresConfig() {
  //estos son solo para visualizar los iconos
  $(".contenidotabs").each((_, el) => opcionBorrarFilasYColumnas === 1 ? el.classList.add("cerrarconboton") : el.classList.remove("cerrarconboton"));
  $(".tabs").each((_, el) => opcionBorrarCamiones === 1 ? el.classList.add("cerrarconboton") : el.classList.remove("cerrarconboton"));
  $('.contenidotabs').each((_, el) => switchOrdenarOrdenAlfabetico ? el.classList.add("ordenarAlfabeticamente") : el.classList.remove("ordenarAlfabeticamente"));

  $(".tabs").sortable({
    axis: "x", stop: function () {
      $(".tabs label").each((i, tab) => tab.innerText = `Camión ${i + 1}`);
    },
    items: "> div:not(:last-child)",
    disabled: !switchReordenarCamiones,
    stop: function () {
      reacomodarCamiones()
      Swal.fire("Se ha cambiado el orden", "Se ha cambiado el orden de los camiones exitosamente", "success")
    }
  });

  tablasSortable();
}

function tablasSortable() {
  $(".grupotabs table .cuerpo").sortable({
    axis: "y",
    disabled: !switchReordenarProductos
  });
}


$("body").on("click", ".guardarconfig", async () => {
  await colocarValoresConfig();
  guardarValoresConfig();
})

async function colocarValoresConfig() {
  let opcionBorrarFilasYColumnasNuevo = $('[name="borrarfilasycolumnas"]:checked').parent().index();
  let opcionBorrarCamionesNuevo = $('[name="borrarcamiones"]:checked').parent().index();
  let opcionExportarPDFNuevo = $('[name="exportarpdf"]:checked').parent().index();
  let opcionExportarExcelNuevo = $('[name="exportarexcel"]:checked').parent().index();
  let switchOrdenarCamionesNuevo = $("#switchreordenarcamiones")[0].checked;
  let switchOrdenarProductosNuevo = $("#switchreordenarproductos")[0].checked;
  let switchOrdenarOrdenAlfabeticoNuevo = $("#switchreordenalfabetico")[0].checked;


  if (opcionBorrarFilasYColumnasNuevo !== opcionBorrarFilasYColumnas) {
    if (opcionBorrarFilasYColumnasNuevo === 0) {
      $("body").on("pointerdown", ".borrarcolumnas", borrarColumnasHandler);
      $("body").on("pointerdown", ".borrarfilas", borrarFilasHandler);
      if (opcionBorrarFilasYColumnas === 1) {
        $("body").off("click", ".borrarcolumnas", borrarColumnasHandler);
        $("body").off("click", ".borrarfilas", borrarFilasHandler);
      }
    }
    if (opcionBorrarFilasYColumnasNuevo === 1) {
      $("body").on("click", ".borrarcolumnas", borrarColumnasHandler);
      $("body").on("click", ".borrarfilas", borrarFilasHandler);
      if (opcionBorrarFilasYColumnas === 0) {
        $("body").off("pointerdown", ".borrarcolumnas", borrarColumnasHandler);
        $("body").off("pointerdown", ".borrarfilas", borrarFilasHandler);
      }
    }
    if (opcionBorrarFilasYColumnasNuevo === 2) {
      if (opcionBorrarFilasYColumnas === 0) {
        $("body").off("pointerdown", ".borrarcolumnas", borrarColumnasHandler);
        $("body").off("pointerdown", ".borrarfilas", borrarFilasHandler);
      } else if (opcionBorrarFilasYColumnas === 1) {
        $("body").off("click", ".borrarcolumnas", borrarColumnasHandler);
        $("body").off("click", ".borrarfilas", borrarFilasHandler);
      }
    }
  }

  if (opcionBorrarCamionesNuevo !== opcionBorrarCamiones) {
    if (opcionBorrarCamionesNuevo === 0) {
      $("body").on("pointerdown", ".borrarcamiones", borrarCamionesHandler);
      if (opcionBorrarCamiones === 1)
        $("body").off("click", ".borrarcamiones", borrarCamionesHandler);
    }
    if (opcionBorrarCamionesNuevo === 1) {
      $("body").on("click", ".borrarcamiones", borrarCamionesHandler);
      if (opcionBorrarCamiones === 0)
        $("body").off("pointerdown", ".borrarcamiones", borrarCamionesHandler);
    }
    if (opcionBorrarCamionesNuevo === 2) {
      if (opcionBorrarCamiones === 0)
        $("body").off("pointerdown", ".borrarcamiones", borrarCamionesHandler);
      else if (opcionBorrarCamiones === 1) {
        $("body").off("click", ".borrarcamiones", borrarCamionesHandler);
      }
    }
  }

  opcionBorrarFilasYColumnas = opcionBorrarFilasYColumnasNuevo;
  opcionBorrarCamiones = opcionBorrarCamionesNuevo;
  opcionExportarPDF = opcionExportarPDFNuevo;
  opcionExportarExcel = opcionExportarExcelNuevo;
  switchReordenarCamiones = switchOrdenarCamionesNuevo;
  switchReordenarProductos = switchOrdenarProductosNuevo;
  switchOrdenarOrdenAlfabetico = switchOrdenarOrdenAlfabeticoNuevo;
}

function reseteaValoresConfig() {
  $('[name="borrarfilasycolumnas"]:checked')[0].checked = false;
  $(`[name="borrarfilasycolumnas"]`)[opcionBorrarFilasYColumnas].checked = true;
  $('[name="borrarcamiones"]:checked')[0].checked = false;
  $(`[name="borrarcamiones"]`)[opcionBorrarCamiones].checked = true;
  $('[name="exportarpdf"]:checked')[0].checked = false;
  $(`[name="exportarpdf"]`)[opcionExportarPDF].checked = true;
  $(`[name="exportarpdf"]`)[opcionExportarExcel].checked = true;
  $("#switchreordenarcamiones")[0].checked = switchReordenarCamiones;
  $("#switchreordenalfabetico")[0].checked = switchOrdenarOrdenAlfabetico;
}

const configs = document.getElementById("configs");
configs.addEventListener('hidden.bs.modal', reseteaValoresConfig)

//ordenar alfabeticamente ordenar por orden alfabetico
$("body").on("click", '.grupotabs th:not([colspan="2"]), #tablaresumen th', function () {
  if (switchOrdenarOrdenAlfabetico) {
    let tabla = this.closest("table");
    let esResumen = (tabla.id === "tablaresumen")
    if (!esResumen)
      $(".restaurarplantilla").css("display", "initial")
    let cuerpo = tabla.querySelector(".cuerpo");
    let flecha = window.getComputedStyle(this, ':after').content;
    let order = (flecha === '"↓"') ? "asc" : "desc";
    let separador = "-----";
    let objValores = {};
    let listaIdentifObjValores = [];
    let listaReordenarPlantillasHelper = []
    let indiceColumna = this.cellIndex;
    let nombreColumna = this.innerText;

    if (nombreColumna === "Vendidos")
      indiceColumna = cuerpo.rows[0].cells.length - 2;
    else if (nombreColumna === "Ingresos")
      indiceColumna = cuerpo.rows[0].cells.length - 1;
    else if (nombreColumna === "Sale" || nombreColumna === "Entra")
      indiceColumna += colsinicio;
    cuerpo.querySelectorAll("tr").forEach((fila, indice) => {
      listaReordenarPlantillasHelper.push(fila.cells[0].innerText.normalizar())
      let textoCelda = fila.cells[indiceColumna].innerText.toUpperCase()
      if (esResumen && nombreColumna !== "Productos")
        textoCelda = textoCelda.replace(/[^0-9.]/g, '')
      objValores[textoCelda + separador + indice] = fila.outerHTML.replace(/(\t)|(\n)/g, '');
      listaIdentifObjValores.push(textoCelda + separador + indice);
    })

    if (!esResumen) {
      if (!objReordenarPlantillas[tabla.closest(".tabs__content").dataset.tabid])
        objReordenarPlantillas[tabla.closest(".tabs__content").dataset.tabid] = listaReordenarPlantillasHelper;
    }

    let listaElementosColumna = [...cuerpo.querySelectorAll(`td:nth-child(${(indiceColumna + 1)})`)]
    let todosSonNumeros = listaElementosColumna.every(el => !isNaN(el.innerText.aFloat()))
    if (esResumen && nombreColumna !== "Productos")
      todosSonNumeros = true

    if (todosSonNumeros) {
      listaIdentifObjValores.sort(function (a, b) {
        let aa = a.split(separador)
        let bb = b.split(separador)
        if (aa[0] != bb[0])
          return aa[0] - bb[0]
        return cuerpo.rows[aa[1].aInt()].cells[0].innerText.localeCompare(cuerpo.rows[bb[1].aInt()].cells[0].innerText)
      });
    }
    else
      listaIdentifObjValores.sort();

    if (order === "desc") {
      listaIdentifObjValores.reverse();
      this.style.setProperty("--flecha", '"↓"')
    }
    else
      this.style.setProperty("--flecha", '"↑"')

    tabla.querySelector('.activo')?.classList.remove("activo");
    this.classList.add("activo")
    let html = "";
    listaIdentifObjValores.forEach(key => html += objValores[key]);
    cuerpo.innerHTML = html;
  }
});

const swalConfirmarYCancelar = Swal.mixin({
  customClass: {
    confirmButton: "btn btn-success margenbotonswal",
    cancelButton: "btn btn-danger margenbotonswal",
  },
  buttonsStyling: false,
});
const swalContinuar = Swal.mixin({
  customClass: {
    confirmButton: "btn btn-primary margenbotonswal btncontinuar",
  },
  buttonsStyling: false,
});
const swal3Botones = Swal.mixin({
  customClass: {
    confirmButton: "botonswal3 botonconfirm",
    denyButton: "botonswal3 botondeny",
    cancelButton: "botonswal3 botoncancel",
  },
  buttonsStyling: false,
});
const swal3BotonesInvertido = Swal.mixin({
  customClass: {
    confirmButton: "botonswal3 botondeny",
    denyButton: "botonswal3 botonconfirm",
    cancelButton: "botonswal3 botoncancel",
  },
  buttonsStyling: false,
});

$("body").on("click", ".tabs input", function (e) {
  $(".tabs__content").each((_, el) => el.style.display = "none");
  let contenido = document.querySelector(`.contenidotabs [data-tabid="${this.dataset.tabid}"]`)
  contenido.style.display = "initial"
})

$("body").on("keyup", "td", function (e) {
  let keycode = event.keyCode || event.which;
  if ((keycode >= 48 && keycode <= 57) || keycode === 229 || keycode === 8) {
    let cuerpo = this.closest(".cuerpo");
    [...cuerpo.rows].forEach(el => calcularvendidoseingresos(el))
    calcularvendidoseingresostotal(cuerpo)
  }
});

function calcularvendidoseingresos({ cells }) {
  let sumafila = 0
  let y = colsinicio
  let hayunnumero = false;
  for (; y < cells.length - colsfinal; y++) {
    let contenido = cells[y].innerText.aInt()
    if (!isNaN(contenido)) {
      hayunnumero = true;
      sumafila += (y % 2 === 0) ? contenido : -contenido
    }
  }
  cells[y].innerText = (sumafila === 0 && !hayunnumero) ? "" : sumafila
  y++
  let totalingresos = sumafila * cells[1].innerText.aFloat()
  cells[y].innerText = isNaN(totalingresos) || (sumafila === 0 && !hayunnumero) ? "" : totalingresos.normalizarPrecio()
}

function calcularvendidoseingresostotal(cuerpo) {
  let sumaVendidos = 0, sumaIngresos = 0, hayUnNumero = false;
  [...$(cuerpo).find("td:nth-last-child(2)")].forEach(el => {
    let texto = el.innerText.aFloat()
    if (!isNaN(texto)) {
      hayUnNumero = true;
      sumaVendidos += texto;
    }
  });

  [...$(cuerpo).find("td:nth-last-child(1)")].forEach(el => {
    let texto = el.innerText.aFloat()
    if (!isNaN(texto))
      sumaIngresos += texto;
  })

  if (!isNaN(sumaVendidos))
    $(cuerpo).parent().find("tfoot td")[1].innerText = (sumaVendidos === 0 && !hayUnNumero) ? "" : sumaVendidos

  if (!isNaN(sumaIngresos))
    $(cuerpo).parent().find("tfoot td")[2].innerText = (sumaIngresos === 0 && !hayUnNumero) ? "" : sumaIngresos.normalizarPrecio()
}

$("#añadirProducto").on("click", e => $(_cuerpo()).append(`<tr>${[...Array(_cantidadSaleYEntra() - 2)].map(_ => `<td contenteditable="true"></td>`).join("")}<td></td><td class="borrarfilas"></td></tr>`))

$("#añadirViaje").on("click", e => {
  $(_tabla().querySelector(".columnaVendidos")).before(`<th colspan="2" class="borrarcolumnas">Viaje No. ${_cantidadViajes() + 1}</th>`);
  $(_saleYEntra()).append(`<th>Sale</th><th>Entra</th>`);
  $(_pintarColumnas()).append(`<col span="2">`)
  let cantidadSaleYEntra = _cantidadSaleYEntra()
  _filas().forEach(x => {
    let indice = cantidadSaleYEntra - (colsinicio + colsfinal)
    x.insertCell(indice).setAttribute("contenteditable", true)
    x.insertCell(indice).setAttribute("contenteditable", true)
  })
  _pie().querySelector("td:first-child").setAttribute("colspan", (cantidadSaleYEntra - 2));
});

document.addEventListener("pointerup", e => {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
});
//TODO hacer que las fechas de ultima actualizacion digan... hace 3 dias ...hace 5 horas... ayer 


function borrarColumnasHandler(e) {
  borrarElementos(e, opcionBorrarFilasYColumnas, borrarColumnas, this);
}

function borrarFilasHandler(e) {
  borrarElementos(e, opcionBorrarFilasYColumnas, borrarFilas, this);
}

function borrarCamionesHandler(e) {
  borrarElementos(e, opcionBorrarCamiones, borrarCamiones, this);
}

function borrarElementos(e, opcion, metodo, elementoSeleccionado) {
  if (elementoSeleccionado.closest(".swal2-html-container"))
    return
  if (opcion === 0) {
    if (!timer) {
      timer = null;
      timer = setTimeout(metodo, touchduration, elementoSeleccionado, e);
    }
  }
  else if (opcion === 1) {
    if ((elementoSeleccionado.clientWidth - e.offsetX) <= 21 && e.offsetY <= 21)
      metodo(elementoSeleccionado, e)
  }
}

async function borrarFilas(celda) {
  let filaborrar = $(celda).parent()[0]
  let html = `<table class="mx-auto"><tbody style="background: #0f0d35;">${filaborrar.cloneNode(true).outerHTML}</tbody></table>`
  if (await swalSíNo("Estás seguro que deseas borrar este producto de la tabla?", html)) {
    let cuerpo = $(filaborrar).parent()[0]
    if (cuerpo.rows.length === 1)
      return Swal.fire("Error", "No puedes borrar todos los productos, debe haber al menos uno", "error")

    filaborrar.remove()
    calcularvendidoseingresostotal(cuerpo)
    Swal.fire("Se ha eliminado el producto", "Se ha eliminado el producto y su contenido exitosamente", "success")
  }
};

async function borrarColumnas(colborrar) {
  let tabla = $(colborrar).closest("table")[0]
  let celdaViajeABorrarSale = ($(colborrar).index() - colsinicio) * 2 + colsinicio;
  let cuerpo = $(tabla).find(".cuerpo");
  let filas = [...$(cuerpo).find("tr")];
  let html = `<table class="mx-auto"><thead><tr>
  ${colborrar.outerHTML}</tr><tr><th>Sale</th><th>Entra</th></tr></thead><tbody style="background: #0f0d35;">
  ${filas.map(fila => `<tr>${fila.cells[celdaViajeABorrarSale].outerHTML} ${fila.cells[celdaViajeABorrarSale + 1].outerHTML}</tr>`).join("")}
  </tbody></table>`
  if (await swalSíNo("Estás seguro que deseas borrar esta columna y todos sus contenidos?", html, 600)) {
    if (_cantidadViajes() === 1)
      return Swal.fire("Error", "No puedes borrar todos los viajes, debe haber al menos uno", "error");

    filas.forEach(fila => {
      fila.deleteCell(celdaViajeABorrarSale);
      fila.deleteCell(celdaViajeABorrarSale);
    });
    let celdatotal = $(tabla).find("tfoot td:first")[0];
    let colspan = celdatotal.getAttribute("colspan").aInt()
    celdatotal.setAttribute("colspan", colspan - 2);

    colborrar.remove()
    $(tabla).find(".saleYEntra>:last").remove()
    $(tabla).find(".saleYEntra>:last").remove()
    $(tabla).find(".pintarcolumnas>:last").remove()
    $(tabla).find(".borrarcolumnas").each((i, celdaViaje) => celdaViaje.textContent = "Viaje No. " + (i + 1))
    filas.forEach(fila => calcularvendidoseingresos(fila))
    calcularvendidoseingresostotal(cuerpo)
    Swal.fire("Se ha eliminado la columna", "Se ha eliminado la columna y todos sus contenidos exitosamente", "success");
  }

};

$("#diaanterior").on("click", () => window.location = `/registrarventas/${hoy.subtract("1", "day").format("D-M-YYYY")}`)
$("#diasiguiente").on("click", () => window.location = `/registrarventas/${hoy.add("1", "day").format("D-M-YYYY")}`)

function añadirceros(cuerpo) {
  cuerpo.querySelectorAll("td:not(:nth-child(1),:nth-child(2))").forEach(celda => {
    if (celda.innerText === "")
      celda.innerText = 0
  });
  calcularvendidoseingresostotal(cuerpo)
}

$("#guardar").on("click", async function () {
  if (!await borrarTablasVacias())
    return
  let listaCamioneros = document.querySelectorAll(".grupotabs .tabs__content input");
  for (let i = 0; i < listaCamioneros.length; i++) {
    if (!await validarCamioneros(listaCamioneros[i], i + 1))
      return
  }

  let listaTablas = devuelveListaTablas();
  let cantidadTablas = listaTablas.length;
  for (let i = 0; i < cantidadTablas; i++) {
    tablaValida = false;
    tablaParaValidacion = listaTablas[i];
    permitirFilasVacias = false;
    if (!await validarDatosTabla(listaTablas[i], i + 1))
      return;
  }

  let data = JSON.stringify({
    _id: hoy.valueOf(),
    usuario: "",
    ultimocambio: Date.now(),
    tablas: listaTablas.map(tabla => ({
      trabajador: $(tabla).closest(".tabs__content").find(".trabajador").val(),
      productos: [...$(tabla).find(".cuerpo tr")].map(fila => ({
        nombre: fila.cells[0].textContent,
        precio: fila.cells[1].innerText.aFloat(),
        viajes: [...Array($(tabla).find(".pintarcolumnas>*").length * 2)].map((_, j) => fila.cells[j + colsinicio].innerText.aInt()),
        vendidos: fila.querySelector("td:nth-last-child(2)").innerText.aInt(),
        ingresos: fila.querySelector("td:nth-last-child(1)").innerText.aFloat()
      })),
      totalvendidos: tabla.querySelector("tfoot tr").cells[1].innerText.aInt(),
      totalingresos: tabla.querySelector("tfoot tr").cells[2].innerText.aFloat()
    }))
  })
  console.log(data);

  $.ajax({
    url: "/registrarventas/guardar",
    method: "POST",
    contentType: "application/json",
    data,
    success: q => Swal.fire("Se ha guardado exitosamente", "El archivo se ha almacenado en la base de datos", "success"),
    error: q => Swal.fire("Ups...", "No se pudo guardar en la base de datos", "error")
  })
})

function formatearCeldas({ cells: [, prod, prec] }) {
  prod.innerText = prod.innerText.cantidadFormateada()
  prec.innerText = prec.innerText.aQuetzales()
}

$("#resumen").on("click", async () => {
  let listaTablas = devuelveListaTablas()
  let listaTablasValores = listaTablas.map(tabla => {
    let productos = [...tabla.querySelectorAll(".cuerpo td:first-child")]
    let vendidos = [...tabla.querySelectorAll(".cuerpo td:nth-last-child(2)")]
    let ingresos = [...tabla.querySelectorAll(".cuerpo td:nth-last-child(1)")]
    return productos.map((_, i) => ({ producto: productos[i].innerText.normalizar(), vendidos: vendidos[i].innerText.aInt() || 0, ingresos: ingresos[i].innerText.aFloat() || 0, productoDesnormalizado: productos[i].innerText }))
  })

  let result = listaTablasValores.reduce((acc, table) => {
    table.forEach(fila => {
      if (acc[fila.producto]) {
        acc[fila.producto].vendidos += fila.vendidos
        acc[fila.producto].ingresos += fila.ingresos
      } else
        acc[fila.producto] = { vendidos: fila.vendidos, ingresos: fila.ingresos, productoDesnormalizado: fila.productoDesnormalizado }
    })
    return acc
  }, {})

  Object.keys(result).forEach(x => result[x].ingresos = result[x].ingresos.normalizarPrecio())

  let html = `<table id="tablaresumen" class="mx-auto"><thead><tr>
    <th class="thresumenproducto">Productos</th>
    <th class="thresumenvendidoseingresos">Vendidos</th>
    <th class="thresumenvendidoseingresos">Ingresos</th>
  </tr></thead><tbody class="cuerpo">
  ${Object.keys(result).map(key => `<tr><td>${result[key].productoDesnormalizado}</td><td>${result[key].vendidos || 0}</td><td>${result[key].ingresos || 0}</td></tr>`).join("")}
  </tbody><tfoot><tr><td style="text-align: center">Total:</td>
  <td class="totalresumen"></td><td class="totalresumen"></td></tr></tfoot></table>
  <div class="contenedorflex">
    <button class="btn btn-primary margenbotonswal btncontinuar2" onclick="cancelarSwal()">Continuar</button>
    <button is="boton-pdf" id="exportarAPDFResumen"></button>
    <button is="boton-excel" id="exportarAExcelResumen"></button>
  </div>`

  await swal.fire({
    title: "Resumen de todo lo que vendiste durante el día",
    width: window.innerWidth * 0.6,
    html,
    showConfirmButton: false,
    didOpen: () => {
      let cuerpo = $("#tablaresumen tbody")[0]
      calcularvendidoseingresostotal(cuerpo);
      [...cuerpo.rows].forEach(fila => formatearCeldas(fila))
      formatearCeldas($("#tablaresumen tfoot tr")[0])

      $("#exportarAPDFResumen")[0].inicializar(() => {
        let tabla = $("#tablaresumen")[0];
        let tablaClon = tabla.cloneNode(true);
        tablaClon.id = "tablaresumenclon";
        return `<div class="tituloresumen" style="margin-left: ${tabla.clientWidth / 2 - 150}px">Resumen	&nbsp;del día ${fechastr}</div>${tablaClon.outerHTML}<br><br>`;
      }, `Resumen de ventas ${fechastr}`)

      $("#exportarAExcelResumen")[0].inicializar(function () {
        let nombre = `Resumen de ventas ${fechastr}.xlsx`
        let workbook = XLSX.utils.book_new()
        let ws = XLSX.utils.table_to_sheet($("#tablaresumen")[0], { raw: true })
        let range = XLSX.utils.decode_range(ws["!ref"])
        ws['!cols'] = [{ width: 20 }]
        ws['!rows'] = [{ hpt: 35 }, ...[...Array(range.e.r - range.s.r)].map(x => ({ hpt: 24 }))]
        for (let i = range.s.r; i <= range.e.r; i++) {
          for (let j = range.s.c; j <= range.e.c; j++) {
            let cell_address = XLSX.utils.encode_cell({ r: i, c: j });
            let cell = ws[cell_address];
            if (cell) {
              this.ajustesCeldasExcel(cell)
              cell.s.fill = { fgColor: { rgb: i === 0 ? "192435" : "0f0d35" } }
            }
          }
        }
        XLSX.utils.book_append_sheet(workbook, ws, `Resumen	del día ${fechastr}`);
        XLSX.writeFile(workbook, nombre);
      })
    }
  })
})

//TODO este no se si ponerlo
// function exportarExcel(){
// doc.output("dataurlnewwindow", {
//   filename: "archivohtml2pdf.pdf"
// })
// let nombre = `registro ventas ${fechastr} ${document.querySelector(".grupotabs .tabs__radio:checked + label").innerText}.pdf`;
// if (desdeElMobil()) {
//   var blob = doc.output("blob", {
//     filename: nombre
//   });
//   window.open(URL.createObjectURL(blob));
// }
// else
//   doc.save(nombre);
// }

async function borrarFilasVacias(tabla, numtabla) {
  let tablaCopia = tabla.cloneNode(true)
  let filasCopia = [...$(tablaCopia).find(".cuerpo tr")]
  debugger
  let filasQueNoEstanVacias = filasCopia.filter(fila => {
    let celdasEspecificas = [...fila.cells].slice(colsinicio, -colsfinal)
    let res = celdasEspecificas.every(celda => celda.innerText === "0" || celda.innerText === "")
    if (res)
      $(fila).children().each((_, celda) => celda.classList.add("enfocar"))
    return !res
  })
  if (filasQueNoEstanVacias.length === filasCopia.length) {
    clonaValores(tabla, tablaCopia)
    return true
  }

  let tablaCopiaSinFilasVacias = tabla.cloneNode(true);
  let tablaSinFilasVacias = filasQueNoEstanVacias.map(el => el.outerHTML).join("");
  $(tablaCopiaSinFilasVacias).find(".cuerpo").html(tablaSinFilasVacias);
  let botones = `<div class="contenedorbotonesEnFila">
    <button class="botonswal3 botonconfirm" onclick="borrarFilasVaciasB()">Borrar las filas vacías</button>
    <button class="botonswal3 botondeny" onclick="conservarFilasVaciasB()">Conservar las filas vacías</button>
    <button class="botonswal3 botonconfirm" onclick="validarDatosB()">Ya lo arreglé</button>
    <button class="botonswal3 botoncancel" onclick="cancelarB()">Volver</button>
  </div>`

  await swal3Botones.fire({
    title: "Se han detectado filas vacias",
    icon: "warning",
    width: window.innerWidth * 3 / 4,
    html: `<div class="textovista">Se han detectado filas vacias en la tabla ${numtabla}, qué desea hacer?</div>
    ${tabsTexto(tablaCopia, tablaCopiaSinFilasVacias, "Ver filas vacías")}${botones}`,
    showCancelButton: false,
    showConfirmButton: false,
    showDenyButton: false,
  })

  if (opcionSwal === "borrarFilasVacias") {
    if (filasQueNoEstanVacias.length === 0) {
      Swal.fire("Error", `No se puede guardar la tabla ${numtabla} porque está vacía`, "error");
      return false;
    }
    let filasVacias = [...tablaCopia.querySelector(".cuerpo").rows].filter(fila => {
      let celdasEspecificas = [...fila.cells].slice(colsinicio, -colsfinal)
      let res = celdasEspecificas.every(celda => celda.innerText === "0" || celda.innerText === "");
      if (res)
        $(fila).children().each((_, celda) => celda.classList.add("enfocar"))
      return res;
    });
    filasVacias.forEach(fila => $(fila).remove());
    clonaValores(tabla, tablaCopia);
    return true;
  }
  else if (opcionSwal === "conservarFilasVacias") {
    permitirFilasVacias = true;
    return true;
  }
  else if (opcionSwal === "validarDatos") {
    let tablaCopia = swal3Botones.getHtmlContainer().querySelector("table")
    borrarEnfocarFilas(tablaCopia)
    return await validarDatosTabla(tablaCopia, numtabla)
  }
  return false;
}

async function entraMasDeLoQueSale(tabla, numtabla) {
  let tablaCopia = tabla.cloneNode(true);
  let cuerpocopia = $(tablaCopia).find(".cuerpo")[0];

  let verificacion = true;
  for (let i = 0; i < cuerpocopia.rows.length; i++) {
    for (let j = colsinicio; j < cuerpocopia.rows[i].cells.length - colsfinal; j += 2) {
      let entra = cuerpocopia.rows[i].cells[j];
      let sale = cuerpocopia.rows[i].cells[j + 1];
      if (sale.innerText.aInt() > entra.innerText.aInt()) {
        entra.classList.add("enfocar")
        sale.classList.add("enfocar")
        verificacion = false
      }
      else {
        entra.classList.remove("enfocar")
        sale.classList.remove("enfocar")
      }
    }
  }

  if (verificacion) {
    clonaValores(tabla, tablaCopia);
    tablaValida = true;
    return true;
  }

  let result = await swalConfirmarYCancelar.fire({
    title: `<h3>Se ha detectado filas en la tabla ${numtabla} donde lo que sale es mayor que lo que entra, por favor corrígelos para poder guardar los datos</h3>`,
    icon: "error",
    width: window.innerWidth * 3 / 4,
    html: tablaCopia,
    showCancelButton: true,
    stopKeydownPropagation: false,
    confirmButtonText: "Ya lo arreglé",
    cancelButtonText: "Volver",
  })

  if (result.isConfirmed) {
    borrarEnfocarFilas(tablaCopia)
    return await validarDatosTabla(tablaCopia, numtabla);
  }
  else
    return false;
}

async function validarQueTablaNoTengaMismoNombre(tabla, numtabla) {
  let tablaCopia = tabla.cloneNode(true);
  let productosCopia = [...$(tablaCopia).find(".cuerpo tr td:nth-child(1)")];
  let arrayNormalizado = productosCopia.map(el => el.textContent.normalizar());
  let hayRepetidos = false;
  arrayNormalizado.forEach((item, index) => {
    if (arrayNormalizado.indexOf(item) !== index) {
      let color = colorAleatorio();
      productosCopia.forEach(el => {
        if (el.textContent === item)
          el.style.background = color;
      })
      hayRepetidos = true;
    }
  });
  if (!hayRepetidos) {
    clonaValores(tabla, tablaCopia);
    return true;
  }
  let result = await swalConfirmarYCancelar.fire({
    title: `Error, hay productos que tienen el mismo nombre en la tabla ${numtabla}`,
    icon: "error",
    width: window.innerWidth * 3 / 4,
    html: tablaCopia,
    showCancelButton: true,
    stopKeydownPropagation: false,
    confirmButtonText: "Ya lo arreglé",
    cancelButtonText: "Volver",
  })
  if (result.isConfirmed) {
    $(tablaCopia).find(".cuerpo tr td:nth-child(1)").each((_, el) => el.style.background = "#0f0d35");
    return await validarDatosTabla(tablaCopia, numtabla);
  }
  return false;
}

function colorAleatorio() {
  const threshold = 128;
  const color = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
  const rgb = color.match(/\d+/g).map(Number);
  const brightness = (0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]);
  if (brightness > threshold) {
    return colorAleatorio();
  }
  return color;
}

async function validarQueLosPreciosNoTenganPuntoAlFinal(tabla, numtabla) {
  let tablaCopia = tabla.cloneNode(true);
  let hayTerminaConPunto = false;
  $(tablaCopia).find(".cuerpo tr td:nth-child(2)").each((_, el) => {
    if (el.innerText.endsWith(".")) {
      el.classList.add("enfocar");
      hayTerminaConPunto = true;
    }
  });

  if (!hayTerminaConPunto) {
    clonaValores(tabla, tablaCopia);
    return true;
  }

  let result = await swal3BotonesInvertido.fire({
    title: `Hay valores que terminan en . en la tabla ${numtabla}, te faltó escribir un número? Qué deseas hacer?`,
    icon: "error",
    width: window.innerWidth * 3 / 4,
    html: tablaCopia,
    showCancelButton: true,
    showDenyButton: true,
    stopKeydownPropagation: false,
    confirmButtonText: "Borrar los puntos al final",
    denyButtonText: `Ya lo arreglé`,
    cancelButtonText: "Volver",
  });
  if (result.isConfirmed) {
    $(tabla).find(".cuerpo tr td:nth-child(2)").each((_, el) => {
      let precio = el.innerText;
      if (precio.endsWith("."))
        el.textContent = precio.replace(".", "")
    });
    clonaValores(tabla, tablaCopia);
    return true;
  }
  else if (result.isDenied) {
    borrarEnfocarPreciosYProductos(tablaCopia);
    return await validarDatosTabla(tablaCopia, numtabla);
  }
  return false;
}

async function validarQueLosPreciosNoSeanMenorAUno(tabla, numtabla) {
  let tablaCopia = tabla.cloneNode(true);
  let hayEmpiezaConPunto = false;
  $(tablaCopia).find(".cuerpo tr td:nth-child(2)").each((_, el) => {
    if (el.innerText.startsWith("0.")) {
      el.classList.add("enfocar");
      hayEmpiezaConPunto = true;
    }
  });

  if (!hayEmpiezaConPunto) {
    clonaValores(tabla, tablaCopia);
    return true;
  }

  let html = tablaCopia.outerHTML + `<div class="contenedorbotonesEnFila">
    <button class="botonswal3 botonconfirm" onclick="continuarSwalB()">Sí estoy seguro, &nbsp;&nbsp; continuar</button>
    <button class="botonswal3 botondeny" onclick="removerCeroPuntoB()">Remueve los 0. al principio y continuar</button>
    <button class="botonswal3 botonconfirm" onclick="validarDatosB()">Ya lo arreglé</button>
    <button class="botonswal3 botoncancel" onclick="cancelarB()">No continuar</button>
  </div>`;
  await swal3Botones.fire({
    title: `Hay valores menores a 1, en la tabla ${numtabla} estás seguro que no es un error? Deseas continuar?`,
    icon: "error",
    width: window.innerWidth * 3 / 4,
    html,
    stopKeydownPropagation: false,
    showCancelButton: false,
    showDenyButton: false,
    showConfirmButton: false,
  });
  if (opcionSwal === "removerCeroPunto") {
    $(tabla).find(".cuerpo tr td:nth-child(2)").each((_, el) => {
      let precio = el.innerText;
      if (precio.startsWith("0."))
        el.textContent = precio.replace("0.", "");
    });
    return true;
  }
  else if (opcionSwal === "validarDatos") {
    let tablaCopia = swal3Botones.getHtmlContainer().querySelector("table");
    borrarEnfocarPreciosYProductos(tablaCopia);
    return await validarDatosTabla(tablaCopia, numtabla);
  }
  else if (opcionSwal === "continuar")
    return true;
  return false;
}

function borrarFilasVaciasB() {
  opcionSwal = "borrarFilasVacias";
  Swal.close();
}

function conservarFilasVaciasB() {
  opcionSwal = "conservarFilasVacias";
  Swal.close();
}

function continuarSwalB() {
  opcionSwal = "continuar";
  Swal.close();
}

function removerCeroPuntoB() {
  opcionSwal = "removerCeroPunto";
  Swal.close();
}

function validarDatosB() {
  opcionSwal = "validarDatos";
  Swal.close();
}

function cancelarB() {
  opcionSwal = "cancelar";
  Swal.close();
}

function borrarEnfocarPreciosYProductos(tabla) {
  $(tabla).find(".cuerpo tr").each((_, el) => {
    el.cells[0].classList.remove("enfocar")
    el.cells[1].classList.remove("enfocar")
  })
}

async function validarProductosYPrecios(tabla, numtabla) {
  $(tabla).find(".cuerpo tr").each((_, { cells: [producto, precio] }) => {
    let prec = precio.innerText;
    producto.textContent = producto.innerText.trim()
    if (prec === ".")
      precio.textContent = ""
    else {
      if (!prec.endsWith(".")) {
        let precioNormalizado = prec.normalizarPrecio()
        if (!isNaN(precioNormalizado))
          precio.textContent = precioNormalizado
      }
    }
  });

  let tablaCopia = tabla.cloneNode(true);
  let filasCopia = [...$(tablaCopia).find(".cuerpo tr")];
  let verificacionProductos = true;
  let verificacionPrecios = true;

  filasCopia.forEach(({ cells: [producto, precio] }) => {
    if (producto.textContent === "") {
      producto.classList.add("enfocar");
      verificacionProductos = false;
    }
    if (precio.innerHTML === "" || precio.innerHTML === "0") {
      precio.classList.add("enfocar");
      verificacionPrecios = false;
    }
  })
  if (verificacionProductos && verificacionPrecios) {
    clonaValores(tabla, tablaCopia)
    return true
  }

  let titulo = "<h3>Se ha detectado valores vacíos en la columna ";
  if (!verificacionProductos && !verificacionPrecios)
    titulo += "productos y la columna precios"
  else if (!verificacionProductos)
    titulo += "productos"
  else
    titulo += "precios"

  titulo += ` de la tabla ${numtabla}
  <br>
  Por favor corrígelos para poder guardar los datos</h3>`
  let result = await swalConfirmarYCancelar.fire({
    title: titulo,
    icon: "error",
    width: window.innerWidth * 3 / 4,
    html: tablaCopia,
    showCancelButton: true,
    stopKeydownPropagation: false,
    confirmButtonText: "Ya lo arreglé",
    cancelButtonText: "Volver",
  })
  if (result.isConfirmed) {
    borrarEnfocarPreciosYProductos(tablaCopia);
    return await validarDatosTabla(tablaCopia, numtabla);
  }
  else
    return false;
}

async function borrarTablasVacias() {
  let tablas = [...$(".contenidotabs table")];
  let tablasVacias = tablas.filter(tabla => tabla.querySelector("tfoot td:nth-child(3)").innerText === "");

  if (tablasVacias.length === 0)
    return true

  let html = `${tablasVacias.length === 1 ? '<div class="textovista">Se ha detectado que esta tabla está vacía así que será eliminada</div>' : '<div class="textovista">Se han detectado las siguientes tablas vacias las cuales serán eliminadas</div>'}
  <div class="tabs-swal">
  ${tablasVacias.map((tabla, i) => `<input type="radio" class="tabs__radio" name="tabs-swal" id="tabswal${i}" checked />
    <label for="tabswal${i}" class="tabs__label label-swal">Camión ${tabla.closest(".tabs__content").dataset.tabid.aInt() + 1}</label>
    <div class="tabs__content">${tabla.cloneNode(true).outerHTML}</div>`).join("")}
  </div><br><div class="textovista">Desea continuar?</div>`

  if (await swalContinuarNoContinuar("Se han detectado tablas vacias", html)) {
    if (await soloHayUnCamion())
      return false

    tablasVacias.forEach(tabla => {
      let tabs__content = $(tabla).closest(".tabs__content")
      let id = tabs__content[0].dataset.tabid
      $(tabs__content).remove()
      $(`.tab:has([data-tabid=${id}])`).remove()
    })

    reacomodarCamiones()
    Swal.fire("Se han eliminado las tablas vacías", "Se han eliminado las tablas vacías exitosamente", "success")
    return true
  }
  return false
}

async function swalContinuarNoContinuar(title, html) {
  let { isConfirmed } = await swalConfirmarYCancelar.fire({
    title, icon: "warning", width: window.innerWidth * 3 / 4, html,
    showCancelButton: true,
    confirmButtonText: "Continuar",
    cancelButtonText: "No continuar",
  })
  return isConfirmed
}
async function swalSíNo(title, html, width = window.innerWidth * 3 / 4) {
  let { isConfirmed } = await swalConfirmarYCancelar.fire({
    title, icon: "warning", width, html,
    showCancelButton: true,
    confirmButtonText: "Sí",
    cancelButtonText: "No",
  })
  return isConfirmed
}

async function borrarCamiones(label, e) {
  let id = label.previousElementSibling.dataset.tabid;
  let tabla = document.querySelector(`.grupotabs .tabs__content[data-tabid="${id}"] table`)
  let html = `<div class="tabs-swal">
  <input type="radio" class="tabs__radio" name="tabs-swal" id="tabswal0" checked />
  <label for="tabswal0" class="tabs__label label-swal">Camión ${(id.aInt() + 1)}</label>
    <div class="tabs__content" style="display:initial !important;">${tabla.cloneNode(true).outerHTML}
  </div></div><br><div class="textovista">Deseas continuar?</div>`
  e.preventDefault()
  e.stopPropagation()

  if (await swalContinuarNoContinuar("Estás seguro que deseas eliminar este camión?", html)) {
    if (await soloHayUnCamion())
      return false;
    delete objReordenarPlantillas[id]
    $(label).parent().remove()
    $(`.grupotabs .tabs__content[data-tabid=${id}]`).remove()
    reacomodarCamiones()
    Swal.fire("Se ha eliminado el camión", "Se ha eliminado el camión exitosamente", "success")
    return true
  }
  return false
}

async function soloHayUnCamion() {
  if ($(".grupotabs table").length === 1) {
    await Swal.fire("Error", "No se puede borrar, debe haber al menos un camión", "error")
    return true
  }
  return false
}

function reacomodarCamiones() {
  let listaContenido = [...$(".grupotabs .tab")].map(el => $(`.grupotabs .tabs__content[data-tabid="${$(el).find("input")[0].dataset.tabid}"]`)[0])

  $(".grupotabs .tab").each((i, tab) => {
    listaContenido[i].dataset.tabid = i
    let checkbox = tab.querySelector("input")
    let idNuevo = `tab${i}`
    checkbox.dataset.tabid = i
    checkbox.id = idNuevo
    let label = tab.querySelector("label")
    label.setAttribute("for", idNuevo)
    label.innerText = `Camión ${(i + 1)}`
  })
  if ($(".grupotabs .tab .tabs__radio:checked").length === 0)
    $(".grupotabs .tab:first-child .tabs__label")[0].click()
}

async function validarCamioneros(textbox, numerotabla) {
  textbox.value = textbox.value.trim()
  if (textbox.value !== "")
    return true
  let html = `<h3>El nombre del conductor del camión ${numerotabla} está vacío. <br> Escribe o elige un nombre para continuar </h3> <br>
<div class="divtrabajadorrevisar">
<input type="text" class="form-control trabajador" style="height: 35px; min-width: 228px" id="trabajadorrevisar" style="width: 260px; max-width: 260px; text-align:center;" placeholder="Escribe el nombre del conductor" />
<div class="btn-group dropend">
  <button type="button" class="btn btn-sm btn-secondary dropdown-toggle dropdown-toggle-split" id="dropdowncamionero" data-bs-toggle="dropdown"></button>
  <ul class="dropdown-menu dropdown-menu-dark">
    ${devuelveCamioneros()}
  </ul>
</div></div>`
  let result = await swalConfirmarYCancelar.fire({
    icon: "warning",
    width: window.innerWidth * 3 / 4,
    html,
    showCancelButton: true,
    confirmButtonText: "Continuar",
    cancelButtonText: "Volver"
  })
  if (result.isConfirmed) {
    textbox.value = $("#trabajadorrevisar").val().trim();
    if (textbox.value !== "")
      return true;
    return validarCamioneros(textbox, numerotabla);
  } else
    return false;
}

async function validarDatosTabla(tabla, numtabla) {
  if (!permitirFilasVacias && !await borrarFilasVacias(tabla, numtabla)) {
    return false;
  }
  if (tablaValida)
    return true;
  añadirceros(tabla.querySelector(".cuerpo"));
  const validationFunctions = [
    validarProductosYPrecios,
    validarQueTablaNoTengaMismoNombre,
    validarQueLosPreciosNoTenganPuntoAlFinal,
    validarQueLosPreciosNoSeanMenorAUno,
    entraMasDeLoQueSale
  ];

  for (const validationFunction of validationFunctions) {
    if (!await validationFunction(tabla, numtabla))
      return false;
    if (tablaValida)
      return true;
  }
}

function clonaValores(tabla, tablaCopia) {
  tabla.innerHTML = tablaCopia.innerHTML;
  tablaParaValidacion.innerHTML = tablaCopia.innerHTML;
}

$("#exportarexcel")[0].inicializar(function () {
  let nombre = `registro ventas ${fechastr} ${document.querySelector(".grupotabs .tabs__radio:checked + label").innerText}.xlsx`;
  let workbook = XLSX.utils.book_new();
  let listaTablas = opcionExportarExcel === 0 ? [_tabla()] : devuelveListaTablas()

  listaTablas.forEach((tabla, indice) => {
    let ws = XLSX.utils.table_to_sheet(tabla, { raw: true });
    let range = XLSX.utils.decode_range(ws["!ref"]);
    ws['!cols'] = [{ width: 20 }];
    ws['!rows'] = [...Array(range.e.r - range.s.r + 1)].map(w => ({ hpt: 24 }))

    for (let i = range.s.r; i <= range.e.r; i++) {
      for (let j = range.s.c; j <= range.e.c; j++) {
        let cell_address = XLSX.utils.encode_cell({ r: i, c: j });
        let cell = ws[cell_address];
        if (cell) {
          this.ajustesCeldasExcel(cell)
          cell.s.fill = { fgColor: { rgb: (i === 0 || i === 1) ? "192435" : (j === 0 || j === 1 || j === range.e.c - 1 || j === range.e.c || i === range.e.r) ? "0f0d35" : (j % 4 === 2 || j % 4 === 3) ? "024649" : "192435" } }
          if (i === range.e.r && j === 0) cell.s.alignment.horizontal = "right"
        }
      }
    }
    let celdaVacia = { t: 's', v: '' }
    let bordeCelda = { border: { right: { style: "thin", color: { rgb: '000000' } } } }
    ws['A2'] = celdaVacia
    ws['A2'].s = bordeCelda
    let vend = XLSX.utils.encode_cell({ r: 1, c: range.e.c - 1 })
    ws[vend] = celdaVacia
    ws[vend].s = bordeCelda
    XLSX.utils.book_append_sheet(workbook, ws, `Camión ${(opcionExportarExcel === 0) ? (tabla.closest(".tabs__content").dataset.tabid.aInt() + 1) : (indice + 1)}`)
  })
  XLSX.writeFile(workbook, nombre)
})

$("#exportarpdf")[0].inicializar(() => {
  let listaTablas = [];
  if (opcionExportarPDF === 0)
    listaTablas.push(_tabla());
  else
    listaTablas = devuelveListaTablas();
  let html = ``;
  listaTablas.forEach((tabla, indice) => {
    let copiaTabla = tabla.cloneNode(true);
    let medirTabla = copiaTabla.cloneNode(true);
    $(document.body).append(medirTabla)
    $(medirTabla).css({ position: "absolute", visibility: "hidden", display: "table" });
    html += `<div class="titulopdf" style="margin-left: ${(medirTabla.clientWidth / 2 - 55)}px">Camión ${(opcionExportarPDF === 0) ? (tabla.closest(".tabs__content").dataset.tabid.aInt() + 1) : (indice + 1)}</div>`;
    $(medirTabla).remove()
    copiaTabla.querySelector(".pintarcolumnas").innerHTML = "";

    html += `${copiaTabla.outerHTML}<br><br>`
  });
  return html;
}, `registro ventas ${fechastr} ${document.querySelector(".grupotabs .tabs__radio:checked + label").innerText}`)

async function pidePlantilla(nombre) {
  if (!listaplantillas[nombre]) {
    await $.ajax({
      url: `/plantillas/devuelveplantilla/${nombre}`,
      method: "POST",
      contentType: "application/json",
      success: p => listaplantillas[nombre] = p,
      error: q => Swal.fire("Ups...", "Ha habido un error", "error")
    })
  }
  return listaplantillas[nombre]
}

async function metododropdown(option) {
  let p = await pidePlantilla(option.textContent)
  if (!p) return
  plantillaSeleccionada = p
  let html = `<table style="margin: 0 auto;">
  <thead><tr><th class="prod">Productos</th><th class="tr">Precio</th></tr></thead>
  <tbody>${p.map(x => `<tr><td>${x.producto}</td><td>${x.precio.normalizarPrecio()}</td></tr>`).join("")}</tbody>
  </table>`
  if (await swalSíNo("Estás seguro que deseas utilizar esta plantilla?", html, null))
    await opcionesPlantilla()
}

async function opcionesPlantilla() {
  let html = `<div class="contenedorbotones">
      <button class="botonswal4 botonconfirm" onclick="crearPlantillaVacia()">Crear plantilla vacía</button>
      <button class="botonswal4 botondeny" onclick="mezclarEliminandoHandler()">Mezclar y eliminar los productos que no estén en ambas plantillas</button>
      <button class="botonswal4 cuartaopcion" onclick="mezclarSinEliminarHandler()">Mezclar ambas plantillas sin eliminar productos</button>
      <button class="botonswal4 botoncancel" onclick="cancelarSwal()">Cancelar</button>
    </div>`
  await swal.fire({
    width: window.innerWidth / 2,
    focusConfirm: false,
    icon: "question",
    title: 'Qué deseas hacer con esta plantilla?',
    showConfirmButton: false,
    html
  })
}

async function crearPlantillaVacia() {
  let formatotablavacia = creaTablaVacia(plantillaSeleccionada)
  if (await swalSíNo("Estás seguro que deseas utilizar esta plantilla?", formatotablavacia, 850)) {
    _tabla().outerHTML = formatotablavacia
    borrarListaOrdenarPlantillasTablaActual()
    tablasSortable()
  }
  Swal.close()
}

async function mezclarEliminandoHandler() {
  await mezclarHandler(mezclarEliminandoOrdenTabla, mezclarEliminandoOrdenPlantilla);
}
async function mezclarSinEliminarHandler() {
  await mezclarHandler(mezclarSinEliminarOrdenTabla, mezclarSinEliminarOrdenPlantilla);
}

async function mezclarHandler(callbackConfirmado, callbackDenegado) {
  let result = await swal3Botones.fire({
    title: "Qué orden desea utilizar?",
    icon: "question",
    width: window.innerWidth / 2,
    showCancelButton: true,
    showDenyButton: true,
    confirmButtonText: "Usar orden de la tabla",
    denyButtonText: `Usar orden de la plantilla seleccionada`,
    cancelButtonText: "Volver",
  });
  if (result.isConfirmed)
    await ordenPlantillaHandler(callbackConfirmado, callbackConfirmado, callbackDenegado);
  else if (result.isDenied)
    await ordenPlantillaHandler(callbackDenegado, callbackConfirmado, callbackDenegado);
  else if (result.dismiss === Swal.DismissReason.cancel)
    opcionesPlantilla();
}

async function ordenPlantillaHandler(callback, callbackConfirmado, callbackDenegado) {
  let productos = plantillaSeleccionada.productos;
  let formatoTablaLlena = callback(productos);
  let tabla = _tabla();
  let tablaCopia = tabla.cloneNode(true);
  let cuerpoCopia = tablaCopia.querySelector(".cuerpo");
  cuerpoCopia.innerHTML = formatoTablaLlena;
  calcularvendidoseingresostotal(cuerpoCopia)

  let result = await swalConfirmarYCancelar.fire({
    title: "Aquí puedes ver las diferencias entre la tabla original y el resultado final",
    icon: "warning",
    width: window.innerWidth * 3 / 4,
    html: tabsTexto(tabla, tablaCopia, "Ver tabla original") + `<br><br><h2>Deseas conservar los cambios?</h2>`,
    showCancelButton: true,
    confirmButtonText: "Conservar",
    cancelButtonText: "Volver",
  })
  if (result.isConfirmed)
    tabla.outerHTML = tablaCopia.outerHTML;
  else if (result.dismiss === Swal.DismissReason.cancel)
    mezclarHandler(callbackConfirmado, callbackDenegado);
  borrarListaOrdenarPlantillasTablaActual();
  tablasSortable();
}

function tabsTexto(tablaOriginal, tablaNueva, texto) {
  return `<div class="tabs-swal">
  <input type="radio" class="tabs__radio" name="tabs-swal" id="tabswal0" checked>
  <label for="tabswal0" class="tabs__label label-swal">${texto}</label>
  <div class="tabs__content">${tablaOriginal.outerHTML}</div>

  <input type="radio" class="tabs__radio" name="tabs-swal" id="tabswal1">
  <label for="tabswal1" class="tabs__label label-swal">Vista previa del resultado</label>
  <div class="tabs__content">${tablaNueva.outerHTML}</div>
</div>`
}

//TODO optimizar estos que dicen mezclar
function mezclarSinEliminarOrdenTabla(productos) {
  let filas = _filas()
  let formatoTablaLlena = "";
  let pTabla = filas.map(el => el.cells[0].innerText.normalizar());
  let pSeleccionada = productos.map(el => el.producto.normalizar());

  pTabla.forEach((el, i) => {
    let indice = pSeleccionada.findIndex(el2 => el2 === el);
    if (indice >= 0) {
      let filaCopia = filas[i].cloneNode(true);
      filaCopia.cells[0].textContent = productos[indice].producto;
      filaCopia.cells[1].textContent = productos[indice].precio.normalizarPrecio();
      calcularvendidoseingresos(filaCopia);
      formatoTablaLlena += filaCopia.outerHTML;
    }
    else
      formatoTablaLlena += filas[i].outerHTML;
  });

  pSeleccionada.forEach((el, i) => {
    if (!pTabla.includes(el))
      formatoTablaLlena += devuelveProductoVacio(productos[i]);
  });
  return formatoTablaLlena;
}

function mezclarSinEliminarOrdenPlantilla(productos) {
  let filas = _filas()
  let formatoTablaLlena = "";
  let pTabla = filas.map(el => el.cells[0].innerText.normalizar());
  let pSeleccionada = productos.map(el => el.producto.normalizar());

  pSeleccionada.forEach((el, i) => {
    let j = pTabla.findIndex(el2 => el2 === el);
    if (j >= 0) {
      let filaCopia = filas[j].cloneNode(true);
      filaCopia.cells[0].textContent = productos[i].producto;
      filaCopia.cells[1].textContent = productos[i].precio.normalizarPrecio();
      calcularvendidoseingresos(filaCopia);
      formatoTablaLlena += filaCopia.outerHTML;
    }
    else
      formatoTablaLlena += devuelveProductoVacio(productos[i]);
  });

  pTabla.forEach((el, i) => {
    if (!pSeleccionada.includes(el))
      formatoTablaLlena += filas[i].outerHTML;
  });

  return formatoTablaLlena;
}

function mezclarEliminandoOrdenTabla(productos) {
  let filas = _filas()
  let formatoTablaLlena = "";
  let pTabla = filas.map(el => el.cells[0].innerText.normalizar());
  let pSeleccionada = productos.map(el => el.producto.normalizar());

  pTabla.forEach((el, i) => {
    let j = pSeleccionada.findIndex(el2 => el2 === el);
    if (j >= 0) {
      let filaCopia = filas[i].cloneNode(true);
      filaCopia.cells[0].textContent = productos[j].producto;
      filaCopia.cells[1].textContent = productos[j].precio.normalizarPrecio();
      calcularvendidoseingresos(filaCopia);
      formatoTablaLlena += filaCopia.outerHTML;
    }
  });

  pSeleccionada.forEach((el, i) => {
    if (!pTabla.includes(el))
      formatoTablaLlena += devuelveProductoVacio(productos[i]);
  });

  return formatoTablaLlena;
}

function mezclarEliminandoOrdenPlantilla(productos) {
  let filas = _filas()
  let formatoTablaLlena = "";
  let pTabla = filas.map(el => el.cells[0].innerText.normalizar());
  let pSeleccionada = productos.map(el => el.producto.normalizar());

  pSeleccionada.forEach((el, i) => {
    let j = pTabla.findIndex(el2 => el2 === el);
    if (j >= 0) {
      let filaCopia = filas[j].cloneNode(true);
      filaCopia.cells[0].textContent = productos[i].producto;
      filaCopia.cells[1].textContent = productos[i].precio.normalizarPrecio();
      calcularvendidoseingresos(filaCopia);
      formatoTablaLlena += filaCopia.outerHTML;
    }
    else
      formatoTablaLlena += devuelveProductoVacio(productos[i]);
  });

  return formatoTablaLlena;
}
String.prototype.aFloat = function () { return parseFloat(this) }
String.prototype.aInt = function () { return parseInt(this) }
String.prototype.normalizar = function () { return this.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, "") }
String.prototype.normalizarPrecio = function () { return this.aFloat().toFixed(2).replace(/[.,]00$/, "") }
Number.prototype.normalizarPrecio = function () { return this.toFixed(2).replace(/[.,]00$/, "") }

String.prototype.aQuetzales = function () { return new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'GTQ' }).format(this.aFloat()) }
String.prototype.cantidadFormateada = function () { return new Intl.NumberFormat('es-GT').format(this.aFloat()) }

function cancelarSwal() {
  Swal.close();
}

function creaTablaVacia(plantilla) {
  return `<table>
  <thead>
    <col><col><colgroup class="pintarcolumnas"><col span="2"></colgroup><col><col>
    <tr>
      <th rowspan="2" class="prod">Productos</th><th rowspan="2" class="tr">Precio</th>
      <th colspan="2" class="borrarcolumnas">Viaje No. 1</th>
      <th rowspan="2" class="tr columnaVendidos">Vendidos</th><th rowspan="2" class="tr">Ingresos</th>
    </tr>
    <tr class="saleYEntra"><th>Sale</th><th>Entra</th></tr>
  </thead>
  <tbody class="cuerpo">
  ${plantilla.map(x => `<tr><td contenteditable="true">${x.producto}</td><td contenteditable="true">${x.precio.normalizarPrecio()}</td><td contenteditable="true"></td><td contenteditable="true"></td><td></td><td class="borrarfilas"></td></tr>`).join("")}
  </tbody>
    <tfoot>
      <tr><td colspan="4">Total:</td><td></td><td></td></tr>
    </tfoot>
  </table>`
}

$("body").on("click", ".agregarcamion", async () => {
  let cantidadTabs = _cantidadTabs();
  let formatotablavacia = creaTablaVacia(await pidePlantilla(plantillaDefault))
  let nuevoCamion = `<div data-tabid="${cantidadTabs}" class="tabs__content">
  <div class="contenedor-trabajador">
  <label class="label-trabajador">Nombre del conductor:</label>
  <div class="contenedor-input-trabajador">
  <input type="text" class="form-control trabajador"><div class="btn-group dropend">
  <button type="button" class="btn btn-sm btn-secondary dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown"></button>
  <ul class="dropdown-menu dropdown-menu-dark">
  ${devuelveCamioneros()}
  </ul></div></div></div>
  ${formatotablavacia}</div>`
  let nuevaTab = `<div class="tab">
  <input data-tabid="${cantidadTabs}" type="radio" class="tabs__radio" name="tab" id="tab${cantidadTabs}"/>
  <label for="tab${cantidadTabs}" class="tabs__label borrarcamiones">Camión ${(cantidadTabs + 1)}</label>
</div>`
  $(".agregarcamion").before(nuevaTab);
  $(".contenidoTabs").append(nuevoCamion);
  tablasSortable();
});

$("body").on('click', '.grupotabs .dropdown-item', function () { $(this).closest(".tabs__content").find(".trabajador").val(this.innerText) });
$("body").on('click', '.swal2-html-container .dropdown-item', function () { $(this).closest(".dropend").prev().val(this.innerText) });
$("body").on('hide.bs.dropdown', '#dropdowncamionero', function () { this.closest(".swal2-html-container").style.minHeight = "68.2px" });

$("body").on('click', '.swal2-html-container .dropdown-toggle', function (e) {
  let altura = ($(this).next().children().length - 4) * 30 + 135;
  this.closest(".swal2-html-container").style.minHeight = `${altura}px`;
})

///TODO Aqui tengo que ver que pedo con el correo
$("body").on('click', '.contenedoreliminar', async function () {
  let result = await swalConfirmarYCancelar.fire({
    title: "Estás seguro que deseas borrar este registro?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí",
    cancelButtonText: "No",
  })
  if (result.isConfirmed) {
    funcionEnviar = enviar({ correo: "jajaj" }, "Se ha borrado el registro exitosamente")
    bootstrap.Modal.getInstance(configs).hide()
    modal.show()
  }
});
$("body").on('click', '.contenedormover', async function () {
  result = await Swal.fire({
    title: "Escoge la fecha a donde quieres mover el registro",
    width: 750,
    html: `<iframe src="/extras/calendarioIframe" frameborder="0"></iframe><button id="continuarIframe" class="btn btn-success margenbotonswal">Continuar</button><button id="cancelarIframe" class="btn btn-danger margenbotonswal">Cancelar</button>`,
    showConfirmButton: false,
    didOpen: () => {
      $(document).find("#continuarIframe")[0].addEventListener("click", () => {
        let contenidoIframe = $(document).find("iframe")[0].contentDocument;
        let input = contenidoIframe.querySelector("input");
        let fecha = input.value;
        if (fecha === "") {
          input.classList.add("is-invalid");
          contenidoIframe.querySelector("#validadorIframe").className = "invalid-feedback";
          return;
        }
        moverRegistro(hoy, parseDate(fecha).valueOf(), 0)
      });
      $(document).find("#cancelarIframe")[0].addEventListener("click", () => Swal.close());
    },
  });
});

function moverRegistro(anterior, fecha, sobreescribir) {
  $.ajax({
    url: "/registrarventas/mover",
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify({ anterior, fecha, sobreescribir }),
    success: async function (res) {
      if (res === "Se ha restaurado con éxito") {
        await preguntarSiQuiereRedireccionar(fecha)
        return
      }
      let html = `<custom-tabs><div class="tabs">
      ${res.tablas.map((_, i) => `<custom-label name="swal" data-id="swal${i}">Camión ${i + 1}</custom-label>`).join('')}
      </div><div class="content">`

      res.tablas.forEach(({ productos, totalvendidos, totalingresos }) => {
        let cantViajes = productos[0].viajes.length / 2;
        html += `<tab-content><table><thead>
          <col><col><colgroup class="pintarcolumnas">${[...Array(cantViajes)].map(_ => `<col span="2">`).join('')}</colgroup><col><col>
          <tr>
            <th rowspan="2" class="prod">Productos</th><th rowspan="2" class="tr">Precio</th>
            ${[...Array(cantViajes)].map((_, k) => `<th colspan="2">Viaje No. ${k + 1}</th>`).join('')}
            <th rowspan="2" class="tr">Vendidos</th><th rowspan="2" class="tr">Ingresos</th>
          </tr>
          <tr>${[...Array(cantViajes)].map(_ => `<th>Sale</th><th>Entra</th>`).join('')}</tr>
        </thead>
        <tbody>
          ${productos.map(({ nombre, precio, viajes, vendidos, ingresos }) => `<tr>
            <td>${nombre}</td><td>${precio.normalizarPrecio()}</td>${viajes.map(x => `<td>${x}</td>`).join('')}<td>${vendidos}</td><td>${ingresos.normalizarPrecio()}</td>
          </tr>`).join('')}
        </tbody>
        <tfoot><tr><td colspan="${cantViajes * 2 + colsinicio}">Total:</td><td>${totalvendidos}</td><td>${totalingresos.normalizarPrecio()}</td></tr></tfoot>
      </table></tab-content>`})
      html += "</div></custom-tabs>"

      if (await swalSíNo("Ya existe un registro en esa fecha, deseas sobreescribirlo?", html)) {
        moverRegistro(anterior, fecha, 1)
      }
    },
    error: q => Swal.fire("Ups...", "No se pudo restaurar el registro", "error")
  })
}

function enviar(atributo, texto) {
  return function () {
    let contraseñaVerificacion = $("#verificacionIdentidad").val()
    let data = JSON.stringify({ ...atributo, contraseñaVerificacion })
    modal.hide()
    $.ajax({
      url: window.location.pathname,
      method: "DELETE",
      contentType: "application/json",
      data,
      success: async q => {
        await Swal.fire("ÉXITO", texto, "success")
        location.reload()
      },
      error: r => Swal.fire("Error", r.responseText, "error")
    })
  }
}

async function preguntarSiQuiereRedireccionar(fecha) {
  let { isConfirmed } = await swalConfirmarYCancelar.fire({
    title: "Se ha restaurado correctamente",
    text: `El registro se ha restaurado correctamente. Deseas ser redireccionado para ver los cambios?`,
    icon: "info",
    showCancelButton: true,
    confirmButtonText: "Sí",
    cancelButtonText: "No",
  })
  if (isConfirmed) window.location = `/registrarventas/${devuelveFechaFormateada(fecha)}`
}

function devuelveFechaFormateada(fecha) {
  let date = new Date(fecha)
  return `${date.getUTCDate()}-${(date.getUTCMonth() + 1)}-${date.getUTCFullYear()}`
}

function parseDate(dateString) {
  const [day, month, year] = dateString.split('/');
  return Date.UTC(year, month - 1, day);
}

// colocarDatosTabla()
dayjs.extend(window.dayjs_plugin_utc);
let colscomienzo = 2;
let colsfinal = 2;
let fecha = document.querySelector(".fechanum").textContent.split("/"); //este hay que ponerle textcontent porque si esta escondido con innertext no lo agarra
let hoy = dayjs(fecha[2] + "-" + fecha[1] + "-" + fecha[0]).utc(true);
let timer;
let touchduration = 600;
let listaplantillas = [];
let objReordenarPlantillas = [];
let arreglado;
let resPlantillas = {};
let yaSeRecibioTouch = false;
let fechastr = hoy.format("D-M-YYYY");

// let desdeElMobil = function () { return /Android|webOS|iPhone|iPad|tablet/i.test(navigator.userAgent) }
let desdeElMobil = function () { return (('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0)); }

$(async function () {
  colocarValoresConfig();
  guardarValoresConfig();

  if (desdeElMobil())
    await $.getScript('/touch.js');
})

const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]') //estos son para el bootstrap
const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl));

function _cantidadTabs() { return document.querySelector(".contenidotabs").children.length; }
function _idTab() { return document.querySelector(".grupotabs .tabs__radio:checked").dataset.tabid; }
function _tabla() { return document.querySelector(`.contenidotabs [data-tabid="${_idTab()}"] table`); }
function _cuerpo() { return _tabla().querySelector(".cuerpo"); }
function _pie() { return _tabla().querySelector("tfoot"); }
function _pintarColumnas() { return _tabla().querySelector(".pintarcolumnas") }
function _cantidadViajes() { return _pintarColumnas().children.length; }
function _saleYEntra() { return _tabla().querySelector(".saleYEntra"); }
function _cantidadSaleYEntra() { return (_pintarColumnas().children.length * 2 + colscomienzo + colsfinal); }
function _cantidadProductos() { return _cuerpo().rows.length; }

document.querySelectorAll("tbody td:not(:nth-last-child(1), :nth-last-child(2))").forEach(el => el.setAttribute("contentEditable", true));
document.querySelectorAll("tbody td:last-child").forEach(el => el.classList.add("borrarfilas"));
document.querySelectorAll(".tabs__label").forEach(el => el.classList.add("borrarcamiones"));

$("body").on("click", ".fecha", () => document.querySelectorAll(".fecha").forEach(el => el.classList.toggle("esconder")));
let opcionBorrarFilasYColumnas = -1;
let opcionBorrarCamiones = -1;
let opcionExportarPDF = -1;
let opcionExportarExcel = -1;
let switchReordenarProductos = -1;
let switchReordenarCamiones = -1;
let switchOrdenarOrdenAlfabetico = -1;

$("body").on("click", ".grupotabs .tabs__label", function (e) {
  let encontrado = objReordenarPlantillas[this.previousElementSibling.dataset.tabid];
  if (encontrado)
    $(".restaurarplantilla").css("display", "initial");
  else
    $(".restaurarplantilla").css("display", "none");
})

$("body").on("click", ".restaurarplantilla", function (e) {
  let tabla = _tabla();
  let cuerpo = $(tabla).find(".cuerpo")[0];
  let id = _idTab();
  let ordenAnterior = objReordenarPlantillas[id];
  let html = restaurarOrdenPlantilla(ordenAnterior, cuerpo);
  cuerpo.innerHTML = html;
  borrarListaOrdenarPlantillas(tabla, id)
})

function borrarListaOrdenarPlantillas(tabla, id) {
  $(tabla).find(`th:not([colspan="2"])`).each((i, el) => el.style.setProperty("--flecha", '"↓"'));
  tabla.querySelector('.activo')?.classList.remove("activo");
  $(".restaurarplantilla").css("display", "none");
  delete objReordenarPlantillas[id];
}

function borrarListaOrdenarPlantillasTablaActual() {
  let id = _idTab();
  let tabla = _tabla();
  borrarListaOrdenarPlantillas(tabla, id);
}

function restaurarOrdenPlantilla(ordenAnterior, cuerpo) {
  let filas = [...cuerpo.rows];
  let formatoTablaLlena = "";
  let ordenNuevo = filas.map(el => el.cells[0].innerText.normalizar());
  ordenAnterior.forEach(producto => {
    let indice = ordenNuevo.findIndex(el => el === producto);
    if (indice >= 0)
      formatoTablaLlena += filas[indice].outerHTML;
  });

  ordenNuevo.forEach((prod, i) => {
    if (!ordenAnterior.includes(prod))
      formatoTablaLlena += filas[i].outerHTML;
  });
  return formatoTablaLlena;
}

async function guardarValoresConfig() {
  //estos son solo para visualizar los iconos
  if (opcionBorrarFilasYColumnas === 1)
    document.querySelectorAll(".contenidotabs").forEach(el => el.classList.add("cerrarconboton"));
  else
    document.querySelectorAll(".contenidotabs").forEach(el => el.classList.remove("cerrarconboton"));

  if (opcionBorrarCamiones === 1)
    document.querySelectorAll(".tabs").forEach(el => el.classList.add("cerrarconboton"));
  else
    document.querySelectorAll(".tabs").forEach(el => el.classList.remove("cerrarconboton"));

  if (switchOrdenarOrdenAlfabetico) {
    document.querySelectorAll('.contenidotabs').forEach(el => el.classList.add("ordenarAlfabeticamente"));
  }
  else
    document.querySelectorAll('.contenidotabs').forEach(el => el.classList.remove("ordenarAlfabeticamente"));

  $(".tabs").sortable({
    axis: "x", stop: function () {
      let tabs = document.querySelectorAll(".tabs label");
      for (let i = 0; i < tabs.length; i++) {
        tabs[i].innerText = `Camión ${i + 1}`;
      }
    },
    items: "> div:not(:last-child)",
    disabled: !switchReordenarCamiones,
    stop: function () {
      reacomodarCamiones();
      Swal.fire("Se ha cambiado el orden", "Se ha cambiado el orden de los camiones exitosamente", "success");
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


$("body").on("click", ".guardarconfig", () => {
  colocarValoresConfig();
  guardarValoresConfig();
})

function colocarValoresConfig() {
  let opcionBorrarFilasYColumnasNuevo = $('[name="borrarfilasycolumnas"]:checked').parent().index() - 1;
  let opcionBorrarCamionesNuevo = $('[name="borrarcamiones"]:checked').parent().index() - 1;
  let opcionExportarPDFNuevo = $('[name="exportarpdf"]:checked').parent().index() - 1;
  let opcionExportarExcelNuevo = $('[name="exportarexcel"]:checked').parent().index() - 1;
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

document.getElementById('configs').addEventListener('hidden.bs.modal', () => {
  reseteaValoresConfig();
})

//ordenar alfabeticamente ordenar por orden alfabetico
$("body").on("click", '.grupotabs th:not([colspan="2"]), #tablaresumen th', function () {
  if (switchOrdenarOrdenAlfabetico) {
    let tabla = this.closest("table");
    let esResumen = (tabla.id === "tablaresumen")
    let cuerpo
    if (!esResumen) {
      $(".restaurarplantilla").css("display", "initial")
      cuerpo = tabla.querySelector(".cuerpo");
    } else
      cuerpo = tabla.querySelector("tbody");

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
      indiceColumna += colscomienzo;
    cuerpo.querySelectorAll("tr").forEach((fila, indice) => {
      listaReordenarPlantillasHelper.push(fila.cells[0].innerText.normalizar())
      let textoCelda = fila.cells[indiceColumna].innerText.toUpperCase();
      objValores[textoCelda + separador + indice] = fila.outerHTML.replace(/(\t)|(\n)/g, '');
      listaIdentifObjValores.push(textoCelda + separador + indice);
    });

    if (!esResumen) {
      if (!objReordenarPlantillas[tabla.closest(".tabs__content").dataset.tabid])
        objReordenarPlantillas[tabla.closest(".tabs__content").dataset.tabid] = listaReordenarPlantillasHelper;
    }

    let listaElementosColumna = [...cuerpo.querySelectorAll(`td:nth-child(${(indiceColumna + 1)})`)];
    let todosSonNumeros = listaElementosColumna.every(el => !isNaN(parseFloat(el.innerText)));
    if (todosSonNumeros) {
      listaIdentifObjValores.sort(function (a, b) {
        let aa = a.split(separador);
        let bb = b.split(separador);
        if (aa[0] != bb[0])
          return aa[0] - bb[0];
        return cuerpo.rows[parseInt(aa[1])].cells[0].innerText.localeCompare(cuerpo.rows[parseInt(bb[1])].cells[0].innerText)
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

$("body").on("click", ".tabs input", function (e) {
  document.querySelectorAll(".tabs__content").forEach(el => el.style.display = "none");
  let contenido = document.querySelector(`.contenidotabs [data-tabid="${this.dataset.tabid}"]`)
  contenido.style.display = "initial"
})

$("body").on("keyup", "tr td", function (e) {
  let keycode = event.keyCode || event.which;
  if ((keycode >= 48 && keycode <= 57) || keycode === 229 || keycode === 8) {
    let cuerpo = $(this).closest("tbody")[0];
    let indiceFila = $(this).parent().index();
    calcularvendidoseingresos(cuerpo.rows[parseInt(indiceFila)]);
    calcularvendidoseingresostotal(cuerpo);
  }
});

function calcularvendidoseingresos(fila) {
  let sumafila = 0;
  let y = colscomienzo;
  let hayunnumero = false;
  for (; y < fila.cells.length - colsfinal; y++) {
    let contenido = parseInt(fila.cells[y].innerText);
    if (!isNaN(contenido)) {
      hayunnumero = true;
      if (y % 2 === 0)
        sumafila += contenido;
      else
        sumafila -= contenido;
    }
  }
  if (sumafila === 0 && !hayunnumero)
    fila.cells[y].innerText = "";
  else
    fila.cells[y].innerText = sumafila;

  y++;
  let totalingresos = sumafila * parseFloat(fila.cells[1].innerText);

  if (isNaN(totalingresos) || (sumafila === 0 && !hayunnumero))
    fila.cells[y].innerText = "";
  else {
    let totalajustado = totalingresos.normalizarPrecio();
    fila.cells[y].innerText = totalajustado;
  }
}

function calcularvendidoseingresostotal(cuerpo) {
  let sumaVendidos = 0;
  let hayUnNumero = false;
  cuerpo.querySelectorAll("td:nth-last-child(2)").forEach(el => {
    let contenido = parseFloat(el.innerText);
    if (!isNaN(contenido)) {
      hayUnNumero = true;
      sumaVendidos += contenido;
    }
  });

  let sumaIngresos = 0;
  cuerpo.querySelectorAll("td:nth-last-child(1)").forEach(el => {
    let contenido = parseFloat(el.innerText);
    if (!isNaN(contenido))
      sumaIngresos += contenido;
  });

  let celdaVendidos = $(cuerpo).parent().find("tfoot td")[1]
  if (!isNaN(sumaVendidos)) {
    if (sumaVendidos === 0 && !hayUnNumero)
      celdaVendidos.innerText = "";
    else
      celdaVendidos.innerText = sumaVendidos;
  }

  let celdaIngresos = $(cuerpo).parent().find("tfoot td")[2]
  if (!isNaN(sumaIngresos)) {
    if (sumaIngresos === 0 && !hayUnNumero)
      celdaIngresos.innerText = "";
    else
      celdaIngresos.innerText = sumaIngresos.normalizarPrecio();
  }

}

document.getElementById("añadirProducto").addEventListener("click", e => {
  let fila = "<tr>";
  for (i = 0; i < _cantidadSaleYEntra() - 2; i++) {
    fila += `<td contenteditable="true"></td>`;
  }
  fila += `<td></td><td class="borrarfilas"></td></tr>`;
  $(_cuerpo()).append(fila);
});


document.getElementById("añadirViaje").addEventListener("click", () => {
  $(_tabla().querySelector(".columnaVendidos")).before(`<th colspan="2" scope="colgroup" class="borrarcolumnas">Viaje No. ${_cantidadViajes() + 1}</th>`);
  $(_saleYEntra()).append(`<th scope="col">Sale</th><th scope="col">Entra</th>`);
  $(_pintarColumnas()).append(`<col span="2">`);
  let cuerpo = _cuerpo();
  let cantidadSaleYEntra = _cantidadSaleYEntra()
  for (let i = 0; i < _cantidadProductos(); i++) {
    let fila = cuerpo.rows[i];
    let indice = cantidadSaleYEntra - 4;
    let celda = fila.insertCell(indice);
    celda.setAttribute("contenteditable", true);
    celda = fila.insertCell(indice);
    celda.setAttribute("contenteditable", true);
  }
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
  let filaborrar = $(celda).parent()[0];
  let textoborrar = `<div class="contenedormensajeborrar"><table><tbody style="background: #0f0d35;">${filaborrar.cloneNode(true).outerHTML}</tbody></table></div>`
  let result = await swalConfirmarYCancelar.fire({
    title: "Estás seguro que deseas borrar este producto de la tabla?",
    icon: "warning",
    width: window.innerWidth * 3 / 4,
    html: textoborrar,
    showCancelButton: true,
    confirmButtonText: "Sí",
    cancelButtonText: "No",
  })
  if (result.isConfirmed) {
    let cuerpo = $(filaborrar).parent()[0];
    if (cuerpo.rows.length === 1)
      return Swal.fire("Error", "No puedes borrar todos los productos, debe haber al menos uno", "error");

    cuerpo.removeChild(filaborrar);
    calcularvendidoseingresostotal(cuerpo)
    Swal.fire("Se ha eliminado el producto", "Se ha eliminado el producto y su contenido exitosamente", "success");
  }
};

async function borrarColumnas(colborrar) {
  let numCol = $(colborrar).index();
  let tabla = $(colborrar).closest("table")[0]
  let celdaViajeABorrarSale = (numCol - colscomienzo) * 2 + colscomienzo;
  let textoBorrarColumnas = `<div class="contenedormensajeborrar"><table><thead><tr>`;
  textoBorrarColumnas += `${colborrar.outerHTML}</tr><tr><th scope="col">Sale</th><th scope="col">Entra</th></tr></thead><tbody style="background: #0f0d35;">`;
  for (let i = 2; i < tabla.rows.length - 1; i++) {
    textoBorrarColumnas += `<tr>${tabla.rows[i].cells[celdaViajeABorrarSale].outerHTML} ${tabla.rows[i].cells[celdaViajeABorrarSale + 1].outerHTML}</tr>`
  }
  textoBorrarColumnas += "</tbody></table></div>";
  let result = await swalConfirmarYCancelar.fire({
    title: "Estás seguro que deseas borrar esta columna y todos sus contenidos?",
    icon: "warning",
    width: window.innerWidth * 3 / 4,
    html: textoBorrarColumnas,
    showCancelButton: true,
    confirmButtonText: "Sí",
    cancelButtonText: "No",
  })
  if (result.isConfirmed) {
    if (_cantidadViajes() === 1)
      return Swal.fire("Error", "No puedes borrar todos los viajes, debe haber al menos uno", "error");

    let cuerpo = tabla.querySelector(".cuerpo");
    for (let i = 0; i < cuerpo.rows.length; i++) {
      cuerpo.rows[i].deleteCell(celdaViajeABorrarSale);
      cuerpo.rows[i].deleteCell(celdaViajeABorrarSale);
    }
    let celdatotal = $(tabla).find("tfoot td").first()[0];
    let colspan = parseInt(celdatotal.getAttribute("colspan"));
    celdatotal.setAttribute("colspan", colspan - 2);

    $(colborrar).remove();
    $(tabla).find(".saleYEntra").children().last().remove();
    $(tabla).find(".saleYEntra").children().last().remove();
    $(tabla).find(".pintarcolumnas").children().last().remove();
    let columnaborrartexto = tabla.querySelectorAll(".borrarcolumnas");
    columnaborrartexto.forEach((columnaborrartxt, index) => columnaborrartxt.textContent = "Viaje No. " + (index + 1));
    for (let i = 0; i < cuerpo.rows.length; i++) {
      calcularvendidoseingresos(cuerpo.rows[i])
    }
    calcularvendidoseingresostotal(cuerpo);
    Swal.fire("Se ha eliminado la columna", "Se ha eliminado la columna y todos sus contenidos exitosamente", "success");
  }

};

$("#diaanterior").on("click", function () {
  window.location = `/registrarventas/${hoy.subtract("1", "day").format("D-M-YYYY")}`;
});

$("#diasiguiente").on("click", function () {
  window.location = `/registrarventas/${hoy.add("1", "day").format("D-M-YYYY")}`;
});

function añadirceros(cuerpo) {
  cuerpo.querySelectorAll("td:not(:nth-child(1),:nth-child(2))").forEach(celda => {
    if (celda.innerText === "")
      celda.innerText = 0
  });
  calcularvendidoseingresostotal(cuerpo)
}

function devuelveListaTablas() {
  let listaCamiones = [...document.querySelectorAll(".grupotabs .tabs__radio")];
  let listaTablas = listaCamiones.map(el => document.querySelector(`.contenidotabs [data-tabid="${el.dataset.tabid}"] table`));
  return listaTablas;
}

$("#guardar").on("click", async function () {
  let respuesta = await borrarTablasVacias();
  if (!respuesta)
    return;
  let tabscontenido = document.querySelectorAll(".grupotabs .tabs__content");
  for (let i = 0; i < tabscontenido.length; i++) {
    respuesta = await validarCamioneros(tabscontenido[i].querySelector("input"), i + 1);
    if (!respuesta)
      return;
  }
  for (let i = 0; i < tabscontenido.length; i++) {
    let respuesta = await validarDatosTabla(tabscontenido[i].querySelector("table"), i + 1);
    if (!respuesta)
      return;
    respuesta = await borrarFilasVacias(tabscontenido[i].querySelector("table"), i + 1);
    if (!respuesta)
      return;
  }
  let listaTablas = devuelveListaTablas();
  let cantidadTablas = listaTablas.length;

  let guardar = `{ "fecha": ${hoy.valueOf()},
  "usuario": "",
  "fechacreacion": ${Date.now()},
  "fechaultimocambio": ${Date.now()},
  "camiones": [`;

  listaTablas.forEach((tabla, indice) => {
    let cuerpo = tabla.querySelector(".cuerpo");
    let filapie = tabla.querySelector("tfoot tr");
    let cantidadProductos = cuerpo.rows.length;
    guardar += `{ "nombretrabajador": "${$(tabla).closest(".tabs__content").find(".trabajador").val()}", "filas": [`;
    for (let i = 0; i < cantidadProductos; i++) {
      let fila = cuerpo.rows[i];
      let cantidadViajesMasComienzo = tabla.querySelector(".pintarColumnas").children.length * 2 + colscomienzo;
      guardar += `{"nombreproducto": "${fila.cells[0].textContent}", "precioproducto": ${fila.cells[1].innerText}, "viajes":[`
      for (let j = colscomienzo; j < cantidadViajesMasComienzo; j += 2) {
        guardar += `{"sale": ${fila.cells[j].innerText},"entra": ${fila.cells[j + 1].innerText}`;
        if (j + 2 >= cantidadViajesMasComienzo)
          guardar += "}";
        else
          guardar += "},";
      }
      guardar += "],";
      guardar += `"vendidos": ${fila.querySelector("td:nth-last-child(2)").innerText}, "ingresos": ${fila.querySelector("td:nth-last-child(1)").innerText}`
      if (i + 1 >= cantidadProductos)
        guardar += `} `;
      else
        guardar += `}, 
        `;
    }
    guardar += `], "totalvendidos": ${filapie.cells[1].innerText}, "totalingresos": ${filapie.cells[2].innerText}`

    if (indice + 1 >= cantidadTablas)
      guardar += `}`;
    else
      guardar += `}, 
      `;
  })
  guardar += `]}`;

  console.log(guardar);

  // $.ajax({
  //   url: "/registrarventas/guardar",
  //   method: "POST",
  //   contentType: "application/json",
  //   data: guardar,
  //   success: function (res) {
  //     Swal.fire(
  //       "Se ha guardado exitosamente",
  //       "El archivo se ha almacenado en la base de datos",
  //       "success"
  //     );
  //   },
  //   error: function (res) {
  //     Swal.fire({
  //       icon: "error",
  //       title: "Ups...",
  //       text: "No se pudo guardar en la base de datos",
  //     });
  //   },
  // });
});


document.getElementById("resumen").addEventListener("click", async () => {
  let listaTablas = devuelveListaTablas();
  listaTablasValores = []
  listaTablas.forEach(tabla => {
    listaValores = [];
    let productos = tabla.querySelectorAll(".cuerpo td:first-child");
    let vendidos = tabla.querySelectorAll(".cuerpo td:nth-last-child(2)");
    let ingresos = tabla.querySelectorAll(".cuerpo td:nth-last-child(1)");
    for (let i = 0; i < productos.length; i++) {
      let valor = { producto: productos[i].innerText.normalizar(), vendidos: parseInt(vendidos[i].innerText), ingresos: parseFloat(ingresos[i].innerText), productoDesnormalizado: productos[i].innerText }
      listaValores.push(valor);
    }
    listaTablasValores.push(listaValores);
  });

  let result = listaTablasValores.reduce((acc, table) => {
    table.forEach(fila => {
      if (acc[fila.producto]) {
        acc[fila.producto].vendidos += fila.vendidos;
        acc[fila.producto].ingresos += fila.ingresos;
      } else {
        acc[fila.producto] = { vendidos: fila.vendidos, ingresos: fila.ingresos, productoDesnormalizado: fila.productoDesnormalizado };
      }
    });
    return acc;
  }, {});

  for (const el in result) {
    result[el].ingresos = result[el].ingresos.normalizarPrecio();
  }

  console.log(result);
  let html = `<table id="tablaresumen" style="margin-left: auto; margin-right:auto"><thead><tr>
    <th class="thresumenproducto">Productos</th>
    <th class="thresumenvendidoseingresos">Vendidos</th>
    <th class="thresumenvendidoseingresos">Ingresos</th>
  </tr></thead><tbody>`;
  for (const key in result) {
    html += `<tr><td>${result[key].productoDesnormalizado}</td>
    <td>${isNaN(result[key].vendidos) ? 0 : result[key].vendidos}</td>
    <td>${isNaN(result[key].ingresos) ? 0 : result[key].ingresos}</td></tr>`
  }
  html += `</tbody><tfoot><tr><td style="text-align: center">Total:</td>
  <td class="totalresumen"></td><td class="totalresumen"></td></tr></tfoot></table>`

  html += `<div class="contenedorflex">
    <button class="btn btn-primary margenbotonswal btncontinuar2" onclick="cancelarSwal()">Continuar</button>
    ${devuelveBotonExportarAPDFResumen()}
    ${devuelveBotonExportarAExcelResumen()}
  </div>`;

  await swal.fire({
    title: "Resumen de todo lo que vendiste durante el día",
    width: window.innerWidth * 0.6,
    html: html,
    showConfirmButton: false,
    didOpen: () => {
      calcularvendidoseingresostotal($("#tablaresumen tbody")[0]);
    }
  });
});

function devuelveExportarAExcel() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="30px" height="30px" viewBox="0 0 32 32"><title>file_type_excel2</title><path d="M28.781,4.405H18.651V2.018L2,4.588V27.115l16.651,2.868V26.445H28.781A1.162,1.162,0,0,0,30,25.349V5.5A1.162,1.162,0,0,0,28.781,4.405Zm.16,21.126H18.617L18.6,23.642h2.487v-2.2H18.581l-.012-1.3h2.518v-2.2H18.55l-.012-1.3h2.549v-2.2H18.53v-1.3h2.557v-2.2H18.53v-1.3h2.557v-2.2H18.53v-2H28.941Z" style="fill:#20744a;fill-rule:evenodd"/><rect x="22.487" y="7.439" width="4.323" height="2.2" style="fill:#20744a"/><rect x="22.487" y="10.94" width="4.323" height="2.2" style="fill:#20744a"/><rect x="22.487" y="14.441" width="4.323" height="2.2" style="fill:#20744a"/><rect x="22.487" y="17.942" width="4.323" height="2.2" style="fill:#20744a"/><rect x="22.487" y="21.443" width="4.323" height="2.2" style="fill:#20744a"/><polygon points="6.347 10.673 8.493 10.55 9.842 14.259 11.436 10.397 13.582 10.274 10.976 15.54 13.582 20.819 11.313 20.666 9.781 16.642 8.248 20.513 6.163 20.329 8.585 15.666 6.347 10.673" style="fill:#fff;fill-rule:evenodd"/></svg> Exportar a Excel`
}

function devuelveExportarAPDF() {
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" height="30px" width="30px" version="1.1" id="Capa_1" viewBox="0 0 56 56" xml:space="preserve"><g><path style="fill:#E9E9E0;" d="M36.985,0H7.963C7.155,0,6.5,0.655,6.5,1.926V55c0,0.345,0.655,1,1.463,1h40.074   c0.808,0,1.463-0.655,1.463-1V12.978c0-0.696-0.093-0.92-0.257-1.085L37.607,0.257C37.442,0.093,37.218,0,36.985,0z"/><polygon style="fill:#D9D7CA;" points="37.5,0.151 37.5,12 49.349,12  "/><path style="fill:#CC4B4C;" d="M19.514,33.324L19.514,33.324c-0.348,0-0.682-0.113-0.967-0.326   c-1.041-0.781-1.181-1.65-1.115-2.242c0.182-1.628,2.195-3.332,5.985-5.068c1.504-3.296,2.935-7.357,3.788-10.75   c-0.998-2.172-1.968-4.99-1.261-6.643c0.248-0.579,0.557-1.023,1.134-1.215c0.228-0.076,0.804-0.172,1.016-0.172   c0.504,0,0.947,0.649,1.261,1.049c0.295,0.376,0.964,1.173-0.373,6.802c1.348,2.784,3.258,5.62,5.088,7.562   c1.311-0.237,2.439-0.358,3.358-0.358c1.566,0,2.515,0.365,2.902,1.117c0.32,0.622,0.189,1.349-0.39,2.16   c-0.557,0.779-1.325,1.191-2.22,1.191c-1.216,0-2.632-0.768-4.211-2.285c-2.837,0.593-6.15,1.651-8.828,2.822   c-0.836,1.774-1.637,3.203-2.383,4.251C21.273,32.654,20.389,33.324,19.514,33.324z M22.176,28.198   c-2.137,1.201-3.008,2.188-3.071,2.744c-0.01,0.092-0.037,0.334,0.431,0.692C19.685,31.587,20.555,31.19,22.176,28.198z    M35.813,23.756c0.815,0.627,1.014,0.944,1.547,0.944c0.234,0,0.901-0.01,1.21-0.441c0.149-0.209,0.207-0.343,0.23-0.415   c-0.123-0.065-0.286-0.197-1.175-0.197C37.12,23.648,36.485,23.67,35.813,23.756z M28.343,17.174   c-0.715,2.474-1.659,5.145-2.674,7.564c2.09-0.811,4.362-1.519,6.496-2.02C30.815,21.15,29.466,19.192,28.343,17.174z    M27.736,8.712c-0.098,0.033-1.33,1.757,0.096,3.216C28.781,9.813,27.779,8.698,27.736,8.712z"/><path style="fill:#CC4B4C;" d="M48.037,56H7.963C7.155,56,6.5,55.345,6.5,54.537V39h43v15.537C49.5,55.345,48.845,56,48.037,56z"/><g><path style="fill:#FFFFFF;" d="M17.385,53h-1.641V42.924h2.898c0.428,0,0.852,0.068,1.271,0.205    c0.419,0.137,0.795,0.342,1.128,0.615c0.333,0.273,0.602,0.604,0.807,0.991s0.308,0.822,0.308,1.306    c0,0.511-0.087,0.973-0.26,1.388c-0.173,0.415-0.415,0.764-0.725,1.046c-0.31,0.282-0.684,0.501-1.121,0.656    s-0.921,0.232-1.449,0.232h-1.217V53z M17.385,44.168v3.992h1.504c0.2,0,0.398-0.034,0.595-0.103    c0.196-0.068,0.376-0.18,0.54-0.335c0.164-0.155,0.296-0.371,0.396-0.649c0.1-0.278,0.15-0.622,0.15-1.032    c0-0.164-0.023-0.354-0.068-0.567c-0.046-0.214-0.139-0.419-0.28-0.615c-0.142-0.196-0.34-0.36-0.595-0.492    c-0.255-0.132-0.593-0.198-1.012-0.198H17.385z"/><path style="fill:#FFFFFF;" d="M32.219,47.682c0,0.829-0.089,1.538-0.267,2.126s-0.403,1.08-0.677,1.477s-0.581,0.709-0.923,0.937    s-0.672,0.398-0.991,0.513c-0.319,0.114-0.611,0.187-0.875,0.219C28.222,52.984,28.026,53,27.898,53h-3.814V42.924h3.035    c0.848,0,1.593,0.135,2.235,0.403s1.176,0.627,1.6,1.073s0.74,0.955,0.95,1.524C32.114,46.494,32.219,47.08,32.219,47.682z     M27.352,51.797c1.112,0,1.914-0.355,2.406-1.066s0.738-1.741,0.738-3.09c0-0.419-0.05-0.834-0.15-1.244    c-0.101-0.41-0.294-0.781-0.581-1.114s-0.677-0.602-1.169-0.807s-1.13-0.308-1.914-0.308h-0.957v7.629H27.352z"/><path style="fill:#FFFFFF;" d="M36.266,44.168v3.172h4.211v1.121h-4.211V53h-1.668V42.924H40.9v1.244H36.266z"/></g></g></svg> Exportar a PDF`
}

function devuelveBotonExportarAExcelResumen() {
  return `<button class="btn btn-success botonexcel" onclick="exportarAExcelResumen()" id="exportarAExcelResumen">${devuelveExportarAExcel()}</button>`
}

function devuelveBotonExportarAPDFResumen() {
  return `<button class="btn btn-danger botonpdf" onclick="exportarAPDFResumen()" id="exportarAPDFResumen">${devuelveExportarAPDF()}</button>`
}

async function exportarAExcelResumen() {
  let btnExportar = $("#exportarAExcelResumen");
  colocarSpinnerExcel(btnExportar);
  await pedirExcel();
  let nombre = `Resumen de ventas ${fechastr}.xlsx`;
  let workbook = XLSX.utils.book_new();
  let ws = XLSX.utils.table_to_sheet($("#tablaresumen")[0]);
  var range = XLSX.utils.decode_range(ws["!ref"]);
  ws['!cols'] = [{ width: 20 }];
  ws['!rows'] = [{ hpt: 35 }];
  for (var i = (range.s.r + 1); i <= range.e.r; i++) {
    ws['!rows'].push({ hpt: 24 });
  }
  for (var i = range.s.r; i <= range.e.r; i++) {
    for (var j = range.s.c; j <= range.e.c; j++) {
      var cell_address = XLSX.utils.encode_cell({ r: i, c: j });
      var cell = ws[cell_address];
      if (cell) {
        ajustesCeldasExcel(cell)
        if (i === 0) {
          cell.s.fill = { fgColor: { rgb: "192435" } }
        } else {
          cell.s.fill = { fgColor: { rgb: "0f0d35" } }
        }
      }
    }
  }
  XLSX.utils.book_append_sheet(workbook, ws, `Resumen	del día ${fechastr}`);
  XLSX.writeFile(workbook, nombre);
  archivoCreado(btnExportar, devuelveExportarAExcel);
}

function ajustesCeldasExcel(cell) {
  cell.s = {
    alignment: {
      horizontal: "center",
      vertical: "center",
    },
    font: {
      color: { rgb: "FFFFFF" }
    },
    border: {
      right: {
        style: "thin",
        color: { rgb: '000000' }
      },
      left: {
        style: "thin",
        color: { rgb: '000000' }
      },
      bottom: {
        style: "thin",
        color: { rgb: '000000' }
      },
      top: {
        style: "thin",
        color: { rgb: '000000' }
      },
    }
  };
}

function colocarSpinnerPDF(btn) {
  btn.html(`  Cargando<div class="cajaspinner"><div class="spinner-border text-danger"></div>`);
}
function colocarSpinnerExcel(btn) {
  btn.html(`  Cargando<div class="cajaspinner"><div class="spinner-border text-success"></div>`);
}


async function exportarAPDFResumen() {
  let btnExportar = $("#exportarAPDFResumen");
  colocarSpinnerPDF(btnExportar);
  await pedirPDF();
  let doc = new jsPDF('p', 'pt', 'letter');
  let margin = 20;
  let scale = (doc.internal.pageSize.width - margin * 2) / document.body.scrollWidth;
  let tabla = $("#tablaresumen")[0];
  let html = `<div class="tituloresumen" style="margin-left: ${tabla.clientWidth / 2 - 150}px">Resumen	&nbsp;del día ${fechastr}</div>${tabla.outerHTML}<br><br>`;
  doc.html(html, {
    x: margin,
    y: margin,
    html2canvas: {
      scale
    },
    callback: doc => {
      let nombre = `Resumen de ventas ${fechastr}.pdf`;
      doc.save(nombre);
      archivoCreado(btnExportar, devuelveExportarAPDF)
    }
  })
}

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

function archivoCreado(btn, cb) {
  btn.html(`Archivo creado`);
  setTimeout(() => {
    btn.html(cb());
  }, 2000);
}

async function borrarFilasVacias(tabla, numtabla) {
  let tablaCopia = tabla.cloneNode(true);
  let cuerpoCopia = tablaCopia.querySelector(".cuerpo");
  let filasCopia = [...cuerpoCopia.rows];
  let filasQueNoEstanVacias = filasCopia.filter(fila => {
    let celdasEspecificas = [...fila.querySelectorAll("td:not(:nth-child(1),:nth-child(2),:nth-last-child(1),:nth-last-child(2))")];
    let res = celdasEspecificas.every(celda => celda.innerText === "0")
    if (res)
      $(fila).find("td").each((i, celda) => celda.classList.add("enfocar"))
    return !res;
  });
  if (filasQueNoEstanVacias.length === cuerpoCopia.rows.length)
    return true;

  let tablaCopiaSinFilasVacias = tabla.cloneNode(true);
  let tablaSinFilasVacias = ""
  filasQueNoEstanVacias.forEach(el => tablaSinFilasVacias += el.outerHTML)
  tablaCopiaSinFilasVacias.querySelector(".cuerpo").innerHTML = tablaSinFilasVacias

  $(tablaCopia).find(".cuerpo td").each((i, el) => el.setAttribute("contenteditable", false))
  $(tablaCopiaSinFilasVacias).find(".cuerpo td").each((i, el) => el.setAttribute("contenteditable", false))

  let result = await swal3Botones.fire({
    title: "Se han detectado filas vacias",
    icon: "warning",
    width: window.innerWidth * 3 / 4,
    html: `<div class="textovista">Se han detectado filas vacias en la tabla ${numtabla}</div>
    <br><br><br> ${tabsTexto(tablaCopia, tablaCopiaSinFilasVacias, "Ver filas vacías")}
    <br><div class="textovista">Desea eliminarlas?</div><br><br>`,
    showCancelButton: true,
    showDenyButton: true,
    confirmButtonText: "Borrar las filas vacías",
    denyButtonText: `Conservar las filas vacías`,
    cancelButtonText: "Volver",
  })

  if (result.isConfirmed) {
    if (filasQueNoEstanVacias.length === 0) {
      Swal.fire("Error", `No se puede guardar la tabla ${numtabla} porque está vacía`, "error");
      return false;
    }
    let filasVacias = [...tabla.querySelector(".cuerpo").rows].filter(fila => {
      let celdasEspecificas = [...fila.querySelectorAll("td:not(:nth-child(1),:nth-child(2),:nth-last-child(1),:nth-last-child(2))")];
      let res = celdasEspecificas.every(celda => celda.innerText === "0")
      return res;
    });
    filasVacias.forEach(fila => $(fila).remove());
    return true;
  }
  else if (result.isDenied)
    return true;

  return false;
}

async function entraMasDeLoQueSale(tabla, numtabla) {
  let tablacopia = tabla.cloneNode(true);
  let cuerpocopia = $(tablacopia).find("tbody")[1];

  let verificacion = true;
  for (let i = 0; i < cuerpocopia.rows.length; i++) {
    for (let j = colscomienzo; j < cuerpocopia.rows[i].cells.length - colsfinal; j += 2) {
      let entra = cuerpocopia.rows[i].cells[j];
      let sale = cuerpocopia.rows[i].cells[j + 1];
      if (parseInt(sale.innerText) > parseInt(entra.innerText)) {
        entra.classList.add("enfocar");
        sale.classList.add("enfocar");
        verificacion = false;
      }
      else {
        if (entra.classList.contains("enfocar")) {
          entra.removeAttribute("class");
          sale.removeAttribute("class");
        }
      }
    }
  }

  if (verificacion) {
    arreglado = tablacopia;
    return true;
  }

  let result = await swalConfirmarYCancelar.fire({
    title: `<h3>Se ha detectado filas en la tabla ${numtabla} donde lo que sale es mayor que lo que entra, por favor corrígelos para poder guardar los datos</h3>`,
    icon: "error",
    width: window.innerWidth * 3 / 4,
    html: tablacopia,
    showCancelButton: true,
    confirmButtonText: "Ya lo arreglé",
    cancelButtonText: "Volver",
  })

  if (result.isConfirmed) {
    let verif = await entraMasDeLoQueSale(tablacopia, numtabla);
    return verif;
  }
  else
    return false;
}

async function validarProductosYPrecios(tabla, numtabla) {
  let tablacopia = tabla.cloneNode(true);
  let cuerpocopia = $(tablacopia).find("tbody")[1];
  let verificacionProductos = true;
  let verificacionPrecios = true;
  for (let i = 0; i < cuerpocopia.rows.length; i++) {
    let celdaProductos = cuerpocopia.rows[i].cells[0];
    celdaProductos.textContent = celdaProductos.innerHTML.trim();
    let celdaPrecios = cuerpocopia.rows[i].cells[1];
    if (celdaProductos.textContent === "") {
      celdaProductos.classList.add("enfocar");
      verificacionProductos = false;
    }
    else {
      if (celdaProductos.classList.contains("enfocar"))
        celdaProductos.removeAttribute("class");
    }
    if (celdaPrecios.innerHTML === "") {
      celdaPrecios.classList.add("enfocar");
      verificacionPrecios = false;
    }
    else {
      if (celdaPrecios.classList.contains("enfocar"))
        celdaPrecios.removeAttribute("class");
    }

  }

  if (verificacionProductos && verificacionPrecios) {
    arreglado = tablacopia;
    return true;
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
    html: tablacopia,
    showCancelButton: true,
    confirmButtonText: "Ya lo arreglé",
    cancelButtonText: "Volver",
  })
  if (result.isConfirmed) {
    let verif = await validarProductosYPrecios(tablacopia, numtabla);
    return verif;
  }
  else
    return false;
}

async function borrarTablasVacias() {
  let tablas = [...document.querySelectorAll(".contenidotabs table")];
  let tablasVacias = tablas.filter(tabla => tabla.querySelector("tfoot td:nth-child(3)").innerText === "");

  if (tablasVacias.length === 0)
    return true;

  let htmlTablas = "";
  if (tablasVacias.length === 1)
    htmlTablas += `<div class="textovista">Se ha detectado que esta tabla está vacía así que será eliminada</div>`;
  else
    htmlTablas += `<div class="textovista">Se han detectado las siguientes tablas vacias las cuales serán eliminadas</div>`

  htmlTablas += `<br><br><br><div class="tabs-swal">`;
  tablasVacias.forEach((tabla, indice) => {
    htmlTablas += `<input type="radio" class="tabs__radio" name="tabs-swal" id="tabswal${indice}" checked />
    <label for="tabswal${indice}" class="tabs__label label-swal">Camión ${parseInt(tabla.closest(".tabs__content").dataset.tabid) + 1}</label>
    <div class="tabs__content">` + tabla.cloneNode(true).outerHTML + "</div>"
  });
  htmlTablas += `</div>
            <br>
            <div class="textovista">Desea continuar?</div>
            <br><br>`

  let result = await swalConfirmarYCancelar.fire({
    title: "Se han detectado tablas vacias",
    icon: "warning",
    width: window.innerWidth * 3 / 4,
    html: htmlTablas,
    showCancelButton: true,
    confirmButtonText: "Continuar",
    cancelButtonText: "No continuar",
  })

  if (result.isConfirmed) {
    let res = await soloHayUnCamion();
    if (res)
      return false;

    tablasVacias.forEach(tabla => {
      let tabs__content = $(tabla).closest(".tabs__content");
      let id = tabs__content[0].dataset.tabid;
      $(tabs__content).remove();
      $(`.tab:has([data-tabid=${id}])`).remove();
    })

    reacomodarCamiones();
    Swal.fire("Se han eliminado las tablas vacías", "Se han eliminado las tablas vacías exitosamente", "success");
    return true;
  }
  return false;
}

async function borrarCamiones(label, e) {
  let id = label.previousElementSibling.dataset.tabid;
  let tabla = document.querySelector(`.grupotabs .tabs__content[data-tabid="${id}"] table`)
  let htmlTablas = `<div class="tabs-swal">`;
  htmlTablas += `<input type="radio" class="tabs__radio" name="tabs-swal" id="tabswal0" checked />
  <label for="tabswal0" class="tabs__label label-swal">Camión ${(parseInt(id) + 1)}</label>
    <div class="tabs__content" style="display:initial !important;">` + tabla.cloneNode(true).outerHTML + "</div>"
  htmlTablas += `</div>
    <br>
    <div class="textovista">Desea continuar?</div>
    <br><br>`
  e.preventDefault();
  e.stopPropagation();
  let result = await swalConfirmarYCancelar.fire({
    title: "Estás seguro que deseas eliminar este camión?",
    icon: "warning",
    width: window.innerWidth * 3 / 4,
    html: htmlTablas,
    showCancelButton: true,
    confirmButtonText: "Continuar",
    cancelButtonText: "No continuar",
  })

  if (result.isConfirmed) {
    let res = await soloHayUnCamion();
    if (res)
      return false;
    delete objReordenarPlantillas[id];
    $(label).parent().remove();
    $(`.grupotabs .tabs__content[data-tabid=${id}]`).remove();
    reacomodarCamiones();
    Swal.fire("Se ha eliminado el camión", "Se ha eliminado el camión exitosamente", "success");
    return true;
  }
  return false;
}

async function soloHayUnCamion() {
  if ($(".grupotabs table").length === 1) {
    await Swal.fire("Error", "No se puede borrar, debe haber al menos un camión", "error");
    return true;
  }
  return false;
}

function reacomodarCamiones() {
  let listaContenido = [...$(".grupotabs .tab")].map(el =>
    $(`.grupotabs .tabs__content[data-tabid="${$(el).find("input")[0].dataset.tabid}"]`)[0]);

  $(".grupotabs .tab").each((index, tab) => {
    listaContenido[index].dataset.tabid = index;
    let checkbox = tab.querySelector("input");
    checkbox.dataset.tabid = index;
    let idNuevo = `tab${index}`;
    checkbox.id = idNuevo;
    let label = tab.querySelector("label");
    label.setAttribute("for", idNuevo)
    label.innerText = `Camión ${(parseInt(index) + 1)}`;
  });
  if ($(".grupotabs .tab .tabs__radio:checked").length === 0)
    $(".grupotabs .tab:first-child .tabs__label")[0].click();
}

async function validarCamioneros(textbox, numerotabla) {
  textbox.value = textbox.value.trim()
  if (textbox.value !== "")
    return true;

  let result = await swalConfirmarYCancelar.fire({
    icon: "warning",
    width: window.innerWidth * 3 / 4,
    html: `<h3>El nombre del conductor del camión ${numerotabla} está vacío. <br> Escribe o elige un nombre para continuar </h3> <br>
      <div class="divtrabajadorrevisar">
      <input type="text" class="form-control trabajador" style="height: 35px; min-width: 228px" id="trabajadorrevisar" style="width: 260px; max-width: 260px; text-align:center;" placeholder="Escribe el nombre del conductor" />
      <div class="btn-group dropend">
        <button type="button" class="btn btn-sm btn-secondary dropdown-toggle dropdown-toggle-split" id="dropdowncamionero" data-bs-toggle="dropdown"></button>
        <ul class="dropdown-menu dropdown-menu-dark">
          ${devuelveCamioneros()}
        </ul>
      </div>
      </div>`,
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
  let verificacion = await validarProductosYPrecios(tabla, numtabla);
  if (!verificacion)
    return false;
  clonaValores(tabla)
  añadirceros(tabla.querySelector(".cuerpo"));
  verificacion = await entraMasDeLoQueSale(tabla, numtabla);
  clonaValores(tabla)
  return verificacion;
}

function clonaValores(tabla) {
  let filasCuerpo = $(tabla).find(".cuerpo tr");
  let filasCuerpoCopia = $(arreglado).find(".cuerpo tr");
  let filasPie = $(tabla).find("tfoot tr");
  let filasPieCopia = $(arreglado).find("tfoot tr");
  for (let i = 0; i < filasCuerpo.length; i++) {
    for (let j = 0; j < filasCuerpo[i].cells.length; j++) {
      filasCuerpo[i].cells[j].innerHTML = filasCuerpoCopia[i].cells[j].innerHTML
    }
  }
  filasPie[0].cells[1].innerHTML = filasPieCopia[0].cells[1].innerHTML
  filasPie[0].cells[2].innerHTML = filasPieCopia[0].cells[2].innerHTML
}

//TODO cambiar las librerias de plugins a las desargadas de internet
document.getElementById("exportarexcel").addEventListener("click", async function () {
  let btnExportar = $(this);
  colocarSpinnerExcel(btnExportar);
  await pedirExcel();
  let nombre = `registro ventas ${fechastr} ${document.querySelector(".grupotabs .tabs__radio:checked + label").innerText}.xlsx`;
  let workbook = XLSX.utils.book_new();
  let listaTablas = [];
  if (opcionExportarExcel === 0)
    listaTablas.push(_tabla());
  else
    listaTablas = devuelveListaTablas();

  listaTablas.forEach((tabla, indice) => {
    let ws = XLSX.utils.table_to_sheet(tabla);
    // console.log(`TCL: workbook`, workbook)
    // console.dir(`TCL: workbook`, workbook)
    // console.log(`TCL: ws`, ws)
    // console.dir(`TCL: ws`, ws)
    // console.log(`TCL: XLSX.utils`, XLSX.utils)
    // console.log(`TCL: XLSX.utils`, XLSX.utils)
    // console.dir(`TCL: XLSX`, XLSX)
    // console.dir(`TCL: XLSX`, XLSX)
    var range = XLSX.utils.decode_range(ws["!ref"]);
    ws['!cols'] = [{ width: 20 }];
    ws['!rows'] = [];
    for (var i = range.s.r; i <= range.e.r; i++) {
      ws['!rows'].push({ hpt: 24 });
    }

    for (var i = range.s.r; i <= range.e.r; i++) {
      for (var j = range.s.c; j <= range.e.c; j++) {
        var cell_address = XLSX.utils.encode_cell({ r: i, c: j });
        var cell = ws[cell_address];
        if (cell) {
          ajustesCeldasExcel(cell)
          if (i === 0 || i === 1) {
            cell.s.fill = { fgColor: { rgb: "192435" } }
          } else {
            if (j === 0 || j === 1 || j === range.e.c - 1 || j === range.e.c || i === range.e.r) {
              cell.s.fill = { fgColor: { rgb: "0f0d35" } }
            } else {
              if (j % 4 === 2 || j % 4 === 3) {
                cell.s.fill = { fgColor: { rgb: "024649" } }
              }
              else {
                cell.s.fill = { fgColor: { rgb: "192435" } }
              }
            }
          }

          if (i === range.e.r && j === 0) {
            cell.s.alignment.horizontal = "right";
          }
        }
      }
    }
    ws['A2'] = {
      t: 's',
      v: ''
    };
    ws['A2'].s = {
      border: {
        right: {
          style: "thin",
          color: { rgb: '000000' }
        },
      }
    }
    var cellVendidos = XLSX.utils.encode_cell({ r: 1, c: range.e.c - 1 });
    ws[cellVendidos] = {
      t: 's',
      v: ''
    };
    ws[cellVendidos].s = {
      border: {
        right: {
          style: "thin",
          color: { rgb: '000000' }
        },
      }
    }
    XLSX.utils.book_append_sheet(workbook, ws, `Camión ${(opcionExportarExcel === 0) ? parseInt(tabla.closest(".tabs__content").dataset.tabid) + 1 : indice + 1}`);
  });
  XLSX.writeFile(workbook, nombre);
  archivoCreado(btnExportar, devuelveExportarAExcel);
})

async function pedirExcel() {
  if (typeof XLSX === "undefined")
    await $.getScript('/tablaAExcelSheetJS.js');
}

async function pedirPDF() {
  if (typeof jsPDF === "undefined") {
    // await $.getScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/1.5.3/jspdf.debug.js');
    // await $.getScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.3.2/html2canvas.js');
    await $.getScript('/jspdf-1.5.3.js');
    await $.getScript('/html2canvas-1.3.2.js');
  }
}



//TODO cambiar estos tambien
document.getElementById("exportarpdf").addEventListener("click", async function () {
  let btnExportar = $(this);
  colocarSpinnerPDF(btnExportar);
  await pedirPDF();
  let doc = new jsPDF('p', 'pt', 'letter')
  let margin = 20;
  let scale = (doc.internal.pageSize.width - margin * 2) / document.body.scrollWidth;
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
    html += `<div class="titulopdf" style="margin-left: ${(medirTabla.clientWidth / 2 - 55)}px">Camión ${(opcionExportarPDF === 0) ? parseInt(tabla.closest(".tabs__content").dataset.tabid) + 1 : indice + 1}</div>`;
    $(medirTabla).remove()
    copiaTabla.querySelector(".pintarcolumnas").innerHTML = "";

    html += `${copiaTabla.outerHTML}<br><br>`
  });
  doc.html(html, {
    x: margin,
    y: margin,
    html2canvas: {
      scale
    },
    callback: doc => {
      let nombre = `registro ventas ${fechastr} ${document.querySelector(".grupotabs .tabs__radio:checked + label").innerText}.pdf`;
      doc.save(nombre);
      archivoCreado(btnExportar, devuelveExportarAPDF)
    }
  })
})

async function pidePlantilla(nombreplantilla) {
  let plantilla = listaplantillas.find(el => el.nombre === nombreplantilla)
  let mandar = `{ "nombreplantilla": "${nombreplantilla}" }`
  if (!plantilla) {
    await $.ajax({
      url: "/plantillas/devuelveplantilla",
      method: "POST",
      contentType: "application/json",
      data: mandar,
      success: async function (res) {
        plantilla = { nombre: nombreplantilla, plantilla: res };
        listaplantillas.push(plantilla);
      },
      error: function (res) {
        return Swal.fire("Ups...", "Ha habido un error", "error");
      },
    });
  }
  return plantilla.plantilla;
}

async function metododropdown(option) {
  let nombreplantilla = option.textContent;
  let res = await pidePlantilla(nombreplantilla);
  if (!res)
    return;
  let formatotabla = `<table id="mostrartabla">
  <thead>
    <tr>
      <th class="prod">Productos</th>
      <th class="tr">Precio</th>
    </tr>
  </thead>
  <tbody>`;
  for (let i = 0; i < res.productos.length; i++) {
    formatotabla += `<tr>
      <td>${res.productos[i].producto}</td>
      <td>${res.productos[i].precio.normalizarPrecio()}</td>
      </tr>`;
  }
  formatotabla += `</tbody></table>`;
  resPlantillas = res;
  let result = await swalConfirmarYCancelar.fire({
    title: "Estás seguro que deseas utilizar esta plantilla?",
    icon: "warning",
    html: formatotabla,
    showCancelButton: true,
    confirmButtonText: "Sí",
    cancelButtonText: "No",
  });
  if (result.isConfirmed)
    await opcionesPlantilla();
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
  let formatotablavacia = creaTablaVacia(resPlantillas);
  let result = await swalConfirmarYCancelar.fire({
    title: "Estás seguro que deseas utilizar esta plantilla?",
    icon: "warning",
    width: "850px",
    html: formatotablavacia,
    showCancelButton: true,
    confirmButtonText: "Sí",
    cancelButtonText: "No",
  })
  if (result.isConfirmed) {
    _tabla().outerHTML = formatotablavacia;
    borrarListaOrdenarPlantillasTablaActual();
    tablasSortable();
  }
  Swal.close();
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
  let productos = resPlantillas.productos;
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


function devuelveProductoVacio(producto) {
  let cantidadcolumnas = _cantidadSaleYEntra();
  let formatoTablaLlena = `<tr><td contenteditable="true">${producto.producto}</td><td contenteditable="true">${producto.precio.normalizarPrecio()}</td>`
  for (let i = 0; i < cantidadcolumnas - 4; i++) {
    formatoTablaLlena += `<td contenteditable="true"></td>`
  }
  formatoTablaLlena += `<td></td><td class="borrarfilas"></td></tr>`
  return formatoTablaLlena;
}

//TODO optimizar estos que dicen mezclar
function mezclarSinEliminarOrdenTabla(productos) {
  let filas = [..._cuerpo().rows];
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
  let filas = [..._cuerpo().rows];
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
  let filas = [..._cuerpo().rows];
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
  let filas = [..._cuerpo().rows];
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
String.prototype.normalizar = function () {
  return this.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
}

String.prototype.normalizarPrecio = fNormalizarPrecio;
Number.prototype.normalizarPrecio = fNormalizarPrecio;
function fNormalizarPrecio() {
  return this.toFixed(2).replace(/[.,]00$/, "");
}


function cancelarSwal() {
  Swal.close();
}

function creaTablaVacia(res) {
  let formatotablavacia = `<table>
  <thead>
    <col><col>
    <colgroup class="pintarcolumnas">
      <col span="2">
    </colgroup>
    <col><col>
    <tr>
      <th rowspan="2"class="prod">Productos</th>
      <th rowspan="2" class="tr">Precio</th>
      <th colspan="2" scope="colgroup" class="borrarcolumnas">Viaje No. 1</th>
      <th rowspan="2" class="tr columnaVendidos">Vendidos</th>
      <th rowspan="2" class="tr">Ingresos</th>
    </tr>
    <tr class="saleYEntra">
      <th scope="col">Sale</th>
      <th scope="col">Entra</th>
    </tr>
  </thead>
  <tbody class="cuerpo">`;
  for (let i = 0; i < res.productos.length; i++) {
    formatotablavacia += `<tr>
    <td contenteditable="true">${res.productos[i].producto}</td>
    <td contenteditable="true">${res.productos[i].precio.normalizarPrecio()}</td>
    <td contenteditable="true"></td>
    <td contenteditable="true"></td>
    <td></td>
    <td class="borrarfilas"></td></tr>`
  }
  formatotablavacia += `</tbody>
    <tfoot>
      <tr><td colspan="4">Total:</td><td></td><td></td></tr>
    </tfoot>
  </table>`;
  return formatotablavacia;
}

document.querySelector(".agregarcamion").addEventListener("click", async () => {
  let cantidadTabs = _cantidadTabs();
  let res = await pidePlantilla(plantillaDefault);
  let formatotablavacia = creaTablaVacia(res);
  let nuevoCamion = `<div data-tabid="${cantidadTabs}" class="tabs__content">
  <div class="contenedor-trabajador">
  <label class="label-trabajador">Nombre del conductor:</label>
  <div class="contenedor-input-trabajador">
  <input type="text" class="form-control trabajador"><div class="btn-group dropend">
  <button type="button" class="btn btn-sm btn-secondary dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown">
    <span class="visually-hidden">Toggle Dropdown</span></button>
  <ul class="dropdown-menu dropdown-menu-dark">
  ${devuelveCamioneros()}
  </ul></div></div></div>`
  nuevoCamion += formatotablavacia + "</div>";
  let nuevaTab = `<div class="tab">
  <input data-tabid="${cantidadTabs}" type="radio" class="tabs__radio" name="tab" id="tab${cantidadTabs}"/>
  <label for="tab${cantidadTabs}" class="tabs__label borrarcamiones">Camión ${(cantidadTabs + 1)}</label>
</div>`
  $(".agregarcamion").before(nuevaTab);
  $(".contenidoTabs").append(nuevoCamion);
  tablasSortable();
});

$("body").on('click', '.grupotabs .dropdown-item', function () {
  $(this).closest(".tabs__content").find(".trabajador").val(this.innerText);
});

$("body").on('click', '.swal2-html-container .dropdown-toggle', function (e) {
  let altura = ($(this).next().children().length - 4) * 30 + 135;
  this.closest(".swal2-html-container").style.minHeight = `${altura}px`;
});

$("body").on('click', '.swal2-html-container .dropdown-item', function () {
  $(this).closest(".dropend").prev().val(this.innerText);
});

$("body").on('hide.bs.dropdown', '#dropdowncamionero', function () {
  this.closest(".swal2-html-container").style.minHeight = "68.2px";
});


function devuelveCamioneros() {
  return camioneros.map(el => `<li class="dropdown-item">${el}</li>`).join("")
}

// var element = document.querySelector('.contenidotabs');
// var observer = new MutationObserver(function(mutations) {
//     mutations.forEach(function(mutation) {
//       console.log(mutation.type)
//         if (mutation.type === "childList") {
//             console.log("attributes changed");
//         }
//     });
// });
// observer.observe(element, { childList: true, subtree: false });

colocarDatosTabla()
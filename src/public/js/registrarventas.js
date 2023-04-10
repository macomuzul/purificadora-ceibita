dayjs.extend(window.dayjs_plugin_utc);
let colscomienzo = 2;
let colsfinal = 2;
let fecha = document.querySelector(".fechanum").textContent.split("/"); //este hay que ponerle textcontent porque si esta escondido con innertext no lo agarra
let hoy = dayjs(fecha[2] + "-" + fecha[1] + "-" + fecha[0]).utc(true);
let timer;
let touchduration = 600;
let listaplantillas = [];
let arreglado;
let resPlantillas = {};
let yaSeRecibioTouch = false;

let desdeElMobil = function () { return /Android|webOS|iPhone|iPad|tablet/i.test(navigator.userAgent) }

if (desdeElMobil())
  document.querySelector(".modal-dialog").classList.remove("modal-dialog-centered", "modal-lg")

const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]') //estos son para el bootstrap
const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl))

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

$(document).on("dblclick", ".fecha", () => document.querySelectorAll(".fecha").forEach(el => el.classList.toggle("esconder")));
let opcionBorrarFilasYColumnas = -1;
let opcionBorrarCamiones = -1;
let opcionExportarPDF = -1;
let switchOrdenarProductos = -1;
let switchOrdenarCamiones = -1;
let switchOrdenarOrdenAlfabetico = -1;

$(function () {
  colocarValoresConfig();
  guardarValoresConfig();
})

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

  if (switchOrdenarCamiones && typeof $.Widget === "undefined") {
    await $.getScript('/jquery-ui-1.13.js');
    if (desdeElMobil() && !yaSeRecibioTouch)
    {
      await $.getScript('/touch.js');
      yaSeRecibioTouch = true;
    }
  }

  if (typeof $.Widget !== "undefined") {
    $(".tabs").sortable({
      axis: "x", stop: function () {
        let tabs = document.querySelectorAll(".tabs label");
        for (let i = 0; i < tabs.length; i++) {
          tabs[i].innerText = `Camión ${i + 1}`;
        }
      },
      items: "> div:not(:last-child)",
      disabled: !switchOrdenarCamiones,
      stop: function () {
        reacomodarCamiones();
        Swal.fire(
          "Se ha cambiado el orden",
          "Se ha cambiado el orden de los camiones exitosamente",
          "success"
        );
      }
    });
  }
 
}

$(document).on("click", ".guardarconfig", () => {
  colocarValoresConfig();
  guardarValoresConfig();
})

function colocarValoresConfig() {
  opcionBorrarFilasYColumnasNuevo = $('[name="borrarfilasycolumnas"]:checked').parent().index() - 1;
  opcionBorrarCamionesNuevo = $('[name="borrarcamiones"]:checked').parent().index() - 1;
  opcionExportarPDFNuevo = $('[name="exportarpdf"]:checked').parent().index() - 1;
  switchOrdenarCamionesNuevo = $("#switchreordenarcamiones")[0].checked;
  switchOrdenarOrdenAlfabeticoNuevo = $("#switchreordenalfabetico")[0].checked;

  if (opcionBorrarFilasYColumnasNuevo !== opcionBorrarFilasYColumnas) {
    if (opcionBorrarFilasYColumnasNuevo === 0) {
      $(document).on("pointerdown", ".borrarcolumnas", borrarColumnasHandler);
      $(document).on("pointerdown", ".borrarfilas", borrarFilasHandler);
      if (opcionBorrarFilasYColumnas === 1) {
        $(document).off("click", ".borrarcolumnas", borrarColumnasHandler);
        $(document).off("click", ".borrarfilas", borrarFilasHandler);
      }
    }
    if (opcionBorrarFilasYColumnasNuevo === 1) {
      $(document).on("click", ".borrarcolumnas", borrarColumnasHandler);
      $(document).on("click", ".borrarfilas", borrarFilasHandler);
      if (opcionBorrarFilasYColumnas === 0) {
        $(document).off("pointerdown", ".borrarcolumnas", borrarColumnasHandler);
        $(document).off("pointerdown", ".borrarfilas", borrarFilasHandler);
      }
    }
    if (opcionBorrarFilasYColumnasNuevo === 2) {
      if (opcionBorrarFilasYColumnas === 0) {
        $(document).off("pointerdown", ".borrarcolumnas", borrarColumnasHandler);
        $(document).off("pointerdown", ".borrarfilas", borrarFilasHandler);
      } else if (opcionBorrarFilasYColumnas === 1) {
        $(document).off("click", ".borrarcolumnas", borrarColumnasHandler);
        $(document).off("click", ".borrarfilas", borrarFilasHandler);
      }
    }
  }

  if (opcionBorrarCamionesNuevo !== opcionBorrarCamiones) {
    if (opcionBorrarCamionesNuevo === 0) {
      $(document).on("pointerdown", ".borrarcamiones", borrarCamionesHandler);
      if (opcionBorrarCamiones === 1)
        $(document).off("click", ".borrarcamiones", borrarCamionesHandler);
    }
    if (opcionBorrarCamionesNuevo === 1) {
      $(document).on("click", ".borrarcamiones", borrarCamionesHandler);
      if (opcionBorrarCamiones === 0)
        $(document).off("pointerdown", ".borrarcamiones", borrarCamionesHandler);
    }
    if (opcionBorrarCamionesNuevo === 2) {
      if (opcionBorrarCamiones === 0)
        $(document).off("pointerdown", ".borrarcamiones", borrarCamionesHandler);
      else if (opcionBorrarCamiones === 1) {
        $(document).off("click", ".borrarcamiones", borrarCamionesHandler);
      }
    }
  }

  opcionBorrarFilasYColumnas = opcionBorrarFilasYColumnasNuevo;
  opcionBorrarCamiones = opcionBorrarCamionesNuevo;
  opcionExportarPDF = opcionExportarPDFNuevo;
  switchOrdenarCamiones = switchOrdenarCamionesNuevo;
  switchOrdenarOrdenAlfabetico = switchOrdenarOrdenAlfabeticoNuevo;
}

function reseteaValoresConfig() {
  $('[name="borrarfilasycolumnas"]:checked')[0].checked = false;
  $(`[name="borrarfilasycolumnas"]`)[opcionBorrarFilasYColumnas].checked = true;
  $('[name="borrarcamiones"]:checked')[0].checked = false;
  $(`[name="borrarcamiones"]`)[opcionBorrarCamiones].checked = true;
  $('[name="exportarpdf"]:checked')[0].checked = false;
  $(`[name="exportarpdf"]`)[opcionExportarPDF].checked = true;
  $("#switchreordenarcamiones")[0].checked = switchOrdenarCamiones;
  $("#switchreordenalfabetico")[0].checked = switchOrdenarOrdenAlfabetico;
}

document.getElementById('configs').addEventListener('hidden.bs.modal', () => {
  reseteaValoresConfig();
})

//ordenar alfabeticamente
$(document).on("click", 'th:not([colspan="2"])', function () {
  if (switchOrdenarOrdenAlfabetico) {
    if (this.closest(".swal2-html-container"))
      return
    let table = this.closest("table");
    let flecha = window.getComputedStyle(this, ':after').content;
    let order = (flecha === '"↓"') ? "asc" : "desc";
    let separador = "-----";

    let objValores = {};
    let listaIdentifObjValores = [];

    let cuerpo = table.querySelector(".cuerpo");
    let indiceColumna = this.cellIndex;
    let nombreColumna = this.innerText;
    if (nombreColumna === "Vendidos")
      indiceColumna = cuerpo.rows[0].cells.length - 2;
    else if (nombreColumna === "Ingresos")
      indiceColumna = cuerpo.rows[0].cells.length - 1;
    else if (nombreColumna === "Sale" || nombreColumna === "Entra")
      indiceColumna += colscomienzo;
    cuerpo.querySelectorAll("tr").forEach((fila, indice) => { // <tbody> rows
      let textoCelda = fila.children[indiceColumna].innerText.toUpperCase();
      objValores[textoCelda + separador + indice] = fila.outerHTML.replace(/(\t)|(\n)/g, '');
      listaIdentifObjValores.push(textoCelda + separador + indice);
    });

    let listaElementosColumna = Array.from(cuerpo.querySelectorAll(`td:nth-child(${(indiceColumna + 1)})`))
    let todosSonNumeros = listaElementosColumna.every(el => !isNaN(parseFloat(el.innerText)))
    if (todosSonNumeros) {
      listaIdentifObjValores.sort(function (a, b) {
        let aa = a.split(separador);
        let bb = b.split(separador);
        if (aa[0] != bb[0])
          return aa[0] - bb[0];
        return cuerpo.rows[parseInt(aa[1])].cells[0].innerText.localeCompare(cuerpo.rows[parseInt(bb[1])].cells[0].innerText)
      });
    }
    else {
      listaIdentifObjValores.sort();
    }

    if (order === "desc") {
      listaIdentifObjValores.reverse();
      this.style.setProperty("--flecha", '"↓"')
    }
    else
      this.style.setProperty("--flecha", '"↑"')

    table.querySelector('.activo')?.classList.remove("activo");
    this.classList.add("activo")
    let html = "";
    listaIdentifObjValores.forEach(key => html += objValores[key]);
    table.getElementsByTagName("tbody")[1].innerHTML = html;
  }
});

const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: "btn btn-success margenbotonswal",
    cancelButton: "btn btn-danger margenbotonswal",
  },
  buttonsStyling: false,
});
const swalWithBootstrapButtons2 = Swal.mixin({
  customClass: {
    confirmButton: "btn btn-primary margenbotonswal btncontinuar",
  },
  buttonsStyling: false,
});
const swalWithBootstrapButtons3 = Swal.mixin({
  customClass: {
    confirmButton: "botonswal3 botonconfirm",
    denyButton: "botonswal3 botondeny",
    cancelButton: "botonswal3 botoncancel",
  },
  buttonsStyling: false,
});

$("body").on("click", ".tabs input", function (e) {
  document.querySelectorAll(".tabs__content").forEach(el => el.style.display = "none");
  let contenido = document.querySelector(`.contenidotabs [data-tabid="${e.currentTarget.dataset.tabid}"]`)
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
    let totalajustado = normalizarPrecio(totalingresos);
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
      celdaIngresos.innerText = normalizarPrecio(sumaIngresos);
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
  if (this.closest(".swal2-html-container"))
    return
  borrarElementos(e, opcionBorrarFilasYColumnas, borrarColumnas, this);
}

function borrarFilasHandler(e) {
  if (this.closest(".swal2-html-container"))
    return
  borrarElementos(e, opcionBorrarFilasYColumnas, borrarFilas, this);
}

function borrarCamionesHandler(e) {
  if (this.closest(".swal2-html-container"))
    return
  borrarElementos(e, opcionBorrarCamiones, borrarCamiones, this);
}

function borrarElementos(e, opcion, metodo, elementoSeleccionado) {
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
  let result = await swalWithBootstrapButtons.fire({
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
    if (cuerpo.rows.length === 1) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `No puedes borrar todos los productos, debe haber al menos uno`,
      });
      return;
    }

    cuerpo.removeChild(filaborrar);
    calcularvendidoseingresostotal(cuerpo)
    Swal.fire(
      "Se ha eliminado el producto",
      "Se ha eliminado el producto y su contenido exitosamente",
      "success"
    );
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
  let result = await swalWithBootstrapButtons.fire({
    title: "Estás seguro que deseas borrar esta columna y todos sus contenidos?",
    icon: "warning",
    width: window.innerWidth * 3 / 4,
    html: textoBorrarColumnas,
    showCancelButton: true,
    confirmButtonText: "Sí",
    cancelButtonText: "No",
  })
  if (result.isConfirmed) {
    if (_cantidadViajes() === 1) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `No puedes borrar todos los viajes, debe haber al menos uno`,
      });
      return;
    }

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
    columnaborrartexto.forEach((columnaborrartxt, index) => columnaborrartxt.innerHTML = "<div>Viaje No. " + (index + 1) + "</div>");
    for (let i = 0; i < cuerpo.rows.length; i++) {
      calcularvendidoseingresos(cuerpo.rows[i])
    }
    calcularvendidoseingresostotal(cuerpo);
    Swal.fire(
      "Se ha eliminado la columna",
      "Se ha eliminado la columna y todos sus contenidos exitosamente",
      "success"
    );
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
  let listaCamiones = Array.from(document.querySelectorAll(".grupotabs .tabs__radio"));
  let listaTablas = [];
  listaCamiones.forEach(el => {
    let tabla = document.querySelector(`.contenidotabs [data-tabid="${el.dataset.tabid}"] table`)
    listaTablas.push(tabla)
  })
  return listaTablas;
}

$("#guardar").on("click", async function () {
  let respuesta = await borrarTablasVacias();
  if (!respuesta)
    return;
  let tabscontenido = document.querySelectorAll(".grupotabs .tabs__content");
  for (let i = 0; i < tabscontenido.length; i++) {
    respuesta = await validarTrabajador(tabscontenido[i].querySelector("input"), i + 1);
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
    // TODO agregar este guardar += `{ "nombretrabajador": "${document.getElementById("trabajador").value.trim()}", "filas": [`;
    guardar += `{ "nombretrabajador": "", "filas": [`;
    for (let i = 0; i < cantidadProductos; i++) {
      let fila = cuerpo.rows[i];
      let cantidadViajesMasComienzo = tabla.querySelector(".pintarColumnas").children.length * 2 + colscomienzo;
      guardar += `{ "nombreproducto": "${fila.cells[0].innerText.trim()}", 
      "precioproducto": ${fila.cells[1].innerText},
      "viajes": [`
      for (let j = colscomienzo; j < cantidadViajesMasComienzo; j += 2) {
        guardar += `{ "sale": ${fila.cells[j].innerText}, "entra": ${fila.cells[j + 1].innerText}`;
        if (j + 2 >= cantidadViajesMasComienzo)
          guardar += "} ";
        else
          guardar += "}, ";
      }
      guardar += "],";
      guardar += `"vendidos": ${fila.querySelector("td:nth-last-child(2)").innerText}, "ingresos": ${fila.querySelector("td:nth-last-child(1)").innerText}`
      if (i + 1 >= cantidadProductos)
        guardar += "} ";
      else
        guardar += "}, ";
    }
    guardar += `], 
                "totalvendidos": ${filapie.cells[1].innerText},
                "totalingresos": ${filapie.cells[2].innerText}`

    if (indice + 1 >= cantidadTablas)
      guardar += ` } `;
    else
      guardar += ` }, `;
  })
  guardar += `]} `;

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
      let valor = { producto: normalizar(productos[i].innerText), vendidos: parseInt(vendidos[i].innerText), ingresos: parseFloat(ingresos[i].innerText), productoDesnormalizado: productos[i].innerText }
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

  console.log(result);

  let contador = 0;
  let html = `<table id="tablaresumen" style="margin-left: auto; margin-right:auto"><thead><tr>
    <th class="thresumenproducto">Productos</th>
    <th class="thresumenvendidoseingresos">Vendidos</th>
    <th class="thresumenvendidoseingresos">Ingresos</th>
  </tr></thead><tbody>`;
  for (const key in result) {
    html += `<tr><td>${result[key].productoDesnormalizado}</td>
    <td>${isNaN(result[key].vendidos) ? 0 : result[key].vendidos}</td>
    <td>${isNaN(result[key].ingresos) ? 0 : result[key].ingresos}</td></tr>`
    contador++;
  }
  html += `</tbody><tfoot><tr><td style="text-align: center">Total:</td>
  <td class="totalresumen"></td><td class="totalresumen"></td></tr></tfoot></table>`

  $(document.body).append(html)
  calcularvendidoseingresostotal($("#tablaresumen tbody")[0]);
  await swalWithBootstrapButtons2.fire({
    title: "Aquí puedes ver todo lo que vendiste durante el día",
    width: window.innerWidth * 0.6,
    html: $("#tablaresumen")[0],
    confirmButtonText: "Continuar",
  })
});

async function borrarFilasVacias(tabla, numtabla) {
  let tablaCopia = tabla.cloneNode(true);
  let cuerpoCopia = tablaCopia.querySelector(".cuerpo");
  let filasCopia = Array.from(cuerpoCopia.rows)
  let filasQueNoEstanVacias = filasCopia.filter(fila => {
    let celdasEspecificas = Array.from(fila.querySelectorAll("td:not(:nth-child(1),:nth-child(2),:nth-last-child(1),:nth-last-child(2))"))
    let res = celdasEspecificas.every(celda => celda.innerText === "0")
    if (res) {
      let todasLasCeldas = Array.from(fila.querySelectorAll("td"))
      todasLasCeldas.forEach(celda => celda.classList.add("enfocar"))
    }
    return !res;
  });
  if (filasQueNoEstanVacias.length === cuerpoCopia.rows.length)
    return true;

  let tablaCopiaSinFilasVacias = tabla.cloneNode(true);
  let tablaSinFilasVacias = ""
  filasQueNoEstanVacias.forEach(el => tablaSinFilasVacias += el.outerHTML)
  tablaCopiaSinFilasVacias.querySelector(".cuerpo").innerHTML = tablaSinFilasVacias

  Array.from(tablaCopia.querySelectorAll(".cuerpo td")).forEach(el => el.setAttribute("contenteditable", false))
  Array.from(tablaCopiaSinFilasVacias.querySelectorAll(".cuerpo td")).forEach(el => el.setAttribute("contenteditable", false))

  let result = await swalWithBootstrapButtons3.fire({
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
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `No se puede guardar la tabla ${numtabla} porque está vacía`,
      });
      return false;
    }
    let filasVacias = Array.from(tabla.querySelector(".cuerpo").rows).filter(fila => {
      let celdasEspecificas = Array.from(fila.querySelectorAll("td:not(:nth-child(1),:nth-child(2),:nth-last-child(1),:nth-last-child(2))"))
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

  let result = await swalWithBootstrapButtons.fire({
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
    let celdaPrecios = cuerpocopia.rows[i].cells[1];
    if (celdaProductos.innerHTML === "") {
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
  let result = await swalWithBootstrapButtons.fire({
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
  let tablas = Array.from(document.querySelectorAll(".contenidotabs table"));
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

  let result = await swalWithBootstrapButtons.fire({
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
    Swal.fire(
      "Se han eliminado las tablas vacías",
      "Se han eliminado las tablas vacías exitosamente",
      "success"
    );
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
  let result = await swalWithBootstrapButtons.fire({
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

    $(label).parent().remove();
    $(`.grupotabs .tabs__content[data-tabid=${id}]`).remove();
    reacomodarCamiones();
    Swal.fire(
      "Se ha eliminado el camión",
      "Se ha eliminado el camión exitosamente",
      "success"
    );
    return true;
  }
  return false;
}

async function soloHayUnCamion() {
  if ($(".grupotabs table").length === 1) {
    await Swal.fire({
      icon: "error",
      title: "Error",
      text: `No se puede borrar, debe haber al menos un camión`,
    });
    return true;
  }
  return false;
}

function reacomodarCamiones() {
  document.querySelectorAll(".grupotabs .tab").forEach((tab, index) => {
    let checkbox = tab.querySelector("input");
    let id = checkbox.dataset.tabid;
    document.querySelector(`.grupotabs .tabs__content[data-tabid="${id}"]`).dataset.tabid = index;
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

async function validarTrabajador(textbox, numerotabla) {
  if (textbox.value !== "")
    return true;

  let result = await swalWithBootstrapButtons2.fire({
    icon: "warning",
    width: window.innerWidth * 3 / 4,
    html: `
      <h3>El nombre del trabajador del camión ${numerotabla} está vacío.
      <br>
      Estás seguro que desesas dejarlo asi? </h3>
      <br>
      <div class="divtrabajadorrevisar">
      <input type="text" class="form-control" id="trabajadorrevisar" style="width: 260px; max-width: 260px; text-align:center;" placeholder="Escribe el nombre del trabajador" />
      </div>
      <br>
      <h3>Puedes escribir un nombre aquí o dejarlo en blanco y continuar</h3>
      <br>`,
    confirmButtonText: "Continuar",
  })
  if (result.isConfirmed) {
    textbox.value = $("#trabajadorrevisar")[0].value;
    return true;
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
  if (typeof TableToExcel === "undefined")
    await $.getScript('/tableToExcel.js');
  let fechastr = hoy.format("D-M-YYYY");
  let nombre = `registro ventas ${fechastr} ${document.querySelector(".grupotabs .tabs__radio:checked + label").innerText}.xlsx`;
  TableToExcel.convert(_tabla(),
    {
      name: nombre,
      sheet: {
        name: fechastr
      }
    });
})

//TODO cambiar estos tambien
document.getElementById("exportarpdf").addEventListener("click", async function () {
  if (typeof jsPDF === "undefined") {
    // await $.getScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/1.5.3/jspdf.debug.js');
    // await $.getScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.3.2/html2canvas.js');
    await $.getScript('/jspdf-1.5.3.js');
    await $.getScript('/html2canvas-1.3.2.js');
  }
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
    $(document.body).remove(medirTabla)
    copiaTabla.querySelector(".pintarcolumnas").innerHTML = "";
    let copiaCuerpo = copiaTabla.querySelector(".cuerpo");
    let filas = Array.from(copiaCuerpo.rows)
    filas.forEach(fila => {
      let celdas = fila.querySelectorAll("td:not(:nth-child(1),:nth-child(2),:nth-last-child(1),:nth-last-child(2))");
      let impar = true;
      for (let i = 0; i < celdas.length; i += 2) {
        if (impar) {
          celdas[i].style.background = "#024649";
          celdas[i + 1].style.background = "#024649";
        }
        else {
          celdas[i].style.background = "#192435";
          celdas[i + 1].style.background = "#192435";
        }
        impar = !impar;
      }
    });
    html += `${copiaTabla.outerHTML}<br><br>`
  });
  doc.html(html, {
    x: margin,
    y: margin,
    html2canvas: {
      scale
    },
    callback: doc => {
      // doc.output("dataurlnewwindow", {
      //   filename: "archivohtml2pdf.pdf"
      // })
      let fechastr = hoy.format("D-M-YYYY");
      let nombre = `registro ventas ${fechastr} ${document.querySelector(".grupotabs .tabs__radio:checked + label").innerText}.pdf`;
      if (desdeElMobil()) {
        var blob = doc.output("blob", {
          filename: nombre
        });
        window.open(URL.createObjectURL(blob));
      }
      // else
      //   doc.save(nombre);
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
        Swal.fire({
          icon: "error",
          title: "Ups...",
          text: "Ha habido un error",
        });
        return;
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
      <td>${normalizarPrecio(res.productos[i].precio)}</td>
      </tr>`;
  }
  formatotabla += `</tbody></table>`;
  resPlantillas = res;
  let result = await swalWithBootstrapButtons.fire({
    title: "Estás seguro que deseas utilizar esta plantilla?",
    icon: "warning",
    html: formatotabla,
    showCancelButton: true,
    confirmButtonText: "Sí",
    cancelButtonText: "No",
  })
  if (result.isConfirmed) {
    await opcionesPlantilla();
  }
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

function crearPlantillaVacia() {
  let formatotablavacia = creaTablaVacia(resPlantillas);
  _tabla().outerHTML = formatotablavacia;
  Swal.close();
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

async function mezclarEliminandoHandler() {
  await mezclarHandler(mezclarEliminandoOrdenTabla, mezclarEliminandoOrdenPlantilla);
}


async function mezclarSinEliminarHandler() {
  await mezclarHandler(mezclarSinEliminarOrdenTabla, mezclarSinEliminarOrdenPlantilla);
}


async function mezclarHandler(callbackConfirmado, callbackDenegado) {
  let result = await swalWithBootstrapButtons3.fire({
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
  let res = resPlantillas;
  let formatoTablaLlena = callback(res);
  let tabla = _tabla();
  let tablaCopia = tabla.cloneNode(true);
  let cuerpoCopia = tablaCopia.querySelector(".cuerpo");
  cuerpoCopia.innerHTML = formatoTablaLlena;
  calcularvendidoseingresostotal(cuerpoCopia)

  let result = await swalWithBootstrapButtons.fire({
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
}

function mezclarEliminandoOrdenPlantilla(res) {
  let cuerpo = _cuerpo();
  let filas = Array.from(cuerpo.rows);
  let cantidadcolumnas = _cantidadSaleYEntra();
  let formatoTablaLlena = "";

  listaOriginal = [];
  listaSeleccionada = [];
  filas.forEach(el => listaOriginal.push(normalizar(el.cells[0].innerText)));
  res.productos.forEach(el => listaSeleccionada.push(normalizar(el.producto)));

  for (let i = 0; i < res.productos.length; i++) {
    let siEsta = false;
    for (let j = 0; j < filas.length; j++) {
      if (listaSeleccionada[i] === listaOriginal[j]) {
        let filaCopia = filas[j].cloneNode(true);
        filaCopia.cells[0].innerHTML = res.productos[i].producto;
        filaCopia.cells[1].innerHTML = normalizarPrecio(res.productos[i].precio);
        calcularvendidoseingresos(filaCopia);
        formatoTablaLlena += filaCopia.outerHTML;
        siEsta = true;
        break;
      }
    }
    if (!siEsta) {
      formatoTablaLlena += `<tr><td contenteditable="true">${res.productos[i].producto}</td><td contenteditable="true">${normalizarPrecio(res.productos[i].precio)}</td>`
      for (let i = 0; i < cantidadcolumnas - 4; i++) {
        formatoTablaLlena += `<td contenteditable="true"></td>`
      }
      formatoTablaLlena += `<td></td><td class="borrarfilas"></td></tr>`
    }
  }
  return formatoTablaLlena;
}


function mezclarSinEliminarOrdenPlantilla(res) {
  let cuerpo = _cuerpo();
  let filas = Array.from(cuerpo.rows);
  let cantidadcolumnas = _cantidadSaleYEntra();
  let formatoTablaLlena = "";

  listaOriginal = [];
  listaSeleccionada = [];
  filas.forEach(el => listaOriginal.push(normalizar(el.cells[0].innerText)));
  res.productos.forEach(el => listaSeleccionada.push(normalizar(el.producto)));

  for (let i = 0; i < res.productos.length; i++) {
    let siEsta = false;
    for (let j = 0; j < filas.length; j++) {
      if (listaSeleccionada[i] === listaOriginal[j]) {
        let filaCopia = filas[j].cloneNode(true);
        filaCopia.cells[0].innerHTML = res.productos[i].producto;
        filaCopia.cells[1].innerHTML = normalizarPrecio(res.productos[i].precio);
        calcularvendidoseingresos(filaCopia);
        formatoTablaLlena += filaCopia.outerHTML;
        siEsta = true;
        break;
      }
    }
    if (!siEsta) {
      formatoTablaLlena += `<tr><td contenteditable="true">${res.productos[i].producto}</td><td contenteditable="true">${normalizarPrecio(res.productos[i].precio)}</td>`
      for (let i = 0; i < cantidadcolumnas - 4; i++) {
        formatoTablaLlena += `<td contenteditable="true"></td>`
      }
      formatoTablaLlena += `<td></td><td class="borrarfilas"></td></tr>`
    }
  }

  for (let i = 0; i < filas.length; i++) {
    let siEsta = false;
    for (let j = 0; j < res.productos.length; j++) {
      if (listaSeleccionada[j] === listaOriginal[i]) {
        siEsta = true;
        break;
      }
    }
    if (!siEsta)
      formatoTablaLlena += filas[i].outerHTML;
  }
  return formatoTablaLlena;
}

function mezclarEliminandoOrdenTabla(res) {
  let cuerpo = _cuerpo();
  let filas = Array.from(cuerpo.rows);
  let cantidadcolumnas = _cantidadSaleYEntra();
  let formatoTablaLlena = "";

  listaOriginal = [];
  listaSeleccionada = [];
  filas.forEach(el => listaOriginal.push(normalizar(el.cells[0].innerText)));
  res.productos.forEach(el => listaSeleccionada.push(normalizar(el.producto)));

  for (let i = 0; i < filas.length; i++) {
    for (let j = 0; j < res.productos.length; j++) {
      if (listaSeleccionada[j] === listaOriginal[i]) {
        let filaCopia = filas[i].cloneNode(true);
        filaCopia.cells[0].innerHTML = res.productos[j].producto;
        filaCopia.cells[1].innerHTML = normalizarPrecio(res.productos[j].precio);
        calcularvendidoseingresos(filaCopia);
        formatoTablaLlena += filaCopia.outerHTML;
        break;
      }
    }
  }

  for (let i = 0; i < res.productos.length; i++) {
    let siEsta = false;
    for (let j = 0; j < filas.length; j++) {
      if (listaSeleccionada[i] === listaOriginal[j]) {
        siEsta = true;
        break;
      }
    }
    if (!siEsta) {
      formatoTablaLlena += `<tr><td contenteditable="true">${res.productos[i].producto}</td><td contenteditable="true">${normalizarPrecio(res.productos[i].precio)}</td>`
      for (let i = 0; i < cantidadcolumnas - 4; i++) {
        formatoTablaLlena += `<td contenteditable="true"></td>`
      }
      formatoTablaLlena += `<td></td><td class="borrarfilas"></td></tr>`
    }
  }
  return formatoTablaLlena;
}

function mezclarSinEliminarOrdenTabla(res) {
  let cuerpo = _cuerpo();
  let filas = Array.from(cuerpo.rows);
  let cantidadcolumnas = _cantidadSaleYEntra();
  let formatoTablaLlena = "";

  listaOriginal = [];
  listaSeleccionada = [];
  filas.forEach(el => listaOriginal.push(normalizar(el.cells[0].innerText)));
  res.productos.forEach(el => listaSeleccionada.push(normalizar(el.producto)));

  for (let i = 0; i < filas.length; i++) {
    let siEsta = false;
    for (let j = 0; j < res.productos.length; j++) {
      if (listaSeleccionada[j] === listaOriginal[i]) {
        let filaCopia = filas[i].cloneNode(true);
        filaCopia.cells[0].innerHTML = res.productos[i].producto;
        filaCopia.cells[1].innerHTML = normalizarPrecio(res.productos[i].precio);
        calcularvendidoseingresos(filaCopia);
        formatoTablaLlena += filaCopia.outerHTML;
        siEsta = true;
        break;
      }
    }
    if (!siEsta)
      formatoTablaLlena += filas[i].outerHTML;
  }

  for (let i = 0; i < res.productos.length; i++) {
    let siEsta = false;
    for (let j = 0; j < filas.length; j++) {
      if (listaSeleccionada[i] === listaOriginal[j]) {
        siEsta = true;
        break;
      }
    }
    if (!siEsta) {
      formatoTablaLlena += `<tr><td contenteditable="true">${res.productos[i].producto}</td><td contenteditable="true">${normalizarPrecio(res.productos[i].precio)}</td>`
      for (let i = 0; i < cantidadcolumnas - 4; i++) {
        formatoTablaLlena += `<td contenteditable="true"></td>`
      }
      formatoTablaLlena += `<td></td><td class="borrarfilas"></td></tr>`
    }
  }
  return formatoTablaLlena;
}

function normalizar(texto) {
  return texto.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
}

function normalizarPrecio(precio) {
  return precio.toFixed(2).replace(/[.,]00$/, "");
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
    <td contenteditable="true">${normalizarPrecio(res.productos[i].precio)}</td>
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
  <label class="label-trabajador">Nombre del trabajador:</label>
  <input type="text" class="form-control trabajador"></div>`
  nuevoCamion += formatotablavacia + "</div>";
  let nuevaTab = `<div class="tab">
  <input data-tabid="${cantidadTabs}" type="radio" class="tabs__radio" name="tab" id="tab${cantidadTabs}"/>
  <label for="tab${cantidadTabs}" class="tabs__label borrarcamiones">Camión ${(cantidadTabs + 1)}</label>
</div>`
  $(".agregarcamion").before(nuevaTab);
  $(".contenidoTabs").append(nuevoCamion);
});
colocarDatosTabla()
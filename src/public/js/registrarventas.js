dayjs.extend(window.dayjs_plugin_utc);
let colscomienzo = 2;
let colsfinal = 2;
let fecha = document.querySelector(".fechanum").textContent.split("/");
let hoy = dayjs(fecha[2] + "-" + fecha[1] + "-" + fecha[0]).utc(true);
let timer;
let touchduration = 600;
let listaplantillas = [];

document.querySelectorAll("tbody td:not(:nth-last-child(1), :nth-last-child(2))").forEach(el => el.setAttribute("contentEditable", true));
document.querySelectorAll("tbody td:last-child").forEach(el => el.classList.add("borrarfilas"));
$(document).on("dblclick", ".fecha", () => document.querySelectorAll(".fecha").forEach(el => el.classList.toggle("esconder")));

const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: "btn btn-success margenbotonswal",
    cancelButton: "btn btn-danger margenbotonswal",
  },
  buttonsStyling: false,
});
const swalWithBootstrapButtons2 = Swal.mixin({
  customClass: {
    confirmButton: "btn btn-primary margenbotonswal",
  },
  buttonsStyling: false,
});
const swalWithBootstrapButtons3 = Swal.mixin({
  customClass: {
    confirmButton: "botonconfirm",
    denyButton: "botondeny",
    cancelButton: "botoncancel",
  },
  buttonsStyling: false,
});

$(".tabs").sortable({
  axis: "x", stop: function () {
    let tabs = document.querySelectorAll(".tabs label");
    for (let i = 0; i < tabs.length; i++) {
      tabs[i].innerText = `Camion ${i + 1}`;
    }
  },
  items: "> div:not(:last-child)"
});

$("body").on("click", ".tabs input", function (e) {
  document.querySelectorAll(".tabs__content").forEach(el => el.style.display = "none");
  let contenido = document.querySelector(`.contenidotabs [data-tabid="${e.currentTarget.dataset.tabid}"]`)
  contenido.style.display = "initial"
})

$("body").on("keyup", "tr td", function (e) {
  let keycode = event.keyCode || event.which;
  if ((keycode >= 48 && keycode <= 57) || keycode === 229 || keycode === 8) {
    let tabla = $(this).closest("tbody")[0];
    let indiceFila = $(this).parent().index();
    calcularvendidoseingresos(tabla, indiceFila);
    calcularvendidoseingresostotal(tabla);
  }
});

function calcularvendidoseingresos(tabla, indiceFila) {
  let sumafila = 0;
  let fila = tabla.rows[parseInt(indiceFila)];
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

  let totalajustado = totalingresos.toFixed(2).replace(/[.,]00$/, "");
  if (!isNaN(totalingresos)) {
    if (totalingresos === 0 && !hayunnumero)
      fila.cells[y].innerText = "";
    else
      fila.cells[y].innerText = totalajustado;
  }
}



function calcularvendidoseingresostotal(cuerpo) {
  let sumaVendidos = 0;
  cuerpo.querySelectorAll("td:nth-last-child(2)").forEach(el => {
    let contenido = parseFloat(el.innerText);
    if (!isNaN(contenido))
      sumaVendidos += contenido;
  });

  let sumaIngresos = 0;
  cuerpo.querySelectorAll("td:nth-last-child(1)").forEach(el => {
    let contenido = parseFloat(el.innerText);
    if (!isNaN(contenido))
      sumaIngresos += contenido;
  });

  let celdaVendidos = $(cuerpo).parent().find("tfoot td")[1]
  if (!isNaN(sumaVendidos)) {
    if (sumaVendidos === 0)
      celdaVendidos.innerText = "";
    else
      celdaVendidos.innerText = sumaVendidos;
  }

  let celdaIngresos = $(cuerpo).parent().find("tfoot td")[2]
  if (!isNaN(sumaIngresos)) {
    if (sumaIngresos === 0)
      celdaIngresos.innerText = "";
    else
      celdaIngresos.innerText = sumaIngresos.toFixed(2).replace(/[.,]00$/, "");
  }

}


function _cantidadTabs() { return document.querySelector(".contenidotabs").children.length; }
function _idTab() { return document.querySelector(".tabs__radio:checked").dataset.tabid; }
function _tabla() { return document.querySelector(`.contenidotabs [data-tabid="${_idTab()}"] table`); }
function _cabeza() { return _tabla().querySelectorAll("tbody")[0]; }
function _cuerpo() { return _tabla().querySelector(".cuerpo"); }
function _pie() { return _tabla().querySelector("tfoot"); }
function _pintarColumnas() { return _tabla().querySelector(".pintarcolumnas") }
function _cantidadViajes() { return _pintarColumnas().children.length; }
function _saleYEntra() { return _tabla().querySelector(".saleYEntra"); }
function _cantidadSaleYEntra() { return (_pintarColumnas().children.length * 2 + colscomienzo + colsfinal); }
function _cantidadProductos() { return _cuerpo().children.length; }

document.getElementById("añadirProducto").addEventListener("click", () => {
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

document.addEventListener("pointerup", function (event) {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
});

let colborrar;
$(document).on("pointerdown", ".borrarcolumnas", function () {
  if (!timer) {
    timer = setTimeout(borrarcolumnas, touchduration);
    colborrar = this;
  }
});

async function borrarcolumnas() {
  timer = null;
  let numCol = $(colborrar).index();
  let tabla = $(colborrar).closest("table")[0]
  let textoborrarcolumnas = `<div class="contenedormensajeborrar"><table><thead><tr>  `;
  textoborrarcolumnas += `${tabla.rows[0].cells[numCol].outerHTML}</tr> <tr>${tabla.rows[1].cells[(numCol - 2) * 2].outerHTML} ${tabla.rows[1].cells[(numCol - 2) * 2 + 1].outerHTML} </tr></thead><tbody  style="background: #0f0d35;">`;
  for (let i = 2; i < tabla.rows.length - 1; i++) {
    textoborrarcolumnas += `<tr>${tabla.rows[i].cells[(numCol - 2) * 2 + 2].outerHTML} ${tabla.rows[i].cells[(numCol - 2) * 2 + 3].outerHTML}</tr>`
  }
  textoborrarcolumnas += "</tbody></table></div>";
  let result = await swalWithBootstrapButtons.fire({
    title: "Estás seguro que deseas borrar esta columna y todos sus contenidos?",
    icon: "warning",
    width: (window.innerWidth * 3) / 4,
    html: textoborrarcolumnas,
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
      cuerpo.rows[i].deleteCell((numCol - colsfinal) * 2 + colscomienzo);
      cuerpo.rows[i].deleteCell((numCol - colsfinal) * 2 + colscomienzo);
    }
    let celdatotal = $(tabla).find("tfoot td").first()[0];
    let colspan = parseInt(celdatotal.getAttribute("colspan"));
    celdatotal.setAttribute("colspan", colspan - 2);

    $(colborrar).remove();
    $(tabla).find(".saleYEntra").children().last().remove();
    $(tabla).find(".saleYEntra").children().last().remove();
    $(tabla).find(".pintarcolumnas").children().last().remove();
    let columnaborrartexto = tabla.querySelectorAll(".borrarcolumnas");
    columnaborrartexto.forEach((columnaborrartxt, index) => columnaborrartxt.innerHTML = "<div>Viaje No. " + (index+1) + "</div>");
    for (let i = 0; i < cuerpo.rows.length; i++) {
      calcularvendidoseingresos(cuerpo, i)
    }
    calcularvendidoseingresostotal(cuerpo);
    Swal.fire(
      "Se ha eliminado la columna",
      "Se ha eliminado la columna y todos sus contenidos exitosamente",
      "success"
    );
  }

};

$(document).on("pointerdown", ".borrarfilas", function () {
  if (!timer) {
    timer = setTimeout(borrarfilas, touchduration);
    filaborrar = $(this).parent()[0];
  }
});

async function borrarfilas() {
  timer = null;

  let textoborrar = `<div class="contenedormensajeborrar"><table><tbody style="background: #0f0d35;">${filaborrar.cloneNode(true).outerHTML}</tbody></table></div>`
  let result = await swalWithBootstrapButtons.fire({
    title: "Estás seguro que deseas borrar este producto de la tabla?",
    icon: "warning",
    width: (window.innerWidth * 3) / 4,
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


$("#diaanterior").click(function () {
  window.location = `/registrarventas/${hoy.subtract("1", "day").format("D-M-YYYY")}`;
});

$("#diasiguiente").click(function () {
  window.location = `/registrarventas/${hoy.add("1", "day").format("D-M-YYYY")}`;
});

function añadirceros(tabla) {
  tabla.querySelectorAll("td:not(:nth-child(1),:nth-child(2))").forEach(celda => celda.innerText = celda.innerText || 0);
}

$("#guardar").click(async function () {
  let tabscontenido = document.querySelectorAll(".tabs__content");
  for (let i = 0; i < tabscontenido.length; i++) {
    let respuesta = await verificartrabajador(tabscontenido[i].querySelector("input"), i + 1);
    if (!respuesta)
      return;
  }
  for (let i = 0; i < tabscontenido.length; i++) {
    let respuesta = await verificardatostabla(tabscontenido[i].querySelector("table"), i + 1);
    if (!respuesta)
      return;
  }
  for (let i = 0; i < tabscontenido.length; i++) {
    let respuesta = await borrarceros(tabscontenido[i].querySelector("table"), i + 1);
    if (!respuesta)
      return;
  }

  let guardar = `{ "fecha": ${hoy.valueOf()},
  "usuario": "",
  "fechacreacion": ${Date.now()},
  "fechaultimocambio": ${Date.now()},
  "camiones": [`;

  let tablas = document.querySelectorAll("table")
  for (let i = 0; i < tablas.length; i++) {
    let cuerpo = tablas[i].querySelector(".cuerpo");
    let filapie = tablas[i].querySelector("tfoot tr");
    // guardar += `{ "nombretrabajador": "${document.getElementById("trabajador").value.trim()}",
    //             "filas": [`;
    guardar += `{ "nombretrabajador": "",
                "filas": [`;
    for (let i = 0; i < _cantidadProductos(); i++) {
      row = cuerpo.rows[i];
      guardar += `{ "nombreproducto": "${row.cells[0].innerText.trim()}", 
                    "precioproducto": ${row.cells[1].innerText},
                    "viajes": [`
      for (let j = 0; j < _cantidadSaleYEntra() - 4; j += 2) {
        guardar += `{ "sale": ${row.cells[j + colscomienzo].innerText}, 
                      "entra": ${row.cells[j + colscomienzo + 1].innerText}`;
        if (j + 2 >= _cantidadSaleYEntra() - 4)
          guardar += "} ";
        else
          guardar += "}, ";
      }
      guardar += "],";
      guardar += `"vendidos": ${row.querySelector("td:nth-last-child(2)").innerText}, 
                  "ingresos": ${row.querySelector("td:nth-last-child(1)").innerText}`
      if (i + 1 >= cuerpo.rows.length)
        guardar += "} ";
      else
        guardar += "},";
    }
    guardar += `], 
                "totalvendidos": ${filapie.cells[1].innerText},
                "totalingresos": ${filapie.cells[2].innerText} } ] }`;

  }


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

async function borrarceros(tabla, numtabla) {
  let tablacopia = tabla.cloneNode(true);
  let cuerpocopia = tabla.querySelector(".cuerpo");
  let todobien = true;
  let seVaABorrar = true;
  for (let i = 0; i < cuerpocopia.rows.length; i++) {
    for (let j = 2; j < cuerpocopia.rows[i].cells.length - 2; j++) {
      let contenido = parseFloat(cuerpocopia.rows[i].cells[j].innerHTML);
      if (contenido !== 0) {
        seVaABorrar = false;
        break;
      }
    }
    if (seVaABorrar) {
      todobien = false;
      for (let j = 0; j < cuerpocopia.rows[i].cells.length; j++) {
        cuerpocopia.rows[i].cells[j].classList.add("enfocar");
      }
    }
    seVaABorrar = true;
  }

  if (todobien)
    return true;

  tablacopia = tabla.cloneNode(true);
  cuerpocopia = $(tablacopia).find("tbody")[1];

  seVaABorrar = true;
  for (let i = 0; i < cuerpocopia.rows.length; i++) {
    for (let j = 2; j < cuerpocopia.rows[i].cells.length - 2; j++) {
      let contenido = parseFloat(cuerpocopia.rows[i].cells[j].innerHTML);
      if (contenido !== 0) {
        seVaABorrar = false;
        break;
      }
    }
    if (seVaABorrar) {
      cuerpocopia.removeChild(cuerpocopia.rows[i]);
      i--;
    }
    seVaABorrar = true;
  }

  let result = await swalWithBootstrapButtons.fire({
    title: "Se han detectado filas vacias",
    icon: "warning",
    width: (window.innerWidth * 3) / 4,
    html: `<div class="textovista">Se han detectado filas vacias en la tabla ${numtabla} las cuales serán eliminadas</div>
          <br><br><br>
              <div class="contenedortab">
                  <input type="radio" class="radiotab" name="tabs" id="tab10" checked />
            <label for="tab10">Ver filas vacías</label>
            <input type="radio" class="radiotab" name="tabs" id="tab11" />
            <label for="tab11">Vista previa del resultado</label>    
            <div class="tab content1">${tablacopia.outerHTML}
          </div>
            <div class="tab content2">${nuevatablacopia.outerHTML}</div>
            </div>
            <br>
            <div class="textovista">Desea continuar?</div>
            <br>
        <br>`,
    showCancelButton: true,
    confirmButtonText: "Continuar",
    cancelButtonText: "No continuar",
  })
  if (result.isConfirmed) {
    if ($(_tabla()).find("#totalvendidos")[0].innerHTML === "0") {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `No se puede guardar la tabla ${numtabla} porque está vacía`,
      });
      return;
    }
    _tabla().outerHTML = nuevatablacopia.outerHTML;
    return true;
  }
  return false;
}

async function entramasdeloquesale(tabla, numtabla) {
  let tablacopia = tabla.cloneNode(true);
  let cuerpocopia = $(tablacopia).find("tbody")[1];

  let verificacion = true;
  for (let i = 0; i < cuerpocopia.rows.length; i++) {
    for (let j = colscomienzo; j < cuerpocopia.rows[i].cells.length - colsfinal; j += 2) {
      let valor1 = cuerpocopia.rows[i].cells[j].innerHTML;
      let valor2 = cuerpocopia.rows[i].cells[j + 1].innerHTML;
      if (parseInt(valor2) > parseInt(valor1)) {
        cuerpocopia.rows[i].cells[j].classList.add("enfocar");
        cuerpocopia.rows[i].cells[j + 1].classList.add("enfocar");
        verificacion = false;
      }
    }
  }

  if (verificacion)
    return true;

  else {
    await swalWithBootstrapButtons2.fire({
      title: `<h3>Se ha detectado filas en la tabla ${numtabla} donde lo que sale es mayor que lo que entra, por favor corrígelos para poder guardar los datos</h3>`,
      icon: "error",
      width: (window.innerWidth * 3) / 4,
      html: tablacopia,
      confirmButtonText: "Continuar",
    })

    return false;
  }
}

async function verificarprecios(tabla, numtabla) {
  let tablacopia = tabla.cloneNode(true);
  let cuerpocopia = $(tablacopia).find("tbody")[1];
  let verificacion = true;
  for (let i = 0; i < cuerpocopia.rows.length; i++) {
    if (cuerpocopia.rows[i].cells[1].innerHTML === "") {
      cuerpocopia.rows[i].cells[1].classList.add("enfocar");
      verificacion = false;
    }
  }

  if (verificacion)
    return true;
  else {
    await swalWithBootstrapButtons2.fire({
      title: `<h3>Se ha detectado valores vacíos en la columna precios de la tabla ${numtabla}
    <br>
    Por favor corrígelos para poder guardar los datos</h3>`,
      icon: "error",
      width: (window.innerWidth * 3) / 4,
      html: tablacopia,
      confirmButtonText: "Continuar",
    })
    return false;
  }
}

async function verificartrabajador(textbox, numerotabla) {
  if (textbox.value !== "")
    return true;

  let result = await swalWithBootstrapButtons2.fire({
    icon: "warning",
    width: (window.innerWidth * 3) / 4,
    html: `
      <h3>El nombre del trabajador del camion ${numerotabla} esta vacio. Estas seguro que desesas dejarlo asi? </h3>
      <br>
      <div class="divtrabajadorrevisar">
      <input type="text" class="form-control" id="trabajadorrevisar" placeholder="Escribe el nombre del trabajador" />
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

async function verificardatostabla(tabla, numtabla) {
  let verificacion = await verificarprecios(tabla, numtabla);
  if (verificacion === false)
    return false;

  añadirceros(tabla.querySelector(".cuerpo"));
  verificacion = await entramasdeloquesale(tabla, numtabla);
  return verificacion;
}

document.getElementById("exportarexcel").addEventListener("click", async function () {
  if (typeof TableToExcel === "undefined")
    await $.getScript('/tableToExcel.js');
  let fechastr = hoy.format("D-M-YYYY");
  let nombre = `registro ventas ${fechastr} ${document.querySelector(".tabs__radio:checked + label").innerText}.xlsx`;
  TableToExcel.convert(_tabla(),
    {
      name: nombre,
      sheet: {
        name: fechastr
      }
    });

})

async function pidePlantilla(nombreplantilla) {
  let plantilla = listaplantillas.find(el => el.nombre === nombreplantilla)
  let mandar = `{ "nombreplantilla": "${nombreplantilla}" }`
  if (!plantilla) {
    await $.ajax({
      url: "/plantillas/datostabla",
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
  let nombreplantilla = option.innerHTML;
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
      <td>${res.productos[i].precio.toFixed(2).replace(/[.,]00$/, "")}</td>
      </tr>`;
  }
  formatotabla += `</tbody></table>`;

  let result = await swalWithBootstrapButtons.fire({
    title: "Estás seguro que deseas utilizar esta plantilla?",
    icon: "warning",
    html: formatotabla,
    showCancelButton: true,
    confirmButtonText: "Sí",
    cancelButtonText: "No",
  })
  if (result.isConfirmed) {
    result = await swalWithBootstrapButtons3.fire({
      width: (window.innerWidth * 3) / 4,
      focusConfirm: false,
      title: 'Deseas crear una plantilla vacia o deseas guardar los elementos que coincidan con esta plantilla?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Crear plantilla vacia',
      denyButtonText: `Conservar elementos que coincidan`,
      cancelButtonText: `Cancelar`,
    })
    if (result.isConfirmed) {
      let formatotablavacia = creaTablaVacia(res);
      _tabla().outerHTML = formatotablavacia;
    }
    else if (result.isDenied) {
      let filas = _cuerpo().rows;
      let cantidadcolumnas = _cantidadSaleYEntra();
      let formatotablallena = "";

      for (let i = 0; i < res.productos.length; i++) {
        let siestaba = false;
        for (let j = 0; j < filas.length - 1; j++) {
          if (filas[j].cells[0].innerHTML.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, "") === res.productos[i].producto.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, "")) {
            filas[j].cells[0].innerHTML = res.productos[i].producto;
            filas[j].cells[1].innerHTML = res.productos[i].precio.toFixed(2).replace(/[.,]00$/, "");
            formatotablallena += filas[j].outerHTML;
            siestaba = true;
            break;
          }
        }
        if (!siestaba) {
          formatotablallena += `<tr>`;
          formatotablallena += `<td contenteditable="true">${res.productos[i].producto}</td>
                          <td contenteditable="true">${res.productos[i].precio.toFixed(2).replace(/[.,]00$/, "")}</td>`
          for (let i = 0; i < cantidadcolumnas - 4; i++) {
            formatotablallena += `<td contenteditable="true"></td>`
          }
          formatotablallena += `<td></td><td class="borrarfilas"></td></tr>`
        }
      }
      _cuerpo().innerHTML = formatotablallena;
      calcularvendidoseingresostotal(_cuerpo());
      console.log(cuerpo)
    }
  }

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
                          <td contenteditable="true">${res.productos[i].precio.toFixed(2).replace(/[.,]00$/, "")}</td>
                          <td contenteditable="true"></td>
                          <td contenteditable="true"></td>
                          <td></td>
                          <td class="borrarfilas"></td>
                          </tr>`
  }
  formatotablavacia += `</tbody>
                          <tfoot>
                          <tr>
                            <td colspan="4">Total:</td>
                            <td></td>
                            <td></td>
                          </tr>
                          </tfoot>
                        </table>`;
  return formatotablavacia
}

document.querySelector(".agregarcamion").addEventListener("click", async () => {
  let cantidadTabs = _cantidadTabs();
  let res = await pidePlantilla(plantillaDefault);
  let formatotablavacia = creaTablaVacia(res);
  let nuevoCamion = `<div data-tabid="${cantidadTabs}" class="tabs__content">
  <div class="contenedor-trabajador">
  <label class="label-trabajador" for="trabajador${cantidadTabs}">Nombre del trabajador:</label>
  <input type="text" class="form-control trabajador" id="trabajador${cantidadTabs}"></div>`
  nuevoCamion += formatotablavacia + "</div>";
  let nuevaTab = `<div class="tab">
  <input data-tabid="${cantidadTabs}" type="radio" class="tabs__radio" name="tab" id="tab${cantidadTabs}"/>
  <label for="tab${cantidadTabs}" class="tabs__label">Camión ${(cantidadTabs+1)}</label>
</div>`
  $(".agregarcamion").before(nuevaTab);
  $(".contenidoTabs").append(nuevoCamion);
});
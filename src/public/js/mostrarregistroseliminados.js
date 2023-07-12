const botonSubir = document.querySelector("#back-to-top-btn");
let tabs = document.querySelectorAll(".tabs");
let clickeados = { valores: [] }
let seleccionarTodos = document.getElementById("seleccionarTodos");
let checkboxes = document.querySelectorAll(".check");

seleccionarTodos.addEventListener("change", () => {
  if (seleccionarTodos.checked)
    checkboxes.forEach(el => el.checked = true);
  else
    checkboxes.forEach(el => el.checked = false);
});

window.addEventListener("scroll", scrollFunction);

const swalConfirmarYCancelar = Swal.mixin({
  customClass: {
    confirmButton: "btn btn-success margenbotonswal",
    cancelButton: "btn btn-danger margenbotonswal",
  },
  buttonsStyling: false,
});

const swalSobreescribir = Swal.mixin({
  customClass: {
    confirmButton: "btn btn-success margenbotonswal2 botonconfirm",
    cancelButton: "btn margenbotonswal2 botondeny",
  },
  buttonsStyling: false,
});

function scrollFunction() {
  if (window.scrollY > 0) {
    // mostrar scroller
    if (!botonSubir.classList.contains("btnEntrance")) {
      botonSubir.classList.remove("btnExit");
      botonSubir.classList.add("btnEntrance");
      botonSubir.style.display = "block";
    }
  } else {
    // esconder
    if (botonSubir.classList.contains("btnEntrance")) {
      botonSubir.classList.remove("btnEntrance");
      botonSubir.classList.add("btnExit");
      setTimeout(function () {
        botonSubir.style.display = "none";
      }, 250);
    }
  }
}

botonSubir.addEventListener("click", (e) => {
  window.scrollTo(0, 0);
});


function devuelveTabla(article) {
  let registro = $(article).find(".content")[0].cloneNode(true);
  let html = `<custom-tabs><div class="tabs">`
  $(registro).find("table").each(i => html += `<custom-label name="swal" data-id="swal${i}">Camión ${i + 1}</custom-label>`);
  html += `</div>`
  let clon = registro.cloneNode(true)
  $(clon).find("tab-content").each((i, el) => el.style.display = "none")
  html += clon.outerHTML;
  html += "</custom-tabs>";
  return { html, fecha: $(article).find(`.fecharegistro .spanFechaStr`).text(), fechaDate: parseDate($(article).find(`.fecharegistro .spanFecha`).text()) };
}

$("body").on("click", ".btnrestaurar", async function (e) {
  let registro = this.closest("article");
  let id = registro.getAttribute("name");
  let { html, fecha, fechaDate } = devuelveTabla(registro);

  let result = await swalSobreescribir.fire({
    title: `Estás seguro que deseas restaurar este registro con fecha ${fecha}?`,
    icon: "warning",
    width: (window.innerWidth * 3) / 4,
    html,
    showCancelButton: true,
    confirmButtonText: "Restaurar usando esta fecha",
    cancelButtonText: "Usar otra fecha",
  })
  if (result.isConfirmed)
    moverRegistro(id, fechaDate.valueOf(), 0)
  else if (result.dismiss === "cancel") {
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
          moverRegistro(id, parseDate(fecha).valueOf(), 0)
        });
        $(document).find("#cancelarIframe")[0].addEventListener("click", () => Swal.close());
      },
    });
  }
})


function preguntarSiQuiereRedireccionar(fecha) {
  return new Promise((_, reject) => {
    swalConfirmarYCancelar.fire({
      title: "Se ha restaurado correctamente",
      text: `El registro se ha restaurado correctamente. Deseas ser redireccionado para ver los cambios?`,
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed)
        window.location = `/registrarventas/${devuelveFechaFormateada(fecha)}`;
      else
        reject("false");
    })
  })
}

function devuelveFechaFormateada(fecha) {
  let date = new Date(fecha)
  let day = date.getUTCDate();
  let month = date.getUTCMonth() + 1;
  let year = date.getUTCFullYear();
  return `${day}-${month}-${year}`;
}

function moverRegistro(id, fecha, sobreescribir) {
  $.ajax({
    url: "/respaldos/registroseliminados/restaurarregistro",
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify({ id, fecha, sobreescribir }),
    success: async function (res) {
      if (res === "Se ha restaurado con éxito") {
        await preguntarSiQuiereRedireccionar(fecha)
        return
      }
      let html = `<custom-tabs><div class="tabs">
      ${[...Array(res.tablas.length)].map((_, i) => `<custom-label name="swal" data-id="swal${i}">Camión ${i + 1}</custom-label>`).join('')}
      </div><div class="content">`

      res.tablas.forEach(({ productos, totalvendidos, totalingresos }) => {
        let cantViajes = productos[0].viajes.length / 2;
        html += `<tab-content><table>
        <thead>
          <col>
          <col>
          <colgroup class="pintarcolumnas">
            ${[...Array(cantViajes)].map(_ => `<col span="2">`).join('')}
          </colgroup>
          <col>
          <col>
          <tr>
            <th rowspan="2" class="prod">Productos</th>
            <th rowspan="2" class="tr">Precio</th>
            ${[...Array(cantViajes)].map((_, k) => `<th colspan="2" scope="colgroup">Viaje No. ${k + 1}</th>`).join('')}
            <th rowspan="2" class="tr">Vendidos</th>
            <th rowspan="2" class="tr">Ingresos</th>
          </tr>
          <tr>
            ${[...Array(cantViajes)].map(_ => `<th scope="col">Sale</th><th scope="col">Entra</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${productos.map(({ nombre, precio, viajes, vendidos, ingresos }) => `<tr>
            <td>${nombre}</td>
            <td>${precio.toFixed(2).replace(/[.,]00$/, '')}</td>
            ${viajes
            .map(x => `<td>${x}</td>`)
            .join('')}
            <td>${vendidos}</td>
            <td>${ingresos.toFixed(2).replace(/[.,]00$/, '')}</td>
          </tr>`
        ).join('')}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="${cantViajes * 2 + 2}">Total:</td>
            <td>${totalvendidos}</td>
            <td>${totalingresos.toFixed(2).replace(/[.,]00$/, '')}</td>
          </tr>
        </tfoot>
      </table>
      </tab-content>`;
      })
      html += "</div></custom-tabs>"

      let result = await swalConfirmarYCancelar.fire({
        title: "Ya existe un registro en esa fecha, deseas sobreescribirlo?",
        icon: "warning",
        width: (window.innerWidth * 3) / 4,
        html,
        showCancelButton: true,
        confirmButtonText: "Sí",
        cancelButtonText: "No",
      })
      if (result.isConfirmed) {
        moverRegistro(id, fecha, 1)
      }
    },
    error: function (res) {
      Swal.fire("Ups...", "No se pudo restaurar el registro", "error");
    },
  });
}

$("body").on("click", ".btneliminar", async function (e) {
  let registro = this.closest("article");
  let { html, fecha } = devuelveTabla(registro);

  let result = await swalConfirmarYCancelar.fire({
    title: "Estás seguro que deseas borrar este registro?",
    icon: "warning",
    width: (window.innerWidth * 3) / 4,
    html,
    showCancelButton: true,
    confirmButtonText: "Sí",
    cancelButtonText: "No",
  })
  if (result.isConfirmed) {
    borrarRegistros(`{"registros": ["${registro.getAttribute("name")}"]}`, `El registro con fecha: ${fecha} se ha borrado correctamente`, "No se pudo eliminar el registro")
  }
})

$("body").on("click", ".restaurarsoloestatabla", async function (e) {
  let registro = this.closest("article");
  let tabla = [...$(registro).find("tab-content")].filter(x => x.style.display === "initial")[0];
  let numTabla = $(tabla).index();
  let fecha = $(registro).find(`.fecharegistro .spanFechaStr`).text();
  let result = await swalConfirmarYCancelar.fire({
    title: "Estás seguro que deseas restaurar esta tabla?",
    icon: "warning",
    width: (window.innerWidth * 3) / 4,
    html: tabla.outerHTML,
    showCancelButton: true,
    confirmButtonText: "Sí",
    cancelButtonText: "No",
  })
  if (result.isConfirmed) {
    result = await swalConfirmarYCancelar.fire({
      title: "Si restauras vas a sobreescribir el registro del dia",
      icon: "warning",
      width: (window.innerWidth * 3) / 4,
      html: tabla.outerHTML,
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: "No",
    })
    if (result.isConfirmed) {
      $.ajax({
        url: "/respaldos/registroseliminados/restaurarregistro",
        method: "POST",
        contentType: "application/json",
        data,
        success: async function (res) {
          preguntarSiQuiereRedireccionar(fecha)
          return
        },
        error: function (res) {
          Swal.fire("Ups...", "No se pudo restaurar el registro", "error");
        },
      });
    }
  }
})

$("body").on("click", ".eliminartodos", async (e) => {
  let objRegistros = { registros: [] };
  document.querySelectorAll(".check:checked").forEach(el => objRegistros.registros.push(el.closest("article").getAttribute("name")));
  let result = await swalConfirmarYCancelar.fire({
    title: "Estás seguro que deseas borrar los registros seleccionados?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí",
    cancelButtonText: "No",
  })
  if (result.isConfirmed)
    borrarRegistros(JSON.stringify(objRegistros), "Se han borrado correctamente todos los registros seleccionados", "No se pudo eliminar uno o más registros, pero los que sí se podian eliminar fueron eliminados")
})



function borrarRegistros(data, texto, textoError) {
  $.ajax({
    url: "/respaldos/registroseliminados/borrarregistros",
    method: "DELETE",
    contentType: "application/json",
    data,
    success: async function (res) {
      let result = await swalConfirmarYCancelar.fire({
        title: "Se ha borrado correctamente",
        text: texto + ", deseas refrescar la página?",
        icon: "success",
        showCancelButton: true,
        confirmButtonText: "Sí",
        cancelButtonText: "No",
      })
      if (result.isConfirmed)
        location.reload()
    },
    error: function (res) {
      Swal.fire("Ups...", textoError, "error");
    },
  });
}

function parseDate(dateString) {
  const [day, month, year] = dateString.split('/');
  return Date.UTC(year, month - 1, day);
}
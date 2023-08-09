const botonSubir = $("#back-to-top-btn")[0]
let checkboxes = $(".check")

$("#seleccionarTodos").on("change", e => checkboxes.prop("checked", e.currentTarget.checked))

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
      setTimeout(() => botonSubir.style.display = "none", 250);
    }
  }
}

$(botonSubir).on("click", (e) => window.scrollTo(0, 0))

function devuelveTabla(article) {
  let registro = $(article).find(".content")[0].cloneNode(true);
  $(registro).find("tab-content").each((_, el) => el.style.display = "none")
  let html = `<custom-tabs><div class="tabs">
  ${[...$(registro).find("table")].map((_, i) => `<custom-label name="swal" data-id="swal${i}">Camión ${(i + 1)}</custom-label>`).join("")}
  </div> ${registro.outerHTML}</custom-tabs>`
  return { html, fecha: $(article).find(`.fecharegistro .spanFechaStr`).text(), fechaDate: parseDate($(article).find(`.fecharegistro .spanFecha`).text()) };
}

$("body").on("click", ".btnrestaurar", async function (e) {
  let registro = this.closest("article");
  let id = registro.getAttribute("name");
  let { html, fecha, fechaDate } = devuelveTabla(registro);

  let { isConfirmed, dismiss } = await swalSobreescribir.fire({
    title: `Estás seguro que deseas restaurar este registro con fecha ${fecha}?`,
    icon: "warning",
    width: (window.innerWidth * 3) / 4,
    html,
    showCancelButton: true,
    confirmButtonText: "Restaurar usando esta fecha",
    cancelButtonText: "Usar otra fecha",
  })
  if (isConfirmed)
    moverRegistro(id, fechaDate.valueOf(), 0)
  else if (dismiss === "cancel") {
    result = await Swal.fire({
      title: "Escoge la fecha a donde quieres mover el registro",
      width: 750,
      html: `<iframe src="/extras/calendarioIframe" frameborder="0"></iframe><button id="continuarIframe" class="btn btn-success margenbotonswal">Continuar</button><button id="cancelarIframe" class="btn btn-danger margenbotonswal">Cancelar</button>`,
      showConfirmButton: false,
      didOpen: () => {
        $("#continuarIframe")[0].addEventListener("click", () => {
          let contenidoIframe = $("iframe")[0].contentDocument;
          let input = contenidoIframe.querySelector("input");
          let fecha = input.value;
          if (fecha === "") {
            input.classList.add("is-invalid")
            return contenidoIframe.querySelector("#validadorIframe").className = "invalid-feedback"
          }
          moverRegistro(id, parseDate(fecha).valueOf(), 0)
        })
        $("#cancelarIframe")[0].addEventListener("click", () => Swal.close())
      },
    })
  }
})


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
  let day = date.getUTCDate()
  let month = date.getUTCMonth() + 1
  let year = date.getUTCFullYear()
  return `${day}-${month}-${year}`
}

function moverRegistro(id, fecha, sobreescribir) {
  $.ajax({
    url: "/respaldos/registroseliminados/restaurarregistro",
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify({ id, fecha, sobreescribir }),
    success: async res => {
      if (res === "Se ha restaurado con éxito") return await preguntarSiQuiereRedireccionar(fecha)
      let { tablas: t } = res
      let html = `<custom-tabs><div class="tabs">
      ${t.map((_, i) => `<custom-label name="swal" data-id="swal${i}">Camión ${i + 1}</custom-label>`).join('')}
      </div><div class="content">
      ${t.map(({ productos, totalvendidos, totalingresos }) => {
        let cantViajes = productos[0].viajes.length / 2;
        return `<tab-content><table><thead>
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
      </table></tab-content>`}).join("")}
      </div></custom-tabs>`

      if (await swalSíNo("Ya existe un registro en esa fecha, deseas sobreescribirlo?", html))
        moverRegistro(id, fecha, 1)
    },
    error: q => Swal.fire("Ups...", "No se pudo restaurar el registro", "error")
  });
}

$("body").on("click", ".btneliminar", async function (e) {
  let registro = this.closest("article");
  let { html, fecha } = devuelveTabla(registro);

  if (await swalSíNo("Estás seguro que deseas borrar este registro?", html))
    borrarRegistros(`{"registros": ["${registro.getAttribute("name")}"]}`, `El registro con fecha: ${fecha} se ha borrado correctamente`, "No se pudo eliminar el registro")
})

// $("body").on("click", ".restaurarsoloestatabla", async function (e) {
//   let registro = this.closest("article");
//   let tabla = [...$(registro).find("tab-content")].filter(x => x.style.display === "initial")[0]
//   let fecha = $(registro).find(`.fecharegistro .spanFechaStr`).text();
//   if (await swalSíNo("Estás seguro que deseas restaurar esta tabla?", tabla.outerHTML)) {
//     result = await swalConfirmarYCancelar.fire({
//       title: `Si restauras vas a sobreescribir el registro con fecha ${fecha}`,
//       icon: "warning",
//       width: (window.innerWidth * 3) / 4,
//       html: tabla.outerHTML,
//       showCancelButton: true,
//       confirmButtonText: "Sí",
//       cancelButtonText: "No",
//     })
//     if (result.isConfirmed) {
//       $.ajax({
//         url: "/respaldos/registroseliminados/restaurarregistro",
//         method: "POST",
//         contentType: "application/json",
//         data,
//         success: async q => preguntarSiQuiereRedireccionar(fecha),
//         error: q => Swal.fire("Ups...", "No se pudo restaurar el registro", "error")
//       });
//     }
//   }
// })

$("body").on("click", ".eliminartodos", async (e) => {
  let objRegistros = { registros: [...$(".check:checked")].map(el => el.closest("article").getAttribute("name")) }
  if (await swalSíNo("Estás seguro que deseas borrar los registros seleccionados?", null, null))
    borrarRegistros(JSON.stringify(objRegistros), "Se han borrado correctamente todos los registros seleccionados", "No se pudo eliminar uno o más registros, pero los que sí se podian eliminar fueron eliminados")
})



function borrarRegistros(data, texto, textoError) {
  $.ajax({
    url: "/respaldos/registroseliminados/borrarregistros",
    method: "DELETE",
    contentType: "application/json",
    data,
    success: async q => {
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
    error: q => Swal.fire("Ups...", textoError, "error")
  });
}

function parseDate(dateString) {
  const [day, month, year] = dateString.split('/')
  return Date.UTC(year, month - 1, day)
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
let devuelveFechaFormateada = fecha => `${fecha.getUTCDate()}-${(fecha.getUTCMonth() + 1)}-${fecha.getUTCFullYear()}`

async function moverReg(fecha, url) {
  await Swal.fire({
    title: "Escoge la fecha a donde quieres mover el registro",
    width: 750,
    html: `<iframe src="/extras/calendarioIframe" frameborder="0"></iframe><button id="continuarIframe" class="btn btn-success margenbotonswal">Continuar</button><button id="cancelarIframe" class="btn btn-danger margenbotonswal">Cancelar</button>`,
    showConfirmButton: false,
    didOpen: () => {
      $("#continuarIframe")[0].addEventListener("click", () => {
        let contenidoIframe = $("iframe")[0].contentDocument
        let input = contenidoIframe.querySelector("input")
        if (input.value === "") {
          input.classList.add("is-invalid")
          return contenidoIframe.querySelector("#validadorIframe").className = "invalid-feedback"
        }
        moverRegistro(fecha, parseDate(input.value).valueOf(), 0, url)
      })
      $("#cancelarIframe")[0].addEventListener("click", () => Swal.close())
    }
  })
}

function moverRegistro(de, a, sobreescribir, url) {
  $.ajax({
    url,
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify({ de, a, sobreescribir }),
    success: async r => {
      if (r === "") return await preguntarSiQuiereRedireccionar(a)
      let html = `<custom-tabs><div class="tabs">
      ${r.map((_, i) => `<custom-label name="swal" data-id="swal${i}">Camión ${i + 1}</custom-label>`).join('')}
      </div><div class="content">
      ${r.map(({ productos, totalvendidos, totalingresos }) => {
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
        <tfoot><tr><td colspan="${cantViajes * 2 + 2}">Total:</td><td>${totalvendidos}</td><td>${totalingresos.normalizarPrecio()}</td></tr></tfoot>
      </table></tab-content>`}).join("")}
      </div></custom-tabs>`

      if (await swalSíNo("Ya existe un registro en esa fecha, deseas sobreescribirlo?", html)) moverRegistro(de, a, 1, url)
    },
    error: r => Swal.fire("Error", r.responseText, "error")
  })
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
  if (isConfirmed) window.location = `/registrarventas/${devuelveFechaFormateada(new Date(fecha))}`
}

function parseDate(dateString) {
  const [day, month, year] = dateString.split('/')
  return Date.UTC(year, month - 1, day)
}
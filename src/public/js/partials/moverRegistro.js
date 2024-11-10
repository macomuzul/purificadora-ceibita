let devuelveFechaFormateada = fecha => `${fecha.getUTCDate()}-${(fecha.getUTCMonth() + 1)}-${fecha.getUTCFullYear()}`
let cargaronLibsDP = false
añadirCSS(`#datepickerNormal{
  height: 40px;
}
.fa-calendar{
  color: #615b5b;
  font-size: 20px;
}`)

async function moverReg(fecha, url) {
  await Swal.fire({
    title: "Escoge la fecha a donde quieres mover el registro",
    width: 750,
    showConfirmButton: false,
    html: 'Cargando',
    willOpen: async q => {
      if (!cargaronLibsDP) {
        await añadirJS("/bootstrapdatepicker.js")
        cargaronLibsDP = true
      }
    },
    didOpen: async q => {
      Swal.showLoading()
      cargaronLibsDP ? mostrarDP(fecha, url) : document.addEventListener('eventoDP', q => mostrarDP(fecha, url))
    }
  })
}

function mostrarDP(fecha, url) {
  Swal.hideLoading()
  qs('#swal2-html-container').html(`<div style="display: flex; height: 400px; justify-content: center;"><div><calendario-simple></calendario-simple><div class="invalid-feedback">Por favor escoge una fecha</div></div></div>
  <button id="continuarCal" class="btn btn-success margenbotonswal">Continuar</button><button id="cancelarCal" class="btn btn-danger margenbotonswal">Cancelar</button>`)
  let dp = $(`#calendario`)
  let validacion = (c, a) => {
    $('.input-group-text').css('border-color', c)
    dp.css('border-color', c)
    qs('.invalid-feedback')[a]()
  }
  dp.datepicker({ weekStart: 1, language: "es", autoclose: true, maxViewMode: 2, todayHighlight: true, format: "dd/mm/yyyy" })

  dp.on('change', q => validacion('#ced4da', 'esconder'))
  qsclick('#continuarCal', q => {
    let input = dp[0]
    if (input.value === '') return validacion('red', 'mostrar')
    moverRegistro(fecha, parseDate(input.value).valueOf(), 0, url)
  })
  qsclick('#cancelarCal', q => Swal.close())
  setTimeout(q => dp.datepicker('show'), cargaronLibsDP ? 150 : 0)
}

function moverRegistro(de, a, sobreescribir, url) {
  hazPost(url, JSON.stringify({ de, a, sobreescribir }), async r => {
    if (r === '') return await preguntarSiQuiereRedireccionar(a)
    let html = `<custom-tabs><div class="tabs">
    ${r.map((_, i) => `<tab-label name="swal" data-id="swal${i}">Camión ${i + 1}</tab-label>`).join('')}
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
    </table></tab-content>`}).join('')}
    </div></custom-tabs>`

    if (await swalSíNo("Ya existe un registro en esa fecha, deseas sobreescribirlo?", html)) moverRegistro(de, a, 1, url)
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
  if (isConfirmed) location = `/registrarventas/${devuelveFechaFormateada(new Date(fecha))}`
}

function parseDate(dateString) {
  const [day, month, year] = dateString.split('/')
  return Date.UTC(year, month - 1, day)
}
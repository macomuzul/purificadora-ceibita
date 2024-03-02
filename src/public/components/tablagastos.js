let tablaVacia = `<div class="titulo ningunregistro">Aún no se ha registrado ningún gasto de este tipo este mes</div>`
let fechastr = $('#fechames').text().replace('del mes ', '')

class tablaGastos extends HTMLElement {
  inicializar(datos, titulo, idTabla, esGastoPorProducto) {
    Object.assign(this, { datos, titulo, idTabla, esGastoPorProducto, datos: datos || [] })
    let tieneData = datos?.length > 0
    $(this).html(`${this.htmlTitulo()}<div class="tablagastosparteinferior">${tieneData ? this.crearTabla(1) : tablaVacia}</div>`)
    if (!tieneData) $(this).find('.botonesExportar').hide()

    $(this).on('click', '.botonregistrargasto', e => {
      $(this).find('table').length > 0 ? $(this).find('tbody').append(this.añadirFila([])) : $(this).find('.tablagastosparteinferior').html(this.crearTabla(0))
      convierteDatePicker($(this).find('.divdatepicker'))
    })

    this.tituloHoja = titulo.replace('Tabla de ', '')
    this.id = idTabla
  }

  htmlTitulo() {
    return `<hr>
    <div class="divtitulo">
    <div><button class="btn btn-primary botonazul botonregistrargasto">Agregar gasto</button></div>
    <div class="titulo">${this.titulo}</div>
    <switch-sortable></switch-sortable>
    </div>`
  }

  crearTabla(inicializando) {
    let { esGastoPorProducto, datos, idTabla } = this
    $(this).find('.botonesExportar').show()
    return `<div class="divtablagastos">
    <table class="${idTabla}">
      <thead><tr>${esGastoPorProducto ? `<th>Producto</th><th>Fecha</th><th>Costo unitario</th><th>Cantidad comprados</th><th>Gasto total</th><th>Descripción (Opcional)</th>` : `<th>Concepto de gasto</th><th>Fecha</th><th>Gasto</th><th>Descripción (Opcional)</th>`}</tr></thead>
      <tbody>${inicializando ? datos.map(x => this.añadirFila(x)).join('') : this.añadirFila([])}</tbody>
    </table>
  </div>`
  }

  añadirFila(data) {
    let { esGastoPorProducto } = this
    let [a = '', b = '', c = '', d = '', e = '', f = ''] = data
    return `<tr>
    <td contenteditable="true">${a}</td>
    <td><div class="input-group date divdatepicker"><input value="${b}" type="text" class="form-control" readonly><span class="input-group-append"><span class="input-group-text bg-white"><i class="fa fa-calendar"></i></span></span></div></td>
    <td contenteditable="true">${c}</td>
    <td contenteditable="true">${d}</td>
    ${esGastoPorProducto ? `<td>${e}</td><td contenteditable="true">${f}</td>` : ''}
  </tr>`
  }
}

customElements.define('tabla-gastos', tablaGastos)

$(document).on('click', '.divtablagastos tr td:last-child', async function (e) {
  if (this.clientWidth - e.offsetX <= 21 && e.offsetY <= 21) {
    let fila = this.closest('tr')
    let html = `<div class="divtablagastos"><table class="mx-auto"><tbody style="background: #0f0d35;">${fila.cloneNode(true).outerHTML}</tbody></table></div>`
    if (await swalSíNo('Estás seguro que deseas borrar esta fila de la tabla?', html)) {
      $(fila).parent()[0].rows.length === 1 ? $(this).closest('.tablagastosparteinferior').html(tablaVacia) : fila.remove()
      Swal.fire('Fila eliminada', 'Se ha eliminado la fila exitosamente', 'success')
    }
  }
})

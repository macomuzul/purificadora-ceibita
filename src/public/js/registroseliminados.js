const btnSubir = qsd('#back-to-top-btn')

let estilosSwal = (confirmButton, cancelButton = '') => Swal.mixin({ customClass: { confirmButton, cancelButton }, buttonsStyling: false })
const swalConfirmarYCancelar = estilosSwal('btn btn-success margenbotonswal', 'btn btn-danger margenbotonswal')
const swalSobreescribir = estilosSwal('btn btn-success margenbotonswal2 botonconfirm', 'btn margenbotonswal2 botondeny')

qsd('#seleccionarTodos').onchange = e => qsad('.check').forEach(x => x.checked = e.currentTarget.checked)
btnSubir.onclick = q => scrollTo(0, 0)

addEventListener('scroll', q => {
  let seVeElBoton = btnSubir.classList.contains('btnEntrance')
  if (scrollY === 0 && seVeElBoton) {
    quitarClase(btnSubir, 'btnEntrance')
    añadirClase(btnSubir, 'btnExit')
    setTimeout(q => (btnSubir.style.display = 'none'), 250)
  } else if (!seVeElBoton) {
    quitarClase(btnSubir, 'btnExit')
    añadirClase(btnSubir, 'btnEntrance')
    btnSubir.style.display = 'block'
  }
})

function devuelveTabla(article) {
  let registro = clonar(qs(article, '.content'))
  $(registro).find('tab-content').hide()
  let html = `<custom-tabs><div class="tabs">
  ${qsarr(registro, 'table').map((_, i) => `<tab-label>Camión ${i + 1}</tab-label>`).join('')}
  </div> ${registro.outerHTML}</custom-tabs>`
  return { html, fecha: qs(article, `.fecharegistro .spanFechaStr`).innerText, fechaDate: new Date(qs(article, 'span-fechas').dataset.fecha) }
}

bodyOnClick('.btnrestaurar', async function (e) {
  let registro = this.closest('article')
  let id = registro.getAttribute('name')
  let { html, fecha, fechaDate } = devuelveTabla(registro)

  let { isConfirmed, dismiss } = await swalSobreescribir.fire({
    title: `Estás seguro que deseas restaurar este registro con fecha ${fecha}?`,
    icon: 'warning',
    width: (innerWidth * 3) / 4,
    html,
    showCancelButton: true,
    confirmButtonText: 'Restaurar usando esta fecha',
    cancelButtonText: 'Usar otra fecha',
  })
  let url = '/respaldos/registroseliminados/restaurarregistro'
  if (isConfirmed) await moverRegistro(id, fechaDate.valueOf(), 0, url)
  else if (dismiss === 'cancel') await moverReg(id, url)
})

bodyOnClick('.btneliminar', async function (e) {
  let registro = this.closest('article')
  let { html, fecha } = devuelveTabla(registro)

  let regs = JSON.stringify({ registros: [registro.getAttribute('name')] })
  if (await swalSíNo('Estás seguro que deseas borrar este registro?', html)) borrarRegistros(regs, `El registro con fecha: ${fecha} se ha borrado correctamente`)
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

bodyOnClick('.eliminartodos', async e => {
  let regs = JSON.stringify({ registros: qsarrd('.check:checked').map(el => el.closest('article').getAttribute('name')) })
  if (await swalSíNo('Estás seguro que deseas borrar los registros seleccionados?', null, null)) borrarRegistros(regs, 'Se han borrado correctamente todos los registros seleccionados')
})

function borrarRegistros(data, texto) {
  $.ajax({
    url: '/respaldos/registroseliminados/borrarregistros',
    method: 'DELETE',
    contentType: 'application/json',
    data,
    success: async q => await preguntarSiQuiereRefrescar('Se ha borrado correctamente', texto, 'success'),
    error: async r => (r.status === 400 ? Swal.fire('Error', r.responseText, 'error') : await preguntarSiQuiereRefrescar('Atención', r.responseText, 'warning')),
  })
}

async function preguntarSiQuiereRefrescar(title, text, icon) {
  let { isConfirmed } = await swalConfirmarYCancelar.fire({ title: title + ', deseas refrescar la página?', text, icon, showCancelButton: true, confirmButtonText: 'Sí', cancelButtonText: 'No' })
  if (isConfirmed) location.reload()
}

async function swalSíNo(title, html, width = (innerWidth * 3) / 4) {
  let { isConfirmed } = await swalConfirmarYCancelar.fire({
    title, icon: 'warning', width, html,
    showCancelButton: true,
    confirmButtonText: 'Sí',
    cancelButtonText: 'No',
  })
  return isConfirmed
}

String.prototype.normalizarPrecio = function () { return this.aFloat().toFixed(2).replace(/[.,]00$/, '') }
Number.prototype.normalizarPrecio = function () { return this.toFixed(2).replace(/[.,]00$/, '') }

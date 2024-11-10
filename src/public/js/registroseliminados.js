const btnSubir = qs('#back-to-top-btn')
const swalSobreescribir = estilosSwal('btn btn-success margenbotonswal2 botonconfirm', 'btn margenbotonswal2 botondeny')
let borrarRegistros = (data, texto) => hazDelete('', data, async q => await preguntarSiQuiereRefrescar('Se ha borrado correctamente', texto, 'success'), async r => (r.status === 400 ? Swal.fire('Error', r.responseText, 'error') : await preguntarSiQuiereRefrescar('Atención', r.responseText, 'warning')))

qs('#seleccionarTodos').onchange = e => qsafor('.check', x => x.checked = e.currentTarget.checked)
btnSubir.onclick = q => scrollTo(0, 0)

addEventListener('scroll', q => {
  let seVeElBoton = btnSubir.tieneClase('btnEntrance')
  if (scrollY === 0 && seVeElBoton) {
    btnSubir.quitarClase('btnEntrance')
    btnSubir.añadirClase('btnExit')
    setTimeout(q => btnSubir.esconder(), 250)
  } else if (!seVeElBoton) {
    btnSubir.quitarClase('btnExit')
    btnSubir.añadirClase('btnEntrance')
    btnSubir.mostrar()
  }
})

function devuelveTabla(article) {
  let registro = article.qs('.content').clonar()
  registro.qs('tab-content').esconder()
  let html = `<custom-tabs><div class="tabs">
  ${registro.qsarr('table').map((_, i) => `<tab-label>Camión ${i + 1}</tab-label>`).join('')}
  </div> ${registro.outerHTML}</custom-tabs>`
  return { html, fecha: article.qs(`.fecharegistro .spanFechaStr`).innerText, fechaDate: new Date(article.qs('span-fechas').dataset.fecha) }
}

bodyOnClick('.btnrestaurar', async c => {
  let registro = c.closest('article')
  let id = registro.getAttribute('name')
  let { html, fecha, fechaDate } = devuelveTabla(registro)

  let { isConfirmed, dismiss } = await swalSobreescribir.fire({
    title: `Estás seguro que deseas restaurar este registro con fecha ${fecha}?`,
    icon: 'warning',
    width: innerWidth * 3 / 4,
    html,
    showCancelButton: true,
    confirmButtonText: 'Restaurar usando esta fecha',
    cancelButtonText: 'Usar otra fecha',
  })
  let url = '/respaldos/registroseliminados/restaurarregistro'
  if (isConfirmed) await moverRegistro(id, fechaDate.valueOf(), 0, url)
  else if (dismiss === 'cancel') await moverReg(id, url)
})

bodyOnClick('.btneliminar', async c => {
  let registro = c.closest('article')
  let { html, fecha } = devuelveTabla(registro)

  let regs = JSON.stringify({ registros: [registro.getAttribute('name')] })
  if (await swalSíNo('Estás seguro que deseas borrar este registro?', html)) borrarRegistros(regs, `El registro con fecha: ${fecha} se ha borrado correctamente`)
})

$("body").on("click", ".restaurarsoloestatabla", async c => {
  let registro = c.closest('article')
  let tabla = registro.qsarr('tab-content').filter(x => !x.hidden)
  let fecha = registro.qs('.fecharegistro .spanFechaStr').textContent
  if (await swalSíNo("Estás seguro que deseas restaurar esta tabla?", tabla.outerHTML)) {
    if (await swalSíNo(`Si restauras vas a sobreescribir el registro con fecha ${fecha}`, tabla.outerHTML)) {
      hazPost('/respaldos/registroseliminados/restaurarregistro', data, async q => await preguntarSiQuiereRedireccionar(fecha), q => swalError("No se pudo restaurar el registro"))
    }
  }
})

bodyOnClick('.eliminartodos', async q => {
  let regs = JSON.stringify({ registros: qsarr('.check:checked').map(el => el.closest('article').getAttribute('name')) })
  if (await swalSíNo('Estás seguro que deseas borrar los registros seleccionados?', null, null)) borrarRegistros(regs, 'Se han borrado correctamente todos los registros seleccionados')
})

async function preguntarSiQuiereRefrescar(title, text, icon) {
  let { isConfirmed } = await swalConfirmarYCancelar.fire({ title: title + ', deseas refrescar la página?', text, icon, showCancelButton: true, confirmButtonText: 'Sí', cancelButtonText: 'No' })
  if (isConfirmed) location.reload()
}

qsclick('#guardar', async q => {
  if (!await validarPlantillas()) return

  let data = JSON.stringify({
    nombre: nombreplantilla.value,
    ultimaedicion: "",
    fechaultimaedicion: Date.now(),
    orden: 1,
    productos: qsarr("tbody tr").map(fila => ({
      producto: fila.cells[0].innerText.trim(),
      precio: fila.cells[1].innerText.trim().aFloat()
    }))
  })
  hazPost('', data, q => swalExito('La plantilla se ha creado exitosamente'))
})

qs('custom-dropdown').metododropdown = async option => {
  hazGet(`/plantillas/devuelveplantilla/${option.textContent}`, '', async r => {
    let p = await r.json()
    let html = `<div style="display: flex; justify-content: center;"><table><thead><tr><th class="productos">Productos</th><th class="precio">Precio</th></tr></thead>
    ${p.map(x => `<tr><td>${x.producto}</td><td>${x.precio.normalizarPrecio()}</td></tr>`).join("")}</table></div>`
    if (await swalSíNo('Estás seguro que deseas utilizar esta plantilla?', html, "703px")) { qs("tbody").html(p.map(x => `<tr>
    <td contenteditable="true">${x.producto}</td><td contenteditable="true">${x.precio.normalizarPrecio()}</td>
    <td><button class="botoneliminar"><svg-eliminar></svg-eliminar></button></td>
    </tr>`).join(''))
    }
  })
}
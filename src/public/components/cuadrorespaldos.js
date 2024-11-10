añadirCSS(`.gridUnidadTiempo {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  justify-items: center;
  width: 600px;
  margin: 0 auto;
  row-gap: 25px;
  align-content: center;
}

.gridCheckbox{
  justify-items: flex-end;
  position: relative;

  &>*:nth-child(2n){
    justify-self: flex-start;
  }
}

.tituloOpciones{
  justify-self: center;
  grid-column: 1/3;
  font-size: 20px;
}

.btnOrden{
  font-size: 18px;
  width: 250px;
  height: 120px;
  text-wrap: inherit;
}

.botonazul {
  background: #0b2346;
  border-color: #010a18;
  padding: 15px 25px;

  &:focus, &:hover, &:active {
    outline: none;
    box-shadow: none;
    background-color: #072a5c;
  }
}

.btn-success {
  background: #157347;
}
.btn-danger {
  background: #be0000;
}

.btn-success, .btn-danger{
  color: white;
  width: 140px;
  height: 60px;
  margin-right: 10px;
}

.swal2-actions button:not(.swal2-styled){
  height: 55px;
  width: 120px;
}

.input-group{
  margin: 0 auto;
}

.botonvolver{
  padding: 10px 20px;
  height: 55px;
  position: absolute;
  top: 20px;
  left: 15px;
}
.flecharotada {
  background-color: transparent;
  margin-left: 0px;
  margin-right: 10px;
  transform: rotate(180deg) scale(1.5);
  display: inline-block;
}

.form-check-reverse{
  font-size: 16px;
}

.contenidoOpciones{
  position: relative;
  margin-top: 10px;
  height: 400px;
}`)

let contador = 0, seleccionado, cal, opcionCalendario
let crearCal = c => cal.html(`<botonazul-flechaizquierda class="botonvolver">Volver</botonazul-flechaizquierda>${c}`)
bodyOnClick("#btnMayor", q => {
  seleccionado.cal = "mayores o iguales que"
  crearCal('<calendario-simple></calendario-simple>')
  $(`.divdatepicker`).datepicker({ weekStart: 1, language: "es", autoclose: true, maxViewMode: 2, todayHighlight: true, format: "dd/mm/yyyy" })
  $(`.divdatepicker`).datepicker("show")
})
bodyOnClick("#btnMenor", q => {
  seleccionado.cal = "menores o iguales que"
  crearCal('<calendario-simple></calendario-simple>')
  $(`.divdatepicker`).datepicker({ weekStart: 1, language: "es", autoclose: true, maxViewMode: 2, todayHighlight: true, format: "dd/mm/yyyy" })
  $(`.divdatepicker`).datepicker("show")
})

bodyOnClick("#btnLibre", q => {
  seleccionado.cal = ""
  crearCal("<calendario-simple></calendario-simple>")
  $(`.divdatepicker`).datepicker({ weekStart: 1, language: "es", autoclose: false, maxViewMode: 2, multidate: true, multidateSeparator: ", ", todayHighlight: true, format: "dd/mm/yyyy" })
  $(`.divdatepicker`).datepicker("show")
})
bodyOnClick("#btnEntre", q => {
  seleccionado.cal = "entre el"
  crearCal("Entre")
})

bodyOnClick(".tituloregistro custom-checkbox", c => c.closest("cuadro-respaldos").qs("custom-input input").disabled = !c.qs("input").checked)
bodyOnClick(".botonvolver, .opcionesradiobutton custom-radiobutton input", c => {
  if (qs('.modal-body custom-radiobutton:has(input:checked)').indice() === 0) cal.hide()
  else {
    if (cal.html() && !c.tieneClase("botonvolver")) cal.show()
    else {
      ({
        Ventas: htmlCalendario,
        Plantillas: q => htmlNombres("/plantillas/nombres", "plantillas"),
        Camioneros: q => htmlNombres("/empleados/camioneros/nombres", "camioneros"),
        "Registros eliminados": htmlCalendario,
      })[seleccionado.titulo]()
    }
  }
})

let guardando = false
bodyOnClick("#btnguardar", async c => {
  if (guardando) return
  guardando = true
  c.html(`  Guardando<div class="cajaspinner"><div class="spinner-border text-primary"></div>`)
  let checkeados = qsarr("cuadro-respaldos").filter(x => x.qs(".tituloregistro input").checked)
  if (!checkeados.length) return Swal.fire("Error", "No se ha seleccionado ningún registro para guardar", "error")
  checkeados.forEach(x => x.opciones.nombreArchivo = x.qs(".nombreArchivo input").value)
  let datos = checkeados.map(x => x.opciones)
  let body = { datos, sobreescribir: 0, nombreCarpeta: qs(".nombreCarpeta input").value }
  await guardar(body)
  c.html("Guardar")
  guardando = false
})
bodyOnClick("#seleccionarTodos", c => {
  let checked = c.qs("input").checked
  c.closest(".contenidoOpciones").qsafor(".gridCheckbox input", x => x.checked = checked)
})

async function guardar(body) {
  await hazPost('', JSON.stringify(body), q => swalExito('Se han guardado los registros seleccionados en tu carpeta de google drive'), async r => {
    if (r.status === 402) {
      if (await swalSíNo('Atención', 'Ya existe una carpeta con ese nombre, estás seguro que deseas sobreescribirla?')) {
        body.sobreescribir = 1
        await guardar(body)
      }
    }
    else swalError('Ocurrió un error al guardar los registros')
  })
}

function htmlCalendario() {
  cal.html(`<article class="gridUnidadTiempo">
  <input-azul class="btnOrden" id="btnMayor">Seleccionar fechas mayores o iguales que</input-azul>
  <input-azul class="btnOrden" id="btnMenor">Seleccionar fechas menores o iguales que</input-azul>
  <input-azul class="btnOrden" id="btnEntre">Seleccionar fechas entre</input-azul>
  <input-azul class="btnOrden" id="btnLibre">Selección libre (uno o varios)</input-azul>
</article>`)
}

async function htmlNombres(url, el) {
  try {
    let r = await fetch(url)
    let t = await r.json()

    cal.html(`<div style="text-align: right; margin: 5px 0;"><custom-checkbox id="seleccionarTodos">Seleccionar todos los elementos</custom-checkbox></div>
    <article class="gridUnidadTiempo gridCheckbox">
    <div class="tituloOpciones">Elije qué ${el} deseas guardar</div>
      ${t.map((x, i) => `<custom-checkbox ${i % 2 === 1 ? `data-clase="form-check-reverse"` : ""}>${x}</custom-checkbox>`).join("")}
    </article>`)
  } catch (error) {
    Swal.fire("Error de conexión", "Te has quedado sin conexión a internet. Por favor conéctate a una red WIFI", "error")
  }
}

class cuadroRespaldos extends HTMLElement {
  connectedCallback() {
    let { titulo, checked } = this.dataset
    this.className = "registro"

    this.innerHTML = `<div class="tituloregistro"><custom-checkbox ${checked ? `data-checked="1"` : ""}></custom-checkbox><div class="titulo">${titulo}</div></div>
    <div class="contenido">
    <div class="contenidosuperior">
    <custom-input data-texto="Respaldo ${titulo.toLowerCase()}" class="nombreArchivo" ${checked ? "" : `data-props="disabled"`}>Nombre del archivo:</custom-input>
    <div class="opcionesextra"><svg fill="#ddd" width="30px" height="30px" viewBox="0 0 93.5 93.5"><g><path d="M93.5,40.899c0-2.453-1.995-4.447-4.448-4.447H81.98c-0.74-2.545-1.756-5.001-3.035-7.331l4.998-5    c0.826-0.827,1.303-1.973,1.303-3.146c0-1.19-0.462-2.306-1.303-3.146L75.67,9.555c-1.613-1.615-4.673-1.618-6.29,0l-5,5    c-2.327-1.28-4.786-2.296-7.332-3.037v-7.07C57.048,1.995,55.053,0,52.602,0H40.899c-2.453,0-4.447,1.995-4.447,4.448v7.071    c-2.546,0.741-5.005,1.757-7.333,3.037l-5-5c-1.68-1.679-4.609-1.679-6.288,0L9.555,17.83c-1.734,1.734-1.734,4.555,0,6.289    l4.999,5c-1.279,2.33-2.295,4.788-3.036,7.333h-7.07C1.995,36.452,0,38.447,0,40.899V52.6c0,2.453,1.995,4.447,4.448,4.447h7.071    c0.74,2.545,1.757,5.003,3.036,7.332l-4.998,4.999c-0.827,0.827-1.303,1.974-1.303,3.146c0,1.189,0.462,2.307,1.302,3.146    l8.274,8.273c1.614,1.615,4.674,1.619,6.29,0l5-5c2.328,1.279,4.786,2.297,7.333,3.037v7.071c0,2.453,1.995,4.448,4.447,4.448    h11.702c2.453,0,4.446-1.995,4.446-4.448V81.98c2.546-0.74,5.005-1.756,7.332-3.037l5,5c1.681,1.68,4.608,1.68,6.288,0    l8.275-8.273c1.734-1.734,1.734-4.555,0-6.289l-4.998-5.001c1.279-2.329,2.295-4.787,3.035-7.332h7.071    c2.453,0,4.448-1.995,4.448-4.446V40.899z M62.947,46.75c0,8.932-7.266,16.197-16.197,16.197c-8.931,0-16.197-7.266-16.197-16.197    c0-8.931,7.266-16.197,16.197-16.197C55.682,30.553,62.947,37.819,62.947,46.75z"/></g></svg>
    <div>Opciones</div><div>avanzadas</div></div>
    </div>
    <ul class="listaMensajes"><li class="mensajeOpciones">Crear ambos archivos</li><li class="mensajeOpciones">Guardar todos los registros</li></ul>
    </div>

    <div class="modal fade" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5">Configuraciones</h1>
            <button class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div style="margin: 0 0 30px 10px;" class="opcionesarchivos">
            <custom-checkbox data-checked="1">Crear archivo json</custom-checkbox>
            <custom-checkbox data-checked="1">Crear archivo bson</custom-checkbox>
            </div>
            <custom-radiogroup style="margin-left: 10px;" id="opcionesradiobutton${contador}" class="opcionesradiobutton">
              <custom-radiobutton data-checked="1">Guardar todos los registros</custom-radiobutton>
              <custom-radiobutton>Escoger qué registros guardar</custom-radiobutton>
            </custom-radiogroup>
            <div class="contenidoOpciones"></div>
          </div>
          <div class="modal-footer">
            <div style="flex-grow: 1;"><button class="btn btn-primary btn-config botonazul restaurarconfig" data-bs-dismiss="modal">Restaurar los valores de default</button></div>
            <div style="flex-grow: 1; display: flex; justify-content: flex-end;">
              <button style="margin-right: 5px;" class="btn btn-success btn-config guardarconfig" data-bs-dismiss="modal">Aceptar</button>
              <button class="btn btn-danger btn-config cerrarconfig" data-bs-dismiss="modal">Cancelar</button>
            </div>
          </div>
        </div>
      </div>
    </div>`

    this.opciones = {
      nombre: titulo,
      archivos: "ambos",
      guardar: "todos",
      nombreArchivo: "",
    }
    contador++
    this.titulo = titulo
    let modal = new bootstrap.Modal(this.qs(".modal"))
    this.elclick(".opcionesextra", q => {
      if (!this.qs(".tituloregistro input").checked) return Swal.fire("Atención", "El registro a guardar está deshabilitado. Por favor habilítalo para seleccionar qué información mandar", "warning")
      seleccionado = this
      cal = $(seleccionado).find(".contenidoOpciones")
      modal.show()
    })
  }
}

customElements.define("cuadro-respaldos", cuadroRespaldos)


bodyOnClick('.guardarconfig', (c, e) => {
  let s1 = seleccionado.qsarr(".opcionesarchivos input:checked").map(x => x.closest("custom-checkbox").indice())
  if (!s1.length) {
    e.stopImmediatePropagation()
    return Swal.fire("Atención", "Debe haber al menos un archivo qué guardar, selecciona archivo json, bson o ambos", "warning")
  }

  let s2 = $(seleccionado).find(".opcionesradiobutton input:checked").closest("custom-radiobutton").index()
  let v, iframe = $(seleccionado).find("iframe")[0]?.contentDocument, fechaEntre = seleccionado.cal === "entre el"
  if(s2){
    v = iframe ? fechaEntre ? new Intl.ListFormat("es").format([...$(iframe).find("input")].map(x => x.value)) : $(iframe).find("input").val() : [...$(seleccionado).find(".contenidoOpciones input:checked")].map(x => $(x).next().text())
    if (!v) {
      e.stopImmediatePropagation()
      return Swal.fire("Atención", "No has escogido qué registros deseas guardar", "warning")
    }
  }

  Object.assign(seleccionado.opciones, {
    archivos: s1.length === 2 ? "ambos" : s1[0] ? "bson" : "json",
    guardar: s2 ? { rango: seleccionado.cal, valor: v } : "todos"
  })
  let li = [`Crear ${s1.length === 2 ? "ambos archivos" : `archivo ${s1[0] ? "bson" : "json"}`}`, `Guardar ${s2 ? iframe ? `fechas ${seleccionado.cal} ${v}` : new Intl.ListFormat("es").format(v) : "todos los registros"}`]
  seleccionado.qs(".listaMensajes").html(li.map(x => `<li class="mensajeOpciones">${x}</li>`))
})
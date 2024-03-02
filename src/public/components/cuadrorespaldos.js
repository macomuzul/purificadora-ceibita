$("head").append(`<style>
.gridUnidadTiempo {
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

.iframe{
  width: 700px;
  height: 400px;
  margin-top: 20px;
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
}
</style>`)

let contador = 0, seleccionado, c, opcionCalendario

let swalConfirmarYCancelar = Swal.mixin({
  customClass: {
    confirmButton: "btn btn-success margenbotonswal",
    cancelButton: "btn btn-danger margenbotonswal",
  },
  buttonsStyling: false
})

let crearCal = cal => c.html(`<button type="button" class="btn btn-primary botonazul botonvolver" id="volver">
<svg class="flecharotada" width="20" height="20" fill="white"><path d="M20 0zm-8.344 14.709-1.41-1.418L12.547 11H4V9h8.673l-2.38-2.379 1.414-1.414 4.737 4.736z"/></svg>
Volver</button><iframe class="iframe" src="/extras/calendarioIframe${cal}" frameborder="0"></iframe>`)
$("body").on("click", "#btnMayor", q => {
  seleccionado.cal = "mayores o iguales que"
  crearCal("")
})
$("body").on("click", "#btnMenor", q => {
  seleccionado.cal = "menores o iguales que"
  crearCal("")
})
$("body").on("click", "#btnLibre", q => {
  seleccionado.cal = ""
  crearCal("Multiple")
})
$("body").on("click", "#btnEntre", q => {
  seleccionado.cal = "entre el"
  crearCal("Entre")
})

$("body").on("click", ".tituloregistro custom-checkbox", e => $(e.currentTarget).closest("cuadro-respaldos").find("custom-input input").prop("disabled", !$(e.currentTarget).find("input")[0].checked))
$("body").on("click", ".botonvolver", crearContenidoOpciones)
$("body").on("click", ".opcionesradiobutton custom-radiobutton input", crearContenidoOpciones)

let guardando = false
$("#btnguardar").on("click", async function () {
  if (guardando === true) return
  guardando = true
  $(this).html(`  Guardando<div class="cajaspinner"><div class="spinner-border text-primary"></div>`)
  let chequeados = [...$("cuadro-respaldos")].filter(x => $(x).find(".tituloregistro input")[0].checked)
  if (!chequeados.length) return Swal.fire("Error", "No se ha seleccionado ningún registro para guardar", "error")
  chequeados.forEach(x => x.opciones.nombreArchivo = $(x).find(".nombreArchivo input").val())
  let datos = chequeados.map(x => x.opciones)
  let body = { datos, sobreescribir: 0, nombreCarpeta: $(".nombreCarpeta input").val() }
  await guardar(body)
  $(this).html("Guardar")
  guardando = false
})
$("body").on("click", "#seleccionarTodos", function () {
  let checked = $(this).find("input")[0].checked
  $(this).closest(".contenidoOpciones").find(".gridCheckbox input").each((_, x) => x.checked = checked)
})

async function guardar(body) {
  try {
    let r = await fetch("", {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify(body)
    })
    if (r.ok) Swal.fire("Éxito", "Se han guardado los registros seleccionados en tu carpeta de google drive", "success")
    else {
      if (r.status === 402) {
        let { isConfirmed } = await swalConfirmarYCancelar.fire({
          title: "Atención",
          icon: "warning",
          html: "Ya existe una carpeta con ese nombre, estás seguro que deseas sobreescribirla?",
          showCancelButton: true,
          confirmButtonText: "Sí",
          cancelButtonText: "No",
        })
        if (isConfirmed) {
          body.sobreescribir = 1
          await guardar(body)
        }
      }
      else Swal.fire("Error", "Ocurrió un error al guardar los registros", "error")
    }
  } catch {
    Swal.fire("Error de conexión", "Te has quedado sin conexión a internet. Por favor conéctate a una red WIFI", "error")
  }
}

function htmlCalendario() {
  c.html(`<article class="gridUnidadTiempo">
  <input class="btn btn-primary botonazul btnOrden" type="button" value="Seleccionar fechas mayores o iguales que" id="btnMayor">
  <input class="btn btn-primary botonazul btnOrden" type="button" value="Seleccionar fechas menores o iguales que" id="btnMenor">
  <input class="btn btn-primary botonazul btnOrden" type="button" value="Seleccionar fechas entre" id="btnEntre">
  <input class="btn btn-primary botonazul btnOrden" type="button" value="Selección libre (uno o varios)" id="btnLibre">
</article>`)
}

async function htmlNombres(url, el) {
  try {
    let r = await fetch(url)
    let t = await r.json()

    c.html(`<div style="text-align: right; margin: 5px 0;"><custom-checkbox id="seleccionarTodos">Seleccionar todos los elementos</custom-checkbox></div>
    <article class="gridUnidadTiempo gridCheckbox">
    <div class="tituloOpciones">Elije qué ${el} deseas guardar</div>
      ${t.map((x, i) => `<custom-checkbox ${i % 2 === 1 ? `data-clase="form-check-reverse"` : ""}>${x}</custom-checkbox>`).join("")}
    </article>`)
  } catch (error) {
    Swal.fire("Error de conexión", "Te has quedado sin conexión a internet. Por favor conéctate a una red WIFI", "error")
  }
}

function crearContenidoOpciones() {
  if ($(this).closest("custom-radiobutton").index() === 0) c.hide()
  else {
    if (c.html() && !$(this).hasClass("botonvolver")) c.show()
    else {
      ({
        Ventas: htmlCalendario,
        Plantillas: q => htmlNombres("/plantillas/devuelvenombres", "plantillas"),
        Camioneros: q => htmlNombres("/empleados/camioneros/devuelvenombres", "camioneros"),
        "Registros eliminados": htmlCalendario,
      })[seleccionado.titulo]()
    }
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
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div style="margin: 0 0 30px 10px;" class="opcionesarchivos">
            <custom-checkbox data-checked="1">Crear archivo json</custom-checkbox>
            <custom-checkbox data-checked="1">Crear archivo bson</custom-checkbox>
            </div>
            <custom-radiogroup style="margin-left: 10px;" id="opcionesradiobutton${contador}" class="opcionesradiobutton">
              <custom-radiobutton data-id="guardartodoslosregistros${contador}" data-checked="1">Guardar todos los registros</custom-radiobutton>
              <custom-radiobutton data-id="escogerregistros${contador}">Escoger qué registros guardar</custom-radiobutton>
            </custom-radiogroup>
            <div class="contenidoOpciones"></div>
          </div>
          <div class="modal-footer">
            <div style="flex-grow: 1;"><button type="button" class="btn btn-primary btn-config botonazul restaurarconfig" data-bs-dismiss="modal">Restaurar los valores de default</button></div>
            <div style="flex-grow: 1; display: flex; justify-content: flex-end;">
              <button type="button" style="margin-right: 5px;" class="btn btn-success btn-config guardarconfig" data-bs-dismiss="modal">Aceptar</button>
              <button type="button" class="btn btn-danger btn-config cerrarconfig" data-bs-dismiss="modal">Cancelar</button>
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
    let modal = new bootstrap.Modal($(this).find(".modal")[0])
    $(this).on("click", ".opcionesextra", e => {
      if (!$(this).find(".tituloregistro input")[0].checked) return Swal.fire("Atención", "El registro a guardar está deshabilitado. Por favor habilítalo para seleccionar qué información mandar", "warning")
      seleccionado = this
      c = $(seleccionado).find(".contenidoOpciones")
      modal.show()
    })
  }
}

customElements.define("cuadro-respaldos", cuadroRespaldos)
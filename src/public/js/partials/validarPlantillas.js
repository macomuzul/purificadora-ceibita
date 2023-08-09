let tabla = $("table")[0]
let nombreplantilla = $('#nombreplantilla')
async function validarPlantillas() {
  let productos = [...$("tbody td:nth-child(1)")]
  let precios = [...$("tbody td:nth-child(2)")]
  nombreplantilla.val((_, val) => val.trim())
  
  if (nombreplantilla.val() === "") return mostrarError("El nombre de la plantilla está vacío")
  if (productos.length < 1) return mostrarError("No hay productos qué guardar")

  productos.forEach(x => x.textContent = x.innerText.trim())
  if (productos.some(x => x.textContent === "")) {
    let tablaCopia = tabla.cloneNode(true);
    [...$(tablaCopia).find("tbody td:first-child")].forEach(x => x.textContent === "" ? x.classList.add("enfocar") : "")
    return mostrarErrorSwal(tablaCopia, "Hay productos sin nombre en la tabla")
  }

  precios.forEach(x => {
    let precio = x.innerText;
    if (precio === ".")
      x.textContent = "";
    let numeroParseado = parseFloat(precio)
    if (!isNaN(numeroParseado))
      x.textContent = numeroParseado.normalizarPrecio()
  })

  if (precios.some(x => x.innerText === "")) {
    let tablaCopia = tabla.cloneNode(true);
    [...$(tablaCopia).find("tbody td:nth-child(2)")].forEach(x => x.textContent === "" ? x.classList.add("enfocar") : "")
    return mostrarErrorSwal(tablaCopia, "Hay precios vacíos")
  }
  if (precios.some(x => x.innerText === "0")) {
    let tablaCopia = tabla.cloneNode(true);
    [...$(tablaCopia).find("tbody td:nth-child(2)")].forEach(x => x.textContent === "0" ? x.classList.add("enfocar") : "")
    return mostrarErrorSwal(tablaCopia, "Hay precios con valor igual a 0")
  }
  let arrayNormalizado = productos.map(x => x.textContent.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, ""));
  let hayRepetidos = arrayNormalizado.some((item, index) => {
    if (arrayNormalizado.indexOf(item) !== index) {
      let tablaCopia = tabla.cloneNode(true)
      let productosCopia = $(tablaCopia).find("tbody td:first-child")
      productosCopia[arrayNormalizado.indexOf(item)].classList.add("enfocar")
      productosCopia[index].classList.add("enfocar")
      mostrarErrorSwal(tablaCopia, "Se ha encontrado productos con el mismo nombre")
      return true
    }
    return false
  })
  return !hayRepetidos
}

function mostrarErrorSwal(html, title) {
  $(html).find("tr").each((_, x) => x.lastElementChild.remove())
  $(html).find("td").prop("contenteditable", "false")
  Swal.fire({
    title,
    icon: "error",
    width: window.innerWidth * 1 / 2,
    html,
    confirmButtonText: "Continuar"
  })
}
String.prototype.normalizar = function () { return this.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, "") }
String.prototype.normalizarPrecio = function () { return parseFloat(this).toFixed(2).replace(/[.,]00$/, "") }
Number.prototype.normalizarPrecio = function () { return this.toFixed(2).replace(/[.,]00$/, "") }

function mostrarError(error) {
  Swal.fire("Error", error, "error")
  return false
}
let tabla = $("table")[0]
let nombreplantilla = $('#nombreplantilla')
async function validarPlantillas() {
  let tablaCopia = tabla.cloneNode(true)
  let productos = [...$("tbody td:nth-child(1)")]
  let precios = [...$("tbody td:nth-child(2)")]
  nombreplantilla.val((_, val) => val.trim())

  if (nombreplantilla.val() === "") return mostrarError("El nombre de la plantilla está vacío")
  if (productos.length < 1) return mostrarError("No hay productos qué guardar")

  productos.forEach(x => x.textContent = x.innerText.trim())
  if (productos.some(x => x.textContent === "")) {
    [...$(tablaCopia).find("tbody td:first-child")].forEach(x => x.textContent === "" && x.classList.add("enfocar"))
    return mostrarErrorHTML(tablaCopia, "Hay productos sin nombre en la tabla")
  }

  precios.forEach(x => {
    let precio = x.innerText;
    if (precio === ".") x.textContent = ""
    let p = parseFloat(precio)
    if (!isNaN(p)) x.textContent = p.normalizarPrecio()
  })

  if (precios.some(x => x.innerText === "")) {
    [...$(tablaCopia).find("tbody td:nth-child(2)")].forEach(x => x.textContent === "" && x.classList.add("enfocar"))
    return mostrarErrorHTML(tablaCopia, "Hay precios vacíos")
  }
  if (precios.some(x => x.innerText === "0")) {
    [...$(tablaCopia).find("tbody td:nth-child(2)")].forEach(x => x.textContent === "0" && x.classList.add("enfocar"))
    return mostrarErrorHTML(tablaCopia, "Hay precios con valor igual a 0")
  }

  let productosCopia = [...$(tablaCopia).find("tbody tr td:nth-child(1)")]
  let arrayNormalizado = productos.map(el => el.textContent.normalizar())
  let hayRepetidos = false
  arrayNormalizado.forEach((x, i) => {
    if (arrayNormalizado.indexOf(x) !== i) {
      let color = colorAleatorio()
      productosCopia.forEach(p => p.textContent.normalizar() === x && (p.style.background = color))
      hayRepetidos = true
    }
  })
  if (hayRepetidos) return mostrarErrorHTML(tablaCopia, "Hay productos que tienen el mismo nombre")
  return true
}

function colorAleatorio() {
  const threshold = 128;
  const color = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
  const rgb = color.match(/\d+/g).map(Number);
  const brightness = (0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]);
  if (brightness > threshold) return colorAleatorio()
  return color
}

function mostrarErrorHTML(html, title) {
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
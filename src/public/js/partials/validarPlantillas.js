//TODO validar que las plantillas no tengan el mismo nombre
async function validarPlantillas() {
  let productos = [...$("tbody td:nth-child(1)")];
  let precios = [...$("tbody td:nth-child(2)")];
  $('#nombreplantilla').val((_, val) => val.trim());
  if ($('#nombreplantilla').val() === "")
    return mostrarError("El nombre de la plantilla está vacío");

  if (productos.length < 1)
    return mostrarError("No hay productos qué guardar");

  productos.forEach(el => el.textContent = el.innerText.trim());
  if (productos.some(el => el.textContent === ""))
    return mostrarError("Hay un producto sin nombre");

  precios.forEach(el => {
    let precio = el.innerText;
    if (precio === ".")
      el.textContent = "";
    let numeroParseado = parseFloat(precio);
    if (!isNaN(numeroParseado))
      el.textContent = numeroParseado.normalizarPrecio();
  });
  if (precios.some(el => el.innerText === ""))
    return mostrarError("Hay un precio vacio");
  if (precios.some(el => el.innerText === "0"))
    return mostrarError("Hay un precio con valor 0");
  let arrayNormalizado = productos.map(el => el.textContent.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, ""));
  let hayRepetidos = arrayNormalizado.some((item, index) => {
    if (arrayNormalizado.indexOf(item) !== index){
      let tablaCopia = $("table")[0].cloneNode(true);
      $(tablaCopia).find("tr").each((_, el) => el.removeChild(el.lastElementChild));
      $(tablaCopia).find("td").each((_, el) => el.setAttribute("contenteditable", "false"));
      let productosCopia = $(tablaCopia).find("tbody td:first-child");
      productosCopia[arrayNormalizado.indexOf(item)].classList.add("enfocar");
      productosCopia[index].classList.add("enfocar");
      Swal.fire({
        title: `Se ha encontrado productos con el mismo nombre`,
        icon: "error",
        width: window.innerWidth * 1 / 2,
        html: tablaCopia,
        confirmButtonText: "Continuar"
      });
      return true;
    }
    return false
  });
  return !hayRepetidos;
}

String.prototype.normalizarPrecio = fNormalizarPrecio;
Number.prototype.normalizarPrecio = fNormalizarPrecio;
function fNormalizarPrecio() {
  return this.toFixed(2).replace(/[.,]00$/, "");
}

function mostrarError(error) {
  Swal.fire("Error", error, "error");
  return false;
}
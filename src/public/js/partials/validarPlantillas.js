async function validarPlantillas() {
  let tabla = $("tbody")[0];
  let filas = tabla.rows;
  if ($("#nombreplantilla")[0].value === "") {
    await Swal.fire({
      icon: "error",
      title: "Error",
      text: "El nombre de plantilla está vacío",
    });
    return false;
  }

  if (filas.length < 1) {
    await Swal.fire({
      icon: "error",
      title: "Error",
      text: "No hay productos qué guardar",
    });
    return false;
  }
  for (let i = 0; i < filas.length; i++) {
    if (filas[i].cells[0].innerText === "") {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hay un producto sin nombre",
      });
      return false;
    }
  }
  for (let i = 0; i < filas.length; i++) {
    if (filas[i].cells[1].innerText === "") {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hay un precio vacio",
      });
      return false;
    }
  }
  for (let i = 0; i < filas.length; i++) {
    let precio = filas[i].cells[1].innerText;
    if (precio.endsWith("."))
      filas[i].cells[1].innerText = precio.replace(".", "")
  }
  return true;
}


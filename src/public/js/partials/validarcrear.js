async function validarcrear() {
    var tabla = $("tbody")[0];
    var filas = tabla.rows;
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
      if (filas[i].cells[0].innerHTML === "") {
        await Swal.fire({
          icon: "error",
          title: "Error",
          text: "Hay un producto sin nombre",
        });
        return false;
      }
    }
    for (let i = 0; i < filas.length; i++) {
      if (filas[i].cells[1].innerHTML === "") {
        await Swal.fire({
          icon: "error",
          title: "Error",
          text: "Hay un precio vacio",
        });
        return false;
      }
    }
    return true;
  }
  
  
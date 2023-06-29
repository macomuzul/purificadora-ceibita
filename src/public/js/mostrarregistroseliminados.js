const botonSubir = document.querySelector("#back-to-top-btn");
let tabs = document.querySelectorAll(".tabs");
let clickeados = { valores: [] }
let seleccionarTodos = document.getElementById("seleccionarTodos");
let checkboxes = document.querySelectorAll(".check");

seleccionarTodos.addEventListener("change", () => {
  if (seleccionarTodos.checked)
    checkboxes.forEach(el => el.checked = true);
  else
    checkboxes.forEach(el => el.checked = false);
});

window.addEventListener("scroll", scrollFunction);

const swalConfirmarYCancelar = Swal.mixin({
  customClass: {
    confirmButton: "btn btn-success margenbotonswal",
    cancelButton: "btn btn-danger margenbotonswal",
  },
  buttonsStyling: false,
});

const swalSobreescribir = Swal.mixin({
  customClass: {
    confirmButton: "btn btn-success margenbotonswal2 botonconfirm",
    cancelButton: "btn margenbotonswal2 botondeny",
  },
  buttonsStyling: false,
});

function scrollFunction() {
  if (window.scrollY > 0) {
    // mostrar scroller
    if (!botonSubir.classList.contains("btnEntrance")) {
      botonSubir.classList.remove("btnExit");
      botonSubir.classList.add("btnEntrance");
      botonSubir.style.display = "block";
    }
  } else {
    // esconder
    if (botonSubir.classList.contains("btnEntrance")) {
      botonSubir.classList.remove("btnEntrance");
      botonSubir.classList.add("btnExit");
      setTimeout(function () {
        botonSubir.style.display = "none";
      }, 250);
    }
  }
}

botonSubir.addEventListener("click", (e) => {
  window.scrollTo(0, 0);
});


function devuelveTabla(article) {
  let registro = $(article).find(".content")[0].cloneNode(true);
  let html = `<custom-tabs><div class="tabs">`
  $(registro).find("table").each(i => html += `<custom-label name="swal" data-id="swal${i}">Camión ${i + 1}</custom-label>`);
  html += `</div>`
  html += registro.outerHTML;
  html += "</custom-tabs>";
  return { html, fecha: $(article).find(`.fecharegistro [slot="fechaStr"]`).text(), fechaDate: parseDate($(article).find(`.fecharegistro [slot="fecha"]`).text()) };
}

document.querySelectorAll(".btnrestaurar").forEach((el) => {
  el.addEventListener("click", async function (e) {
    let registro = this.closest("article");
    let id = registro.getAttribute("name");
    let { html, fecha, fechaDate } = devuelveTabla(registro);

    let result = await swalConfirmarYCancelar.fire({
      title: "Estás seguro que deseas restaurar este registro?",
      icon: "warning",
      width: (window.innerWidth * 3) / 4,
      html,
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: "No",
    })
    if (result.isConfirmed) {
      result = await swalSobreescribir.fire({
        title: "Estás seguro que deseas continuar?",
        text: `Si restauras vas a sobreescribir el registro con fecha ${fecha}`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sobreescribir registro",
        cancelButtonText: "Utilizar una fecha diferente",
      })
      if (result.isConfirmed)
        restaurarregistro(`{"id": "${id}", "fecha": ${fechaDate.valueOf()}}`, fecha)
      else {
        result = await Swal.fire({
          title: "Escoge la fecha a donde quieres mover el registro",
          width: 750,
          html: `<iframe src="/extras/calendarioIframe" frameborder="0"></iframe><button id="continuarIframe" class="btn btn-success margenbotonswal">Continuar</button><button id="cancelarIframe" class="btn btn-danger margenbotonswal">Cancelar</button>`,
          showConfirmButton: false,
          didOpen: () => {
            $(document).find("#continuarIframe")[0].addEventListener("click", () => {
              let contenidoIframe = $(document).find("iframe")[0].contentDocument;
              let input = contenidoIframe.querySelector("input");
              let fecha = input.value;
              if (fecha === "") {
                input.classList.add("is-invalid");
                contenidoIframe.querySelector("#validadorIframe").className = "invalid-feedback";
                return;
              }
              restaurarRegistro(`{"id": "${id}", "fecha": ${parseDate(fecha).valueOf()}}`, fecha)
              Swal.close()
            });
            $(document).find("#cancelarIframe")[0].addEventListener("click", () => Swal.close());
          },
        });
      }
    }
  })
});

function restaurarRegistro(data, fecha) {
  $.ajax({
    url: "/respaldos/registroseliminados/restaurarregistro",
    method: "POST",
    contentType: "application/json",
    data,
    success: function (res) {
      Swal.fire("Se ha restaurado correctamente", `El registro con fecha: ${fecha} se ha restaurado correctamente. Ahora serás redireccionado a esta fecha en el calendario para ver los cambios`, "success");
    },
    error: function (res) {
      Swal.fire("Ups...", "No se pudo restaurar el registro", "error");
    },
  });
}

document.querySelectorAll(".btneliminar").forEach((el) => {
  el.addEventListener("click", async function (e) {
    let registro = this.closest("article");
    let { html, fecha } = devuelveTabla(registro);

    let result = await swalConfirmarYCancelar.fire({
      title: "Estás seguro que deseas borrar este registro?",
      icon: "warning",
      width: (window.innerWidth * 3) / 4,
      html,
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: "No",
    })
    if (result.isConfirmed) {
      borrarRegistros(`{"registros": ["${registro.getAttribute("name")}"]}`, `El registro con fecha: ${fecha} se ha borrado correctamente`, "No se pudo eliminar el registro")
    }
  });
});

document.querySelectorAll(".restaurarsoloestatabla").forEach((el) => {
  el.addEventListener("click", async function (e) {
    let registro = this.closest("article");
    let tabla = [...$(registro).find("tab-content")].filter(x => x.style.display === "initial")[0];
    let numTabla = $(tabla).index();
    let fecha = $(registro).find(`.fecharegistro [slot="fechaStr"]`).text();
    let result = await swalConfirmarYCancelar.fire({
      title: "Estás seguro que deseas restaurar esta tabla?",
      icon: "warning",
      width: (window.innerWidth * 3) / 4,
      html: tabla.outerHTML,
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: "No",
    })
    if (result.isConfirmed) {
      result = await swalConfirmarYCancelar.fire({
        title: "Si restauras vas a sobreescribir el registro del dia",
        icon: "warning",
        width: (window.innerWidth * 3) / 4,
        html: tabla.outerHTML,
        showCancelButton: true,
        confirmButtonText: "Sí",
        cancelButtonText: "No",
      })
      if (result.isConfirmed) {
        $.ajax({
          url: "/respaldos/registroseliminados/restaurarregistro",
          method: "POST",
          contentType: "application/json",
          data: `{"id": "${nombreTabla}", "numTabla": "${numTabla}"}`,
          success: function (res) {
            Swal.fire("Se ha restaurado correctamente", `La tabla del camión No. ${numtabla} con fecha: ${fecha} se ha restaurado correctamente. Ahora serás redireccionado a esta fecha en el calendario para ver los cambios`, "success");
          },
          error: function (res) {
            Swal.fire("Ups...", "No se pudo restaurar el registro", "error",);
          },
        });
      }
    }
  });

  document.querySelectorAll(".eliminartodos").forEach((el) => {
    el.addEventListener("click", async (e) => {
      let objRegistros = { registros: [] };
      document.querySelectorAll(".check:checked").forEach(el =>
        objRegistros.registros.push(el.closest("article").getAttribute("name")));
      let result = await swalConfirmarYCancelar.fire({
        title: "Estás seguro que deseas borrar los registros seleccionados?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí",
        cancelButtonText: "No",
      })

      if (result.isConfirmed) {
        borrarRegistros(JSON.stringify(objRegistros), "Se han borrado correctamente todos los registros seleccionados", "No se pudo eliminar uno o más registros, pero los que sí se podian eliminar fueron eliminados")
      }
    });
  });
});


function borrarRegistros(data, texto, textoError) {
  $.ajax({
    url: "/respaldos/registroseliminados/borrarregistros",
    method: "DELETE",
    contentType: "application/json",
    data,
    success: async function (res) {
      let result = await swalConfirmarYCancelar.fire({
        title: "Se ha borrado correctamente",
        text: texto + ", deseas refrescar la página?",
        icon: "success",
        showCancelButton: true,
        confirmButtonText: "Sí",
        cancelButtonText: "No",
      })
      if (result.isConfirmed)
        location.reload()
    },
    error: function (res) {
      Swal.fire("Ups...", textoError, "error");
    },
  });
}

function parseDate(dateString) {
  const [day, month, year] = dateString.split('/');
  return Date.UTC(year, month - 1, day);
}
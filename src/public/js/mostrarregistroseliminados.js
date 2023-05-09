dayjs.locale('es');
const backToTopButton = document.querySelector("#back-to-top-btn");
let tabs = document.querySelectorAll(".tabs");
var fechaRegistro = document.querySelectorAll(".fechaDelRegistro");
var clickeados = { valores: [] }
var seleccionarTodos = document.getElementById("seleccionarTodos");
var checkboxes = document.querySelectorAll(".check");

seleccionarTodos.addEventListener("change", () => {
  if (seleccionarTodos.checked)
    checkboxes.forEach(el => el.checked = true);
  else
    checkboxes.forEach(el => el.checked = false);
});
function cambiarFormatoFecha(el) {
  var fecha = el.innerText.split("/");
  if (fecha.length > 2) {
    clickeados.valores.push({ numero: el.dataset.fecha, valor: el.innerText });
    var fechaCompleta = dayjs(fecha[2] + "-" + fecha[1] + "-" + fecha[0]);
    el.innerText = fechaCompleta.format("dddd, D % MMMM % YYYY").replaceAll("%", "de");
  }
  else
    el.innerText = clickeados.valores.filter(x => x.numero === el.dataset.fecha)[0].valor;
}

fechaRegistro.forEach(el => {
  el.addEventListener("click", () => {
    cambiarFormatoFecha(el);
  });
});

window.addEventListener("load", () => {
  fechaRegistro.forEach((el) => cambiarFormatoFecha(el));
});


window.addEventListener("scroll", scrollFunction);

const swalConfirmarYCancelar = Swal.mixin({
  customClass: {
    confirmButton: "btn btn-success margenbotonswal",
    cancelButton: "btn btn-danger margenbotonswal",
  },
  buttonsStyling: false,
});


function scrollFunction() {
  if (window.pageYOffset > 0) {
    // mostrar scroller
    if (!backToTopButton.classList.contains("btnEntrance")) {
      backToTopButton.classList.remove("btnExit");
      backToTopButton.classList.add("btnEntrance");
      backToTopButton.style.display = "block";
    }
  } else {
    // esconder
    if (backToTopButton.classList.contains("btnEntrance")) {
      backToTopButton.classList.remove("btnEntrance");
      backToTopButton.classList.add("btnExit");
      setTimeout(function () {
        backToTopButton.style.display = "none";
      }, 250);
    }
  }
}

backToTopButton.addEventListener("click", (e) => {
  window.scrollTo(0, 0);
});


function devuelveTabla(registro) {
  let $tablas = registro.querySelectorAll("table");
  let tablas = `<div class="tabs">`;
  for (let i = 0; i < $tablas.length; i++) {
    tablas += `<input type="radio" class="tabs__radio" name="tabswal" id="tabswal${i}" ${i === 0 ? "checked" : ""
      }>
        <label for="tabswal${i}" class="tabs__label">Camión ${i + 1}</label>
        <div class="tabs__content">`;
    tablas += $tablas[i].outerHTML;
    tablas += `</div>`;
  }
  tablas += `</div>`;
  return { tablas, fecha: registro.querySelector(".fechaDelRegistro").innerText };
}

document.querySelectorAll(".btnrestaurar").forEach((el) => {
  el.addEventListener("click", async function(e) {
    let registro = this.closest("article");
    let resultado = devuelveTabla(registro);

    let result = await swalConfirmarYCancelar
      .fire({
        title: "Estás seguro que deseas restaurar este registro?",
        icon: "warning",
        width: (window.innerWidth * 3) / 4,
        html: resultado.tablas,
        showCancelButton: true,
        confirmButtonText: "Sí",
        cancelButtonText: "No",
      })
    if (result.isConfirmed) {
      result = await swalConfirmarYCancelar
        .fire({
          title: `Si restauras vas a sobreescribir el registro con fecha ${resultado.fecha} estas seguro que deseas continuar?`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Sí",
          cancelButtonText: "No",
        })
      if (result.isConfirmed) {
        $.ajax({
          url: "/respaldos/restaurarregistro",
          method: "POST",
          contentType: "application/json",
          data: `{"id": "${registro.getAttribute("name")}"}`,
          success: function (res) {
            Swal.fire(
              "Se ha restaurado correctamente",
              `El registro con fecha: ${resultado.fecha} se ha restaurado correctamente. Ahora serás redireccionado a esta fecha en el calendario para ver los cambios`,
              "success"
            );
          },
          error: function (res) {
            Swal.fire({
              icon: "error",
              title: "Ups...",
              text: "No se pudo restaurar el registro",
            });
          },
        });
      }
    }
  });
});

document.querySelectorAll(".btneliminar").forEach((el) => {
  el.addEventListener("click", async function(e) {
    let registro = this.closest("article");
    let resultado = devuelveTabla(registro);

    let result = await swalConfirmarYCancelar
      .fire({
        title: "Estás seguro que deseas borrar este registro?",
        icon: "warning",
        width: (window.innerWidth * 3) / 4,
        html: resultado.tablas,
        showCancelButton: true,
        confirmButtonText: "Sí",
        cancelButtonText: "No",
      })
    if (result.isConfirmed) {
      $.ajax({
        url: "/respaldos/borrarregistro",
        method: "DELETE",
        contentType: "application/json",
        data: `{"id": "${registro.getAttribute("name")}"}`,
        success: async function (res) {
          await Swal.fire(
            "Se ha borrado correctamente",
            `El registro con fecha: ${resultado.fecha} se ha borrado correctamente`,
            "success"
          );
          if (clickeados.valores.length > 2)
            window.location = document.URL;
          else
            window.location = `${document.URL.replace(/pag=[0-9]+/, `pag=${parseInt(page) - 1}`)}`;
        },
        error: function (res) {
          Swal.fire({
            icon: "error",
            title: "Ups...",
            text: "No se pudo eliminar el registro",
          });
        },
      });
    }
  });
});

document.querySelectorAll(".restaurarsoloestatabla").forEach((el) => {
  el.addEventListener("click", async function(e) {
    let registro = this.closest("article");
    let nombreTabla = this.getAttribute("name");
    let tabla = registro.querySelector(`[name=${nombreTabla}]`);
    let numTabla = nombreTabla.split("t")[1];
    let fecha = registro.querySelector(".fechaDelRegistro").innerText;
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
          url: "/respaldos/restaurarregistro",
          method: "POST",
          contentType: "application/json",
          data: `{"id": "${nombreTabla}", "numTabla": "${numTabla}"}`,
          success: function (res) {
            Swal.fire(
              "Se ha restaurado correctamente",
              `La tabla del camión No. ${numtabla} con fecha: ${fecha} se ha restaurado correctamente. Ahora serás redireccionado a esta fecha en el calendario para ver los cambios`,
              "success"
            );
          },
          error: function (res) {
            Swal.fire({
              icon: "error",
              title: "Ups...",
              text: "No se pudo restaurar el registro",
            });
          },
        });
      }
    }
  });

  document.querySelectorAll(".eliminartodos").forEach((el) => {
    el.addEventListener("click", async (e) => {
      let registros = { registros: [] };
      document.querySelectorAll(".check:checked").forEach(el =>
        registros.registros.push(el.closest("article").getAttribute("name")));
      let result = await swalConfirmarYCancelar.fire({
        title: "Estás seguro que deseas borrar los registros seleccionados?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí",
        cancelButtonText: "No",
      })

      if (result.isConfirmed) {
        $.ajax({
          url: "/respaldos/borrarregistrosseleccionados",
          method: "DELETE",
          contentType: "application/json",
          data: JSON.stringify(registros),
          success: async function (res) {
            await Swal.fire(
              "Se ha borrado correctamente",
              `Se han borrado correctamente todos los registros seleccionados`,
              "success"
            );
            if (clickeados.valores.length > 2)
              window.location = document.URL;
            else
              window.location = `${document.URL.replace(/pag=[0-9]+/, `pag=${parseInt(page) - 1}`)}`;
          },
          error: function (res) {
            Swal.fire({
              icon: "error",
              title: "Ups...",
              text: "No se pudieron eliminar los registros",});
          },
        });
      }
    });
  });
});

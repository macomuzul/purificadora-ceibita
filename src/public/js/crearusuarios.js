const swalConfirmarYCancelar = Swal.mixin({
  customClass: {
    confirmButton: "btn btn-success margenbotonswal",
    cancelButton: "btn btn-danger margenbotonswal",
  },
  buttonsStyling: false,
});

$(".fa-eye").each((i, el) => {
  el.addEventListener("click", () => {
    el.classList.add("escondido");
    $(el).next()[0].classList.remove("escondido");
    $(el).prev().attr("type", "password");
  });
})

$(".fa-eye-slash").each((i, el) => {
  el.addEventListener("click", () => {
    el.classList.add("escondido");
    $(el).prev()[0].classList.remove("escondido");
    $(el).prev().prev().attr("type", "text");
  });
})

$(document).on('click', '.dropdown-item', function () {
  $(this).closest(".dropdown-menu").prev()[0].innerText = this.innerText;
});

async function validarDatos(usuario, contraseña, confirmarContraseña, rol) {
  if (usuario === "" || contraseña === "" || confirmarContraseña === "") {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Por favor llenar todos los campos",
    });
    return false;
  }

  if (contraseña !== confirmarContraseña) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Las contraseñas no coinciden",
    });
    return false;
  }
  if (rol === "Escoge un rol") {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "No se ha escogido ningún rol para el usuario",
    });
    return false;
  }
  return true;
}

$(document).on('click', '#guardar', async function () {
  // let usuario = document.getElementById("usuario").value;
  // let contraseña = document.getElementById("contraseña").value;
  // let confirmarContraseña = document.getElementById("confirmarContraseña").value;
  // let rol = document.getElementById("rol").innerText;
  // let validacion = await validarDatos(usuario, contraseña, confirmarContraseña, rol);
  // if (!validacion)
  //   return;

  let html = `<h3>Prueba que de verdad eres tú quien intenta realizar esta acción</h3>
  <h3><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M144 144v48H304V144c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192V144C80 64.5 144.5 0 224 0s144 64.5 144 144v48h16c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V256c0-35.3 28.7-64 64-64H80z"/></svg>
  Ingresa la contraseña</h3>
  <input type="text">`
  
  let result = await swalConfirmarYCancelar.fire({
    title: "Verificación de identidad",
    icon: "warning",
    width: window.innerWidth * 3 / 4,
    html,
    showCancelButton: true,
    confirmButtonText: "Sí",
    cancelButtonText: "No",
  });

  if(result.isConfirmed){
    let mandar = `{ "usuario": "${usuario.trim()}", "contraseña": "${contraseña}", "rol": "${rol}" }`
    $.ajax({
      url: "/empleados/usuarios/crear",
      method: "POST",
      contentType: "application/json",
      data: mandar,
      success: res => {
        Swal.fire(
          "ÉXITO",
          "Se ha guardado el usuario correctamente",
          "success"
        );
      },
      error: res => {
        Swal.fire({
          icon: "error",
          title: "Ups...",
          text: res.responseText,
        });
      },
    });
  }
});


$("body").on("beforeinput", "input", function (e) {
  let letra = event.data === null ? '' : event.data
  if (letra === '"' || letra == "\\")
    e.preventDefault();
});


$("body").on("keydown", "input", function (e) {
  if (e.keyCode === 13) {
    let siguienteInput = $(this).parent().next().find("input")[0];
    if (siguienteInput instanceof HTMLInputElement)
      siguienteInput.focus();
    else
      $(this).parent().next().find("button")[0].focus();
  }
});

function enfocarCelda(elem, e) {
  e.preventDefault();
  if (elem[0] !== undefined && elem[0].getAttribute("contentEditable") === "true") {
    elem.focus();
    setEndOfContenteditable(elem[0]);
    if ($(elem).is(':offscreen')) {
      elem[0].scrollIntoView();
    }
  }
}
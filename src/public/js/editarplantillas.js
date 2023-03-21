let click_disabled = false;
const switchmodoseguro = document.querySelector("#flexSwitchModoSeguro");
const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: "btn btn-success margenboton",
    cancelButton: "btn btn-danger margenboton",
  },
  buttonsStyling: false,
});

$('.fave').click(function() {
  if (click_disabled) {
    return; 
  }

  $(this).toggleClass('faved');
  
  let label = $(this).attr('aria-label');
  if (label == 'Favourite')
    label = 'Unfavourite';
  else
    label = 'Favourite';
  
  $(this).attr('aria-label',label);
  
  click_disabled = true;  
  setTimeout(function(){
  	click_disabled = false;
  }, 1000);
    
});

$(document).on('click', ".botoneliminar",function(){
  if(switchbtn.checked)
    return;
  if (!switchmodoseguro.checked) {

    var tablaborrar = $(this).closest("tbody")[0];
    var filaborrar = $(this).parent().parent()[0];
    tablaborrar.removeChild(filaborrar);
  }
  else {
    swalWithBootstrapButtons.fire({
        icon: "warning",
        text: "Estas seguro que deseas borrar este producto?",
        showCancelButton: true,
        confirmButtonText: "Continuar",
        cancelButtonText: "No continuar",
      })
      .then((result) => {
        if (result.isConfirmed) {
          var tablaborrar = $(this).closest("tbody")[0];
    var filaborrar = $(this).parent().parent()[0];
    tablaborrar.removeChild(filaborrar);
        }
      });
  }
});




$('#añadirproducto').on('click', function(){
  let fila =
  `<tr>
  <td contenteditable="true"></td>
            <td contenteditable="true"></td>
            <td><button type="button" class="botoneliminar"><svg class="svgeliminar" xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="red" class="bi bi-trash" viewBox="0 0 16 16"> <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" /> <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" /></svg></button></td>
  </tr>`;
  $("#cuerpotabla").append(fila);

});





$(".contenedoreliminar").on('click', function(){  
  swalWithBootstrapButtons.fire({
      icon: "warning",
      text: "Estas seguro que deseas borrar esta plantilla?",
      showCancelButton: true,
      confirmButtonText: "Continuar",
      cancelButtonText: "No continuar",
    })
    .then((result) => {
      if (result.isConfirmed) {
        var param = window.location.pathname.replace("/plantillas/",'');
        var borrar = `{ "nombreplantilla": "${param}" }`;
        console.log(borrar);
        $.ajax({
          url: `/plantillas/borrar`,
          method: "DELETE",
          contentType: "application/json",
          data: borrar,
          success: function (res) {
            Swal.fire(
              "Se ha borrado la plantilla exitosamente",
              "Ahora será redireccionado al menú de plantillas",
              "success"
            ).then((result) => {
              if (result.isConfirmed) {
                window.location = "/plantillas"
              }
            });
            
          },
          error: function (res) {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "No se pudo eliminar la plantilla",
            });
  
          },
        });
      }
    });
})



$(document).on('click', "#guardar",async function(){
  var param = window.location.pathname.replace("/plantillas/",'');
  var valido = await validarcrear();
  if(valido)
  {
  var tabla =  $("tbody")[0];
   var filas = tabla.rows.length;
   var guardar = "{";
   guardar += ` "nombreplantilla": "${document.getElementById("nombreplantilla").value.trim()}",
   "productos": [ `
   for (let i = 0; i < filas; i++)
   {	
    guardar += ` { 
        "producto": "${tabla.rows[i].cells[0].innerText.trim()}", 
        "precio": ${tabla.rows[i].cells[1].innerText} 
       }`;
       if(i + 1 < filas)
       {
        guardar += ",";
       }
   } 
   guardar += " ] }"

    $.ajax({
        url: `/plantillas/${param}`,
        method: "PATCH",
        contentType: "application/json",
        data: guardar,
        success: function (res) {
          Swal.fire(
            "Se ha guardado exitosamente",
            "El archivo se ha almacenado en la base de datos",
            "success"
          ).then(() => {
            window.location = ("/plantillas/"+document.getElementById("nombreplantilla").value.trim());  
          });
        },
        error: function (res) {
          if(res.responseText === "El usuario ya existe")
          {
            Swal.fire({
              icon: "error",
              title: "Ups...",
              text: "Ya existe una plantilla con ese nombre",
            });  
          }
          else
          {
            Swal.fire({
              icon: "error",
              title: "Ups...",
              text: "No se pudo guardar en la base de datos",
            });
          }

        },
      });
    }

});
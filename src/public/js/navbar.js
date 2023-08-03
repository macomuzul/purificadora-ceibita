let navbar = $("#navbar")[0]
$(document).on("click", esconderNavbar())

//TODO hacer que la seccion de usuarios no sea visible para el usuario empleado
function esconderNavbar() {
  $(navbar).find(".presionado").removeClass("presionado").find(".submenu").slideUp()
  navbar.classList.remove("presionado")
}

$("#logoNav").on("click", e => {
  e.preventDefault()
  e.stopPropagation()
  if (navbar.classList.contains("presionado"))
    esconderNavbar()
  else
    navbar.classList.add("presionado")
})

$("body").on("click", ".nav-item-compuesto", e => {
  let el = e.currentTarget
  navbar.classList.add("presionado")
  el.classList.toggle("presionado")
  $(el).find(".submenu").slideToggle()
})

navbar.addEventListener("mouseenter", e => navbar.classList.add("presionado"))
navbar.addEventListener("mouseleave", esconderNavbar)
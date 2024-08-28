let navbar = $("#navbar")

function esconderNavbar() {
  navbar.find(".presionado").removeClass("presionado").find(".submenu").slideUp()
  navbar.removeClass("presionado")
}

qsclickd("#logoNav", e => {
  e.preventDefault()
  e.stopPropagation()
  navbar.hasClass("presionado") ? esconderNavbar() : navbar.addClass("presionado")
})

bodyOnClick(".nav-item-compuesto", c => {
  navbar.addClass('presionado')
  alternarClase(c, 'presionado')
  $(c).find(".submenu").slideToggle()
})

navbar.on("mouseenter", e => navbar.addClass("presionado"))
navbar.on("mouseleave", esconderNavbar)
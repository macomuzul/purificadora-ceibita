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

body.on("click", ".nav-item-compuesto", e => {
  let x = $(e.currentTarget)
  navbar.addClass("presionado")
  x.toggleClass("presionado")
  x.find(".submenu").slideToggle()
})

navbar.on("mouseenter", e => navbar.addClass("presionado"))
navbar.on("mouseleave", esconderNavbar)
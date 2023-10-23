let navbar = $("#navbar")[0]
$(document).on("click", esconderNavbar())

function esconderNavbar() {
  $(navbar).find(".presionado").removeClass("presionado").find(".submenu").slideUp()
  navbar.classList.remove("presionado")
}

$("#logoNav").on("click", e => {
  e.preventDefault()
  e.stopPropagation()
  navbar.classList.contains("presionado") ? esconderNavbar() : navbar.classList.add("presionado")
})

$("body").on("click", ".nav-item-compuesto", e => {
  let el = $(e.currentTarget)
  navbar.classList.add("presionado")
  el.toggleClass("presionado")
  el.find(".submenu").slideToggle()
})

navbar.addEventListener("mouseenter", e => navbar.classList.add("presionado"))
navbar.addEventListener("mouseleave", esconderNavbar)
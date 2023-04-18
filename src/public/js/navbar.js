let navbar = document.getElementById("navbar");
document.addEventListener("click", esconderNavbar());

//TODO hacer que la seccion de usuarios no sea visible para el usuario empleado
function esconderNavbar() {
  $(navbar).find(".presionado").each((i, el) => {
    let submenu = $(el).find(".submenu")[0];
    $(submenu).slideUp();
    el.classList.remove("presionado")
  })
  navbar.classList.remove("presionado");
}

document.getElementById("logoNav").addEventListener("click", e => {
  e.preventDefault();
  e.stopPropagation();
  if (navbar.classList.contains("presionado"))
    esconderNavbar();
  else
    navbar.classList.add("presionado");
});

let navLinkCompuestos = document.querySelectorAll(".nav-item-compuesto");

for (const nav of navLinkCompuestos) {
  nav.addEventListener("click", e => {
    if (!navbar.classList.contains("presionado"))
      navbar.classList.add("presionado")
    nav.classList.toggle("presionado")
    $(nav).find(".submenu").slideToggle();
  });
}

navbar.addEventListener("mouseenter", function (e) {
  navbar.classList.add("presionado");
});

navbar.addEventListener("mouseleave", function (e) {
  esconderNavbar();
});
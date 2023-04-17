let navbar = document.getElementById("navbar");

document.addEventListener("click", e => {
  if (document.querySelector(".navbar").classList.contains("presionado"))
    navbar.classList.remove("presionado");
});


document.getElementById("logoNav").addEventListener("click", e => {
  e.preventDefault();
  e.stopPropagation();
  let navbar = document.querySelector(".navbar");
  navbar.classList.toggle("presionado");
});

let navLinkCompuestos = document.querySelectorAll(".nav-item-compuesto");

for (const nav of navLinkCompuestos) {
  nav.addEventListener("click", e => {
    e.preventDefault();
    e.stopPropagation();
    let navbar = nav.closest(".navbar");
    if(!navbar.classList.contains("presionado"))
      navbar.classList.add("presionado")
    nav.classList.toggle("presionado")
    $(nav).find(".submenu").slideToggle();
  });
}

navbar.addEventListener("mouseenter", function (e) {
  this.classList.add("presionado");
});

navbar.addEventListener("mouseleave", function (e) {
  let presionado = $(this).find(".presionado")[0];
  if (presionado)
  {
    let submenu = $(presionado).find(".submenu")[0];
    $(submenu).slideUp();
    presionado.classList.remove("presionado")
  }
  this.classList.remove("presionado");
});
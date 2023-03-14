let navbar = document.getElementById("navbar");
let btncerrar = document.getElementById("cerrar");

document.addEventListener("click", () => 
{
    if(document.querySelector(".navbar").classList.contains("presionado"))
        navbar.classList.remove("presionado");
});

btncerrar.addEventListener("click", e =>{
    e.preventDefault();
    e.stopPropagation();
    let navbar = document.querySelector(".navbar");
    navbar.classList.toggle("presionado");
});



navbar.addEventListener("mouseenter", e =>{
    let navbar = document.querySelector(".navbar");
    navbar.classList.add("presionado");
});
navbar.addEventListener("mouseleave", e =>{
    let navbar = document.querySelector(".navbar");
    navbar.classList.remove("presionado");
});
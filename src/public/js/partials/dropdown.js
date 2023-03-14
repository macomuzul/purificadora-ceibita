var menuseleccionado = null;
var caretseleccionada = null;
const dropdowns = document.querySelectorAll(".dropdown");
window.addEventListener("click", (e) => {
  menuseleccionado?.classList.remove("menu-open");
  caretseleccionada?.classList.remove("caret-rotate");
});
dropdowns.forEach((dropdown) => {
  const select = dropdown.querySelector(".select");
  const caret = dropdown.querySelector(".caret");
  const menu = dropdown.querySelector(".menu");
  const options = dropdown.querySelectorAll(".menu li");
  const selected = dropdown.querySelector(".selected");
  select.addEventListener("click", e => {
    console.log("aaa")
    if(menuseleccionado === menu && menuseleccionado.classList.contains("menu-open") ) 
       return;
    e.stopPropagation()
    console.log("bbb")
    select.classList.toggle("select-clicked");
    caret.classList.toggle("caret-rotate");
    menu.classList.toggle("menu-open");
    menuseleccionado = menu;
    caretseleccionada = caret;
  });

  options.forEach((option) => {
    option.addEventListener("click", () => {
      selected.innerText = option.innerText;
      select.classList.remove("select-clicked");
      caret.classList.remove("caret-rotate");
      menu.classList.remove("menu-open");
      options.forEach((option) => option.classList.remove("active"));
      option.classList.add("active");
      metododropdown(option, menu);
    });
  });
});

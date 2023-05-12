const template = document.createElement("template");
template.innerHTML = `<style>
[slot="fecha"]{
  display: none;
}
span-fechas{
  user-select: none;
}
</style>
<slot name="fecha"></slot>
<slot name="fechaStr"></slot>`;
class spanFechas extends HTMLElement{
  constructor(){
    super();
    this.append(template.content.cloneNode(true))
    this.addEventListener("click", () => {
      $(this).find(`[slot="fecha"]`).toggle();
      $(this).find(`[slot="fechaStr"]`).toggle();
    })
  }
}

customElements.define("span-fechas", spanFechas);
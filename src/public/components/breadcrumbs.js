class customBreadcrumbs extends HTMLElement {
  constructor() {
    super();
    this.style.display = "block";
    this.inicio = `<li id="breadPrimerNivel"><a><span class="icon icon-home" style="font-size: 18px;"></span></a></li>`
    this.innerHTML = `<ul id="breadcrumb">${this.inicio}</ul>`
    this.animacionAgregar = "animate__wobble";
    this.animacionRemover = "animate__backOutDown";
    this.breadcrumb = $(this).find("#breadcrumb");
    $(this).addClass("animate__animated");
    

    $("body").on("click", "#breadPrimerNivel", () => {
      if(sectionUnidadTiempo.offsetParent === null)
        this.transicion($("#breadPrimerNivel")[0], primerNivel);
    });
    $("body").on("click", "#breadSegundoNivel", () => {
      if(sectionCantidad.offsetParent === null)
        this.transicion($("#breadSegundoNivel")[0], segundoNivel);
    });
    $("body").on("click", "#breadTercerNivel", () => {
      if(sectionRangos.offsetParent === null && sectionUnoSolo.offsetParent === null)
        this.transicion($("#breadTercerNivel")[0], tercerNivelRangos);
    });
  }

  transicion(bread, cb){
    while (bread.nextSibling) {
      bread.nextSibling.remove();
    }
    cb();
  }

  animar(){
    this.borrarClases();
    setTimeout(() => {
      $(this).addClass(this.animacionAgregar);
    }, 50);
  }

  primerNivel(){
    this.animar();
    this.breadcrumb.html(this.inicio);
  }

  segundoNivel(){
    this.primerNivel();
    this.breadcrumb.append(`<li id="breadSegundoNivel"><a><span class="icon icon-calendar"> </span> ${unidadTiempo.capitalizar()}</a></li>`);
  }

  tercerNivel(){
    this.segundoNivel();
    this.breadcrumb.append(`<li id="breadTercerNivel"><a><span class="icon icon-sort-by-order"></span> ${cantidad.capitalizar()}</a></li>`);
  }

  cuartoNivel(){
    this.tercerNivel();
    this.breadcrumb.append(`<li><a><span class="icon icon-sort"></span> ${rango.capitalizar()}</a></li>`);
  }

  añadir(elemento){
    this.animar();
    $(this).append(elemento);
  }
  
  mostrar(){
    this.borrarClases();
    $(this).css("display", "flex");
    $(this).addClass(this.animacionAgregar);
  }

  esconder(){
    this.borrarClases();
    $(this).addClass(this.animacionRemover);
    setTimeout(() => {
      $(this).css("display", "none");
    }, 300);
  }

  borrarClases(){
    this.classList.remove(this.animacionAgregar);
    this.classList.remove(this.animacionRemover);
  }
}

String.prototype.capitalizar = function(){
  return this.charAt(0).toUpperCase() + this.slice(1);
}

customElements.define("custom-breadcrumbs", customBreadcrumbs);
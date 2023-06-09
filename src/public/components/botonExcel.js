class botonExcel extends HTMLButtonElement {
  constructor() {
    super();
    this.htmlOriginal = `<svg xmlns="http://www.w3.org/2000/svg" width="30px" height="30px" viewBox="0 0 32 32"><title>file_type_excel2</title><path d="M28.781,4.405H18.651V2.018L2,4.588V27.115l16.651,2.868V26.445H28.781A1.162,1.162,0,0,0,30,25.349V5.5A1.162,1.162,0,0,0,28.781,4.405Zm.16,21.126H18.617L18.6,23.642h2.487v-2.2H18.581l-.012-1.3h2.518v-2.2H18.55l-.012-1.3h2.549v-2.2H18.53v-1.3h2.557v-2.2H18.53v-1.3h2.557v-2.2H18.53v-2H28.941Z" style="fill:#20744a;fill-rule:evenodd"/><rect x="22.487" y="7.439" width="4.323" height="2.2" style="fill:#20744a"/><rect x="22.487" y="10.94" width="4.323" height="2.2" style="fill:#20744a"/><rect x="22.487" y="14.441" width="4.323" height="2.2" style="fill:#20744a"/><rect x="22.487" y="17.942" width="4.323" height="2.2" style="fill:#20744a"/><rect x="22.487" y="21.443" width="4.323" height="2.2" style="fill:#20744a"/><polygon points="6.347 10.673 8.493 10.55 9.842 14.259 11.436 10.397 13.582 10.274 10.976 15.54 13.582 20.819 11.313 20.666 9.781 16.642 8.248 20.513 6.163 20.329 8.585 15.666 6.347 10.673" style="fill:#fff;fill-rule:evenodd"/></svg> Exportar a Excel`
    this.cambiarContenido(this.htmlOriginal);
    $(this).addClass("btn btn-success botonexcel");
    this.addEventListener("click", this.exportarTabla);
  }

  cambiarContenido(html) {
    this.innerHTML = `<style>
    .botonexcel{
      padding: 10px;
      background: #064723;
      border-color: #116d3a;
      width: 172px;
      height: 52px;
    }
    .botonexcel:hover, .botonexcel:focus, .botonexcel:active {
      background: #165a35;
      box-shadow: 0 0 0 0.1rem rgb(60 153 110 / 50%) !important;
    }
    .cajaspinner{
      transform: translateY(3px);
      display: inline-block;
      margin-left: 5px;
    }
    .spinner-border{
      width: 20px;
      height: 20px;
    }
    </style>` + html;
  }

  async exportarTabla() {
    this.cambiarContenido(`  Cargando<div class="cajaspinner"><div class="spinner-border text-success"></div>`);
    await this.pedirExcel();
    this.crear();
    setTimeout(() => {
      this.cambiarContenido(this.htmlOriginal);
    }, 2000);
  }

  ajustesCeldasExcel(cell) {
    cell.s = {
      alignment: {
        horizontal: "center",
        vertical: "center",
      },
      font: {
        color: { rgb: "FFFFFF" }
      },
      border: {
        right: {
          style: "thin",
          color: { rgb: '000000' }
        },
        left: {
          style: "thin",
          color: { rgb: '000000' }
        },
        bottom: {
          style: "thin",
          color: { rgb: '000000' }
        },
        top: {
          style: "thin",
          color: { rgb: '000000' }
        },
      }
    };
  }

  async pedirExcel() {
    if (typeof XLSX === "undefined")
      await $.getScript('/tablaAExcelSheetJS.js');
  }

  inicializar(crear) {
    this.crear = crear;
  }
}
//TODO cambiar las librerias de plugins a las desargadas de internet

customElements.define("boton-excel", botonExcel, { extends: "button" });
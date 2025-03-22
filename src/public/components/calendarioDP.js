class cCalendarioSimple extends HTMLElement {
  connectedCallback() {
    let { id, esMultiple, fecha, idinput } = this.dataset
    this.outerHTML = `<div class="input-group date${esMultiple ? '' : ' divdatepicker'}"${id ? ` id="${id}"` : ''}><input type="text" class="form-control form-control-datepicker" readonly ${fecha ? `value="${fecha}"` : ''} id="${idinput || 'calendario'}"><span class="input-group-append"><span class="input-group-text bg-white"><i class="fa fa-calendar"></i></span></span></div>`
  }
}

customElements.define("calendario-simple", cCalendarioSimple)

class cCalendarioMultiple extends HTMLElement {
  connectedCallback() {
    this.outerHTML = `<div class="input-group input-daterange divdatepicker" id="${this.dataset.id}"${this.hidden ? ' hidden' : ''}>
    <calendario-simple data-idinput="calendario1" data-esMultiple="1"></calendario-simple>
    <div class="divseparador">y</div>
    <calendario-simple data-idinput="calendario2" data-esMultiple="1"></calendario-simple>
  </div>`
  }
}

customElements.define("calendario-multiple", cCalendarioMultiple)
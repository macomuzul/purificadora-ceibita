añadirCSS(`dropdown-camioneros {
  display: flex;

  &:has(input:focus) {
    box-shadow: 0 0 0 0.18rem rgba(13, 110, 253, 0.25);
  }
}
.dropdown-toggle-split {
  height: 34px;
  width: 28px;
  border-radius: 0;
  border: none;
  transform: translateX(-1px);
  font-size: 23px;
  background: #00132e !important;

  &:hover,
  &:active,
  &:focus {
    background: #00132e !important;
  }
}

.dropdown-toggle-split::after,
.dropend .dropdown-toggle-split::after,
.dropup .dropdown-toggle-split::after {
  font-size: 23px;
  transform: rotate(90deg) translate(-2px, 0px);
}

.dropdown-item.active,
.dropdown-item:active {
  background: transparent !important;
}

.dropdown-menu-dark li {
  cursor: pointer;
}`)

let camioneros = qsarr('#camioneros *').map(x => x.value)

class dropdownCamioneros extends Componente {
  alConectar() {
    this.innerHTML = `<input type="text" class="form-control trabajador" value="${this.dataset.valor ?? ''}" list="camioneros">
<div class="btn-group dropend">
<button class="btn btn-sm btn-secondary dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown"></button>
<ul class="dropdown-menu dropdown-menu-dark">${camioneros.map(x => `<li class="dropdown-item">${x}</li>`).join('')}</ul>
</div>`
  }
}

customElements.define('dropdown-camioneros', dropdownCamioneros)
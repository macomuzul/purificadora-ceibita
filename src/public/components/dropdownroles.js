$("head").append(`<style>
.dropdown-toggle {
  text-align: left;
  background: white !important;
  color: #212529 !important;
  position: relative;

  &::after {
    position: absolute;
    top: 45%;
    right: 10px;
    font-size: 19px;
  }
}

.dropdown-item {
  color: white;
  padding: 8px 10px;
  cursor: pointer;
  &.active,
  &:active,
  &:hover {
    background: #373c49;
    color: white;
  }
}

.dropdown-menu {
  width: 300px;
  padding: 8px 10px !important;
  background: rgb(42, 48, 60);
}
</style>`)

class dropdownRoles extends HTMLElement {
  connectedCallback() {
    let { seleccionado } = this.dataset
    this.innerHTML = `<div class="dropdown">
    <label for="rol">Rol</label>
    <button class="btn dropdown-toggle form-control" type="button" data-bs-toggle="dropdown" aria-expanded="false" id="rol">${seleccionado ?? "Escoge un rol"}</button>
    <ul class="dropdown-menu">
      <li><a class="dropdown-item">Administrador</a></li>
      <li><a class="dropdown-item">Empleado</a></li>
    </ul>
  </div>`
  }
}

customElements.define("dropdown-roles", dropdownRoles)
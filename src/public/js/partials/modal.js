let modal
class customModal extends HTMLElement {
  connectedCallback() {
    let attributes = {
      'class': 'modal fade',
      'id': 'modal',
      'data-bs-backdrop': 'static',
      'data-bs-keyboard': 'false',
      'tabindex': '-1'
    }

    Object.entries(attributes).forEach(([k, v]) => this.setAttribute(k, v))
    this.innerHTML = `<div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <div class="modal-title headerModal">Verificación de identidad</div>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <div class="cuerpoModal1">Demustra que de verdad eres tú quien intenta realizar esta acción</div>
          <i class="fa-solid fa-lock"></i>
          <div class="cuerpoModal2">Ingresa la contraseña de tu usuario</div>
          <div class="cuerpoModal3">
            <input-contraseña data-id="verificacionIdentidad" data-focus="1" />
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-success margenbotonswal botonconfirm" id="enviarVerificacion">Confirmar</button>
          <button type="button" class="btn btn-danger margenbotonswal botoncancel" data-bs-dismiss="modal">Cancelar</button>
        </div>
      </div>
    </div>`

    setTimeout(() => {
      modal = this
      this.btModal = new bootstrap.Modal(this)
      this.input = $(this).find("input")[0]

      
      $(this).on("hide.bs.modal", q => {
        this.input.value = ""
        this.input.type === "text" ? $(this).find("input-contraseña")[0].clickOjo(0) : ""
      })

      $(this).on('click', '#enviarVerificacion', q => {
        let { input } = this
        if (input.value === "") {
          input.setCustomValidity('Por favor escribe una contraseña')
          input.reportValidity()
        }
        else {
          this.ajax()
          this.btModal.hide()
        }
      })
    }, 5)
  }

  mostrar(ajax){
    this.btModal.show()
    this.ajax = ajax
  }
}

customElements.define("custom-modal", customModal)

class inputContraseña extends HTMLElement {
  connectedCallback() {
    let { id, focus, label } = this.dataset

    this.innerHTML = `${label ? `<label for="${id}">${label}</label>` : ""}
    <input ${label ? `class="form-control"` : ""} type="password" id="${id}" ${focus ? "autofocus" : ""}>
    <i class="fa-sharp fa-solid fa-eye" style="display: none;"></i>
    <i class="fa-sharp fa-solid fa-eye-slash"></i>`

    $(this).on("click", ".fa-eye", q => this.clickOjo(0))
    $(this).on("click", ".fa-eye-slash", q => this.clickOjo(1))
  }

  clickOjo(texto){
    $(this).find("i").toggle()
    $(this).find("input").attr("type", texto ? "text" : "password")
  }
}

customElements.define("input-contraseña", inputContraseña)
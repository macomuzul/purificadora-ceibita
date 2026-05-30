añadirCSS(`i {
  font-size: 24px;
  color: #c5c5c5;
  cursor: pointer;
}

.modal-content {
  background: #23232e;
  color: white;
}

.modal-body {
  font-size: 18px;

  .fa-eye {
    translate: 6px 4px;
  }
  .fa-eye-slash {
    translate: 5px 4px;
  }
}

.modal-header {
  font-size: 24px;
}

.cuerpoModal1 {
  text-align: center;
  font-size: 22px;
}

.cuerpoModal2 {
  margin: 15px 0 12px 7px;
  display: inline-block;
}

.cuerpoModal3 {
  display: inline-block;
  margin-left: 5px;
}

#verificacionIdentidad {
  width: 220px;
  padding: 2px 5px;
  font-size: 18px;
}

.fa-lock {
  font-size: 22px;
  transform: translateY(1px);
}

.botonconfirm {
  background: #037841;
  border: 1px solid #194c19;
  &:hover {
    background: #025a31;
  }
}

.botoncancel {
  background: #be0000;
  border: 1px solid #582630;
  &:hover {
    background: #a80101;
  }
}`)
let modalAutenticacion
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
          <button class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <div class="cuerpoModal1">Demuestra que de verdad eres tú quien intenta realizar esta acción</div>
          <i class="fa-solid fa-lock"></i>
          <div class="cuerpoModal2">Ingresa la contraseña de tu usuario</div>
          <div class="cuerpoModal3"><input-password data-focus="1"></input-password></div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-success margenbotonswal botonconfirm" id="enviarVerificacion">Confirmar</button>
          <button class="btn btn-danger margenbotonswal botoncancel" data-bs-dismiss="modal">Cancelar</button>
        </div>
      </div>
    </div>`

    setTimeout(() => {
      modalAutenticacion = this
      this.btModal = new bootstrap.Modal(this)
      this.input = this.qs('input')
      $(this).on("hide.bs.modal", q => {
        this.input.value = ''
        this.input.type === "text" ? this.qs("input-password").clickOjo(0) : ''
      })

      this.elclick('#enviarVerificacion', q => {
        let { input } = this
        if (input.value === '') {
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

  mostrar(ajax) {
    this.ajax = ajax
    this.btModal.show()
  }
}

customElements.define("custom-modal", customModal)

class inputPass extends HTMLElement {
  connectedCallback() {
    let { innerHTML: label } = this
    let { focus } = this.dataset

    this.innerHTML = `<label>${label ?? ''}<input ${label ? `class="form-control"` : ''} type="password" id="verificacionIdentidad" ${focus ? "autofocus" : ''}></label>
    <i class="fa-sharp fa-solid fa-eye" hidden></i><i class="fa-sharp fa-solid fa-eye-slash"></i>`

    this.elclick(".fa-eye", q => this.clickOjo(0))
    this.elclick(".fa-eye-slash", q => this.clickOjo(1))
  }

  clickOjo(texto) {
    this.qsafor('i', x => x.alternar())
    this.qs('input').setAttribute('type', texto ? 'text' : 'password')
  }
}

customElements.define("input-password", inputPass)
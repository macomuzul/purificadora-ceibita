let modal
class customModal extends HTMLElement {
  connectedCallback() {
    let attributes = {
      'class': 'modal fade',
      'id': 'modal',
      'data-bs-backdrop': 'static',
      'data-bs-keyboard': 'false',
      'tabindex': '-1'
    };

    for (let [key, value] of Object.entries(attributes)) {
      this.setAttribute(key, value);
    }

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
      modal = new bootstrap.Modal(this)
      this.inputJQ = $(this).find("input")
      this.input = this.inputJQ[0]

      $(this).on("hide.bs.modal", function () {
        let {input, inputJQ} = this
        input.value = "";
        if (input.type === "text")
          inputJQ.next().click();
      });

      $(this).on('click', '#enviarVerificacion', () => {
        let {input} = this;
        if (input.value === "") {
          input.setCustomValidity('Por favor escribe una contraseña')
          input.reportValidity()
        }
        else
          funcionEnviar();
      });
    }, 0);
  }
}

customElements.define("custom-modal", customModal);

class inputContraseña extends HTMLElement {
  connectedCallback() {
    let { id, focus, label } = this.dataset

    this.innerHTML = `${label ? `<label for="${id}">${label}</label>` : ""}
    <input ${label ? `class="form-control"` : ""} type="password" id="${id}" ${focus ? "autofocus" : ""}>
    <i class="fa-sharp fa-solid fa-eye" style="display: none;"></i>
    <i class="fa-sharp fa-solid fa-eye-slash"></i>`

    let ojoNormal = $(this).find(".fa-eye")
    let ojoCerrado = $(this).find(".fa-eye-slash")
    let input = $(this).find("input")

    $(this).on("click", ".fa-eye", () => {
      ojoNormal.toggle()
      ojoCerrado.toggle()
      input.attr("type", "password")
    })

    $(this).on("click", ".fa-eye-slash", () => {
      ojoNormal.toggle()
      ojoCerrado.toggle()
      input.attr("type", "text")
    })
  }
}

customElements.define("input-contraseña", inputContraseña);
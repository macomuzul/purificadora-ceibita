class datepickerSimple extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    const promises = [];

    const cssFiles = [
      "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css",
      "https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css",
      "https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.9.0/css/bootstrap-datepicker.min.css",
    ];


    cssFiles.forEach((url) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = url;
      const promise = new Promise((resolve, reject) => {
        link.onload = resolve;
        link.onerror = reject;
      });
      promises.push(promise);
      this.shadowRoot.appendChild(link);
    });
    Promise.all(promises)
      .then(() => {
        this.render();
      })
      .catch((error) => {
        console.error('Failed to load dependencies:', error);
      });
  }

  render() {
    this.shadowRoot.innerHTML += `<div class="divdatepicker">
    <div class="input-group date" id="datepickerSimple">
      <input type="text" class="form-control" readonly id="calendario">
      <span class="input-group-append">
        <span class="input-group-text bg-white">
          <i class="fa fa-calendar"></i>
        </span>
      </span>
    </div>
  </div>`;
    let opciones = { weekStart: 1, language: "es", autoclose: true, maxViewMode: 2, todayHighlight: true, format: "dd/mm/yyyy" };
    $(this.shadowRoot).find("#datepickerSimple").datepicker(opciones).on("show", q => mostrarOffscreen($(".datepicker")[0]))
  }
}

let mostrarOffscreen = x => {
  let rect = x.getBoundingClientRect()
  if(((rect.x + rect.width) > window.innerWidth || (rect.y + rect.height) > window.innerHeight)) x.scrollIntoView()
}

customElements.define("datepicker-simple", datepickerSimple)
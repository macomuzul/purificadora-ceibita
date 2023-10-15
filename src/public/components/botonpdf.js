$("head").append(`<style>
.botonpdf{
  padding: 10px;
  background: #871a08;
  border-color: #b31616;
  width: 168px;
  height: 52px;
}
.botonpdf:hover, .botonpdf:focus, .botonpdf:active {
  background: #950303;
  box-shadow: 0 0 0 0.2rem rgba(156, 44, 44, 0.5) !important;
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
</style>`)

$("body").on("click", ".botonpdf", e => e.currentTarget.exportarTabla())

class botonPDF extends HTMLElement {
  connectedCallback() {
    this.htmlOriginal = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" height="30px" width="30px" viewBox="0 0 56 56" xml:space="preserve"><g><path style="fill:#E9E9E0;" d="M36.985,0H7.963C7.155,0,6.5,0.655,6.5,1.926V55c0,0.345,0.655,1,1.463,1h40.074   c0.808,0,1.463-0.655,1.463-1V12.978c0-0.696-0.093-0.92-0.257-1.085L37.607,0.257C37.442,0.093,37.218,0,36.985,0z"/><polygon style="fill:#D9D7CA;" points="37.5,0.151 37.5,12 49.349,12  "/><path style="fill:#CC4B4C;" d="M19.514,33.324L19.514,33.324c-0.348,0-0.682-0.113-0.967-0.326   c-1.041-0.781-1.181-1.65-1.115-2.242c0.182-1.628,2.195-3.332,5.985-5.068c1.504-3.296,2.935-7.357,3.788-10.75   c-0.998-2.172-1.968-4.99-1.261-6.643c0.248-0.579,0.557-1.023,1.134-1.215c0.228-0.076,0.804-0.172,1.016-0.172   c0.504,0,0.947,0.649,1.261,1.049c0.295,0.376,0.964,1.173-0.373,6.802c1.348,2.784,3.258,5.62,5.088,7.562   c1.311-0.237,2.439-0.358,3.358-0.358c1.566,0,2.515,0.365,2.902,1.117c0.32,0.622,0.189,1.349-0.39,2.16   c-0.557,0.779-1.325,1.191-2.22,1.191c-1.216,0-2.632-0.768-4.211-2.285c-2.837,0.593-6.15,1.651-8.828,2.822   c-0.836,1.774-1.637,3.203-2.383,4.251C21.273,32.654,20.389,33.324,19.514,33.324z M22.176,28.198   c-2.137,1.201-3.008,2.188-3.071,2.744c-0.01,0.092-0.037,0.334,0.431,0.692C19.685,31.587,20.555,31.19,22.176,28.198z    M35.813,23.756c0.815,0.627,1.014,0.944,1.547,0.944c0.234,0,0.901-0.01,1.21-0.441c0.149-0.209,0.207-0.343,0.23-0.415   c-0.123-0.065-0.286-0.197-1.175-0.197C37.12,23.648,36.485,23.67,35.813,23.756z M28.343,17.174   c-0.715,2.474-1.659,5.145-2.674,7.564c2.09-0.811,4.362-1.519,6.496-2.02C30.815,21.15,29.466,19.192,28.343,17.174z    M27.736,8.712c-0.098,0.033-1.33,1.757,0.096,3.216C28.781,9.813,27.779,8.698,27.736,8.712z"/><path style="fill:#CC4B4C;" d="M48.037,56H7.963C7.155,56,6.5,55.345,6.5,54.537V39h43v15.537C49.5,55.345,48.845,56,48.037,56z"/><g><path style="fill:#FFFFFF;" d="M17.385,53h-1.641V42.924h2.898c0.428,0,0.852,0.068,1.271,0.205    c0.419,0.137,0.795,0.342,1.128,0.615c0.333,0.273,0.602,0.604,0.807,0.991s0.308,0.822,0.308,1.306    c0,0.511-0.087,0.973-0.26,1.388c-0.173,0.415-0.415,0.764-0.725,1.046c-0.31,0.282-0.684,0.501-1.121,0.656    s-0.921,0.232-1.449,0.232h-1.217V53z M17.385,44.168v3.992h1.504c0.2,0,0.398-0.034,0.595-0.103    c0.196-0.068,0.376-0.18,0.54-0.335c0.164-0.155,0.296-0.371,0.396-0.649c0.1-0.278,0.15-0.622,0.15-1.032    c0-0.164-0.023-0.354-0.068-0.567c-0.046-0.214-0.139-0.419-0.28-0.615c-0.142-0.196-0.34-0.36-0.595-0.492    c-0.255-0.132-0.593-0.198-1.012-0.198H17.385z"/><path style="fill:#FFFFFF;" d="M32.219,47.682c0,0.829-0.089,1.538-0.267,2.126s-0.403,1.08-0.677,1.477s-0.581,0.709-0.923,0.937    s-0.672,0.398-0.991,0.513c-0.319,0.114-0.611,0.187-0.875,0.219C28.222,52.984,28.026,53,27.898,53h-3.814V42.924h3.035    c0.848,0,1.593,0.135,2.235,0.403s1.176,0.627,1.6,1.073s0.74,0.955,0.95,1.524C32.114,46.494,32.219,47.08,32.219,47.682z     M27.352,51.797c1.112,0,1.914-0.355,2.406-1.066s0.738-1.741,0.738-3.09c0-0.419-0.05-0.834-0.15-1.244    c-0.101-0.41-0.294-0.781-0.581-1.114s-0.677-0.602-1.169-0.807s-1.13-0.308-1.914-0.308h-0.957v7.629H27.352z"/><path style="fill:#FFFFFF;" d="M36.266,44.168v3.172h4.211v1.121h-4.211V53h-1.668V42.924H40.9v1.244H36.266z"/></g></g></svg> Exportar a PDF`
    this.innerHTML = this.htmlOriginal
    $(this).addClass("btn btn-danger botonpdf")
    // if (this.id !== "") this.addEventListener("click", this.exportarTabla)
  }

  async cargando() {
    this.innerHTML = `  Cargando<div class="cajaspinner"><div class="spinner-border text-danger"></div></div>`
    //TODO cambiar estos tambien y poner que sean el min y no debug

    if (typeof jsPDF === "undefined") {
      try {
        await Promise.all([$.getScript('/jspdf-1.5.3.js'), $.getScript('/html2canvas-1.3.2.js')])
        return true
      } catch (error) {
        this.innerHTML = `Error al generar PDF`
        return false
      }
    }
    return true
    // await $.getScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/1.5.3/jspdf.debug.js')
    // await $.getScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.3.2/html2canvas.js')
    
    //TODO aqui esta el min
    // await $.getScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/1.5.3/jspdf.min.js')
    // await $.getScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.3.2/html2canvas.min.js')

    // await $.getScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.1.1/jspdf.umd.min.js')
    // await $.getScript('https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js')
    // await $.getScript('https://cdnjs.cloudflare.com/ajax/libs/dompurify/3.0.3/purify.min.js')
  }

  async exportarTabla() {
    if(!await this.cargando()) return
    let pdf = new jsPDF('p', 'pt', 'letter')
    // let pdf = new jspdf.jsPDF();
    let margin = 20
    let scale = (pdf.internal.pageSize.width - margin * 2) / document.body.scrollWidth
    let html = this.generarHTML()
    pdf.html(html, {
      x: margin, y: margin, html2canvas: { scale },
      callback: pdf => this.guardar(pdf)
    })
  }


  async exportarGrafico($canvas, nombre) {
    if(!await this.cargando()) return
    this.nombre = nombre
    html2canvas($canvas).then(canvas => {
      let chartImage = canvas.toDataURL('image/jpeg', 1.0)
      let pdf = new jsPDF({ orientation: 'landscape' })
      let chartWidth = 280
      let chartHeight = 150
      let xPos = (pdf.internal.pageSize.getWidth() - chartWidth) / 2
      let yPos = (pdf.internal.pageSize.getHeight() - chartHeight) / 2

      pdf.addImage(chartImage, 'JPEG', xPos, yPos, chartWidth, chartHeight)
      this.guardar(pdf)
    })
  }

  guardar(pdf) {
    pdf.save(`${this.nombre}.pdf`)
    this.innerHTML = `Archivo creado`
    setTimeout(() => this.innerHTML = this.htmlOriginal, 2000)
  }

  inicializar(generarHTML, nombre) {
    Object.assign(this, { generarHTML, nombre })
  }
}

customElements.define("boton-pdf", botonPDF)
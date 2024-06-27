class spanFechas extends HTMLElement {
  connectedCallback() {
    let { fecha, sinhora, escondido } = this.dataset
    this.style.userSelect = "none"
    fecha = new Date(fecha)
    Object.assign(this, { fecha, sinhora })
    let formatearFecha = opciones => new Intl.DateTimeFormat('es-ES', { ...opciones, timeZone: this.sinhora ? "UTC" : "America/Guatemala" }).format(this.fecha)
    let texto = formatearFecha({ dateStyle: "full" })
    let html = `<span class="spanFecha" hidden>${formatearFecha({ day: 'numeric', month: 'numeric', year: 'numeric' })}</span>
    <span class="spanFechaStr">${sinhora ? texto.replace(/^\w/, c => c.toUpperCase()) : texto}</span>`

    if (!sinhora) {
      let hora = parseInt(formatearFecha({ hour: "numeric" }))
      let tiempo = (hora >= 0 && hora < 6) ? "madrugada" : (hora >= 6 && hora < 12) ? "mañana" : (hora >= 12 && hora < 19) ? "tarde" : "noche"
      html += `<span class="spanHoras"${escondido ? ' hidden' : ''}> a las ${hora > 13 ? hora - 12 : hora} ${hora === 0 ? "horas" : ""} de la ${tiempo} con ${fecha.getMinutes()} minutos y ${fecha.getSeconds()} segundos </span>`
    }
    this.innerHTML = html

    $(this).on("click", ".spanFechaStr,.spanFecha", q => {
      alternar(qs(this, `.spanFecha`))
      alternar(qs(this, `.spanFechaStr`))
    })
  }

}

customElements.define("span-fechas", spanFechas)
class cPodio extends HTMLElement {
  connectedCallback() {
    Object.keys(this.dataset).forEach(x => this.dataset[x] === "undefined" ? this.dataset[x] = "Vacío" : "")
    let { ar1, ar2, ar3, ab1, ab2, ab3, titulo } = this.dataset
    this.innerHTML = `<div class="contenedorPodio">
    <div class="titulopodio">${titulo}</div>
    <div id="podium-box">
      <div class="step-container"><div>${ar2}</div><div>${ab2}</div><div id="second-step" class="podium-number">2</div></div>
      <div class="step-container"><div>${ar1}</div><div>${ab1}</div><div id="first-step" class="podium-number">1</div></div>
      <div class="step-container"><div>${ar3}</div><div>${ab3}</div><div id="third-step" class="podium-number">3</div></div>
    </div>
    <canvas class="canvaspodio"></canvas>
  </div>`
  }
}

customElements.define("custom-podio", cPodio)
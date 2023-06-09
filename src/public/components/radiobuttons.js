class radiobutton extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    let { id, checked } = this.dataset;
    this.innerHTML = `<div class="form-check form-check-inline">
    <input class="form-check-input" type="radio" id="${id}" ${checked ? "checked" : ""}>
    <label class="form-check-label" for="${id}">${this.innerHTML}</label>
    </div>`
  }
}

customElements.define("custom-radiobutton", radiobutton);

class radiogroup extends HTMLElement {
  connectedCallback() {
    requestAnimationFrame(() => $(this).children().each((i, el) => $(el).find("input")[0].name = this.id));
  }
}

customElements.define("custom-radiogroup", radiogroup);
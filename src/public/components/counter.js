let cantidad = 30;

class counter extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });
    this.timerId = null;
    shadow.innerHTML = `<style>
    .countdown {
      line-height: 1;
    }
  
    .countdown>* {
      height: 1em;
      display: inline-block;
      overflow-y: hidden;
    }
  
    .countdown>:before {
      content: "00\\a 01\\a 02\\a 03\\a 04\\a 05\\a 06\\a 07\\a 08\\a 09\\a 10\\a 11\\a 12\\a 13\\a 14\\a 15\\a 16\\a 17\\a 18\\a 19\\a 20\\a 21\\a 22\\a 23\\a 24\\a 25\\a 26\\a 27\\a 28\\a 29\\a 30\\a 31\\a 32\\a 33\\a 34\\a 35\\a 36\\a 37\\a 38\\a 39\\a 40\\a 41\\a 42\\a 43\\a 44\\a 45\\a 46\\a 47\\a 48\\a 49\\a 50\\a 51\\a 52\\a 53\\a 54\\a 55\\a 56\\a 57\\a 58\\a 59\\a 60\\a 61\\a 62\\a 63\\a 64\\a 65\\a 66\\a 67\\a 68\\a 69\\a 70\\a 71\\a 72\\a 73\\a 74\\a 75\\a 76\\a 77\\a 78\\a 79\\a 80\\a 81\\a 82\\a 83\\a 84\\a 85\\a 86\\a 87\\a 88\\a 89\\a 90\\a 91\\a 92\\a 93\\a 94\\a 95\\a 96\\a 97\\a 98\\a 99\\a ";
      white-space: pre;
      top: calc(var(--value)*-1em);
      text-align: center;
      transition: all 1s cubic-bezier(1, 0, 0, 1);
      position: relative;
      font-weight: 500;
    }

    :host{
      display: none;
    }
    </style>
    <span class="countdown">
    <span style="--value:${cantidad};"></span>
    </span>`;
  }
  
  resetear(cb) {
    this.style.display = "inline";
    let estilo = this.shadowRoot.querySelector(`.countdown span`).style;
    estilo.color = "white";
    estilo.setProperty("--value", cantidad);
    this.cuentaAtras(cantidad, this, estilo, cb);
  }

  cuentaAtras(cantidad, obj, estilo, cb) {
    this.timerId = setTimeout(() => {
      cantidad--;
      estilo.setProperty("--value", cantidad);
      if (cantidad <= 3)
        estilo.color = "red";
      else if (cantidad <= 10)
        estilo.color = "yellow";
      if (cantidad > 0)
        this.cuentaAtras(cantidad, obj, estilo, cb)
      else
      {
        obj.style.display = "none";
        cb();
      }
    }, 1000);
  }
  
  parar() {
    clearTimeout(this.timerId);
    this.style.display = "none";
    let estilo = this.shadowRoot.querySelector(`.countdown span`).style;
    estilo.color = "white";
    estilo.setProperty("--value", 0);
  }
}

customElements.define("custom-counter", counter);
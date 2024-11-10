let head = document.head
let body = document.body

let qs = x => body.querySelector(x)
let qsa = x => body.querySelectorAll(x)
let qsafor = (x, m) => [...qsa(x)].forEach(m)
let qsclick = (x, m) => qs(x).onclick = m
let qsarr = x => [...qsa(x)]

let añadirCSS = x => head.innerHTML += `<style>${x}</style>`
let añadirJS = src => new Promise((res, rej) => head.appendChild(Object.assign(document.createElement('script'), { src, onload: res, onerror: rej })))
Object.assign(HTMLElement.prototype, {
  qs(x) { return this.querySelector(x) },
  qsa(x) { return this.querySelectorAll(x) },
  qsarr(x) { return [...this.querySelectorAll(x)] },
  qsafor(x, m) { return this.qsa(x).forEach(m) },
  añadirClase(x) { return this.classList.add(x) },
  quitarClase(x) { return this.classList.remove(x) },
  alternarClase(x, y) { return this.classList.toggle(x, y) },
  tieneClase(x) { return this.classList.contains(x) },
  ant() { return this.previousElementSibling },
  sig() { return this.nextElementSibling },
  // primero() { return this.firstElementChild },
  // ultimo() { return this.lastElementChild },
  padre() { return this.parentElement },
  indice() { return [...this.parentNode.children].indexOf(this) },
  mostrar() { return this.hidden = false },
  esconder() { return this.hidden = true },
  alternar() { return this.hidden = !this.hidden },
  clonar() { return this.cloneNode(true) },
  añadirHTML(x) { this.insertAdjacentHTML('beforeend', x) },
  html(x) { this.innerHTML = x },
  elclick(el, m) { elOn(this, 'click', el, m) }
})


let elOn = (orig, ev, el, m) => orig.addEventListener(ev, e => {
  let c = e.target.closest(el)
  if (c) m(c, e)
})
let bodyOn = (ev, el, m) => elOn(body, ev, el, m)
let bodyOnClick = (el, m) => bodyOn('click', el, m)

let alCargar = async x => await window.addEventListener('load', x)

let estilosSwal = (confirmButton, cancelButton = '', denyButton = '') => Swal.mixin({ customClass: { confirmButton, cancelButton, denyButton }, buttonsStyling: false })
let swalConfirmarYCancelar = estilosSwal('btn btn-success margenbotonswal', 'btn btn-danger margenbotonswal')
async function swalSíNo(title, html, width = (innerWidth * 3) / 4) {
  let { isConfirmed } = await swalConfirmarYCancelar.fire({
    title, icon: 'warning', width, html,
    showCancelButton: true,
    confirmButtonText: 'Sí',
    cancelButtonText: 'No',
  })
  return isConfirmed
}
let swalExito = t => Swal.fire("Éxito", t, "success")
let swalError = t => Swal.fire("Error", t, "error")

async function peticion(url, method, body, exito, fallo = r => mostrarError(r.responseText), error = q => Swal.fire("Error de conexión", "Te has quedado sin conexión a internet. Por favor conéctate a una red WIFI", "error")){
  try {
    let r = method === 'GET' ? await fetch(url) : await fetch(url, { headers: { "Content-Type": "application/json" }, method, body })
    if(!r.ok) return fallo(r)
    exito(r)
  } catch (e) {
    console.log(e)
    error()
  }
}

let hazPost = (url, body, exito, fallo, error) => peticion(url, "POST", body, exito, fallo, error)
let hazDelete = (url, body, exito, fallo, error) => peticion(url, "DELETE", body, exito, fallo, error)
let hazGet = (url, body, exito, fallo, error) => peticion(url, "GET", body, exito, fallo, error)
let hazPatch = (url, body, exito, fallo, error) => peticion(url, "PATCH", body, exito, fallo, error)

let esTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
if (esTouch) $.getScript('/touch.js')


Object.assign(String.prototype, {
  aFloat() { return parseFloat(this) },
  aInt() { return parseInt(this) },
  normalizar() { return this.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '') },
  normalizarPrecio() { return this.aFloat().toFixed(2).replace(/[.,]00$/, '') }
})
Number.prototype.normalizarPrecio = function () { return this.toFixed(2).replace(/[.,]00$/, '') }


class Componente extends HTMLElement {
  connectedCallback() {
    if (this.conectado) return
    this.conectado = true
    this.alConectar()
  }
}
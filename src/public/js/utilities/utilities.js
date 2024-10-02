let head = document.head
let $body = document.body
let body = $($body)

let qs = (el, x) => el.querySelector(x)
let qsa = (el, x) => el.querySelectorAll(x)
let qsaforeach = (el, x, metodo) => qsa(el, x).forEach(metodo)

let qsd = x => qs($body, x)
let qsad = x => qsa($body, x)
let qsaforeachd = (x, metodo) => qsaforeach($body, x, metodo)
let qsclickd = (el, m) => qsd(el).onclick = m

let qsarr = (el, x) => [...el.querySelectorAll(x)]
let qsarrd = x => qsarr($body, x)

let añadirCSS = x => head.innerHTML += `<style>${x}</style>`
let añadirJS = src => new Promise((res, rej) => head.appendChild(Object.assign(document.createElement('script'), { src, onload: res, onerror: rej })))

let añadirClase = (el, x) => el.classList.add(x)
let quitarClase = (el, x) => el.classList.remove(x)
let alternarClase = (el, x, y) => el.classList.toggle(x, y)
let tieneClase = (el, x) => el.classList.contains(x)

let anterior = el => el.previousElementSibling
let siguiente = el => el.nextElementSibling
let primero = el => el.firstElementChild
let ultimo = el => el.lastElementChild
let padre = el => el.parentElement
let indice = el => [...el.parentNode.children].indexOf(el)

let antes = (el, x) => el.insertAdjacentHTML('beforebegin', x)

let mostrar = el => el.hidden = false
let esconder = el => el.hidden = true
let alternar = el => el.hidden = !el.hidden
let visibilidad = (el, x) => el.hidden = !x

let clonar = x => x.cloneNode(true)
let añadirHTML = (el, x) => el.insertAdjacentHTML('beforeend', x)
let cambiarHTML = (el, x) => el.innerHTML = x

let elOn = (orig, ev, el, m) => orig.addEventListener(ev, function (e) {
  let c = e.target.closest(el)
  if (c) m(c, e)
})
let elOnClick = (orig, el, m) => elOn(orig, 'click', el, m)
let bodyOn = (ev, el, m) => elOn($body, ev, el, m)
let bodyOnClick = (el, m) => bodyOn('click', el, m)

let alCargar = x => window.addEventListener('load', x)

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


String.prototype.aFloat = function () { return parseFloat(this) }
String.prototype.aInt = function () { return parseInt(this) }
String.prototype.normalizar = function () { return this.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '') }
String.prototype.normalizarPrecio = function () { return this.aFloat().toFixed(2).replace(/[.,]00$/, '') }
Number.prototype.normalizarPrecio = function () { return this.toFixed(2).replace(/[.,]00$/, '') }
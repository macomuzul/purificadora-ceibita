let qs = (el, x) => el.querySelector(x)
let qsa = (el, x) => el.querySelectorAll(x)
let qsaforeach = (el, x, metodo) => qsa(el, x).forEach(metodo)

let qsd = x => qs(document, x)
let qsad = x => qsa(document, x)
let qsaforeachd = (x, metodo) => qsaforeach(document, x, metodo)
let qsclickd = (el, m) => qsd(el).onclick = m

let qsarr = (el, x) => [...el.querySelectorAll(x)]
let qsarrd = x => qsarr(document, x)

let cabeza = document.querySelector('head')
let añadirCSS = x => cabeza.innerHTML += `<style>${x}</style>`

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

let clonar = x => x.cloneNode(true)
let añadirHTML = (el, x) => el.insertAdjacentHTML('beforeend', x)
let cambiarHTML = (el, x) => el.innerHTML = x

let $body = qsd('body')
let body = $($body)
let elOn = (orig, ev, el, m) => orig.addEventListener(ev, function (e) {
  let c = e.target.closest(el)
  if (c) m(c, e)
})
let elOnClick = (orig, el, m) => elOn(orig, 'click', el, m)
let bodyOn = (ev, el, m) => elOn($body, ev, el, m)
let bodyOnClick = (el, m) => bodyOn('click', el, m)

let alCargar = x => window.addEventListener('load', x)

let esTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
if (esTouch) $.getScript('/touch.js')

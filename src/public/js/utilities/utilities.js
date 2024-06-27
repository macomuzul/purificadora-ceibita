let qsd = x => document.querySelector(x)
let qsad = x => document.querySelectorAll(x)
let qsaforeachd = (x, metodo) => qsad(x).forEach(metodo)
let qsclickd = (el, m) => qsd(el).onclick = m

let qs = (el, x)  => el.querySelector(x)
let qsa = (el, x)  => el.querySelectorAll(x)
let qsaforeach = (el, x, metodo) => qsa(el, x).forEach(metodo)

let qsarrd = x  => [...document.querySelectorAll(x)]
let qsarr = (el, x)  => [...el.querySelectorAll(x)]

let cabeza = document.querySelector('head')
let añadirCSS = x => cabeza.innerHTML += `<style>${x}</style>`

let añadirClase = (el, x) => el.classList.add(x)
let quitarClase = (el, x) => el.classList.remove(x)
let alternarClase = (el, x) => el.classList.toggle(x)
let tieneClase = (el, x) => el.classList.contains(x)

let anterior = el => el.previousElementSibling
let siguiente = el => el.nextElementSibling
let primero = el => el.firstElementChild
let ultimo = el => el.lastElementChild
let padre = el => el.parentElement
let indice = el => [...el.parentNode.children].indexOf(el)

let mostrar = el => el.hidden = false
let esconder = el => el.hidden = true
let alternar = el => el.hidden = el.hidden

let clonar = x => x.cloneNode(true)
let preponerHTML = (el, x) => x += el.innerHTML
let añadirHTML = (el, x) => el.innerHTML += x
let cambiarHTML = (el, x) => el.innerHTML = x

let body = $('body')
let esTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
let cargarTouch = q => { if(esTouch) $.getScript('/touch.js') }
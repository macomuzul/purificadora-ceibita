body.on("keydown", "td", function (e) {
  let k = e.which
  let cellindex = indice(this)
  let filas = this.closest("tbody").rows
  let { atStart, atEnd } = k == 37 || k == 39 ? getSelectionTextInfo(this) : {}
  if (k == 37 && atStart) //flecha izquierda
    enfocarCelda(anterior(this), e)
  else if (k == 39 && atEnd) //flecha derecha
    enfocarCelda(siguiente(this), e)
  else if (k == 38) //flecha arriba
    indice(padre(this)) === 0 ? enfocarCelda([...filas].at(-1).cells[cellindex - 1], e) : enfocarCelda(anterior(this.closest("tr")).cells[cellindex], e)
  else if (k === 13 || k == 40) //enter y flecha abajo
    this.closest("tr").rowIndex <= filas.length ? enfocarCelda(siguiente(this.closest("tr")).cells[cellindex], e) : enfocarCelda(filas[0].cells[cellindex + 1], e)
})

let mostrarOffscreen = x => {
  let rect = x.getBoundingClientRect()
  if ((rect.x + rect.width) > innerWidth || (rect.y + rect.height) > innerHeight) x.scrollIntoView()
}

function enfocarCelda(x, e) {
  e.preventDefault()
  if (x !== undefined && x.contentEditable) {
    x.focus()
    irAlFinalDelTexto(x)
    mostrarOffscreen(x)
  }
}


function irAlFinalDelTexto(elem) {
  if (elem.innerText == '') return
  let range = document.createRange()
  let sel = getSelection()
  range.setStart(elem.childNodes[0], elem.innerText.length)
  sel.removeAllRanges()
  sel.addRange(range)
}

body.on("beforeinput", "td", function (e) {
  let letra = e.originalEvent.data ?? ''
  let colindex = indice(this)
  if (letra === '"' || letra == '\\' || letra == "'") e.preventDefault()
  if (isNaN(letra) && colindex != 0 && colindex != 1) e.preventDefault()
  if (colindex !== 0 && letra === " ") e.preventDefault()

  let texto = this.innerText
  if (colindex == 1) {
    let [, decimales] = texto.split('.')
    if (isNaN(letra) && letra !== '.') e.preventDefault()
    if (letra === '.' && (texto.indexOf('.') > -1 || texto.length - getSelection().baseOffset > 2)) e.preventDefault()
    if (decimales?.length >= 2 && letra != '') e.preventDefault()
  }

  if (texto === "0") this.innerText = ''
})


body.on('beforeinput', 'input', e => {
  let k = e.data ?? ''
  if (k === '"' || k == '\\') e.preventDefault()
})


body.on('keydown', 'input', e => {
  if (e.which === 13) {
    let x = qs(e.target.closest('tab-content'), 'td')
    x.focus()
    irAlFinalDelTexto(x)
    e.preventDefault()
  }
})

function getSelectionTextInfo(x) {
  let atStart = false, atEnd = false
  let selRange, testRange
  let sel = getSelection()
  if (sel.rangeCount) {
    selRange = sel.getRangeAt(0)
    testRange = selRange.cloneRange()

    testRange.selectNodeContents(x)
    testRange.setEnd(selRange.startContainer, selRange.startOffset)
    atStart = testRange.toString() == ""

    testRange.selectNodeContents(x)
    testRange.setStart(selRange.endContainer, selRange.endOffset)
    atEnd = testRange.toString() == ""
  }
  return { atStart, atEnd }
}
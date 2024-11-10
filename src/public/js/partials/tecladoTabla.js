bodyOn('keydown', 'td', (c, e) => {
  let k = e.which
  let cellindex = c.indice()
  let filas = c.closest("tbody").rows
  let { atStart, atEnd } = k == 37 || k == 39 ? getSelectionTextInfo(c) : {}
  if (k == 37 && atStart) //flecha izquierda
    enfocarCelda(c.ant(), e)
  else if (k == 39 && atEnd) //flecha derecha
    enfocarCelda(c.sig(), e)
  else if (k == 38) //flecha arriba
    c.padre().indice() === 0 ? enfocarCelda([...filas].at(-1).cells[cellindex - 1], e) : enfocarCelda(c.closest("tr").ant().cells[cellindex], e)
  else if (k === 13 || k == 40) //enter y flecha abajo
    c.closest("tr").rowIndex <= filas.length ? enfocarCelda(c.closest("tr").sig().cells[cellindex], e) : enfocarCelda(filas[0].cells[cellindex + 1], e)
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

bodyOn('beforeinput', 'td', (c, e) => {
  let letra = e.data ?? ''
  let colindex = c.indice()
  if (letra === '"' || letra == '\\' || letra == "'") e.preventDefault()
  if (isNaN(letra) && colindex != 0 && colindex != 1) e.preventDefault()
  if (colindex !== 0 && letra === " ") e.preventDefault()

  let texto = c.innerText
  if (colindex == 1) {
    if (isNaN(letra) && letra !== ".") e.preventDefault()
    let p = texto.indexOf(".")
    if (p > -1 && (letra === "." || (getSelection().baseOffset > p && texto.length - p >= 3 && letra != ""))) e.preventDefault()
  }
  if (texto === '0') c.innerText = ''
})


bodyOn('beforeinput', 'input', (c, e) => {
  let k = e.data ?? ''
  if (k === '"' || k == '\\') e.preventDefault()
})


bodyOn('keydown', 'input', (c, e) => {
  if (e.which === 13) {
    let x = e.target.closest('tab-content').qs('td')
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
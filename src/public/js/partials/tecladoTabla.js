let getCaretPosition = q => getSelection().rangeCount ? getSelection().getRangeAt(0).endOffset : 0

$("body").on("keydown", "td", function (e) {
  let cellindex = $(this).index()
  let { atStart, atEnd } = e.which == 37 || e.which == 39 ? getSelectionTextInfo(this) : {}
  if (e.which == 37 && atStart) //flecha izquierda
    enfocarCelda($(this).prev(), e)
  else if (e.which == 39 && atEnd) //flecha derecha
    enfocarCelda($(this).next(), e)
  else if (e.which == 38) //flecha arriba
    $(this).parent().index() === 0 ? enfocarCelda($(this).closest("tbody").find("tr").last().find("td").eq(cellindex - 1), e) : enfocarCelda($(this).closest("tr").prev().find("td").eq(cellindex), e)
  else if (e.keyCode === 13 || e.which == 40) //enter y flecha abajo
    $(this).closest("tr")[0].rowIndex <= $(this).closest("tbody")[0].rows.length ? enfocarCelda($(this).closest("tr").next().find("td").eq(cellindex), e) : enfocarCelda($(this).closest("tbody").find("tr").first().find("td").eq(cellindex + 1), e)
})

let mostrarOffscreen = x => {
  let rect = x.getBoundingClientRect()
  if ((rect.x + rect.width) > innerWidth || (rect.y + rect.height) > innerHeight) x.scrollIntoView()
}

function enfocarCelda([x], e) {
  e.preventDefault()
  if (x !== undefined && x.contentEditable) {
    $(x).focus()
    irAlFinalDelTexto(x)
    mostrarOffscreen(x)
  }
}


function irAlFinalDelTexto(elem) {
  let range = document.createRange()
  let sel = getSelection()
  if (elem.innerText == "") return
  range.setStart(elem.childNodes[0], elem.innerText.length)
  range.collapse(false)

  sel.removeAllRanges()
  sel.addRange(range)
}

$("body").on("beforeinput", "td", function (e) {
  let letra = event.data ?? ''
  let colindex = $(this).index()
  let texto = this.innerText
  if (letra === '"' || letra == "\\" || letra == "'") e.preventDefault()
  if (isNaN(letra) && colindex != 0 && colindex != 1) e.preventDefault()
  if (colindex !== 0 && letra === " ") e.preventDefault()

  if (colindex == 1) {
    let [, decimales] = texto.split(".")
    if (isNaN(letra) && letra !== ".") e.preventDefault()
    let dotPos = texto.indexOf(".")
    if (dotPos > -1 && letra === ".") e.preventDefault()
    if (getCaretPosition() > dotPos && decimales?.length >= 2 && letra != "") e.preventDefault()
  }

  if (texto === "0") this.innerText = ""
})


$("body").on("beforeinput", "input", function (e) {
  let letra = event.data ?? ''
  if (letra === '"' || letra == "\\" || letra == '\\') e.preventDefault()
})


$("body").on("keydown", "input", function (e) {
  if (e.keyCode === 13) {
    let x = $(e.target).closest("section").find("td").first()
    x.focus()
    irAlFinalDelTexto(x[0])
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
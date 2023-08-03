$("body").on("keydown", "td", function (e) {
  let atStart = false, atEnd = false
  let cellindex = $(this).index()
  if (e.which == 37 || e.which == 39)
    ({ atStart, atEnd } = getSelectionTextInfo(this))
  if (e.which == 37) { //flecha izquierda
    if (atStart)
      enfocarCelda($(this).prev(), e)
  }
  else if (e.which == 39) { //flecha derecha
    if (atEnd)
      enfocarCelda($(this).next(), e)
  }
  else if (e.which == 38) {//flecha arriba
    if ($(this).parent().index() === 0)
      enfocarCelda($(this).closest("tbody").find("tr").last().find("td").eq(cellindex - 1), e)
    else
      enfocarCelda($(this).closest("tr").prev().find("td").eq(cellindex), e)
  }
  else if (e.keyCode === 13 || e.which == 40) { //enter y flecha abajo
    if ($(this).closest("tr")[0].rowIndex <= $(this).closest("tbody")[0].rows.length)
      enfocarCelda($(this).closest("tr").next().find("td").eq(cellindex), e)
    else
      enfocarCelda($(this).closest("tbody").find("tr").first().find("td").eq(cellindex + 1), e)
  }
})

function enfocarCelda([x], e) {
  e.preventDefault()
  if (x !== undefined && x.contentEditable) {
    $(x).focus()
    irAlFinalDelTexto(x)
    if ($(x).is(':offscreen'))
      x.scrollIntoView();
  }
}


function irAlFinalDelTexto(elem) {
  let range = document.createRange()
  let sel = window.getSelection()
  if (elem.innerText == "")
    return
  range.setStart(elem.childNodes[0], elem.innerText.length)
  range.collapse(false)

  sel.removeAllRanges()
  sel.addRange(range)
}

$("body").on("beforeinput", "td", function (e) {
  debugger
  let letra = event.data === null ? '' : event.data
  let colindex = $(this).index()
  let texto = this.innerText
  if (letra === '"' || letra == "\\")
    e.preventDefault();
  if (isNaN(letra) && colindex != 0 && colindex != 1)
    e.preventDefault();
  if (colindex !== 0 && letra === " ")
    e.preventDefault();

  if (colindex == 1) {
    let [, decimales] = texto.split(".")
    if (isNaN(letra) && letra !== ".")
      e.preventDefault()
    let dotPos = texto.indexOf(".")
    if (dotPos > -1 && letra === ".") //solo permite un punto
      e.preventDefault()
    if (getCaretPosition() > dotPos && decimales?.length >= 2 && letra != "")
      e.preventDefault()
  }

  if (texto === "0")
    this.innerText = ""
})


$("body").on("beforeinput", "input", function (e) {
  let letra = event.data === null ? '' : event.data
  if (letra === '"' || letra == "\\")
    e.preventDefault()
})


$("body").on("keydown", "input", function (e) {
  if (e.keyCode === 13) {
    var elem = $(e.target).closest("section").find("td").first()
    elem.focus()
    irAlFinalDelTexto(elem[0])
    e.preventDefault()
  }
});

function getCaretPosition() {
  let caretPos = 0, sel = window.getSelection()
  if (sel.rangeCount) {
    caretPos = sel.getRangeAt(0).endOffset
  }
  return caretPos
}


function getSelectionTextInfo(el) {
  let atStart = false, atEnd = false
  let selRange, testRange
  let sel = window.getSelection()
  if (sel.rangeCount) {
    selRange = sel.getRangeAt(0)
    testRange = selRange.cloneRange()

    testRange.selectNodeContents(el)
    testRange.setEnd(selRange.startContainer, selRange.startOffset)
    atStart = testRange.toString() == ""

    testRange.selectNodeContents(el);
    testRange.setStart(selRange.endContainer, selRange.endOffset)
    atEnd = testRange.toString() == ""
  }

  return { atStart, atEnd }
}

jQuery.expr.filters.offscreen = function (el) {
  var rect = el.getBoundingClientRect()
  return ((rect.x + rect.width) < 0 || (rect.y + rect.height) < 0 || (rect.x > window.innerWidth || rect.y > window.innerHeight))
}
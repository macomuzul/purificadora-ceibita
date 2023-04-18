$("body").on("keydown", "tr td", function (e) {
  var textInput = this;
  var val = textInput.val;
  var isAtStart = false,
  isAtEnd = false;
  var cellindex = $(this).index();
  if (typeof textInput.selectionStart == "number") {
    isAtStart = textInput.selectionStart == 0;
    isAtEnd = textInput.selectionEnd == val.length;
  } else if (document.selection && document.selection.createRange) {
    textInput.focus();
    var selRange = document.selection.createRange();
    var inputRange = textInput.createTextRange();
    var inputSelRange = inputRange.duplicate();
    inputSelRange.moveToBookmark(selRange.getBookmark());
    isAtStart = inputSelRange.compareEndPoints("StartToStart", inputRange) == 0;
    isAtEnd = inputSelRange.compareEndPoints("EndToEnd", inputRange) == 0;
  }
  if (textInput.selectionStart == null) {
    if (e.which == 37 || e.which == 39) {
      var selInfo = getSelectionTextInfo(this);
      isAtStart = selInfo.atStart;
      isAtEnd = selInfo.atEnd;
    }
  }
  if (e.which == 37) { //flecha izquierda
    if (isAtStart)
      enfocarCelda($(this).prev(), e);
  }
  else if (e.which == 39) { //flecha derecha
    if (isAtEnd)
      enfocarCelda($(this).next(), e);
  }
  else if (e.which == 38) {//flecha arriba
    if ($(this).parent().index() === 0)
      enfocarCelda($(this).closest("tbody").find("tr").last().find("td").eq(cellindex-1), e);
    else
      enfocarCelda($(this).closest("tr").prev().find("td").eq(cellindex), e);
  }
  else if (e.keyCode === 13 || e.which == 40) { //enter y flecha abajo
    if ($(this).closest("tr")[0].rowIndex <= $(this).closest("tbody")[0].rows.length)
      enfocarCelda($(this).closest("tr").next().find("td").eq(cellindex), e);
    else
      enfocarCelda($(this).closest("tbody").find("tr").first().find("td").eq(cellindex + 1), e);
  }
});

function enfocarCelda(elem, e) {
  e.preventDefault();
  if (elem[0] !== undefined && elem[0].getAttribute("contentEditable") === "true") {
    elem.focus();
    setEndOfContenteditable(elem[0]);
    if ($(elem).is(':offscreen')) {
      elem[0].scrollIntoView();
    }
  }
}


function setEndOfContenteditable(elem) {
  var range = document.createRange()
  var sel = window.getSelection()
  if (elem.innerText == "")
    return;
  range.setStart(elem.childNodes[0], elem.innerText.length)
  range.collapse(false)

  sel.removeAllRanges()
  sel.addRange(range)
}

$("body").on("beforeinput", "tr td", function (e) {
  let letra = event.data === null ? '' : event.data
  var colindex = $(this).parent().children().index($(this));
  if (letra === '"' || letra == "\\")
    e.preventDefault();
  if (isNaN(letra) && colindex != 0 && colindex != 1)
    e.preventDefault();
  if (colindex !== 0 && letra === " ")
    e.preventDefault();

  if (colindex == 1) {
    let el = $(this)[0].innerText;
    var number = el.split(".");
    if (isNaN(letra) && letra != ".") {
      e.preventDefault();
    }
    if (number.length > 1 && letra == ".") { //solo permite un punto
      e.preventDefault();
    }

    var caratPos = getCaretPosition(this);
    var dotPos = el.indexOf(".");
    if (caratPos > dotPos && dotPos > -1 && number[1].length > 1 && letra != "") {
      e.preventDefault();
    }
  }

  if (this.innerText === "0")
    this.innerText = "";
});


$("body").on("beforeinput", "input", function (e) {
  let letra = event.data === null ? '' : event.data
  if (letra === '"' || letra == "\\")
    e.preventDefault();
});


$("body").on("keydown", "input", function (e) {
  if (e.keyCode === 13) {
    var elem = $(e.target).closest("section").find("td").first();
    elem.focus();
    setEndOfContenteditable(elem[0]);
    e.preventDefault();
  }
});

function getCaretPosition(editableDiv) {
  var caretPos = 0,
    sel,
    range;
  if (window.getSelection) {
    sel = window.getSelection();
    if (sel.rangeCount) {
      range = sel.getRangeAt(0);
      if (range.commonAncestorContainer.parentNode == editableDiv) {
        caretPos = range.endOffset;
      }
    }
  } else if (document.selection && document.selection.createRange) {
    range = document.selection.createRange();
    if (range.parentElement() == editableDiv) {
      var tempEl = document.createElement("span");
      editableDiv.insertBefore(tempEl, editableDiv.firstChild);
      var tempRange = range.duplicate();
      tempRange.moveToElementText(tempEl);
      tempRange.setEndPoint("EndToEnd", range);
      caretPos = tempRange.text.length;
    }
  }
  return caretPos;
}


function getSelectionTextInfo(el) {
  var atStart = false,
    atEnd = false;
  var selRange, testRange;
  if (window.getSelection) {
    var sel = window.getSelection();
    if (sel.rangeCount) {
      selRange = sel.getRangeAt(0);
      testRange = selRange.cloneRange();

      testRange.selectNodeContents(el);
      testRange.setEnd(selRange.startContainer, selRange.startOffset);
      atStart = testRange.toString() == "";

      testRange.selectNodeContents(el);
      testRange.setStart(selRange.endContainer, selRange.endOffset);
      atEnd = testRange.toString() == "";
    }
  } else if (document.selection && document.selection.type != "Control") {
    selRange = document.selection.createRange();
    testRange = selRange.duplicate();

    testRange.moveToElementText(el);
    testRange.setEndPoint("EndToStart", selRange);
    atStart = testRange.text == "";

    testRange.moveToElementText(el);
    testRange.setEndPoint("StartToEnd", selRange);
    atEnd = testRange.text == "";
  }

  return { atStart: atStart, atEnd: atEnd };
}

function getEnd(el) {
  var selRange, testRange;
  if (window.getSelection) {
    var sel = window.getSelection();
    if (sel.rangeCount) {
      selRange = sel.getRangeAt(0);
      testRange = selRange.cloneRange();

      testRange.selectNodeContents(el);
      testRange.setEnd(selRange.startContainer, selRange.startOffset);
      atStart = testRange.toString() == "";

      testRange.selectNodeContents(el);
      testRange.setStart(selRange.endContainer, selRange.endOffset);
      atEnd = testRange.toString() == "";
    }
  } else if (document.selection && document.selection.type != "Control") {
    selRange = document.selection.createRange();
    testRange = selRange.duplicate();

    testRange.moveToElementText(el);
    testRange.setEndPoint("EndToStart", selRange);
    atStart = testRange.text == "";

    testRange.moveToElementText(el);
    testRange.setEndPoint("StartToEnd", selRange);
    atEnd = testRange.text == "";
  }
}

jQuery.expr.filters.offscreen = function (el) {
  var rect = el.getBoundingClientRect();
  return (
    (rect.x + rect.width) < 0
    || (rect.y + rect.height) < 0
    || (rect.x > window.innerWidth || rect.y > window.innerHeight)
  );
};
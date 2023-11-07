const { DateTime } = require('luxon')
let documentId = process.env.DOC_GDOCS
let num = 58
let repiteTexto = (texto, n) => [...Array(n)].map(x => texto).join("")
let devuelveInsertText = x => ({ insertText: { 'text': x + "\n", 'endOfSegmentLocation': {} } })

global.agregarTextoDocs = tcgoogle(async texto => await gDocs.documents.batchUpdate({ documentId, requestBody: { requests: devuelveInsertText(texto) } }), "google docs agregarTextoDocs")

let agregarTituloDocs = tcgoogle(async (titulo, simbolo) => {
  let empaquetado = devuelveInsertText(repiteTexto(simbolo, num))
  let espacios = repiteTexto(" ", Math.ceil((num - titulo.length) / 2))
  let texto = devuelveInsertText(espacios + titulo)
  const requests = [empaquetado, texto, empaquetado]
  await gDocs.documents.batchUpdate({ documentId, requestBody: { requests } })
}, "google docs agregarTituloDocs")

global.crearDiaGoogleDocs = async q => await agregarTituloDocs("Cambios ocurridos el " + DateTime.now().setZone("America/Guatemala").toFormat("d/M/y"), "-")
global.crearMesGoogleDocs = async q => {
  let f = DateTime.now()
  await agregarTituloDocs(`${primeraLetraMayuscula(f.monthLong)} de ${f.year}`, "*")
}
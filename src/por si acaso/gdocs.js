const { DateTime } = require('luxon')
let documentId = "15WhiLi1dDmjjTKnv4sYpAouuS80Xti1CVjvxsvzlOUA"
let repiteTexto = (texto, num) => [...Array(num)].map(x => texto).join("")
global.crearDiaGoogleDocs = async x => await agregarTituloDocs("Cambios ocurridos el " + DateTime.now().setZone("America/Guatemala").toFormat("d/M/y"), "-")
global.crearMesGoogleDocs = async x => await agregarTituloDocs(DateTime.now().monthLong, "*")
global.crearDoc = async function () {
  try {
    const createResponse = await gDocs.documents.create({
      requestBody: {
        title: 'Your new document!',
      },
    });
    console.log(createResponse)
  } catch (error) {
    console.log(error)
  }
}


global.agregarTextoDoc = async function () {
  try {
    const requests = [
      {
        insertText: {
          'text': 'Migatroons\n',
          'endOfSegmentLocation': {}
        },
      },
      // {
      //   updateTextStyle: {
      //     textStyle: {
      //       fontSize: { magnitude: 14, unit: 'PT' },
      //       foregroundColor: { color: { rgbColor: { red: 0, green: 1, blue: 1, } } },
      //     },
      //     range: { startIndex: 39, endIndex: 48 },
      //     fields: 'fontSize,foregroundColor'
      //   },
      // }
    ];

    let res = await gDocs.documents.batchUpdate({
      documentId,
      requestBody: {
        requests,
      },
    })
    console.log(`TCL: res`, res)
  } catch (error) {
    console.log(error)
  }
}

let devuelveInsertText = x => ({ insertText: { 'text': x + "\n", 'endOfSegmentLocation': {} } })

async function agregarTextoDocs(texto) {
  try {
    await gDocs.documents.batchUpdate({ documentId, requestBody: { requests: devuelveInsertText(texto) } })
  } catch (error) {
    console.log(error)
  }
}

global.agregarTituloDocs = async (titulo, simbolo) => {
  try {
    let num = 58
    let empaquetado = devuelveInsertText(repiteTexto(simbolo, num))
    let espacios = repiteTexto(" ", Math.ceil((num - titulo.length) / 2))
    let texto = devuelveInsertText(espacios + titulo)
    const requests = [empaquetado, texto, empaquetado]
    await gDocs.documents.batchUpdate({ documentId, requestBody: { requests } })
  } catch (error) {
    console.log(error)
  }
}
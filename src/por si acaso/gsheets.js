const { DateTime } = require('luxon')
let spreadsheetId = "1ebf6rLQLsRw7uqnz3Vu3JhyiHg7kXu33ySHJ718iq0U"

global.modificarSpreadSheet = async function () {
  try {
    console.log("corriendo")
    let spreadsheetId = "1EZcUmFFK62aQsdc5WtcadhRMUqKnDc4b_HEFRCkaWHA"
    let crear = await gSheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Historial!A1:A2',
      valueInputOption: 'RAW',
      resource: {
        values: [
          ["jeje", "Cost", "Stocked", "Ship Date"],
          ["Wheel", "$20.50", "4", "3/1/2016"],
          ["Door", "$15", "2", "3/15/2016"],
          ["Engine", "$100", "1", "30/20/2016"],
          ["Totals", "=SUM(B2:B4)", "=SUM(C2:C4)", "=MAX(D2:D4)"]
        ]
      },
    })
    console.log(crear)
  } catch (error) {
    console.log(error)
  }
}


global.agregarHoja = async function () {
  try {
    let mes = DateTime.now().monthLong
    const requests = [{ addSheet: { properties: { title: primeraLetraMayuscula(mes) } } }]

    await gSheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: { requests }
    })
  } catch (error) {
    console.log(error)
  }
}

async function titulosGoogleSheets(titulo, esDia, backgroundColor, fontSize) {
  try {
    let response = await gSheets.spreadsheets.values.get({ spreadsheetId, range: 'Historial!A:A' })
    let lastRowIndex = response.data.values.length
    let sheetId = '0'
    if (esDia && titulo.endsWith(": 1")) lastRowIndex++
    let startRowIndex = lastRowIndex, endRowIndex = lastRowIndex + 1
    if (!esDia) endRowIndex++

    let startColumnIndex = '0', endColumnIndex = '3'
    let range = { sheetId, startRowIndex, endRowIndex, startColumnIndex, endColumnIndex }

    const requests = [
      { mergeCells: { range, mergeType: 'MERGE_ALL' } },
      {
        updateCells: {
          rows: [
            {
              values: [
                {
                  userEnteredValue: { stringValue: titulo },
                  userEnteredFormat: {
                    horizontalAlignment: 'CENTER',
                    verticalAlignment: 'MIDDLE',
                    backgroundColor,
                    textFormat: { fontSize }
                  }
                }
              ]
            }
          ],
          fields: 'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment),userEnteredValue(stringValue)',
          range
        }
      }
    ]

    await gSheets.spreadsheets.batchUpdate({ spreadsheetId, requestBody: { requests } })
  } catch (error) {
    console.log(error)
  }
}

global.agregarFilaGoogleSheetsSimple = async function (data) {
  try {
    let crear = await gSheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Historial!A1:A2',
      valueInputOption: 'RAW',
      resource: { values: [data] }
    })
    console.log(crear)
  } catch (error) {
    console.log(error)
  }
}

global.agregarFilaGoogleSheets = async function (data) {
  try {
    let response = await gSheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Historial!A1:A2',
      valueInputOption: 'RAW',
      resource: { values: [data] },
    })
    let range = response.data.updates.updatedRange
    let num = parseInt(range.split(':')[0].match(/\d+/g))
    let requests = [{
      repeatCell: {
        range: {
          sheetId: '0',
          startRowIndex: num - 1,
          endRowIndex: num,
          startColumnIndex: 0,
          endColumnIndex: 3
        },
        cell: {
          userEnteredFormat: {
            wrapStrategy: "WRAP",
            horizontalAlignment: 'CENTER',
            verticalAlignment: 'MIDDLE',
          }
        },
        fields: 'userEnteredFormat(wrapStrategy,horizontalAlignment,verticalAlignment)',
      }
    }]
    await gSheets.spreadsheets.batchUpdate({ spreadsheetId, resource: { requests } })
  } catch (error) {
    console.log(error)
  }
}

global.crearMesGoogleSheets = async function () {
  let ahora = DateTime.now()
  await titulosGoogleSheets(`Mes: ${primeraLetraMayuscula(ahora.monthLong)} de ${ahora.year}`, 0, { red: 0.62, green: 0.77, blue: 0.91 }, 14)
  await crearDiaGoogleSheets()
}

global.crearDiaGoogleSheets = async function () {
  await titulosGoogleSheets("Día: " + DateTime.now().day, 1, { red: 0.43, green: 0.62, blue: 0.92 }, 11)
  await agregarFilaGoogleSheetsSimple(["Sin cambios"])
}

global.pruebiña = async function () {
  let values = [
    ["John", "Doe"],
  ]; // The values to insert

  let body = {
    values: values
  };

  let r = await gSheets.spreadsheets.values.update({
    spreadsheetId,
    range: 'Historial!A178:D178', // The range to insert the values
    valueInputOption: 'USER_ENTERED',
    resource: body
  })
  console.log(r)
}

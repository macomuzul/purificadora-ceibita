const { DateTime } = require('luxon')
const redis = require("../redis")
let spreadsheetId = "1ebf6rLQLsRw7uqnz3Vu3JhyiHg7kXu33ySHJ718iq0U"
let sheetId = '0'
let startColumnIndex = '0', endColumnIndex = '3'

let titulosGoogleSheets = tcgoogle(async (titulo, esDia, backgroundColor, fontSize) => {
  let filagsheets = parseInt(await redis.get("filagsheets"))
  let startRowIndex = filagsheets, endRowIndex = filagsheets + 1
  if (!esDia) endRowIndex++
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
  await redis.set("filagsheets", endRowIndex)
}, "google sheets titulosGoogleSheets")

global.agregarFilaGoogleSheets = tcgoogle(async data => {
  let filagsheets = parseInt(await redis.get("filagsheets"))
  if (await redis.get("hubocambioshoy") === "1") filagsheets--
  let startRowIndex = filagsheets, endRowIndex = filagsheets + 1
  let range = { sheetId, startRowIndex, endRowIndex, startColumnIndex, endColumnIndex }
  let requests = [{
    updateCells: {
      rows: [
        {
          values: [data.map(x => ({
            userEnteredValue: { stringValue: x },
            userEnteredFormat: {
              horizontalAlignment: 'CENTER',
              verticalAlignment: 'MIDDLE',
            }
          }))]
        }
      ],
      fields: 'userEnteredFormat(horizontalAlignment,verticalAlignment),userEnteredValue(stringValue)',
      range
    }
  }]
  await gSheets.spreadsheets.batchUpdate({ spreadsheetId, resource: { requests } })
  await redis.set("filagsheets", endRowIndex)
}, "google sheets agregarFilaGoogleSheets")

global.crearMesGoogleSheets = async function () {
  let ahora = DateTime.now()
  await titulosGoogleSheets(`Mes: ${primeraLetraMayuscula(ahora.monthLong)} de ${ahora.year}`, 0, { red: 0.62, green: 0.77, blue: 0.91 }, 14)
  await crearDiaGoogleSheets()
}

global.crearDiaGoogleSheets = async function () {
  await titulosGoogleSheets("Día: " + DateTime.now().day, 1, { red: 0.43, green: 0.62, blue: 0.92 }, 11)
  await agregarFilaGoogleSheets(["Sin cambios"])
}
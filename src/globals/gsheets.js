const { DateTime } = require('luxon')
const redis = require("../redis")
let spreadsheetId = process.env.DOC_GSHEETS
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
                  wrapStrategy: "WRAP",
                  horizontalAlignment: 'CENTER',
                  verticalAlignment: 'MIDDLE',
                  backgroundColor,
                  textFormat: { fontSize }
                }
              }
            ]
          }
        ],
        fields: 'userEnteredFormat(backgroundColor,textFormat,wrapStrategy,horizontalAlignment,verticalAlignment),userEnteredValue(stringValue)',
        range
      }
    }
  ]

  await gSheets.spreadsheets.batchUpdate({ spreadsheetId, requestBody: { requests } })
  await redis.set("filagsheets", endRowIndex)
}, "google sheets titulosGoogleSheets")

global.agregarFilaGoogleSheets = tcgoogle(async data => {
  let filagsheets = parseInt(await redis.get("filagsheets"))
  if (await redis.get("filagsheetssobreescribir") === "1") {
    await redis.set("filagsheetssobreescribir", "0")
    filagsheets--
  }
  let startRowIndex = filagsheets, endRowIndex = filagsheets + 1
  let range = { sheetId, startRowIndex, endRowIndex, startColumnIndex, endColumnIndex }
  let requests = [{
    updateCells: {
      rows: [
        {
          values: [data.map(x => ({
            userEnteredValue: { stringValue: x },
            userEnteredFormat: {
              wrapStrategy: "WRAP",
              horizontalAlignment: 'CENTER',
              verticalAlignment: 'MIDDLE',
            }
          }))]
        }
      ],
      fields: 'userEnteredFormat(wrapStrategy,horizontalAlignment,verticalAlignment),userEnteredValue(stringValue)',
      range
    }
  }]
  await gSheets.spreadsheets.batchUpdate({ spreadsheetId, resource: { requests } })
  await redis.set("filagsheets", endRowIndex)
}, "google sheets agregarFilaGoogleSheets")

global.crearMesGoogleSheets = async function () {
  let f = DateTime.now()
  await titulosGoogleSheets(`${primeraLetraMayuscula(f.monthLong)} de ${f.year}`, 0, { red: 0.62, green: 0.77, blue: 0.91 }, 14)
  await crearDiaGoogleSheets()
}

global.crearDiaGoogleSheets = async function () {
  await titulosGoogleSheets("Día: " + DateTime.now().day, 1, { red: 0.43, green: 0.62, blue: 0.92 }, 11)
  await agregarFilaGoogleSheets(["Sin cambios"])
  await redis.set("filagsheetssobreescribir", "1")
}
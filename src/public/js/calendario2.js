let decodificado = he.decode(camionerosEJS)
camionerosEJS = JSON.parse(decodificado)

decodificado = he.decode(diasEJS)
diasEJS = JSON.parse(decodificado)

String.prototype.aUTC = function () {
  const [datePart] = this.split('T')
  const [year, month, day] = datePart.split('-').map(Number)
  return new Date(year, month - 1, day)
}
String.prototype.fechaGuatemala = function () { return new Intl.DateTimeFormat('es', { timeZone: "America/Guatemala" }).format(this.aUTC()) }
let camioneros = {}
camionerosEJS.forEach(x => camioneros[x.nombre] = x.color)
$(".camionero").each((i, x) => x.querySelector(".color").style.background = camioneros[x.querySelector(".nombreCamionero").innerText])

let eventosCalendario = []
diasEJS.forEach(({ camioneros: cam, _id, ultimocambio, usuario }) => cam.forEach((c, i) => eventosCalendario.push({ name: `Camión ${(i + 1)}`, description: `Conductor: ${c}`, date: _id.aUTC().toDateString(), type: i + "", ultimocambio, usuario, color: camioneros[c] })))

toastr.options = {
  "closeButton": true,
  "progressBar": true,
  "positionClass": "toast-bottom-full-width",
  "preventDuplicates": true,
  "timeOut": "100000",
  "extendedTimeOut": "100000"
}

onload = function () {
  $("#demoEvoCalendar").evoCalendar({
    format: "D M dd yyyy",
    titleFormat: "MM",
    language: "es",
    firstDayOfWeek: "1",
    calendarEvents: eventosCalendario
  })
  $("#demoEvoCalendar").evoCalendar("setTheme", "Midnight Blue")
}
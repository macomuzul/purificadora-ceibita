dayjs.extend(window.dayjs_plugin_utc);
dayjs.extend(window.dayjs_plugin_timezone)

toastr.options = {
  "closeButton": true,
  "progressBar": true,
  "positionClass": "toast-bottom-full-width",
  "preventDuplicates": true,
  "timeOut": "100000",
  "extendedTimeOut": "100000",
}

window.onload = function () {
  $("#demoEvoCalendar").evoCalendar({
    format: "dd MM, yyyy",
    titleFormat: "MM",
    language: "es",
    firstDayOfWeek: "1",
    calendarEvents: eventosCalendario
  });
  $("#demoEvoCalendar").evoCalendar("setTheme", "Midnight Blue");
};
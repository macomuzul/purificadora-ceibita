var fechaseleccionada
let stringCheck = d => d.replace(/[^\w]/g, '\\$&')
let devuelveFecha = dia => new Intl.DateTimeFormat('es', { dateStyle: 'full' }).format(new Date(dia.ultimocambio))

  ; (function (factory) {
    'use strict';
    if (typeof define === 'function' && define.amd)
      define(['jquery'], factory)
    else if (typeof exports !== 'undefined')
      module.exports = factory(require('jquery'))
    else
      factory(jQuery)

  }(function ($) {
    'use strict';
    var EvoCalendar = EvoCalendar || {};

    EvoCalendar = (function () {
      var instanceUid = 0;
      function EvoCalendar(element, settings) {
        var _ = this;
        _.defaults = {
          theme: null,
          format: 'mm/dd/yyyy',
          titleFormat: 'MM yyyy',
          eventHeaderFormat: 'MM d, yyyy',
          firstDayOfWeek: 0,
          language: 'en',
          todayHighlight: false,
          sidebarDisplayDefault: true,
          sidebarToggler: true,
          eventDisplayDefault: true,
          eventListToggler: true,
          calendarEvents: null
        };
        _.options = $.extend({}, _.defaults, settings);

        _.initials = {
          default_class: $(element)[0].classList.value,
          validParts: /dd?|DD?|mm?|MM?|yy(?:yy)?/g,
          dates: {
            en: {
              days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
              daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
              daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
              months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
              monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
              noEventForToday: "No event for today.. so take a rest! :)",
              noEventForThisDay: "No event for this day.. so take a rest! :)",
              previousYearText: "Previous year",
              nextYearText: "Next year",
              closeSidebarText: "Close sidebar",
              closeEventListText: "Close event list"
            },
            es: {
              days: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
              daysShort: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
              daysMin: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"],
              months: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
              monthsShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
              noEventForToday: "Aún no ha registrado los productos vendidos de hoy",
              noEventForThisDay: "No existe ningún registro para este día",
              previousYearText: "Año anterior",
              nextYearText: "El próximo año",
              closeSidebarText: "Cerrar la barra lateral",
              closeEventListText: "Cerrar la lista de eventos"
            },
          }
        }
        _.initials.weekends = { sun: _.initials.dates[_.options.language].daysShort[0], sat: _.initials.dates[_.options.language].daysShort[6] }

        // Format Calendar Events into selected format
        if (_.options.calendarEvents != null) _.options.calendarEvents.forEach(x => _.isValidDate(x.date) && (x.date = _.formatDate(x.date, _.options.format)))

        // Global variables
        _.startingDay = null
        _.monthLength = null
        _.windowW = $(window).width()

        _.$current = {
          month: (isNaN(this.month) || this.month == null) ? new Date().getMonth() : this.month,
          year: (isNaN(this.year) || this.year == null) ? new Date().getFullYear() : this.year,
          date: _.formatDate(_.initials.dates[_.defaults.language].months[new Date().getMonth()] + ' ' + new Date().getDate() + ' ' + new Date().getFullYear(), _.options.format)
        }
        _.$active = { month: _.$current.month, year: _.$current.year, date: _.$current.date, event_date: _.$current.date, events: [] }

        // LABELS
        _.$label = { days: [], months: _.initials.dates[_.defaults.language].months, days_in_month: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31] }

        // HTML Markups (template)
        _.$markups = { calendarHTML: '', mainHTML: '', sidebarHTML: '', eventHTML: '' }
        // HTML DOM elements
        _.$elements = {
          calendarEl: $(element), innerEl: null, sidebarEl: null, eventEl: null,
          sidebarToggler: null, eventListToggler: null,
          activeDayEl: null, activeMonthEl: null, activeYearEl: null
        }
        _.$breakpoints = { tablet: 768, mobile: 425 }
        _.$UI = { hasSidebar: true, hasEvent: true }

        _.formatDate = $.proxy(_.formatDate, _)
        _.selectDate = $.proxy(_.selectDate, _)
        _.selectMonth = $.proxy(_.selectMonth, _)
        _.selectYear = $.proxy(_.selectYear, _)
        _.selectEvent = $.proxy(_.selectEvent, _)
        _.toggleSidebar = $.proxy(_.toggleSidebar, _)
        _.toggleEventList = $.proxy(_.toggleEventList, _)

        _.instanceUid = instanceUid++

        _.init(true)
      }

      return EvoCalendar

    }())

    // v1.0.0 - Initialize plugin
    EvoCalendar.prototype.init = function (init) {
      var _ = this;

      if (!$(_.$elements.calendarEl).hasClass('calendar-initialized')) {
        $(_.$elements.calendarEl).addClass('evo-calendar calendar-initialized');
        if (_.windowW <= _.$breakpoints.tablet) { // tablet/mobile
          _.toggleSidebar(false)
          _.toggleEventList(false)
        } else {
          _.options.sidebarDisplayDefault ? _.toggleSidebar(true) : _.toggleSidebar(false)
          _.options.eventDisplayDefault ? _.toggleEventList(true) : _.toggleEventList(false)
        }
        if (_.options.theme) _.setTheme(_.options.theme); // set calendar theme
        _.buildTheBones(); // start building the calendar components
      }
    }

    EvoCalendar.prototype.limitTitle = function (title, limit) {
      var newTitle = []
      limit = limit === undefined ? 18 : limit;
      if ((title).split(' ').join('').length > limit) {
        var t = title.split(' ');
        for (var i = 0; i < t.length; i++) {
          if (t[i].length + newTitle.join('').length <= limit) newTitle.push(t[i])
        }
        return newTitle.join(' ') + '...'
      }
      return title
    }

    EvoCalendar.prototype.parseFormat = function (format) {
      var _ = this;
      if (typeof format.toValue === 'function' && typeof format.toDisplay === 'function') return format
      var separators = format.replace(_.initials.validParts, '\0').split('\0'), parts = format.match(_.initials.validParts)
      return { separators, parts }
    }

    EvoCalendar.prototype.formatDate = function (date, format, language) {
      var _ = this
      if (!date) return ''
      language = language ? language : _.defaults.language
      if (typeof format === 'string') format = _.parseFormat(format)
      if (format.toDisplay) return format.toDisplay(date, format, language)

      var ndate = new Date(date)
      fechaseleccionada = ndate
      var val = {
        d: ndate.getDate(),
        D: _.initials.dates[language].daysShort[ndate.getDay()],
        DD: _.initials.dates[language].days[ndate.getDay()],
        m: ndate.getMonth() + 1,
        M: _.initials.dates[language].monthsShort[ndate.getMonth()],
        MM: _.initials.dates[language].months[ndate.getMonth()],
        yy: ndate.getFullYear().toString().substring(2),
        yyyy: ndate.getFullYear()
      };

      val.dd = (val.d < 10 ? '0' : '') + val.d;
      val.mm = (val.m < 10 ? '0' : '') + val.m;
      date = [];
      var seps = $.extend([], format.separators);
      for (var i = 0, cnt = format.parts.length; i <= cnt; i++) {
        if (seps.length)
          date.push(seps.shift());
        date.push(val[format.parts[i]]);
      }
      return date.join('');
    };

    // v1.0.0 - Get dates between two dates
    EvoCalendar.prototype.getBetweenDates = function (dates) {
      var _ = this, betweenDates = [];
      for (var x = 0; x < _.monthLength; x++) {
        var active_date = _.formatDate(`${_.$label.months[_.$active.month]} ${(x + 1)} ${_.$active.year}`, _.options.format);
        if (_.isBetweenDates(active_date, dates))
          betweenDates.push(active_date)
      }
      return betweenDates
    }

    // v1.0.0 - Check if date is between the passed calendar date 
    EvoCalendar.prototype.isBetweenDates = function (active_date, dates) {
      var sd, ed;
      if (dates instanceof Array) {
        sd = new Date(dates[0])
        ed = new Date(dates[1])
      } else {
        sd = new Date(dates)
        ed = new Date(dates)
      }
      return sd <= new Date(active_date) && ed >= new Date(active_date)
    }

    // v1.0.0 - Set calendar theme
    EvoCalendar.prototype.setTheme = function (themeName) {
      var _ = this;
      var prevTheme = _.options.theme;
      _.options.theme = themeName.toLowerCase().split(' ').join('-');

      if (_.options.theme) $(_.$elements.calendarEl).removeClass(prevTheme);
      if (_.options.theme !== 'default') $(_.$elements.calendarEl).addClass(_.options.theme);
    }

    // v1.0.0 - Called in every resize
    EvoCalendar.prototype.resize = function () {
      var _ = this;
      _.windowW = $(window).width();

      if (_.windowW <= _.$breakpoints.tablet) { // tablet
        _.toggleSidebar(false);
        _.toggleEventList(false);
        _.windowW <= _.$breakpoints.mobile ? $(window).off('click.evocalendar.evo-' + _.instanceUid) : $(window).on('click.evocalendar.evo-' + _.instanceUid, $.proxy(_.toggleOutside, _)) // mobile
      } else {
        !_.options.sidebarDisplayDefault ? _.toggleSidebar(false) : _.toggleSidebar(true)
        !_.options.eventDisplayDefault ? _.toggleEventList(false) : _.toggleEventList(true)
        $(window).off('click.evocalendar.evo-' + _.instanceUid);
      }
    }

    // v1.0.0 - Initialize event listeners
    EvoCalendar.prototype.initEventListener = function () {
      var _ = this;

      $(window).off('resize.evocalendar.evo-' + _.instanceUid).on('resize.evocalendar.evo-' + _.instanceUid, $.proxy(_.resize, _));

      if (_.options.sidebarToggler) _.$elements.sidebarToggler.off('click.evocalendar').on('click.evocalendar', _.toggleSidebar)
      if (_.options.eventListToggler) _.$elements.eventListToggler.off('click.evocalendar').on('click.evocalendar', _.toggleEventList)

      _.$elements.sidebarEl.find('[data-month-val]').off('click.evocalendar').on('click.evocalendar', _.selectMonth)
      _.$elements.sidebarEl.find('[data-year-val]').off('click.evocalendar').on('click.evocalendar', _.selectYear)
      _.$elements.eventEl.find('[data-event-index]').off('click.evocalendar').on('click.evocalendar', _.selectEvent)
    }

    // v1.0.0 - Calculate days (incl. monthLength, startingDays based on :firstDayOfWeekName)
    EvoCalendar.prototype.calculateDays = function () {
      var _ = this, nameDays, weekStart, firstDay;
      _.monthLength = _.$label.days_in_month[_.$active.month]; // find number of days in month
      if (_.$active.month == 1) { // compensate for leap year - february only!
        if ((_.$active.year % 4 == 0 && _.$active.year % 100 != 0) || _.$active.year % 400 == 0) {
          _.monthLength = 29;
        }
      }
      nameDays = _.initials.dates[_.options.language].daysShort;
      weekStart = _.options.firstDayOfWeek;

      while (_.$label.days.length < nameDays.length) {
        if (weekStart == nameDays.length) {
          weekStart = 0;
        }
        _.$label.days.push(nameDays[weekStart]);
        weekStart++;
      }
      firstDay = new Date(_.$active.year, _.$active.month).getDay() - weekStart;
      _.startingDay = firstDay < 0 ? (_.$label.days.length + firstDay) : firstDay;
    }

    // v1.0.0 - Build the bones! (incl. sidebar, inner, events), called once in every initialization
    EvoCalendar.prototype.buildTheBones = function () {
      var _ = this
      _.calculateDays()

      if (!_.$elements.calendarEl.html()) {
        var markup;

        // --- BUILDING MARKUP BEGINS --- //

        // sidebar
        markup = `<div class="calendar-sidebar">
          <div class="calendar-year">
          <button class="icon-button" role="button" data-year-val="prev" title="${_.initials.dates[_.options.language].previousYearText}">
          <span class="chevron-arrow-left"></span>
          </button>&nbsp;<p></p>&nbsp;
          <button class="icon-button" role="button" data-year-val="next" title="${_.initials.dates[_.options.language].nextYearText}">
          <span class="chevron-arrow-right"></span>
          </button>
          </div><div class="month-list">
          <ul class="calendar-months">
          ${_.$label.months.map((x, i) => `<li class="month" role="button" data-month-val="${i}">${_.initials.dates[_.options.language].months[i]}</li>`).join("")}
          </ul></div></div>
          <div class="calendar-inner">
          <table class="calendar-table">
          <tr><th colspan="7"></th></tr>
          <tr class="calendar-header">
          ${_.$label.days.map((x, i) => `<td class="${`calendar-header-day${_.$label.days[i] === _.initials.weekends.sat || _.$label.days[i] === _.initials.weekends.sun ? " --weekend" : ""}`}">${_.$label.days[i]}</td>`).join("")}
          </tr></table></div>
        <div class="calendar-events">
          <div class="event-header"><p></p></div>
          <div class="event-list"></div>
          <div id="ultimaModificacion"></div>
          <input class="boton" type="submit" id="irARegistrarVentas" onclick="irARegistrarVentas()" value="Crear nuevo registro"/>
        </div>`

        // --- Finally, build it now! --- //
        _.$elements.calendarEl.html(markup);

        if (!_.$elements.sidebarEl) _.$elements.sidebarEl = $(_.$elements.calendarEl).find('.calendar-sidebar');
        if (!_.$elements.innerEl) _.$elements.innerEl = $(_.$elements.calendarEl).find('.calendar-inner');
        if (!_.$elements.eventEl) _.$elements.eventEl = $(_.$elements.calendarEl).find('.calendar-events');

        // if: _.options.sidebarToggler
        if (_.options.sidebarToggler) {
          $(_.$elements.sidebarEl).append('<span id="sidebarToggler" role="button" aria-pressed title="' + _.initials.dates[_.options.language].closeSidebarText + '"><button class="icon-button"><span class="bars"></span></button></span>');
          if (!_.$elements.sidebarToggler) _.$elements.sidebarToggler = $(_.$elements.sidebarEl).find('span#sidebarToggler');
        }
        if (_.options.eventListToggler) {
          $(_.$elements.calendarEl).append('<span id="eventListToggler" role="button" aria-pressed title="' + _.initials.dates[_.options.language].closeEventListText + '"><button class="icon-button"><span class="chevron-arrow-right"></span></button></span>');
          if (!_.$elements.eventListToggler) _.$elements.eventListToggler = $(_.$elements.calendarEl).find('span#eventListToggler');
        }
      }
      _.buildSidebarYear();
      _.buildSidebarMonths();
      _.buildCalendar();
      _.buildEventList();
      _.initEventListener(); // test

      _.resize();
    }

    EvoCalendar.prototype.buildEventList = function () {
      var _ = this, hasEventToday = false
      _.$active.events = []

      var title = _.formatDate(_.$active.date, _.options.eventHeaderFormat, _.options.language)
      _.$elements.eventEl.find('.event-header > p').text(title)
      // Event list
      var eventListEl = _.$elements.eventEl.find('.event-list');
      // Clear event list item(s)
      if (eventListEl.children().length > 0) eventListEl.empty();
      if (_.options.calendarEvents) {
        for (var i = 0; i < _.options.calendarEvents.length; i++) {
          if (_.isBetweenDates(_.$active.date, _.options.calendarEvents[i].date)) {
            eventAdder(_.options.calendarEvents[i])
          }
          else if (_.options.calendarEvents[i].everyYear) {
            var d = new Date(_.$active.date).getMonth() + 1 + ' ' + new Date(_.$active.date).getDate();
            var dd = new Date(_.options.calendarEvents[i].date).getMonth() + 1 + ' ' + new Date(_.options.calendarEvents[i].date).getDate();
            // var dates = [_.formatDate(_.options.calendarEvents[i].date[0], 'mm/dd'), _.formatDate(_.options.calendarEvents[i].date[1], 'mm/dd')];

            if (d == dd) eventAdder(_.options.calendarEvents[i])
          }
        }
      }
      function eventAdder(event) {
        hasEventToday = true;
        let dia = eventosCalendario.find(el => new Date(el.date).valueOf() === new Date(_.$active.date).valueOf())
        $($).find("#ultimaModificacion").text(`Fecha de última modificación: ${devuelveFecha(dia)} por: ${dia.usuario}`)
        $($).find("#irARegistrarVentas").val("Ir a registro")
        _.addEventList(event)
      }
      // IF: no event for the selected date
      if (!hasEventToday) {
        $($).find("#ultimaModificacion").text("");
        $($).find("#irARegistrarVentas").val("Crear nuevo registro")
        eventListEl.append(`<div class="event-empty"><p>${_.initials.dates[_.options.language][_.$active.date === _.$current.date ? "noEventForToday" : "noEventForThisDay"]}</p></div>`)
      }
    }

    function pedirCamioneros(_) {
      let fechaAPedir = _.$active.year + "/" + (_.$active.month + 1)
      if (listaMeses[fechaAPedir]) return
      $.ajax({
        url: "/calendario",
        method: "POST",
        contentType: "application/json",
        data: `{ "fecha": "${fechaAPedir}" }`,
        success: async mes => {
          listaMeses[fechaAPedir] = 1
          let añadir = []
          mes.dias?.forEach(d => { d.camioneros.forEach((c, i) => añadir.push({ name: `Camión ${(i + 1)}`, description: `Conductor: ${c}`, date: d._id.aUTC().toDateString(), type: i + "", ultimocambio: d.ultimocambio, usuario: d.usuario, color: camioneros[c] })) })
          _.addCalendarEvent(añadir)
        },
        error: q => toastr["error"](`Hubo un error al momento de pedir los camioneros por favor recarga la página`, "Alerta")
      })
    }

    // v1.0.0 - Add single event to event list
    EvoCalendar.prototype.addEventList = function (event_data) {
      var _ = this
      var eventListEl = _.$elements.eventEl.find('.event-list');
      if (eventListEl.find('[data-event-index]').length === 0) eventListEl.empty();
      _.$active.events.push(event_data);
      eventListEl.append(`<div class="event-container" role="button" data-event-index="${event_data.id}">
      <div class="event-icon"><div class="event-bullet-${event_data.type}"${event_data.color ? `style="background-color:${event_data.color}"` : ""}></div></div>
      <div class="event-info"><p class="event-title">${_.limitTitle(event_data.name)}${event_data.badge ? `<span>${event_data.badge}</span>` : ""}</p>${event_data.description ? `<p class="event-desc">${event_data.description}</p>` : ""}</div>
      </div>`)

      _.$elements.eventEl.find('[data-event-index="' + (event_data.id) + '"]').off('click.evocalendar').on('click.evocalendar', _.selectEvent);
    }

    // v1.0.0 - Build Sidebar: Year text
    EvoCalendar.prototype.buildSidebarYear = function () {
      this.$elements.sidebarEl.find('.calendar-year > p').text(this.$active.year)
    }

    // v1.0.0 - Build Sidebar: Months list text
    EvoCalendar.prototype.buildSidebarMonths = function () {
      this.$elements.sidebarEl.find('.calendar-months > [data-month-val]').removeClass('active-month')
      this.$elements.sidebarEl.find(`.calendar-months > [data-month-val="${this.$active.month}"]`).addClass('active-month')
    }

    // v1.0.0 - Build Calendar: Title, Days
    EvoCalendar.prototype.buildCalendar = function () {
      var _ = this, markup, title;

      _.calculateDays();

      title = _.formatDate(new Date(_.$label.months[_.$active.month] + ' 1 ' + _.$active.year), _.options.titleFormat, _.options.language);
      _.$elements.innerEl.find('.calendar-table th').text(title);

      _.$elements.innerEl.find('.calendar-body').remove(); // Clear days

      markup += '<tr class="calendar-body">';
      var day = 1;
      for (var i = 0; i < 9; i++) { // this loop is for is weeks (rows)
        for (var j = 0; j < _.$label.days.length; j++) { // this loop is for weekdays (cells)
          if (day <= _.monthLength && (i > 0 || j >= _.startingDay)) {
            // add '--weekend' to sat sun
            markup += `<td class="calendar-day${_.$label.days[j] === _.initials.weekends.sat || _.$label.days[j] === _.initials.weekends.sun ? " --weekend" : ""}">
            <div class="day" role="button" data-date-val="${_.formatDate(`${_.$label.months[_.$active.month]} ${day} ${_.$active.year}`, _.options.format)}">${day}</div>`
            day++;
          } else {
            markup += '<td>';
          }
          markup += '</td>';
        }
        if (day > _.monthLength) {
          break; // stop making rows if we've run out of days
        } else {
          markup += '</tr><tr class="calendar-body">'; // add if not
        }
      }
      markup += '</tr>';
      _.$elements.innerEl.find('.calendar-table').append(markup);
      if (_.options.todayHighlight) _.$elements.innerEl.find(`[data-date-val="${_.$current.date}"]`).addClass('calendar-today')

      // set event listener for each day
      _.$elements.innerEl.find('.calendar-day').children().off('click.evocalendar').on('click.evocalendar', _.selectDate)
      var selectedDate = _.$elements.innerEl.find(`[data-date-val="${_.$active.date}"]`)
      if (selectedDate) {
        // Remove active class to all
        _.$elements.innerEl.children().removeClass('calendar-active')
        // Add active class to selected date
        selectedDate.addClass('calendar-active')
      }
      if (_.options.calendarEvents != null) { // For event indicator (dots)
        _.$elements.innerEl.find('.calendar-day > day > .event-indicator').empty()
        _.options.calendarEvents.forEach(x => _.addEventIndicator(x))
      }
    }

    // v1.0.0 - Add event indicator/s (dots)
    EvoCalendar.prototype.addEventIndicator = function (event) {
      var _ = this, thisDate;
      var event_date = event.date
      var type = stringCheck(event.type)

      if (event_date instanceof Array) {
        if (event.everyYear) {
          for (var x = 0; x < event_f.length; x++) { event_date[x] = _.formatDate(new Date(event_date[x]).setFullYear(_.$active.year), _.options.format); }
        }
        var active_date = _.getBetweenDates(event_date);

        for (var i = 0; i < active_date.length; i++) { appendDot(active_date[i]); }
      } else {
        if (event.everyYear) { event_date = _.formatDate(new Date(event_date).setFullYear(_.$active.year), _.options.format); }
        appendDot(event_date);
      }

      function appendDot(date) {
        thisDate = _.$elements.innerEl.find(`[data-date-val="${date}"]`)
        if (thisDate.find('span.event-indicator').length === 0) thisDate.append('<span class="event-indicator"></span>')

        if (thisDate.find('span.event-indicator > .type-bullet > .type-' + type).length === 0) {
          thisDate.find('.event-indicator').append(`<div class="type-bullet"><div class="type-${event.type}"
        ${event.color ? `style="background-color:${event.color}"` : ""}></div></div > `);
        }
      }
    }

    /****************
    *    METHODS    *
    ****************/

    // v1.0.0 - Select year
    EvoCalendar.prototype.selectYear = function (event) {
      var _ = this;
      var el, yearVal;

      if (typeof event === 'string' || typeof event === 'number') {
        if ((parseInt(event)).toString().length === 4)
          yearVal = parseInt(event)
      } else {
        el = $(event.target).closest('[data-year-val]');
        yearVal = $(el).data('yearVal');
      }

      if (yearVal == "prev") --_.$active.year
      else if (yearVal == "next") ++_.$active.year
      else if (typeof yearVal === 'number') _.$active.year = yearVal
      pedirCamioneros(_)

      if (_.windowW <= _.$breakpoints.mobile && _.$UI.hasSidebar) _.toggleSidebar(false)

      $(_.$elements.calendarEl).trigger("selectYear", [_.$active.year])

      _.buildSidebarYear();
      _.buildCalendar();
    }

    // v1.0.0 - Select month
    EvoCalendar.prototype.selectMonth = function (event) {
      var _ = this;
      if (typeof event === 'string' || typeof event === 'number') {
        if (event >= 0 && event <= _.$label.months.length) {
          // if: 0-11
          _.$active.month = (event).toString();
        }
      } else {
        // if month is manually selected
        _.$active.month = $(event.currentTarget).data('monthVal');
      }

      pedirCamioneros(_);
      _.buildSidebarMonths();
      _.buildCalendar();

      if (_.windowW <= _.$breakpoints.tablet && _.$UI.hasSidebar) _.toggleSidebar(false)

      // EVENT FIRED: selectMonth
      $(_.$elements.calendarEl).trigger("selectMonth", [_.initials.dates[_.options.language].months[_.$active.month], _.$active.month])
    }

    // v1.0.0 - Select specific date
    EvoCalendar.prototype.selectDate = function (event) {
      var _ = this;
      var oldDate = _.$active.date;
      var date, year, month, activeDayEl, isSameDate;
      if (typeof event === 'string' || typeof event === 'number' || event instanceof Date) {
        date = _.formatDate(new Date(event), _.options.format)
        year = new Date(date).getFullYear();
        month = new Date(date).getMonth();

        if (_.$active.year !== year) _.selectYear(year);
        if (_.$active.month !== month) _.selectMonth(month);
        activeDayEl = _.$elements.innerEl.find("[data-date-val='" + date + "']");
      } else {
        activeDayEl = $(event.currentTarget);
        date = activeDayEl.data('dateVal')
      }
      isSameDate = _.$active.date === date;
      // Set new active date
      _.$active.date = date;
      _.$active.event_date = date;
      // Remove active class to all
      _.$elements.innerEl.find('[data-date-val]').removeClass('calendar-active');
      // Add active class to selected date
      activeDayEl.addClass('calendar-active');
      // Build event list if not the same date events built
      if (!isSameDate) _.buildEventList();

      // EVENT FIRED: selectDate
      $(_.$elements.calendarEl).trigger("selectDate", [_.$active.date, oldDate])
    }

    // v1.0.0 - Hide Sidebar/Event List if clicked outside
    EvoCalendar.prototype.toggleOutside = function (event) {
      var _ = this, isInnerClicked;

      isInnerClicked = event.target === _.$elements.innerEl[0];

      if (_.$UI.hasSidebar && isInnerClicked) _.toggleSidebar(false);
      if (_.$UI.hasEvent && isInnerClicked) _.toggleEventList(false);
    }

    // v1.0.0 - Toggle Sidebar
    EvoCalendar.prototype.toggleSidebar = function (event) {
      var _ = this;

      if (event === undefined || event.originalEvent) {
        $(_.$elements.calendarEl).toggleClass('sidebar-hide')
        _.$UI.hasSidebar = !_.$UI.hasSidebar;
      } else {
        $(_.$elements.calendarEl).toggleClass('sidebar-hide', !event)
        _.$UI.hasSidebar = event
      }

      if (_.windowW <= _.$breakpoints.tablet && _.$UI.hasSidebar && _.$UI.hasEvent) _.toggleEventList()
    }

    // v1.0.0 - Toggle Event list
    EvoCalendar.prototype.toggleEventList = function (event) {
      var _ = this

      if (event === undefined || event.originalEvent) {
        $(_.$elements.calendarEl).toggleClass('event-hide')
        _.$UI.hasEvent = !_.$UI.hasEvent
      } else {
        $(_.$elements.calendarEl).toggleClass('event-hide', !event)
        _.$UI.hasEvent = event
      }

      if (_.windowW <= _.$breakpoints.tablet && _.$UI.hasEvent && _.$UI.hasSidebar) _.toggleSidebar()
    }

    // v1.0.0 - Add Calendar Event(s)
    EvoCalendar.prototype.addCalendarEvent = function (arr) {
      var _ = this

      function addEvent(data) {
        let fecha = data.date;
        if (fecha instanceof Array)
          fecha.forEach((x, i, a) => _.isValidDate(x) && (a[i] = _.formatDate(new Date(x), _.options.format)))
        else if (_.isValidDate(fecha))
          fecha = _.formatDate(new Date(fecha), _.options.format)

        if (!_.options.calendarEvents) _.options.calendarEvents = [];
        _.options.calendarEvents.push(data);
        _.addEventIndicator(data);
        if (_.$active.event_date === fecha) _.addEventList(data);
      }
      if (arr instanceof Array) arr.forEach(x => addEvent(x))
      else if (typeof arr === 'object') addEvent(arr)
    }

    // v1.0.0 - Check if date is valid
    EvoCalendar.prototype.isValidDate = d => new Date(d) && !isNaN(new Date(d).getTime())

    $.fn.evoCalendar = function () {
      var _ = this, opt = arguments[0], args = Array.prototype.slice.call(arguments, 1), l = _.length, i, ret
      for (i = 0; i < l; i++) {
        if (typeof opt == 'object' || typeof opt == 'undefined') _[i].evoCalendar = new EvoCalendar(_[i], opt)
        else ret = _[i].evoCalendar[opt].apply(_[i].evoCalendar, args)
        if (typeof ret != 'undefined') return ret
      }
      return _
    }

  }))

let irARegistrarVentas = q => location = `/registrarventas/${fechaseleccionada.getDate()}-${(fechaseleccionada.getMonth() + 1)}-${fechaseleccionada.getFullYear()} `;
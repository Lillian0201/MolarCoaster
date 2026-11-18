/* Appointment page (DEMO, no backend): calendar, form shown only after a
   date is picked, booked time slots saved in this browser (localStorage)
   so the next patient can no longer choose them, and a confirmation screen.

   To go live later, replace loadBookings() / saveBooking() with calls to
   your server (e.g. /Patient/api/booked_slots.php and book_appointment.php). */
(function () {
  'use strict';

  var STORE_KEY = 'molarcoaster_demo_bookings';

  var MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  var DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  var MAX_MONTHS_AHEAD = 6;

  var today = new Date(); today.setHours(0, 0, 0, 0);
  var current = new Date(today.getFullYear(), today.getMonth(), 1);
  var view = new Date(current);
  var selected = null;

  var daysEl = document.getElementById('cal-days');
  var monthEl = document.getElementById('cal-month');
  var prevBtn = document.getElementById('cal-prev');
  var nextBtn = document.getElementById('cal-next');
  var dateInput = document.getElementById('appt-date');
  var timeSel = document.getElementById('time');
  var noteEl = document.getElementById('slots-note');
  var noteText = document.getElementById('slots-text');
  var form = document.getElementById('appt-form');
  var submitBtn = document.getElementById('submit-btn');
  var formCard = document.querySelector('.form-card');
  var grid = document.querySelector('.grid-two');
  var statusEl = document.getElementById('form-status');

  /* Form is hidden until the user selects a date */
  formCard.hidden = true;
  grid.classList.add('no-date');

  function iso(d) {
    var m = d.getMonth() + 1, day = d.getDate();
    return d.getFullYear() + '-' + (m < 10 ? '0' : '') + m + '-' + (day < 10 ? '0' : '') + day;
  }
  function label(h) {
    var suffix = h >= 12 ? 'PM' : 'AM', hh = h % 12 === 0 ? 12 : h % 12;
    return hh + ':00 ' + suffix;
  }
  function prettyDate(d) {
    return DAYS[d.getDay()] + ', ' + MONTHS[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
  }
  function setStatus(msg, type) {
    statusEl.textContent = msg || '';
    statusEl.className = 'form-status' + (type ? ' is-' + type : '');
  }

  /* ---------- Demo storage (localStorage) ---------- */
  function loadBookings() {
    try {
      var list = JSON.parse(localStorage.getItem(STORE_KEY) || '[]');
      return Array.isArray(list) ? list : [];
    } catch (e) { return []; }
  }
  function saveBooking(b) {
    var list = loadBookings();
    list.push(b);
    try { localStorage.setItem(STORE_KEY, JSON.stringify(list)); return true; }
    catch (e) { return false; }
  }
  function bookedTimes(isoStr) {
    return loadBookings()
      .filter(function (b) { return b.appointment_date === isoStr; })
      .map(function (b) { return b.preferred_time; });
  }
  // Handy for testing: run MolarCoasterDemo.reset() in the browser console.
  window.MolarCoasterDemo = {
    reset: function () { localStorage.removeItem(STORE_KEY); window.location.reload(); }
  };

  /* ---------- Calendar ---------- */
  function render() {
    monthEl.textContent = MONTHS[view.getMonth()] + ' ' + view.getFullYear();
    daysEl.innerHTML = '';

    var first = new Date(view.getFullYear(), view.getMonth(), 1).getDay();
    var count = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
    for (var b = 0; b < first; b++) daysEl.appendChild(document.createElement('span'));

    for (var d = 1; d <= count; d++) {
      var date = new Date(view.getFullYear(), view.getMonth(), d);
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'day' + (date.getDay() === 0 ? ' sun' : '');
      btn.textContent = d;
      btn.setAttribute('aria-label', prettyDate(date));
      btn.dataset.date = iso(date);

      var closed = date.getDay() === 0; // clinic is closed on Sundays
      if (date < today || closed) btn.disabled = true;

      if (selected && iso(selected) === btn.dataset.date) {
        btn.classList.add('selected');
        btn.setAttribute('aria-pressed', 'true');
      }
      btn.addEventListener('click', function () { pick(this.dataset.date); });
      daysEl.appendChild(btn);
    }

    prevBtn.disabled = view <= current;
    var limit = new Date(current.getFullYear(), current.getMonth() + MAX_MONTHS_AHEAD, 1);
    nextBtn.disabled = view >= limit;
  }

  /* ---------- Time slots ---------- */
  function buildSlots(date, booked) {
    // Mon-Fri 9AM-6PM, Sat 9AM-2PM (last slot starts an hour before closing)
    var last = date.getDay() === 6 ? 13 : 17;
    var now = new Date();
    var isToday = iso(date) === iso(now);
    var free = 0;

    timeSel.innerHTML = '<option value="" selected disabled>Select a time</option>';
    for (var h = 9; h <= last; h++) {
      var text = label(h);
      var o = document.createElement('option');
      o.value = text;
      var taken = booked.indexOf(text) !== -1;
      var passed = isToday && h <= now.getHours();
      if (taken) { o.textContent = text + ' (booked)'; o.disabled = true; }
      else if (passed) { o.textContent = text + ' (passed)'; o.disabled = true; }
      else { o.textContent = text; free++; }
      timeSel.appendChild(o);
    }
    return free;
  }

  function pick(isoStr) {
    var p = isoStr.split('-');
    selected = new Date(+p[0], +p[1] - 1, +p[2]);
    dateInput.value = isoStr;
    setStatus('');

    var wasHidden = formCard.hidden;
    formCard.hidden = false;
    grid.classList.remove('no-date');

    var free = buildSlots(selected, bookedTimes(isoStr));
    timeSel.disabled = free === 0;
    noteEl.classList.toggle('is-full', free === 0);
    noteText.textContent = free === 0
      ? 'No time slots left on ' + prettyDate(selected) + '. Please pick another day.'
      : 'Selected: ' + prettyDate(selected) + '. Choose a time on the form.';

    render();
    update();

    // On phones/tablets the form is below the calendar: bring it into view
    if (wasHidden && window.matchMedia('(max-width: 900px)').matches) {
      formCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function update() {
    submitBtn.disabled = !(selected && form.checkValidity());
  }

  /* ---------- Submit ---------- */
  function showConfirmation(data) {
    var box = document.createElement('div');
    box.className = 'confirm-box';
    box.innerHTML =
      '<h2>Request received</h2>' +
      '<p class="form-status is-success" role="status">Thank you! We will contact you to confirm your appointment.</p>' +
      '<dl>' +
        '<dt>Name</dt><dd></dd>' +
        '<dt>Date</dt><dd></dd>' +
        '<dt>Time</dt><dd></dd>' +
        '<dt>Reason</dt><dd></dd>' +
        '<dt>Phone</dt><dd></dd>' +
      '</dl>' +
      '<button type="button" class="btn-submit" id="book-another">Book another appointment</button>';
    // textContent keeps user input from being interpreted as HTML
    var dds = box.querySelectorAll('dd');
    dds[0].textContent = data.full_name;
    dds[1].textContent = prettyDate(selected);
    dds[2].textContent = data.preferred_time;
    dds[3].textContent = data.reason;
    dds[4].textContent = data.phone;

    formCard.innerHTML = '';
    formCard.appendChild(box);
    box.querySelector('#book-another').addEventListener('click', function () { window.location.reload(); });
    var h2 = box.querySelector('h2');
    h2.setAttribute('tabindex', '-1');
    h2.focus();
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }

    var payload = {};
    new FormData(form).forEach(function (v, k) { payload[k] = String(v).trim(); });

    // Re-check: the slot may have been taken in another tab
    if (bookedTimes(payload.appointment_date).indexOf(payload.preferred_time) !== -1) {
      setStatus('That time was just booked. Please choose another.', 'error');
      pick(payload.appointment_date);
      return;
    }
    if (!saveBooking(payload)) {
      setStatus('Could not save the booking in this browser. Please try again or call us.', 'error');
      return;
    }
    showConfirmation(payload);
  });

  prevBtn.addEventListener('click', function () { view = new Date(view.getFullYear(), view.getMonth() - 1, 1); render(); });
  nextBtn.addEventListener('click', function () { view = new Date(view.getFullYear(), view.getMonth() + 1, 1); render(); });
  form.addEventListener('input', update);
  form.addEventListener('change', update);

  // Coming from a service page (appointment.html?service=Orthodontics)
  // preselects the matching "Reason for Visit".
  (function preselectReason() {
    try {
      var q = new URLSearchParams(window.location.search).get('service');
      if (!q) return;
      q = q.toLowerCase();
      var sel = document.getElementById('reason');
      for (var i = 0; i < sel.options.length; i++) {
        var v = sel.options[i].value;
        if (v && v.toLowerCase().indexOf(q) === 0) { sel.value = v; break; }
      }
    } catch (e) { /* ignore */ }
  })();

  render();
  update();
})();
/* Appointment page: calendar, time slots (with already-booked slots
   disabled), validation, submit via fetch and a confirmation screen. */
(function () {
  'use strict';

  var API_SLOTS  = '/Patient/api/booked_slots.php';
  var API_BOOK   = '/Patient/api/book_appointment.php';

  var MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  var DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  var MAX_MONTHS_AHEAD = 6;

  var today = new Date(); today.setHours(0, 0, 0, 0);
  var current = new Date(today.getFullYear(), today.getMonth(), 1);
  var view = new Date(current);
  var selected = null;
  var slotRequest = 0; // guards against out-of-order responses

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
  var statusEl = document.getElementById('form-status');

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

    timeSel.disabled = true;
    timeSel.innerHTML = '<option value="" selected disabled>Loading times...</option>';
    noteEl.classList.remove('is-full');
    noteText.textContent = 'Checking available times for ' + prettyDate(selected) + '...';
    render();
    update();

    var req = ++slotRequest;
    fetchBooked(isoStr).then(function (booked) {
      if (req !== slotRequest) return; // a newer date was picked meanwhile
      var free = buildSlots(selected, booked);
      timeSel.disabled = free === 0;
      if (free === 0) {
        noteEl.classList.add('is-full');
        noteText.textContent = 'No time slots left on ' + prettyDate(selected) + '. Please pick another day.';
      } else {
        noteText.textContent = 'Selected: ' + prettyDate(selected) + '. Choose a time on the form.';
      }
      update();
    });
  }

  // Returns a list like ["9:00 AM", "2:00 PM"]. If the server cannot be
  // reached we simply show every slot; the server re-checks on submit.
  function fetchBooked(isoStr) {
    return fetch(API_SLOTS + '?date=' + encodeURIComponent(isoStr), { headers: { 'Accept': 'application/json' } })
      .then(function (r) { if (!r.ok) throw new Error('bad status'); return r.json(); })
      .then(function (data) { return Array.isArray(data.booked) ? data.booked : []; })
      .catch(function () { return []; });
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
    box.querySelector('h2').setAttribute('tabindex', '-1');
    box.querySelector('h2').focus();
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }

    var payload = {};
    new FormData(form).forEach(function (v, k) { payload[k] = String(v).trim(); });

    submitBtn.disabled = true;
    submitBtn.setAttribute('aria-busy', 'true');
    submitBtn.textContent = 'Sending...';
    setStatus('');

    fetch(API_BOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(function (r) {
        return r.json().catch(function () { return {}; }).then(function (data) { return { ok: r.ok, status: r.status, data: data }; });
      })
      .then(function (res) {
        if (res.ok && res.data.success) {
          showConfirmation(payload);
          return;
        }
        if (res.status === 409) {
          // Someone else took the slot: refresh the list
          setStatus(res.data.message || 'That time was just booked. Please choose another.', 'error');
          pick(dateInput.value);
        } else {
          setStatus(res.data.message || 'Something went wrong. Please try again or call us.', 'error');
        }
      })
      .catch(function () {
        setStatus('Could not reach the server. Check your connection and try again.', 'error');
      })
      .then(function () {
        if (!document.body.contains(submitBtn)) return; // confirmation replaced the form
        submitBtn.removeAttribute('aria-busy');
        submitBtn.textContent = 'Submit Request';
        update();
      });
  });

  prevBtn.addEventListener('click', function () { view = new Date(view.getFullYear(), view.getMonth() - 1, 1); render(); });
  nextBtn.addEventListener('click', function () { view = new Date(view.getFullYear(), view.getMonth() + 1, 1); render(); });
  form.addEventListener('input', update);
  form.addEventListener('change', update);

  render();
  update();
})();
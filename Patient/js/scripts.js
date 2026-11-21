/* ==========================================================
   MolarCoaster Dental Clinic - scripts.js
   Combined from: layout, about, appointment, contact, resources,
   services. Include it ONCE on every page, at the end of <body>:

     <script src="/Patient/js/scripts.js" defer></script>

   The layout section runs first and builds the header/footer.
   Every other section checks that its own page's elements exist
   and quietly does nothing on the other pages.
   ========================================================== */

/* ----------------------------------------------------------
   1. LAYOUT - shared header, footer, page class (all pages)
   ---------------------------------------------------------- */
/* Shared header and footer for all MolarCoaster pages.
   (Section 1 of scripts.js - runs on every page.)
*/

(function () {
  'use strict';

  var NAV = [
    { key: 'home', label: 'Home', href: '/Patient/home.html' },
    { key: 'appointments', label: 'Appointments', href: '/Patient/appointment.html' },
    { key: 'about', label: 'About Us', href: '/Patient/about.html' },
    { key: 'services', label: 'Services', href: '/Patient/services.html' },
    { key: 'resources', label: 'Resources', href: '/Patient/resources.html' },
    { key: 'contact', label: 'Contact Us', href: '/Patient/contact.html' }
  ];

  var page = document.body.getAttribute('data-page') || 'home';

  // Allow either appointment or appointments.
  if (page === 'appointment') {
    page = 'appointments';
  }

  /* ---------- Page body class (used by styles.css) ---------- */
  // data-page="home" -> <body class="page-home">, "appointment(s)" -> page-appointment, etc.
  document.body.classList.add('page-' + (page === 'appointments' ? 'appointment' : page));

  var header = document.getElementById('site-header');
  var footer = document.getElementById('site-footer');

  /* ---------- Shared Header ---------- */
  if (header) {

    var navLinks = NAV.map(function (item) {
      var active = item.key === page;

      return (
        '<li>' +
        '<a href="' + item.href + '"' +
        (active ? ' class="active" aria-current="page"' : '') +
        '>' + item.label + '</a>' +
        '</li>'
      );
    }).join('');

    header.innerHTML =

      // Logo
      '<a href="/Patient/home.html" class="logo" aria-label="MolarCoaster Dental Clinic home">' +
      '<img src="/Patient/images/MolarCoaster.jpg" alt="MolarCoaster Dental Clinic logo">' +
      '<span class="logo-text">' +
      '<span class="brand">MolarCoaster</span>' +
      '<span class="sub">DENTAL CLINIC</span>' +
      '</span>' +
      '</a>' +

      // Mobile menu toggle
      '<input type="checkbox" id="menu-check" class="menu-check" aria-label="Toggle menu">' +

      '<label for="menu-check" class="menu-toggle" aria-label="Toggle menu"></label>' +

      // Navigation links
      '<nav class="main-nav" id="main-nav" aria-label="Main navigation">' +
      '<ul>' + navLinks + '</ul>' +
      '</nav>';
  }

  /* ---------- Shared Footer ---------- */
  if (footer) {

    // Links are taken from NAV so they never go out of sync with the header.
    // Clinic Profile and FAQs jump to sections of the About page: give those
    // sections id="clinic-profile" and id="faqs" in about.html.
    var APPT_URL = NAV[1].href;
    var ABOUT_URL = NAV[2].href;

    var ICON_MAIL =
      '<svg class="footer-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
      '<rect x="2.5" y="5" width="19" height="14" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>' +
      '<path d="m3 6 9 7 9-7M3 18l6.5-6M21 18l-6.5-6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>' +
      '</svg>';

    var ICON_MAP =
      '<svg class="footer-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
      '<path d="M2.5 6.5 8 4.5l6 2 0 13-6-2-5.5 2z M8 4.5v13 M14 6.5v13" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>' +
      '<path d="M17.5 14c-2.5-2.6-3.5-4-3.5-5.6a3.5 3.5 0 0 1 7 0c0 1.6-1 3-3.5 5.6z" fill="#ffffff" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>' +
      '<circle cx="17.5" cy="8.3" r="1.1" fill="currentColor"/>' +
      '</svg>';

    footer.innerHTML =

      '<div class="footer-inner">' +

      // Brand
      '<div class="footer-brand">' +
      '<span class="brand">MolarCoaster</span>' +
      '<span class="sub">Dental Clinic</span>' +
      '<p>Your Smile, our priority.</p>' +
      '</div>' +

      // Appointments
      '<div class="footer-col">' +
      '<a class="footer-head" href="' + APPT_URL + '">Appointments</a>' +
      '</div>' +

      // About Us + sub links
      '<div class="footer-col">' +
      '<a class="footer-head" href="' + ABOUT_URL + '">About Us</a>' +
      '<ul>' +
      '<li><a href="' + ABOUT_URL + '#clinic-profile">Clinic Profile</a></li>' +
      '<li><a href="' + ABOUT_URL + '#faqs">FAQs</a></li>' +
      '</ul>' +
      '</div>' +

      // Contact
      '<div class="footer-col footer-contact">' +
      '<h3 class="footer-head">Get in touch</h3>' +
      '<ul>' +
      '<li>' + ICON_MAIL + '<a href="mailto:info@molarcoaster.com">info@molarcoaster.com</a></li>' +
      '<li>' + ICON_MAP + '<span>123 St. Smile Manila, Philippines</span></li>' +
      '</ul>' +
      '</div>' +

      '</div>' +

      '<div class="footer-bottom">' +
      '<p>&copy; ' + new Date().getFullYear() +
      ' MolarCoaster Dental Clinic. All rights reserved</p>' +
      '</div>';
  }

})();

/* ----------------------------------------------------------
   2. ABOUT - side-menu scroll-spy + FAQ accordion (about page)
   ---------------------------------------------------------- */
/* About page: highlight the side menu while scrolling + FAQ accordion. */
(function () {
  'use strict';

  /* ---------- Side menu scroll-spy ---------- */
  var links = Array.prototype.slice.call(document.querySelectorAll('.side-link'));
  var targets = links.map(function (a) {
    return document.getElementById(a.getAttribute('href').slice(1));
  });

  function setActive(link) {
    links.forEach(function (l) {
      var on = l === link;
      l.classList.toggle('active', on);
      if (on) l.setAttribute('aria-current', 'true'); else l.removeAttribute('aria-current');
    });
  }

  links.forEach(function (link) {
    link.addEventListener('click', function () { setActive(this); });
  });

  if ('IntersectionObserver' in window) {
    var visible = {};
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { visible[en.target.id] = en.isIntersecting; });
      // the first section (in page order) that is inside the viewport band wins
      for (var i = 0; i < targets.length; i++) {
        if (targets[i] && visible[targets[i].id]) { setActive(links[i]); return; }
      }
    }, { rootMargin: '-20% 0px -55% 0px' });
    targets.forEach(function (t) { if (t) observer.observe(t); });
  }

  /* ---------- FAQ accordion ---------- */
  var cards = document.querySelectorAll('.faq-card');
  cards.forEach(function (card, i) {
    var heading = card.querySelector('h3');
    var answer = card.querySelector('p');
    if (!heading || !answer) return;

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'faq-toggle';
    btn.id = 'faq-q' + i;
    btn.setAttribute('aria-controls', 'faq-a' + i);
    btn.innerHTML = '<span></span>';
    btn.firstChild.textContent = heading.textContent;
    heading.textContent = '';
    heading.appendChild(btn);

    answer.id = 'faq-a' + i;
    answer.className = (answer.className + ' faq-answer').trim();
    answer.setAttribute('role', 'region');
    answer.setAttribute('aria-labelledby', btn.id);

    function open(state) {
      btn.setAttribute('aria-expanded', state ? 'true' : 'false');
      answer.hidden = !state;
    }
    open(false); // first question starts open
    btn.addEventListener('click', function () {
      open(btn.getAttribute('aria-expanded') !== 'true');
    });
  });
})();

/* ----------------------------------------------------------
   3. APPOINTMENT - calendar, booking form (appointment page)
   ---------------------------------------------------------- */
/* Appointment page (DEMO, no backend): calendar, form shown only after a
   date is picked, booked time slots saved in this browser (localStorage)
   so the next patient can no longer choose them, and a confirmation screen.

   To go live later, replace loadBookings() / saveBooking() with calls to
   your server (e.g. /Patient/api/booked_slots.php and book_appointment.php). */
(function () {
  'use strict';

  if (!document.getElementById('appt-form')) return; // not the appointment page

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

  /* ---------- Business hours (single source of truth) ---------- */
  // Mon-Fri 9:00 AM - 6:00 PM, Sat 9:00 AM - 2:00 PM, Sun closed.
  // The last bookable slot starts one hour before closing.
  var HOURS = { open: 9, closeWeekday: 18, closeSaturday: 14 };

  function lastSlotHour(date) {
    var dow = date.getDay();
    if (dow === 0) return null; // Sunday: closed
    return (dow === 6 ? HOURS.closeSaturday : HOURS.closeWeekday) - 1;
  }
  function hoursText(date) {
    var close = date.getDay() === 6 ? HOURS.closeSaturday : HOURS.closeWeekday;
    return label(HOURS.open) + ' to ' + label(close);
  }
  function parseISO(isoStr) {
    var p = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoStr || '');
    if (!p) return null;
    var d = new Date(+p[1], +p[2] - 1, +p[3]);
    return iso(d) === isoStr ? d : null; // rejects dates like 2026-02-31
  }
  function slotHour(text) { // "9:00 AM" -> 9, "1:00 PM" -> 13
    var m = /^(\d{1,2}):00 (AM|PM)$/.exec(text || '');
    if (!m) return null;
    var h = parseInt(m[1], 10) % 12;
    return m[2] === 'PM' ? h + 12 : h;
  }
  // Returns '' when the date can be booked, otherwise the reason it cannot.
  function dateProblem(isoStr) {
    var date = parseISO(isoStr);
    if (!date) return 'Please choose a valid date.';
    var now = new Date();
    if (date < new Date(now.getFullYear(), now.getMonth(), now.getDate())) return 'That date has already passed.';
    if (lastSlotHour(date) === null) return 'The clinic is closed on Sundays. Please choose another day.';
    return '';
  }
  // Returns '' when the date + time can be booked, otherwise the reason it cannot.
  function slotProblem(isoStr, timeText) {
    var bad = dateProblem(isoStr);
    if (bad) return bad;
    var date = parseISO(isoStr);
    var h = slotHour(timeText);
    if (h === null) return 'Please choose a valid time.';
    if (h < HOURS.open || h > lastSlotHour(date)) {
      return 'Sorry, that time is outside our business hours (' + hoursText(date) + '). Please choose another time.';
    }
    var now = new Date();
    if (iso(date) === iso(now) && h <= now.getHours()) {
      return 'That time has already passed. Please choose a later time.';
    }
    return '';
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
    var last = lastSlotHour(date);
    if (last === null) last = HOURS.open - 1; // closed day: no slots
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

    // Re-check everything at submit time: the page may have been open for a
    // while (a slot can pass or close), or the form may have been tampered with.
    var problem = slotProblem(payload.appointment_date, payload.preferred_time);
    if (problem) {
      if (!dateProblem(payload.appointment_date)) pick(payload.appointment_date); // rebuild the slots
      setStatus(problem, 'error');
      return;
    }

    // The slot may also have been taken in another tab
    if (bookedTimes(payload.appointment_date).indexOf(payload.preferred_time) !== -1) {
      pick(payload.appointment_date);
      setStatus('That time was just booked. Please choose another.', 'error');
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

/* ----------------------------------------------------------
   4. CONTACT - contact form validation (contact page)
   ---------------------------------------------------------- */
/* Contact page (DEMO, no backend): inline validation, then the message is
   saved in this browser (localStorage) and a success message is shown.

   To go live later, replace saveMessage() with a fetch() to your server
   (e.g. POST /Patient/api/send_message.php). */
(function () {
  'use strict';

  var STORE_KEY = 'molarcoaster_demo_messages';
  var form = document.getElementById('contact-form');
  if (!form) return;

  var statusEl = document.getElementById('contact-status');
  var submitBtn = form.querySelector('button[type="submit"]');

  var MESSAGES = {
    'full-name': 'Please enter your full name.',
    'phone': 'Enter 7 to 15 digits. You can include +, spaces, dashes and parentheses.',
    'email': 'Please enter a valid email address.'
  };

  function setStatus(msg, type) {
    statusEl.textContent = msg || '';
    statusEl.className = 'form-status' + (type ? ' is-' + type : '');
  }

  function saveMessage(data) {
    try {
      var list = JSON.parse(localStorage.getItem(STORE_KEY) || '[]');
      if (!Array.isArray(list)) list = [];
      data.sent_at = new Date().toISOString();
      list.push(data);
      localStorage.setItem(STORE_KEY, JSON.stringify(list));
      return true;
    } catch (e) { return false; }
  }

  function clearError(input) {
    input.classList.remove('has-error');
    input.removeAttribute('aria-invalid');
    input.removeAttribute('aria-describedby');
    var next = input.nextElementSibling;
    if (next && next.classList.contains('field-error')) next.remove();
  }

  function showError(input) {
    clearError(input);
    input.classList.add('has-error');
    input.setAttribute('aria-invalid', 'true');
    var span = document.createElement('span');
    span.className = 'field-error';
    span.id = input.id + '-error';
    span.textContent = MESSAGES[input.id] || input.validationMessage;
    input.setAttribute('aria-describedby', span.id);
    input.insertAdjacentElement('afterend', span);
  }

  function validateField(input) {
    if (input.checkValidity()) { clearError(input); return true; }
    showError(input);
    return false;
  }

  form.setAttribute('novalidate', ''); // we show our own messages
  var fields = form.querySelectorAll('input');
  fields.forEach(function (input) {
    input.addEventListener('blur', function () { if (input.value !== '' || input.required) validateField(input); });
    input.addEventListener('input', function () { if (input.classList.contains('has-error')) validateField(input); });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    setStatus('');

    var firstBad = null;
    fields.forEach(function (input) {
      if (!validateField(input) && !firstBad) firstBad = input;
    });
    if (firstBad) { firstBad.focus(); return; }

    var payload = {};
    new FormData(form).forEach(function (v, k) { payload[k] = String(v).trim(); });

    if (saveMessage(payload)) {
      form.reset();
      fields.forEach(clearError);
      setStatus('Thank you, ' + payload.full_name + '! Your message was sent. We will get back to you soon.', 'success');
    } else {
      setStatus('Something went wrong. Please try again or call us.', 'error');
    }
  });

  // Handy for testing: run MolarCoasterDemo.messages() in the console.
  window.MolarCoasterDemo = window.MolarCoasterDemo || {};
  window.MolarCoasterDemo.messages = function () {
    return JSON.parse(localStorage.getItem(STORE_KEY) || '[]');
  };
})();

/* ----------------------------------------------------------
   5. RESOURCES - filterable resource cards (resources page)
   ---------------------------------------------------------- */
(function () {
  'use strict';

  if (!document.getElementById('cards')) return; // not the resources page

  // Educational resources. Edit this list to add, remove or re-point links.
  // type: "Video" or "Website" | tone: y, g, b, s, p (card colours)
  const RESOURCES = [
    {
      cat: "Daily care", tone: "g", type: "Website", time: "3 min read", source: "MouthHealthy (ADA)",
      title: "Brushing your teeth: the right technique",
      text: "The American Dental Association's step-by-step advice on brushing, plus what else belongs in your daily routine.",
      url: "https://www.mouthhealthy.org/all-topics-a-z/brushing-your-teeth/"
    },
    {
      cat: "Daily care", tone: "s", type: "Video", time: "Watch", source: "YouTube",
      title: "Tips for good dental health",
      text: "A short video on everyday habits that keep your teeth and gums healthy.",
      url: "https://www.youtube.com/watch?v=fv-EGsNvNzc"
    },
    {
      cat: "Treatments", tone: "b", type: "Website", time: "5 min read", source: "Delta Dental",
      title: "What to expect at your filling",
      text: "A walk-through of getting a cavity filled, from numbing to the finishing touches.",
      url: "https://www1.deltadentalins.com/wellness/conditions-and-treatments/articles/cavities-fillings-treatment.html"
    },
    {
      cat: "Treatments", tone: "b", type: "Website", time: "5 min read", source: "American Association of Endodontists",
      title: "What to expect at your root canal",
      text: "How a root canal feels, what soreness is normal afterward and when to call your dentist.",
      url: "https://www.aae.org/patients/root-canal-treatment/root-canal-pain/"
    },
    {
      cat: "Aftercare", tone: "p", type: "Website", time: "4 min read", source: "Gentle Dental",
      title: "Do's and don'ts after a tooth extraction",
      text: "Rest, diet, rinsing, straws and medicines: what to do and avoid while your mouth heals.",
      url: "https://www.gentledental.com/resources/articles/dos-donts-after-tooth-extraction"
    },
    {
      cat: "Aftercare", tone: "y", type: "Video", time: "Watch", source: "YouTube",
      title: "Post-operative oral surgery instructions",
      text: "A video on home care after oral surgery so you can heal safely.",
      url: "https://www.youtube.com/watch?v=IHzrVvK9wM8"
    },
    {
      cat: "Kids & family", tone: "s", type: "Website", time: "3 min read", source: "MouthHealthy (ADA)",
      title: "Your child's first dental visit",
      text: "When to book the first visit, how to prepare and what the dentist will do.",
      url: "https://www.mouthhealthy.org/life-stages/babies-and-kids/first-dental-visit-for-baby"
    }
  ];

  const ICONS = {
    Video: '<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="6" y="14" width="52" height="36" rx="9" fill="#fff" stroke="#0b3a75" stroke-width="3"/><path d="M27 24l14 8-14 8z" fill="#1a5bd8"/></svg>',
    Website: '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M32 12c-5-4-16-3-18 6-1 8 3 11 4 19 1 9 4 15 8 15 4 0 4-10 6-10s2 10 6 10c4 0 7-6 8-15 1-8 5-11 4-19-2-9-13-10-18-6z" fill="#fff" stroke="#0b3a75" stroke-width="3" stroke-linejoin="round"/><circle cx="26" cy="30" r="2.4" fill="#0b3a75"/><circle cx="38" cy="30" r="2.4" fill="#0b3a75"/><path d="M28 38q4 4 8 0" fill="none" stroke="#0b3a75" stroke-width="2.6" stroke-linecap="round"/></svg>'
  };
  const ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12h16M14 6l6 6-6 6"/></svg>';

  const cardsEl = document.getElementById("cards");
  const emptyEl = document.getElementById("empty");
  const chips = document.querySelectorAll(".chip");

  function esc(s) { return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

  function render(filter) {
    const items = filter === "all" ? RESOURCES : RESOURCES.filter(r => r.cat === filter);
    cardsEl.innerHTML = items.map(r => `
      <a class="card" data-tone="${r.tone}" href="${r.url}" target="_blank" rel="noopener noreferrer"
         aria-label="${esc(r.title)} (opens ${esc(r.source)} in a new tab)">
        <div class="thumb">${ICONS[r.type]}<span class="badge">${r.type}</span></div>
        <div class="card-body">
          <span class="tag">${esc(r.cat)}</span>
          <h3>${esc(r.title)}</h3>
          <p>${esc(r.text)}</p>
          <div class="card-foot">
            <span>${esc(r.time)} · ${esc(r.source)}</span>
            <span class="go">${r.type === "Video" ? "Watch" : "Read guide"} ${ARROW}</span>
          </div>
        </div>
      </a>`).join("");
    emptyEl.hidden = items.length > 0;
  }

  chips.forEach(chip => chip.addEventListener("click", () => {
    chips.forEach(c => { c.classList.remove("is-on"); c.setAttribute("aria-pressed", "false"); });
    chip.classList.add("is-on");
    chip.setAttribute("aria-pressed", "true");
    render(chip.dataset.filter);
  }));

  // Mobile menu is CSS-only (checkbox in the header), no JS needed.

  render("all");
})();

/* ----------------------------------------------------------
   6. SERVICES - search box + service pages (services pages)
   ---------------------------------------------------------- */
/* Services pages.
   - services.html: search box that filters the service cards, and
     whole-card click to open the service.
   - Service detail pages: the "Book an Appointment" button passes the
     service name so the appointment form preselects "Reason for Visit". */
(function () {
  'use strict';

  var APPT_URL = '/Patient/appointment.html';

  /* ---------- Detail pages ---------- */
  var title = document.querySelector('.detail-card h2');
  var bookBtn = document.querySelector('.detail-actions .btn-book');
  if (title && bookBtn) {
    bookBtn.href = APPT_URL + '?service=' + encodeURIComponent(title.textContent.trim());
  }

  /* ---------- Services list ---------- */
  var cards = Array.prototype.slice.call(document.querySelectorAll('.service-card'));
  if (!cards.length) return;

  var input = document.getElementById('service-search');
  var empty = document.getElementById('service-empty');

  // Make the whole card clickable (the "Learn more" link still works for keyboards)
  cards.forEach(function (card) {
    var link = card.querySelector('a.learn-more');
    if (!link) return;
    card.classList.add('is-clickable');
    card.addEventListener('click', function (e) {
      if (e.target.closest('a')) return;                 // normal link click
      if (window.getSelection && String(window.getSelection())) return; // user is selecting text
      window.location.href = link.href;
    });
  });

  if (!input) return;

  function textOf(card) {
    return (card.textContent + ' ' + (card.getAttribute('data-keywords') || '')).toLowerCase();
  }

  function filter() {
    var q = input.value.trim().toLowerCase();
    var words = q ? q.split(/\s+/) : [];
    var shown = 0;

    cards.forEach(function (card) {
      var hay = textOf(card);
      var match = words.every(function (w) { return hay.indexOf(w) !== -1; });
      card.hidden = !match;
      if (match) shown++;
    });

    if (shown === 0) {
      empty.textContent = 'No services match "' + input.value.trim() + '". Try another word, or call us and we will help.';
      empty.hidden = false;
    } else {
      empty.textContent = '';
      empty.hidden = true;
    }
  }

  input.addEventListener('input', filter);
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { input.value = ''; filter(); }
  });
})();
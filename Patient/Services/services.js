/* Services pages.
   - services.html: search box that filters the service cards, and
     whole-card click to open the service.
   - Service detail pages: the "Book an Appointment" button passes the
     service name so the appointment form preselects "Reason for Visit". */
(function () {
  'use strict';

  var APPT_URL = '/Patient/Appointment%20Booking/appointment.html';

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

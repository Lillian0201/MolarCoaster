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
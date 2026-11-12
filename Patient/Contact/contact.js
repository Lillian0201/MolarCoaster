/* Contact page: inline validation and fetch submit with status messages. */
(function () {
  'use strict';

  var API = '/Patient/api/send_message.php';
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

  function clearError(input) {
    input.classList.remove('has-error');
    input.removeAttribute('aria-invalid');
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

    submitBtn.disabled = true;
    submitBtn.setAttribute('aria-busy', 'true');
    var original = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';

    fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(function (r) {
        return r.json().catch(function () { return {}; }).then(function (data) { return { ok: r.ok, data: data }; });
      })
      .then(function (res) {
        if (res.ok && res.data.success) {
          form.reset();
          setStatus('Thank you! Your message was sent. We will get back to you soon.', 'success');
        } else {
          setStatus(res.data.message || 'Something went wrong. Please try again or call us.', 'error');
        }
      })
      .catch(function () {
        setStatus('Could not reach the server. Check your connection and try again.', 'error');
      })
      .then(function () {
        submitBtn.disabled = false;
        submitBtn.removeAttribute('aria-busy');
        submitBtn.textContent = original;
      });
  });
})();
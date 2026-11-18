/* Shared header and footer for all MolarCoaster pages.
   Usage:
   <body data-page="home">
   <header id="site-header" class="site-header"></header>
   <footer id="site-footer" class="site-footer"></footer>
   <script src="/Patient/js/layout.js" defer></script>
*/

(function () {
  'use strict';

  var NAV = [
    { key: 'home', label: 'Home', href: '/Patient/Home%20Page/home.html' },
    { key: 'appointments', label: 'Appointments', href: '/Patient/Appointment%20Booking/appointment.html' },
    { key: 'about', label: 'About Us', href: '/Patient/About/about.html' },
    { key: 'services', label: 'Services', href: '/Patient/Services/services.html' },
    { key: 'resources', label: 'Resources', href: '/Patient/Resources/resources.html' },
    { key: 'contact', label: 'Contact Us', href: '/Patient/Contact/contact.html' }
  ];

  var page = document.body.getAttribute('data-page') || 'home';

  // Allow either appointment or appointments.
  if (page === 'appointment') {
    page = 'appointments';
  }

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
      '<a href="/Patient/Home%20Page/home.html" class="logo" aria-label="MolarCoaster Dental Clinic home">' +
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
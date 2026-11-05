/* Shared header and footer for all MolarCoaster pages.
   Usage:
   <body data-page="home">
   <header id="site-header" class="site-header"></header>
   ...
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
    { key: 'contact', label: 'Contact Us', href: '/Patient/Contact/contact.html' }
  ];

  var page = document.body.getAttribute('data-page') || 'home';

  // Allow either "appointment" or "appointments" as the page identifier.
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
      '<a href="/Patient/home.html" class="logo" aria-label="MolarCoaster Dental Clinic Home">' +
        '<span class="logo-text">' +
          '<span class="brand">MolarCoaster</span>' +
          '<span class="sub">DENTAL CLINIC</span>' +
        '</span>' +
      '</a>' +

      '<input type="checkbox" id="menu-check" class="menu-check" aria-label="Toggle navigation">' +

      '<label for="menu-check" class="menu-toggle" aria-label="Toggle navigation"></label>' +

      '<nav class="main-nav" id="main-nav" aria-label="Main navigation">' +
        '<ul>' + navLinks + '</ul>' +
      '</nav>';
  }

  /* ---------- Shared Footer ---------- */
  if (footer) {
    footer.innerHTML =
      '<div class="footer-content">' +
        '<div class="footer-brand">' +
          '<span class="brand">MolarCoaster</span>' +
          '<span class="sub">DENTAL CLINIC</span>' +
          '<p>Your smile, our priority.</p>' +
        '</div>' +

        '<div class="footer-links">' +
          '<h3>Quick Links</h3>' +
          '<ul>' +
            NAV.map(function (item) {
              return '<li><a href="' + item.href + '">' + item.label + '</a></li>';
            }).join('') +
          '</ul>' +
        '</div>' +
      '</div>' +

      '<div class="footer-bottom">' +
        '<p>&copy; ' + new Date().getFullYear() +
        ' MolarCoaster Dental Clinic. All rights reserved.</p>' +
      '</div>';
  }

})();
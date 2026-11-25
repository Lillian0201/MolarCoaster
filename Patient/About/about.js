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
    open(i === 0); // first question starts open
    btn.addEventListener('click', function () {
      open(btn.getAttribute('aria-expanded') !== 'true');
    });
  });
})();
// Brux Barbershop — enhanced with animations

/* =====================================================================
   1. PAGE TRANSITION OVERLAY
   Fades the page out on link click, fades back in on load.
   ===================================================================== */
(function () {
  var overlay = document.createElement('div');
  overlay.id = 'page-overlay';
  document.body.appendChild(overlay);

  // Fade IN: start opaque, then remove class so CSS transitions to transparent
  overlay.classList.add('is-leaving');
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      overlay.classList.remove('is-leaving');
    });
  });

  // Fade OUT before navigating to internal pages
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a');
    if (!link) return;
    var href = link.getAttribute('href');
    if (!href) return;
    var isInternal = !link.target &&
                     !href.startsWith('http') &&
                     !href.startsWith('mailto') &&
                     !href.startsWith('tel') &&
                     !href.startsWith('#') &&
                     (href.endsWith('.html') || href === '/' || href === '');
    if (!isInternal) return;
    e.preventDefault();
    overlay.classList.add('is-leaving');
    setTimeout(function () { window.location.href = href; }, 320);
  });
})();

/* =====================================================================
   2. SCROLL-REVEAL (Intersection Observer)
   Tags key elements with .reveal, fires .is-visible when they enter
   the viewport — triggering the CSS fade-up transition.
   ===================================================================== */
(function () {
  var selectors = [
    '.page-hero h1', '.page-hero p', '.page-hero .eyebrow',
    '.hero-content h1', '.hero-content h2', '.hero-content p',
    '.hero-content .hero-actions', '.hero-content .eyebrow',
    'section.section > .wrap > h2',
    'section.section > .wrap > p',
    '.artist-card', '.testimonial', '.feature-badge',
    '.style-card', '.accordion-item',
    '.form-card', '.info-list', '.contact-actions',
    '.map-embed', '.footer-brand', '.footer-col',
    '.shot'
  ];

  selectors.forEach(function (sel) {
    document.querySelectorAll(sel).forEach(function (el) {
      if (!el.classList.contains('reveal')) el.classList.add('reveal');
    });
  });

  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('is-visible'); });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(function (el) { observer.observe(el); });
})();

/* =====================================================================
   3. SHARED SITE BEHAVIOUR
   ===================================================================== */
document.addEventListener('DOMContentLoaded', function () {

  // Mobile nav toggle (CSS-animated via max-height)
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.primary-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.classList.toggle('is-open', open);
    });
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('is-open');
        toggle.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // FAQ accordion
  document.querySelectorAll('.accordion-item').forEach(function (item) {
    var trigger = item.querySelector('.accordion-trigger');
    var panel   = item.querySelector('.accordion-panel');
    if (!trigger || !panel) return;
    trigger.addEventListener('click', function () {
      var isOpen = item.classList.contains('is-open');
      item.parentElement.querySelectorAll('.accordion-item.is-open').forEach(function (other) {
        if (other !== item) {
          other.classList.remove('is-open');
          other.querySelector('.accordion-panel').style.maxHeight = null;
          other.querySelector('.accordion-trigger').setAttribute('aria-expanded', 'false');
        }
      });
      if (isOpen) {
        item.classList.remove('is-open');
        panel.style.maxHeight = null;
        trigger.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('is-open');
        panel.style.maxHeight = panel.scrollHeight + 'px';
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });


  // Contact forms → mailto
  document.querySelectorAll('form[data-mailto]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var to   = form.getAttribute('data-mailto');
      var data = new FormData(form);
      var lines = [];
      data.forEach(function (value, key) { if (value) lines.push(key + ': ' + value); });
      var subject = encodeURIComponent('New enquiry from Brux Barbershop');
      var body    = encodeURIComponent(lines.join('\n'));
      window.location.href = 'mailto:' + to + '?subject=' + subject + '&body=' + body;
      var status = form.querySelector('.form-status');
      if (status) {
        status.textContent = 'Opening your email app — thank you!';
        status.classList.add('is-visible');
      }
    });
  });

  // Footer year
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  // Header shadow on scroll
  var header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', function () {
      header.style.boxShadow = window.scrollY > 20
        ? '0 2px 20px rgba(28,25,23,0.10)'
        : '';
    }, { passive: true });
  }

});
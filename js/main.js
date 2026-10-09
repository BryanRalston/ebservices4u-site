/* EBServices site behavior. Business facts come from js/config.js */
(function () {
  'use strict';
  var C = window.SITE_CONFIG || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. Fill business facts from config ---------- */
  var has = {
    phone: !!(C.phoneDisplay && C.phoneTel),
    serviceArea: !!C.serviceArea,
    hours: !!C.hours,
    freeEstimates: C.freeEstimates === true,
    licensedInsured: C.licensed === true && C.insured === true
  };
  $$('[data-requires]').forEach(function (el) {
    if (has[el.getAttribute('data-requires')]) el.hidden = false; else el.hidden = true;
  });
  // Drop unconfirmed trust items so the grid lays out cleanly
  $$('.trust-item[hidden]').forEach(function (el) { el.parentNode.removeChild(el); });
  if (has.phone) {
    $$('[data-phone]').forEach(function (el) { el.textContent = C.phoneDisplay; });
    $$('[data-phone-link]').forEach(function (el) { el.href = 'tel:' + C.phoneTel; });
    $$('[data-call-label]').forEach(function (el) { el.textContent = 'Call Now'; });
  } else {
    // No phone yet: call buttons fall back to the estimate form
    $$('[data-phone-link]').forEach(function (el) { el.href = '#estimate'; });
  }
  if (C.email) {
    $$('[data-email]').forEach(function (el) { el.textContent = C.email; });
    $$('[data-email-link]').forEach(function (el) { el.href = 'mailto:' + C.email; });
    var form0 = $('#estimate-form');
    if (form0) form0.action = 'https://formsubmit.co/' + C.email;
  }
  $$('[data-service-area]').forEach(function (el) { el.textContent = C.serviceArea || ''; });
  $$('[data-hours]').forEach(function (el) { el.textContent = C.hours || ''; });
  $$('[data-founded]').forEach(function (el) { if (C.foundedYear) el.textContent = C.foundedYear; });
  $$('[data-legal-name]').forEach(function (el) { if (C.legalName) el.textContent = C.legalName; });
  $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
  if (C.licenseNumber) {
    $$('[data-license]').forEach(function (el) { el.textContent = C.licenseNumber; });
    $$('[data-license-sentence]').forEach(function (el) { el.textContent = ' (' + C.licenseNumber + ')'; });
  }
  var social = C.social || {};
  $$('[data-social]').forEach(function (el) {
    var url = social[el.getAttribute('data-social')];
    if (url) { el.href = url; el.hidden = false; } else { el.hidden = true; }
  });
  $$('[data-social-item]').forEach(function (el) {
    var url = social[el.getAttribute('data-social-item')];
    el.hidden = !url;
    if (url) { var a = el.querySelector('a'); if (a) a.textContent = '@' + url.replace(/\/+$/, '').split('/').pop(); }
  });

  /* Structured data: add confirmed facts from config */
  try {
    var ld = $('#ld-business');
    if (ld) {
      var data = JSON.parse(ld.textContent);
      if (has.phone) data.telephone = C.phoneTel;
      if (C.townsServed && C.townsServed.length) data.areaServed = C.townsServed.map(function (t) { return { '@type': 'City', name: t }; });
      var a = C.address || {}, addr = { '@type': 'PostalAddress' };
      Object.keys(a).forEach(function (k) { if (a[k]) addr[k] = a[k]; });
      if (a.addressLocality) data.address = addr;
      var same = [social.instagram, social.facebook, social.google].filter(Boolean);
      if (same.length) data.sameAs = same;
      ld.textContent = JSON.stringify(data);
    }
  } catch (e) { /* keep static JSON-LD */ }

  /* ---------- 2. Header: shrink on scroll + active section ---------- */
  var header = $('#site-header');
  var ticking = false;
  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        header.classList.toggle('is-scrolled', window.scrollY > 24);
        ticking = false;
      });
      ticking = true;
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  var navLinks = $$('.main-nav ul a');
  if ('IntersectionObserver' in window) {
    var secObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var link = navLinks.filter(function (l) { return l.getAttribute('href') === '#' + en.target.id; })[0];
        if (en.isIntersecting) {
          navLinks.forEach(function (l) { l.classList.toggle('is-active', l === link); });
        } else if (link) { link.classList.remove('is-active'); }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    navLinks.forEach(function (l) { var s = $(l.getAttribute('href')); if (s) secObs.observe(s); });
  }

  /* ---------- 3. Accessible mobile menu ---------- */
  var toggle = $('.menu-toggle'), nav = $('#main-nav');
  function setMenu(open) {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    nav.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
    if (open) { var first = nav.querySelector('a'); if (first) first.focus(); }
  }
  if (toggle && nav) {
    toggle.addEventListener('click', function () { setMenu(toggle.getAttribute('aria-expanded') !== 'true'); });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) {
      if (!nav.classList.contains('is-open')) return;
      if (e.key === 'Escape') { setMenu(false); toggle.focus(); }
      if (e.key === 'Tab') { // keep focus inside the open menu + toggle
        var f = [toggle].concat($$('a, button', nav).filter(function (x) { return x.offsetParent !== null; }));
        var i = f.indexOf(document.activeElement);
        if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
      }
    });
    window.matchMedia('(min-width: 961px)').addEventListener('change', function (m) { if (m.matches) setMenu(false); });
  }

  /* ---------- 4. Scroll reveal ---------- */
  var reveals = $$('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var rObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-visible'); rObs.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(function (el) { rObs.observe(el); });
  }

  /* ---------- 5. Lightbox gallery ---------- */
  var lb = $('#lightbox');
  var items = $$('[data-gallery]').sort(function (a, b) { return a.dataset.index - b.dataset.index; });
  var cur = 0, lastFocus = null;
  var lbImg = $('.lb-img', lb), lbTitle = $('.lb-title', lb), lbCount = $('.lb-count', lb);
  function show(i) {
    cur = (i + items.length) % items.length;
    var it = items[cur];
    lbImg.src = it.dataset.full; lbImg.alt = it.dataset.alt || '';
    lbTitle.textContent = it.dataset.title || '';
    lbCount.textContent = (cur + 1) + ' / ' + items.length;
    // preload neighbour
    var n = new Image(); n.src = items[(cur + 1) % items.length].dataset.full;
  }
  function openLb(i) {
    lastFocus = document.activeElement;
    show(i);
    if (typeof lb.showModal === 'function') lb.showModal(); else lb.setAttribute('open', '');
    document.body.classList.add('lb-open');
    $('.lb-close', lb).focus();
  }
  function closeLb() {
    if (lb.open && typeof lb.close === 'function') lb.close(); else lb.removeAttribute('open');
  }
  if (lb && items.length) {
    items.forEach(function (it) { it.addEventListener('click', function () { openLb(+it.dataset.index); }); });
    $$('[data-open-gallery]').forEach(function (b) { b.addEventListener('click', function () { openLb(0); }); });
    $('.lb-prev', lb).addEventListener('click', function () { show(cur - 1); });
    $('.lb-next', lb).addEventListener('click', function () { show(cur + 1); });
    $('.lb-close', lb).addEventListener('click', closeLb);
    lb.addEventListener('close', function () { document.body.classList.remove('lb-open'); if (lastFocus) lastFocus.focus(); });
    lb.addEventListener('click', function (e) { if (e.target === lb || e.target.classList.contains('lb-inner')) closeLb(); });
    lb.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') show(cur - 1);
      if (e.key === 'ArrowRight') show(cur + 1);
    });
    var sx = null;
    lb.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', function (e) {
      if (sx === null) return; var dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 50) show(cur + (dx < 0 ? 1 : -1)); sx = null;
    });
  }

  /* ---------- 6. Estimate form ---------- */
  var form = $('#estimate-form'), ty = $('#thank-you');
  if (!form) return;
  // "Request an estimate" links on service cards preselect the service
  $$('[data-service]').forEach(function (a) {
    a.addEventListener('click', function () {
      var r = form.querySelector('input[name="service"][data-val="' + a.dataset.service + '"]');
      if (r) { r.checked = true; clearErr('service'); }
    });
  });
  function setErr(name, msg) {
    var p = $('#err-' + name); if (p) p.textContent = msg;
    var input = name === 'service' ? null : form.elements[name];
    if (input) input.setAttribute('aria-invalid', msg ? 'true' : 'false');
  }
  function clearErr(name) { setErr(name, ''); }
  function validate() {
    var ok = true, firstBad = null;
    var f = form.elements;
    function bad(name, msg, el) { setErr(name, msg); ok = false; if (!firstBad) firstBad = el; }
    ['service', 'name', 'phone', 'email', 'zip', 'message'].forEach(clearErr);
    if (!form.querySelector('input[name="service"]:checked')) bad('service', 'Please choose the type of work.', form.querySelector('input[name="service"]'));
    if (!f.name.value.trim()) bad('name', 'Please enter your name.', f.name);
    var phone = f.phone.value.trim(), email = f.email.value.trim();
    var digits = phone.replace(/\D/g, '');
    if (!phone && !email) {
      bad('phone', 'Add a phone number or an email so we can reply.', f.phone);
    }
    if (phone && (digits.length < 10 || digits.length > 11)) bad('phone', 'Please enter a 10-digit phone number.', f.phone);
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) bad('email', 'Please enter a valid email address.', f.email);
    var zip = f.zip.value.trim();
    if (zip && !/^\d{5}(-\d{4})?$/.test(zip)) bad('zip', 'Please enter a 5-digit zip code.', f.zip);
    if (f.message.value.trim().length < 10) bad('message', 'Please add a few words about the project.', f.message);
    if (firstBad) { firstBad.scrollIntoView({ block: 'center', behavior: reduceMotion ? 'auto' : 'smooth' }); firstBad.focus({ preventScroll: true }); }
    return ok;
  }
  ['name', 'phone', 'email', 'zip', 'message'].forEach(function (n) {
    form.elements[n].addEventListener('input', function () { if (this.getAttribute('aria-invalid') === 'true') clearErr(n); });
  });
  form.addEventListener('change', function (e) { if (e.target.name === 'service') clearErr('service'); });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var status = $('.form-status', form); status.textContent = '';
    if (!validate()) return;
    if (form.elements._honey.value) return; // bot
    var btn = $('.submit-btn', form);
    btn.disabled = true; btn.classList.add('is-loading'); $('.btn-label', btn).textContent = 'Sending…';
    var payload = {};
    new FormData(form).forEach(function (v, k) { payload[k] = v; });
    if (payload.email) payload._replyto = payload.email;
    var endpoint = 'https://formsubmit.co/ajax/' + (C.email || 'Ebservices4U@outlook.com');
    fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(payload) })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { if (!r.ok || j.success === 'false' || j.success === false) throw new Error(j.message || 'Send failed'); return j; }); })
      .then(function () {
        var first = (payload.name || '').trim().split(/\s+/)[0];
        $('[data-ty-name]', ty).textContent = first ? ', ' + first : '';
        form.hidden = true; ty.hidden = false; ty.focus();
      })
      .catch(function () {
        var body = encodeURIComponent('Service: ' + (payload.service || '') + '\nName: ' + payload.name + '\nPhone: ' + (payload.phone || '') + '\nEmail: ' + (payload.email || '') + '\nZip: ' + (payload.zip || '') + '\nTimeline: ' + (payload.timeline || '') + '\n\n' + payload.message);
        status.innerHTML = 'Sorry, the form could not be sent right now. <a href="mailto:' + (C.email || '') + '?subject=' + encodeURIComponent('Estimate request') + '&body=' + body + '">Email your request instead</a>.';
      })
      .then(function () { btn.disabled = false; btn.classList.remove('is-loading'); $('.btn-label', btn).textContent = 'Request My Estimate'; });
  });
  $$('[data-reset-form]').forEach(function (b) {
    b.addEventListener('click', function () { form.reset(); ty.hidden = true; form.hidden = false; form.elements.name.focus(); });
  });
})();

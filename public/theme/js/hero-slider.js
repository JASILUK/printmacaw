(function () {
    'use strict';
  
    function initSlider(root) {
      var slides = [].slice.call(root.querySelectorAll('[data-pm-slide]'));
      var dots = [].slice.call(root.querySelectorAll('[data-pm-dot]'));
      var track = root.querySelector('[data-pm-slides]');
      var counter = root.querySelector('[data-pm-current]');
      var total = slides.length;
      if (total < 2) return;
  
      var interval = parseInt(root.getAttribute('data-pm-interval'), 10) || 6000;
      root.style.setProperty('--pm-hero-interval', interval + 'ms');
  
      var current = 0;
      var state = { hover: false, focus: false, hidden: false };
      var timer = null;
      var startedAt = 0;
      var remaining = interval;
  
      function pad(n) { return n < 10 ? '0' + n : '' + n; }
      function isPaused() { return state.hover || state.focus || state.hidden; }
  
      /* ---------- Autoplay timer (pause keeps the remaining time) ---------- */
      function start() {
        if (timer || isPaused()) return;
        startedAt = Date.now();
        timer = setTimeout(function () {
          timer = null;
          goTo(current + 1);
        }, remaining);
      }
  
      function stop() {
        if (!timer) return;
        clearTimeout(timer);
        timer = null;
        remaining -= Date.now() - startedAt;
        if (remaining < 60) remaining = 60;
      }
  
      function setState(key, value) {
        state[key] = value;
        root.setAttribute('data-' + key, value ? 'true' : 'false');
        if (isPaused()) stop(); else start();
      }
  
      /* ---------- Change slide ---------- */
      function goTo(index) {
        index = (index + total) % total;
        if (index === current) return;
  
        stop();
  
        var prevSlide = slides[current];
        prevSlide.classList.add('is-leaving');
        setTimeout(function () { prevSlide.classList.remove('is-leaving'); }, 700);
  
        slides.forEach(function (slide, i) {
          var active = i === index;
          slide.classList.toggle('is-active', active);
          slide.setAttribute('aria-hidden', active ? 'false' : 'true');
          if (active) slide.removeAttribute('inert');
          else slide.setAttribute('inert', '');
          if (active) slide.classList.remove('is-leaving');
        });
  
        dots.forEach(function (dot, i) {
          var active = i === index;
          dot.classList.toggle('is-active', active);
          dot.setAttribute('aria-current', active ? 'true' : 'false');
        });
  
        current = index;
        if (counter) counter.textContent = pad(index + 1);
  
        remaining = interval;
        start();
      }
  
      /* ---------- Arrows & dots ---------- */
      var next = root.querySelector('[data-pm-next]');
      var prev = root.querySelector('[data-pm-prev]');
      if (next) next.addEventListener('click', function () { goTo(current + 1); });
      if (prev) prev.addEventListener('click', function () { goTo(current - 1); });
  
      dots.forEach(function (dot) {
        dot.addEventListener('click', function () {
          goTo(parseInt(dot.getAttribute('data-pm-dot'), 10));
        });
      });
  
      /* ---------- Hover / focus / hidden tab ---------- */
      root.addEventListener('pointerenter', function (e) {
        if (e.pointerType === 'mouse') setState('hover', true);
      });
      root.addEventListener('pointerleave', function () { setState('hover', false); });
  
      root.addEventListener('focusin', function (e) {
        if (e.target.matches && e.target.matches(':focus-visible')) setState('focus', true);
      });
      root.addEventListener('focusout', function (e) {
        if (!root.contains(e.relatedTarget)) setState('focus', false);
      });
  
      document.addEventListener('visibilitychange', function () {
        setState('hidden', document.hidden);
      });
  
      /* ---------- Keyboard ---------- */
      root.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight') goTo(current + 1);
        else if (e.key === 'ArrowLeft') goTo(current - 1);
      });
  
      /* ---------- Swipe (touch) ---------- */
      var startX = 0, startY = 0, tracking = false;
      root.addEventListener('touchstart', function (e) {
        if (e.touches.length !== 1) return;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        tracking = true;
      }, { passive: true });
      root.addEventListener('touchend', function (e) {
        if (!tracking) return;
        tracking = false;
        var dx = e.changedTouches[0].clientX - startX;
        var dy = e.changedTouches[0].clientY - startY;
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
          goTo(dx < 0 ? current + 1 : current - 1);
        }
      }, { passive: true });
  
      if (track) track.setAttribute('aria-live', 'off');
  
      /* go! */
      start();
    }
  
    function boot() {
      [].forEach.call(document.querySelectorAll('[data-pm-slider]'), initSlider);
    }
  
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
    else boot();
  })();
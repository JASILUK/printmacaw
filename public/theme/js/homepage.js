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
        root.setAttribute('data-changed', 'true');
        prevSlide.classList.add('is-leaving');
        clearTimeout(prevSlide._pmLeave);
        prevSlide._pmLeave = setTimeout(function () {
          prevSlide.classList.remove('is-leaving');
        }, 1000);
  
        slides.forEach(function (slide, i) {
          var active = i === index;
          slide.classList.toggle('is-active', active);
          slide.setAttribute('aria-hidden', active ? 'false' : 'true');
          if (active) {
            slide.removeAttribute('inert');
            slide.classList.remove('is-leaving');
            clearTimeout(slide._pmLeave);
          } else {
            slide.setAttribute('inert', '');
          }
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




 /* =========================================================
   PRINT MACAW — CATEGORY SCROLL REVEAL
   Step-by-step: empty -> blur/opacity -> up into place
========================================================= */

(() => {
    'use strict';

    const initCategoryReveal = () => {
        const section = document.querySelector('.pm-categories');

        if (!section) {
            return;
        }

        const cards = section.querySelectorAll('.pm-category-card');

        if (!cards.length) {
            return;
        }

        if (
            window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
            !('IntersectionObserver' in window)
        ) {
            cards.forEach((card) => card.classList.add('pm-is-visible'));
            return;
        }

        const OFFSET = 48;   // px travel distance
        const STAGGER = 140; // ms gap between cards (step by step)
        const MAX_STEPS = 8; // cap so long batches don't wait too long

        section.classList.add('pm-categories--reveal-ready');

        const observer = new IntersectionObserver(
            (entries) => {
                // Reveal in DOM order so it feels sequential.
                const entering = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort((a, b) =>
                        a.target.compareDocumentPosition(b.target) &
                        Node.DOCUMENT_POSITION_FOLLOWING
                            ? -1
                            : 1
                    );

                entering.forEach((entry, i) => {
                    const card = entry.target;

                    card.style.setProperty(
                        '--pm-reveal-delay',
                        `${Math.min(i, MAX_STEPS) * STAGGER}ms`
                    );
                    card.classList.add('pm-is-visible');
                });

                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        return;
                    }

                    const card = entry.target;
                    const exitedAbove = entry.boundingClientRect.top < 0;

                    card.style.setProperty(
                        '--pm-reveal-y',
                        `${exitedAbove ? -OFFSET : OFFSET}px`
                    );
                    card.style.setProperty('--pm-reveal-delay', '0ms');
                    card.classList.remove('pm-is-visible');
                });
            },
            {
                root: null,
                rootMargin: '0px 0px -80px 0px',
                threshold: 0.12
            }
        );

        cards.forEach((card) => observer.observe(card));
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCategoryReveal, {
            once: true
        });
    } else {
        initCategoryReveal();
    }
})();


(function () {
	'use strict';
	var INTERVAL = 1000;      // time between automatic steps (ms)
	var DURATION = 450;       // how long one step glide takes (ms)
	var RESUME_DELAY = 3000;  // pause after manual interaction (ms)
	var DRAG_THRESHOLD = 6;

	var motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

	function easeInOut(t) {
		return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
	}

	function createRow(track) {
		var originals = Array.prototype.slice.call(track.children);
		var count = originals.length;

		if (!count) {
			return null;
		}

		var direction = parseInt(track.getAttribute('data-pm-direction'), 10) === -1 ? -1 : 1;
		var startDelay = parseInt(track.getAttribute('data-pm-delay'), 10) || 0;

		var state = {
			hovering: false,
			focused: false,
			dragging: false,
			touching: false,
			inViewport: true,
			tabVisible: !document.hidden,
			reducedMotion: motionQuery.matches,
			pausedUntil: 0,
			startX: 0,
			startScroll: 0,
			hasDragged: false,
			suppressClick: false
		};

		var step = 0;       // one card + gap
		var setW = 0;       // width of one full set of cards
		var lastWidth = 0;
		var anim = null;
		var raf = null;
		var idleTimer = null;
		var clickTimer = null;
		var autoTimer = null;
		var delayTimer = null;
		var resizeTimer = null;

		/* ---------- Infinite loop: 3 sets, we live in the middle ---------- */

		function makeClone(node) {
			var clone = node.cloneNode(true);
			clone.setAttribute('data-pm-clone', '');
			clone.setAttribute('aria-hidden', 'true');

			var focusables = clone.querySelectorAll('a, button');
			for (var i = 0; i < focusables.length; i++) {
				focusables[i].setAttribute('tabindex', '-1');
			}

			return clone;
		}

		function clearClones() {
			var clones = track.querySelectorAll('[data-pm-clone]');
			for (var i = 0; i < clones.length; i++) {
				clones[i].parentNode.removeChild(clones[i]);
			}
		}

		function measureStep() {
			var gap = parseFloat(getComputedStyle(track).columnGap) || 0;
			return originals[0].getBoundingClientRect().width + gap;
		}

		function build() {
			clearClones();

			var vw = track.clientWidth;
			lastWidth = vw;

			if (!vw) {
				setW = 0;
				return;
			}

			var firstStep = measureStep();
			var reps = Math.max(1, Math.ceil((vw * 2) / (count * firstStep)));
			var i, r;

			// Repeat the cards so one set is always wider than the viewport.
			for (r = 1; r < reps; r++) {
				for (i = 0; i < count; i++) {
					track.appendChild(makeClone(originals[i]));
				}
			}

			var setNodes = Array.prototype.slice.call(track.children);
			var before = document.createDocumentFragment();
			var after = document.createDocumentFragment();

			setNodes.forEach(function (node) {
				before.appendChild(makeClone(node));
				after.appendChild(makeClone(node));
			});

			track.insertBefore(before, track.firstChild);
			track.appendChild(after);

			var kids = track.children;
			var firstLeft = kids[0].getBoundingClientRect().left;

			step = kids[1].getBoundingClientRect().left - firstLeft;
			setW = kids[setNodes.length].getBoundingClientRect().left - firstLeft;

			if (step <= 0) {
				step = firstStep;
			}

			track.scrollLeft = setW;
		}

		// Keep scrollLeft inside the middle set. Returns the shift applied.
		function normalize() {
			if (!setW) {
				return 0;
			}

			var x = track.scrollLeft;
			var k = Math.floor((x - setW) / setW);

			if (!k) {
				return 0;
			}

			var shift = -k * setW;
			track.scrollLeft = x + shift;
			return shift;
		}

		/* ---------- Animation ---------- */

		function cancelAnim() {
			if (raf !== null) {
				window.cancelAnimationFrame(raf);
				raf = null;
			}
			anim = null;
			track.classList.remove('pm-is-animating');
		}

		function tick(now) {
			if (!anim) {
				return;
			}

			var t = Math.min(1, (now - anim.start) / anim.dur);
			track.scrollLeft = anim.from + (anim.to - anim.from) * easeInOut(t);

			var shift = normalize();
			if (shift) {
				anim.from += shift;
				anim.to += shift;
			}

			if (t < 1) {
				raf = window.requestAnimationFrame(tick);
			} else {
				raf = null;
				anim = null;
				track.classList.remove('pm-is-animating');
			}
		}

		function animateTo(target, duration) {
			cancelAnim();

			if (state.reducedMotion || Math.abs(target - track.scrollLeft) < 1) {
				track.scrollLeft = target;
				normalize();
				return;
			}

			track.classList.add('pm-is-animating');
			anim = {
				from: track.scrollLeft,
				to: target,
				start: performance.now(),
				dur: duration
			};
			raf = window.requestAnimationFrame(tick);
		}

		function goBy(dir) {
			if (!setW || !step) {
				return;
			}

			var from = anim ? anim.to : Math.round(track.scrollLeft / step) * step;
			animateTo(from + dir * step, DURATION);
		}

		/* ---------- Auto scroll ---------- */

		function pause() {
			state.pausedUntil = Date.now() + RESUME_DELAY;
		}

		function canAutoScroll() {
			return !state.hovering && !state.focused && !state.dragging &&
				!state.touching && state.inViewport && state.tabVisible &&
				!state.reducedMotion && Date.now() >= state.pausedUntil;
		}

		function autoStep() {
			if (canAutoScroll()) {
				goBy(direction);
			}
		}

		function startAuto() {
			window.clearTimeout(delayTimer);
			window.clearInterval(autoTimer);

			delayTimer = window.setTimeout(function () {
				autoTimer = window.setInterval(autoStep, INTERVAL);
			}, startDelay);
		}

		function stopAuto() {
			window.clearTimeout(delayTimer);
			window.clearInterval(autoTimer);
			cancelAnim();
		}

		/* ---------- Events ---------- */

		// After manual scrolling stops, quietly jump back to the middle set.
		track.addEventListener('scroll', function () {
			if (anim || state.dragging) {
				return;
			}

			window.clearTimeout(idleTimer);
			idleTimer = window.setTimeout(function () {
				if (!state.touching && !anim && !state.dragging) {
					normalize();
				}
			}, 140);
		}, { passive: true });

		// Hover pause (mouse only, so touch devices never get stuck).
		track.addEventListener('pointerenter', function (event) {
			if (event.pointerType === 'mouse') {
				state.hovering = true;
			}
		});

		track.addEventListener('pointerleave', function (event) {
			if (event.pointerType === 'mouse') {
				state.hovering = false;
			}
		});

		// Keyboard focus pause (mouse clicks do not count).
		track.addEventListener('focusin', function (event) {
			try {
				state.focused = event.target.matches(':focus-visible');
			} catch (error) {
				state.focused = true;
			}
		});

		track.addEventListener('focusout', function () {
			window.requestAnimationFrame(function () {
				state.focused = track.contains(document.activeElement) &&
					document.activeElement.matches(':focus-visible');
			});
		});

		track.addEventListener('keydown', function (event) {
			if (event.target !== track) {
				return;
			}

			if (event.key === 'ArrowRight') {
				event.preventDefault();
				pause();
				goBy(1);
			} else if (event.key === 'ArrowLeft') {
				event.preventDefault();
				pause();
				goBy(-1);
			}
		});

		// Touch: native swipe, auto-scroll steps aside.
		track.addEventListener('touchstart', function () {
			state.touching = true;
			pause();
			cancelAnim();
		}, { passive: true });

		function touchDone() {
			state.touching = false;
			pause();
		}

		track.addEventListener('touchend', touchDone, { passive: true });
		track.addEventListener('touchcancel', touchDone, { passive: true });

		// Horizontal wheel / trackpad.
		track.addEventListener('wheel', function (event) {
			if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
				pause();
				cancelAnim();
			}
		}, { passive: true });

		// Mouse drag.
		track.addEventListener('pointerdown', function (event) {
			if (event.pointerType !== 'mouse' || event.button !== 0) {
				return;
			}

			cancelAnim();
			state.dragging = true;
			state.hasDragged = false;
			state.startX = event.clientX;
			state.startScroll = track.scrollLeft;
			pause();
		});

		track.addEventListener('pointermove', function (event) {
			if (!state.dragging) {
				return;
			}

			var distance = event.clientX - state.startX;

			if (!state.hasDragged && Math.abs(distance) > DRAG_THRESHOLD) {
				state.hasDragged = true;
				track.classList.add('pm-is-dragging');
				try { track.setPointerCapture(event.pointerId); } catch (e) {}
			}

			if (state.hasDragged) {
				track.scrollLeft = state.startScroll - distance;
				var shift = normalize();
				if (shift) {
					state.startScroll += shift;
				}
			}
		});

		function endDrag() {
			if (!state.dragging) {
				return;
			}

			state.dragging = false;
			track.classList.remove('pm-is-dragging');
			pause();

			if (state.hasDragged) {
				state.hasDragged = false;
				state.suppressClick = true;

				window.clearTimeout(clickTimer);
				clickTimer = window.setTimeout(function () {
					state.suppressClick = false;
				}, 250);

				// Settle neatly on the nearest card.
				if (step) {
					animateTo(Math.round(track.scrollLeft / step) * step, 450);
				}
			}
		}

		track.addEventListener('pointerup', endDrag);
		track.addEventListener('pointercancel', endDrag);
		track.addEventListener('lostpointercapture', endDrag);

		// Do not open a product link after a drag.
		track.addEventListener('click', function (event) {
			if (!state.suppressClick) {
				return;
			}
			event.preventDefault();
			event.stopPropagation();
			state.suppressClick = false;
			window.clearTimeout(clickTimer);
		}, true);

		track.addEventListener('dragstart', function (event) {
			event.preventDefault();
		});

		// Only run while visible.
		if ('IntersectionObserver' in window) {
			new IntersectionObserver(function (entries) {
				state.inViewport = entries[0].isIntersecting;
			}, { threshold: 0.2 }).observe(track);
		}

		document.addEventListener('visibilitychange', function () {
			state.tabVisible = !document.hidden;
		});

		// Rebuild when the width changes (resize, rotate, layout shift).
		function onResize() {
			if (track.clientWidth === lastWidth) {
				return;
			}
			window.clearTimeout(resizeTimer);
			resizeTimer = window.setTimeout(function () {
				cancelAnim();
				build();
			}, 150);
		}

		if ('ResizeObserver' in window) {
			new ResizeObserver(onResize).observe(track);
		} else {
			window.addEventListener('resize', onResize);
		}

		window.addEventListener('pagehide', stopAuto);

		build();
		startAuto();

		return {
			goBy: goBy,
			pause: pause,
			setReducedMotion: function (value) {
				state.reducedMotion = value;
			}
		};
	}

	function initFeaturedCarousel() {
		var tracks = document.querySelectorAll('[data-pm-row]');

		if (!tracks.length) {
			return;
		}

		var section = tracks[0].closest('.pm-featured') || document;
		var rows = [];

		Array.prototype.forEach.call(tracks, function (track) {
			if (track.dataset.initialized === 'true') {
				return;
			}
			track.dataset.initialized = 'true';

			var row = createRow(track);
			if (row) {
				rows.push(row);
			}
		});

		if (!rows.length) {
			return;
		}

		// Arrow buttons move both rows by one product.
		var prevBtn = section.querySelector('[data-pm-prev]');
		var nextBtn = section.querySelector('[data-pm-next]');

		function moveAll(dir) {
			rows.forEach(function (row) {
				row.pause();
				row.goBy(dir);
			});
		}

		if (prevBtn) {
			prevBtn.addEventListener('click', function () { moveAll(-1); });
		}

		if (nextBtn) {
			nextBtn.addEventListener('click', function () { moveAll(1); });
		}

		function handleMotion(event) {
			rows.forEach(function (row) {
				row.setReducedMotion(event.matches);
			});
		}

		if (typeof motionQuery.addEventListener === 'function') {
			motionQuery.addEventListener('change', handleMotion);
		} else if (typeof motionQuery.addListener === 'function') {
			motionQuery.addListener(handleMotion);
		}
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', initFeaturedCarousel);
	} else {
		initFeaturedCarousel();
	}
})();





/* =========================================
   BULK PROMO — SEQUENTIAL LETTER REVEAL
========================================= */

(function () {
    'use strict';

    function initBulkPromo() {
        const promos = document.querySelectorAll('.pm-promo');

        if (!promos.length) return;

        const reduceMotion = window.matchMedia(
            '(prefers-reduced-motion: reduce)'
        ).matches;

        promos.forEach(function (promo) {
            if (promo.dataset.animationReady === 'true') return;

            promo.dataset.animationReady = 'true';

            const title = promo.querySelector(
                '[data-promo-letter-reveal]'
            );

            if (title && !reduceMotion) {
                const originalNodes = Array.from(title.childNodes);
                const accessibleLabel = originalNodes.map(function (node) {
                    if (node.nodeType === Node.ELEMENT_NODE &&
                        node.tagName === 'BR') {
                        return ' ';
                    }

                    return node.textContent;
                }).join('').replace(/\s+/g, ' ').trim();

                title.setAttribute('aria-label', accessibleLabel);

                let characterIndex = 0;
                const letterDelay = 32;
                const initialDelay = 180;

                title.textContent = '';

                originalNodes.forEach(function (node) {
                    if (
                        node.nodeType === Node.ELEMENT_NODE &&
                        node.tagName === 'BR'
                    ) {
                        title.appendChild(document.createElement('br'));
                        return;
                    }

                    if (node.nodeType !== Node.TEXT_NODE) return;

                    const words = node.textContent.match(/\S+|\s+/g) || [];

                    words.forEach(function (part) {
                        if (/^\s+$/.test(part)) {
                            title.appendChild(
                                document.createTextNode(' ')
                            );
                            return;
                        }

                        const word = document.createElement('span');
                        word.className = 'pm-promo__word';
                        word.setAttribute('aria-hidden', 'true');

                        Array.from(part).forEach(function (character) {
                            const letter = document.createElement('span');

                            letter.className = 'pm-promo__letter';
                            letter.textContent = character;

                            letter.style.setProperty(
                                '--letter-delay',
                                (initialDelay + characterIndex * letterDelay) + 'ms'
                            );

                            word.appendChild(letter);
                            characterIndex++;
                        });

                        title.appendChild(word);
                    });
                });

                // Reveal supporting content after the heading animation.
                const headingDuration =
                    initialDelay + characterIndex * letterDelay + 250;

                promo.style.setProperty(
                    '--reveal-base',
                    headingDuration + 'ms'
                );
            }

            if (reduceMotion || !('IntersectionObserver' in window)) {
                promo.classList.add('is-visible');
                return;
            }

            const observer = new IntersectionObserver(
                function (entries) {
                    entries.forEach(function (entry) {
                        if (entry.isIntersecting) {
                            promo.classList.add('is-visible');
                            observer.unobserve(promo);
                        }
                    });
                },
                {
                    threshold: 0.2,
                    rootMargin: '0px 0px -50px 0px'
                }
            );

            observer.observe(promo);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initBulkPromo);
    } else {
        initBulkPromo();
    }
})();





/* =========================================================
   PRINT MACAW — WHY CHOOSE PINNED SCROLL SECTION
   ========================================================= */

(function () {
    'use strict';

    var LETTER_STEP = 42; // ms between letters

    function initWhyChoose() {
        var sections = document.querySelectorAll('.pm-why');

        if (!sections.length) {
            return;
        }

        sections.forEach(function (section) {
            if (section.dataset.whyInitialized === 'true') {
                return;
            }

            var track = section.querySelector('[data-why-track]');
            var sticky = section.querySelector('.pm-why__sticky');
            var title = section.querySelector('[data-why-title]');
            var features = Array.from(section.querySelectorAll('[data-why-feature]'));
            var images = Array.from(section.querySelectorAll('[data-why-image]'));
            var progressItems = Array.from(section.querySelectorAll('[data-why-progress]'));
            var previousButton = section.querySelector('[data-why-prev]');
            var nextButton = section.querySelector('[data-why-next]');

            var featureCount = features.length;
            var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

            if (!track || !sticky || !title || !featureCount || images.length !== featureCount) {
                return;
            }

            section.dataset.whyInitialized = 'true';

            var activeIndex = -1;
            var ticking = false;
            var scrollFrame = null;

            /* ---------------------------------------------
               Heading: letter by letter, line 1 then line 2
            --------------------------------------------- */

            function prepareHeading() {
                var lines = Array.from(title.querySelectorAll('[data-why-line]'));

                if (!lines.length) {
                    return;
                }

                title.setAttribute(
                    'aria-label',
                    lines.map(function (l) { return l.textContent.trim(); }).join(' ')
                );

                var count = 0;

                lines.forEach(function (line) {
                    var text = line.textContent.trim();
                    var words = text.split(' ');

                    line.textContent = '';

                    words.forEach(function (word, wordIndex) {
                        var wordEl = document.createElement('span');
                        wordEl.className = 'pm-why__word';
                        wordEl.setAttribute('aria-hidden', 'true');

                        Array.from(word).forEach(function (character) {
                            var letter = document.createElement('span');
                            letter.className = 'pm-why__letter';
                            letter.textContent = character;
                            letter.style.setProperty(
                                '--pm-why-letter-delay',
                                (count * LETTER_STEP) + 'ms'
                            );
                            wordEl.appendChild(letter);
                            count++;
                        });

                        line.appendChild(wordEl);

                        if (wordIndex < words.length - 1) {
                            line.appendChild(document.createTextNode(' '));
                            count++; // tiny pause between words
                        }
                    });
                });

                section.style.setProperty(
                    '--pm-why-intro-delay',
                    (count * LETTER_STEP + 150) + 'ms'
                );
            }

            prepareHeading();

            features.forEach(function (f) { f.removeAttribute('hidden'); });
            images.forEach(function (i) { i.removeAttribute('hidden'); });

            section.classList.add('pm-why--enhanced');

            /* ---------------------------------------------
               Feature state (before / active / after)
            --------------------------------------------- */

            function applyState(list, index) {
                list.forEach(function (el, i) {
                    el.classList.toggle('is-active', i === index);
                    el.classList.toggle('is-before', i < index);
                });
            }

            function setActiveFeature(index) {
                index = Math.max(0, Math.min(featureCount - 1, index));

                if (index === activeIndex) {
                    return;
                }

                activeIndex = index;

                applyState(features, index);
                applyState(images, index);

                progressItems.forEach(function (item, i) {
                    item.classList.toggle('is-active', i === index);
                });

                updateControls();
            }

            function updateControls() {
                if (previousButton) {
                    previousButton.disabled = activeIndex === 0;
                }

                if (nextButton) {
                    nextButton.disabled = activeIndex === featureCount - 1;
                }
            }

            /* ---------------------------------------------
               Scroll position -> active feature
            --------------------------------------------- */

            function updateFromScroll() {
                ticking = false;

                var trackTop = track.getBoundingClientRect().top + window.scrollY;
                var availableScroll = Math.max(1, track.offsetHeight - sticky.offsetHeight);
                var distance = window.scrollY - trackTop;
                var progress = Math.max(0, Math.min(1, distance / availableScroll));
                var index = Math.min(featureCount - 1, Math.floor(progress * featureCount));

                setActiveFeature(index);
            }

            function requestScrollUpdate() {
                if (ticking) {
                    return;
                }

                ticking = true;
                scrollFrame = window.requestAnimationFrame(updateFromScroll);
            }

            /* ---------------------------------------------
               Navigation buttons
            --------------------------------------------- */

            function scrollToFeature(index) {
                index = Math.max(0, Math.min(featureCount - 1, index));

                var trackTop = track.getBoundingClientRect().top + window.scrollY;
                var availableScroll = Math.max(0, track.offsetHeight - sticky.offsetHeight);
                var targetPosition = trackTop + (availableScroll * (index / featureCount)) + 2;

                window.scrollTo({
                    top: targetPosition,
                    behavior: reduceMotion ? 'auto' : 'smooth'
                });
            }

            if (previousButton) {
                previousButton.addEventListener('click', function () {
                    scrollToFeature(activeIndex - 1);
                });
            }

            if (nextButton) {
                nextButton.addEventListener('click', function () {
                    scrollToFeature(activeIndex + 1);
                });
            }

            /* ---------------------------------------------
               Heading visibility (watch the header, not the
               huge pinned section)
            --------------------------------------------- */

            function revealHeading() {
                section.classList.add('is-heading-visible');
            }

            if (reduceMotion || !('IntersectionObserver' in window)) {
                revealHeading();
            } else {
                var headerEl = section.querySelector('.pm-why__header') || title;

                var headingObserver = new IntersectionObserver(
                    function (entries) {
                        entries.forEach(function (entry) {
                            if (entry.isIntersecting) {
                                revealHeading();
                                headingObserver.disconnect();
                            }
                        });
                    },
                    { threshold: 0.35 }
                );

                headingObserver.observe(headerEl);
            }

            /* ---------------------------------------------
               Events and initial state
            --------------------------------------------- */

            window.addEventListener('scroll', requestScrollUpdate, { passive: true });
            window.addEventListener('resize', requestScrollUpdate, { passive: true });
            window.addEventListener('orientationchange', requestScrollUpdate, { passive: true });

            setActiveFeature(0);
            updateFromScroll();

            window.addEventListener('pagehide', function () {
                if (scrollFrame !== null) {
                    window.cancelAnimationFrame(scrollFrame);
                }
            }, { once: true });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initWhyChoose);
    } else {
        initWhyChoose();
    }
})();







// /* =========================================================
//    CLIENT LOGOS MARQUEE
//    ========================================================= */

// (() => {
//     'use strict';

//     const initLogoMarquee = () => {
//         const marquees = document.querySelectorAll('[data-pm-logo-marquee]');

//         if (!marquees.length) {
//             return;
//         }

//         const reducedMotion = window.matchMedia(
//             '(prefers-reduced-motion: reduce)'
//         );

//         if (reducedMotion.matches) {
//             return;
//         }

//         if (!('IntersectionObserver' in window)) {
//             return;
//         }

//         marquees.forEach((marquee) => {
//             const track = marquee.querySelector('.pm-logos__track');

//             if (!track) {
//                 return;
//             }

//             const observer = new IntersectionObserver(
//                 (entries) => {
//                     entries.forEach((entry) => {
//                         if (entry.isIntersecting) {
//                             marquee.classList.remove('is-paused');
//                         } else {
//                             marquee.classList.add('is-paused');
//                         }
//                     });
//                 },
//                 {
//                     threshold: 0,
//                 }
//             );

//             observer.observe(marquee);

//             marquee.addEventListener('focusin', () => {
//                 marquee.classList.add('is-paused');
//             });

//             marquee.addEventListener('focusout', (event) => {
//                 if (!marquee.contains(event.relatedTarget)) {
//                     marquee.classList.remove('is-paused');
//                 }
//             });
//         });
//     };

//     if (document.readyState === 'loading') {
//         document.addEventListener('DOMContentLoaded', initLogoMarquee);
//     } else {
//         initLogoMarquee();
//     }
// })();


/* =========================================================
   PRINT MACAW — TESTIMONIALS
   Letter reveal + seamless marquee, LEFT → RIGHT (JS driven)
   ========================================================= */

(() => {
    'use strict';

    const SPEED = 55;          // px per second  (raise = faster)
    const SPEED_REDUCED = 20;
    const DIRECTION = 1;       // 1 = left → right , -1 = right → left

    const initTestimonials = () => {
        const section = document.querySelector('.pm-testimonials');

        if (!section || section.dataset.pmInitialized === 'true') return;

        section.dataset.pmInitialized = 'true';

        const heading  = section.querySelector('[data-pm-testimonial-heading]');
        const title    = section.querySelector('[data-pm-letter-reveal]');
        const viewport = section.querySelector('[data-pm-testimonials]');
        const track    = viewport ? viewport.querySelector('.pm-testimonials__track') : null;

        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const hasIO = 'IntersectionObserver' in window;

        /* ---------- Heading letter reveal ---------- */

        if (heading && title) {
            if (!reduceMotion && hasIO) {
                const originalText = title.textContent.trim();
                const fragment = document.createDocumentFragment();
                let index = 0;

                originalText.split(/\s+/).forEach((word, wordIndex, words) => {
                    const wordEl = document.createElement('span');
                    wordEl.className = 'pm-testimonial-word';
                    wordEl.setAttribute('aria-hidden', 'true');

                    Array.from(word).forEach((character) => {
                        const letter = document.createElement('span');
                        letter.className = 'pm-testimonial-letter';
                        letter.textContent = character;
                        letter.style.setProperty('--pm-letter-delay', `${Math.min(index * 28, 650)}ms`);
                        index++;
                        wordEl.appendChild(letter);
                    });

                    fragment.appendChild(wordEl);

                    if (wordIndex < words.length - 1) {
                        fragment.appendChild(document.createTextNode(' '));
                    }
                });

                title.setAttribute('aria-label', originalText);
                title.textContent = '';
                title.appendChild(fragment);

                heading.classList.remove('is-visible');

                new IntersectionObserver((entries, observer) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            heading.classList.add('is-visible');
                            observer.unobserve(heading);
                        }
                    });
                }, { threshold: 0.25, rootMargin: '0px 0px -35px 0px' }).observe(heading);
            } else {
                heading.classList.add('is-visible');
            }
        }

        /* ---------- Marquee ---------- */

        if (!viewport || !track) return;

        const original = track.querySelector('[data-pm-group]');
        if (!original || !original.children.length) return;

        const baseCards = Array.from(original.children).map((card) => card.cloneNode(true));

        let distance = 0;
        let x = 0;
        let hovering = false;
        let visible = true;
        let lastTime = 0;

        const speed = (reduceMotion ? SPEED_REDUCED : SPEED) * DIRECTION;

        const build = () => {
            track.querySelectorAll('[data-pm-group-clone]').forEach((el) => el.remove());

            original.innerHTML = '';
            baseCards.forEach((card) => original.appendChild(card.cloneNode(true)));

            // Repeat cards until one group is wider than the screen
            const target = viewport.clientWidth + 40;
            let guard = 0;

            while (original.getBoundingClientRect().width < target && guard < 12) {
                baseCards.forEach((card) => original.appendChild(card.cloneNode(true)));
                guard++;
            }

            distance = original.getBoundingClientRect().width;

            // Duplicate group → seamless loop
            const clone = original.cloneNode(true);
            clone.removeAttribute('data-pm-group');
            clone.setAttribute('data-pm-group-clone', '');
            clone.setAttribute('aria-hidden', 'true');
            track.appendChild(clone);

            // Keep x valid: range [-distance, 0)
            if (distance > 0) {
                x = ((x % distance) + distance) % distance - distance;
                track.style.transform = `translate3d(${x.toFixed(2)}px, 0, 0)`;
            }
        };

        const tick = (now) => {
            if (!lastTime) lastTime = now;

            const dt = Math.min((now - lastTime) / 1000, 0.05); // clamp tab-switch jumps
            lastTime = now;

            if (distance > 0 && visible && !hovering) {
                x += speed * dt;

                if (speed > 0 && x >= 0) {
                    x -= distance;          // left → right loop
                } else if (speed < 0 && x <= -distance) {
                    x += distance;          // right → left loop
                }

                track.style.transform = `translate3d(${x.toFixed(2)}px, 0, 0)`;
            }

            window.requestAnimationFrame(tick);
        };

        build();
        x = speed > 0 ? -distance : 0;                 // correct start point
        track.style.transform = `translate3d(${x.toFixed(2)}px, 0, 0)`;
        window.requestAnimationFrame(tick);

        /* Pause only on mouse hover (touch stays free) */
        viewport.addEventListener('pointerenter', (event) => {
            if (event.pointerType === 'mouse') hovering = true;
        });
        viewport.addEventListener('pointerleave', () => { hovering = false; });

        /* Rebuild on width change */
        let lastWidth = window.innerWidth;
        let resizeTimer;

        window.addEventListener('resize', () => {
            if (window.innerWidth === lastWidth) return;
            lastWidth = window.innerWidth;
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(build, 200);
        });

        /* Rebuild after fonts load so card widths are final */
        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(build);
        }

        /* Stop work while off-screen */
        if (hasIO) {
            new IntersectionObserver((entries) => {
                entries.forEach((entry) => { visible = entry.isIntersecting; });
            }).observe(viewport);
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTestimonials, { once: true });
    } else {
        initTestimonials();
    }
})();
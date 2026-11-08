(() => {
    'use strict';

    const SELECTOR = '[data-pm-reveal]';
    const MAX_TOTAL_SECONDS = 1.4; // long texts never take longer than this
    const MAX_STEP_SECONDS = 0.045; // delay between letters for short texts

    const splitText = (el) => {
        if (el.classList.contains('is-split')) {
            return;
        }

        const text = el.textContent.replace(/\s+/g, ' ').trim();

        if (!text) {
            return;
        }

        const letters = Array.from(text).filter((c) => c !== ' ').length;
        const step = Math.min(MAX_STEP_SECONDS, MAX_TOTAL_SECONDS / letters);
        const delay = parseFloat(el.dataset.pmRevealDelay) || 0;

        el.style.setProperty('--pm-step', step + 's');
        el.style.setProperty('--pm-delay', delay + 's');

        // Screen-reader copy
        const sr = document.createElement('span');
        sr.className = 'pm-reveal__sr';
        sr.textContent = text;

        const visible = document.createElement('span');
        visible.setAttribute('aria-hidden', 'true');

        let index = 0;
        const words = text.split(' ');

        words.forEach((word, wordIndex) => {
            const wordEl = document.createElement('span');
            wordEl.className = 'pm-reveal__word';

            Array.from(word).forEach((char) => {
                const charEl = document.createElement('span');
                charEl.className = 'pm-reveal__char';
                charEl.style.setProperty('--pm-i', index++);
                charEl.textContent = char;
                wordEl.appendChild(charEl);
            });

            visible.appendChild(wordEl);

            if (wordIndex < words.length - 1) {
                visible.appendChild(document.createTextNode(' '));
            }
        });

        el.textContent = '';
        el.appendChild(sr);
        el.appendChild(visible);
        el.classList.add('is-split');
    };

    const init = () => {
        const items = document.querySelectorAll(SELECTOR);

        if (!items.length) {
            return;
        }

        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // No animation needed: leave the text exactly as it is.
        if (reducedMotion) {
            return;
        }

        items.forEach(splitText);

        // Old browsers: just show everything.
        if (!('IntersectionObserver' in window)) {
            items.forEach((el) => el.classList.add('is-revealed'));
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-revealed');
                        observer.unobserve(entry.target); // play once
                    }
                });
            },
            { threshold: 0.35, rootMargin: '0px 0px -5% 0px' }
        );

        items.forEach((el) => observer.observe(el));
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
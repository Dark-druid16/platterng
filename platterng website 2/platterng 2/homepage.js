(() => {
    /* ---------- Header height -> CSS variable (keeps slide artwork clear of the header) ---------- */
    const header = document.querySelector('.header');
    const setHeaderHeight = () => {
        document.documentElement.style.setProperty('--header-h', header.offsetHeight + 'px');
    };
    setHeaderHeight();
    window.addEventListener('resize', setHeaderHeight);
    window.addEventListener('load', setHeaderHeight);

    /* ---------- Mobile nav ---------- */
    const toggle = document.querySelector('.nav-toggle');
    const nav = document.getElementById('site-nav');

    const closeNav = () => {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open menu');
    };

    toggle.addEventListener('click', () => {
        const open = nav.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });

    nav.addEventListener('click', (e) => {
        if (e.target.closest('a')) closeNav();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeNav();
    });

    /* ---------- Hero slider ---------- */
    const hero = document.querySelector('.hero');
    const slides = [...hero.querySelectorAll('.slide')];
    const dotsWrap = hero.querySelector('.hero-dots');
    const INTERVAL = 5500; // ms between slides
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let index = 0;
    let timer = null;

    slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.setAttribute('aria-label', `Show slide ${i + 1} of ${slides.length}`);
        dot.addEventListener('click', () => {
            go(i);
            restart();
        });
        dotsWrap.appendChild(dot);
    });
    const dots = [...dotsWrap.children];

    function go(n) {
        index = (n + slides.length) % slides.length;
        slides.forEach((slide, i) => {
            const active = i === index;
            slide.classList.toggle('is-active', active);
            slide.setAttribute('aria-hidden', String(!active));
        });
        dots.forEach((dot, i) => {
            dot.classList.toggle('is-active', i === index);
            dot.setAttribute('aria-current', String(i === index));
        });
    }

    function start() {
        if (reduceMotion || timer) return;
        timer = setInterval(() => go(index + 1), INTERVAL);
    }

    function stop() {
        clearInterval(timer);
        timer = null;
    }

    function restart() {
        stop();
        start();
    }

    hero.querySelector('.prev').addEventListener('click', () => { go(index - 1); restart(); });
    hero.querySelector('.next').addEventListener('click', () => { go(index + 1); restart(); });

    // pause while the visitor is interacting or the tab is hidden
    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);
    hero.addEventListener('focusin', stop);
    hero.addEventListener('focusout', start);
    document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));

    // swipe on touch screens
    let touchX = null;
    hero.addEventListener('touchstart', (e) => { touchX = e.changedTouches[0].clientX; }, { passive: true });
    hero.addEventListener('touchend', (e) => {
        if (touchX === null) return;
        const dx = e.changedTouches[0].clientX - touchX;
        touchX = null;
        if (Math.abs(dx) > 40) {
            go(dx < 0 ? index + 1 : index - 1);
            restart();
        }
    }, { passive: true });

    go(0);
    start();
})();
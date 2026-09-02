  /*
  scripts.js
  - Handles interactive page behavior.
  - Mobile navigation, Swiper sliders, scroll reveal animations, counter animation, and FAQ toggles.
*/

        const toggleButton = document.querySelector('.nav-toggle');
        const navLinks = document.getElementById('navLinks');

        // Close the mobile nav menu and reset the hamburger button state.
        function closeNavMenu() {
            if (navLinks) {
                navLinks.classList.remove('open');
            }
            if (toggleButton) {
                toggleButton.classList.remove('open');
                toggleButton.setAttribute('aria-expanded', 'false');
            }
        }

        if (toggleButton && navLinks) {
            toggleButton.addEventListener('click', (event) => {
                event.stopPropagation();
                const isOpen = navLinks.classList.contains('open');
                if (isOpen) {
                    closeNavMenu();
                } else {
                    navLinks.classList.add('open');
                    toggleButton.setAttribute('aria-expanded', 'true');
                }
                toggleButton.classList.toggle('open', !isOpen);
            });

            document.querySelectorAll('.nav-links a').forEach(link => {
                link.addEventListener('click', closeNavMenu);
            });

            document.addEventListener('click', (event) => {
                if (!navLinks.contains(event.target) && !toggleButton.contains(event.target)) {
                    closeNavMenu();
                }
            });

            document.addEventListener('keydown', (event) => {
                if (event.key === 'Escape') {
                    closeNavMenu();
                }
            });

            window.addEventListener('resize', () => {
                if (window.innerWidth > 680) {
                    closeNavMenu();
                }
            });

            window.addEventListener('scroll', () => {
                closeNavMenu();
            }, { passive: true });
        }

        // Initialize the movie slider using Swiper.js if present on the page.
        if (typeof Swiper !== 'undefined' && document.querySelector('.movies-swiper')) {
            const movieSwiper = new Swiper('.movies-swiper', {
                slidesPerView: 1,
                spaceBetween: 20,
                loop: true,
                autoplay: { delay: 3000, disableOnInteraction: false },
                navigation: { nextEl: '.movies-swiper .swiper-button-next', prevEl: '.movies-swiper .swiper-button-prev' },
                pagination: { el: '.movies-swiper .swiper-pagination', clickable: true },
                breakpoints: { 680: { slidesPerView: 2 }, 980: { slidesPerView: 3 } }
            });
        }

        if (typeof Swiper !== 'undefined' && document.querySelector('.sports-swiper')) {
            const sportsSwiper = new Swiper('.sports-swiper', {
                slidesPerView: 1,
                spaceBetween: 18,
                loop: true,
                autoplay: { delay: 2800, disableOnInteraction: false },
                navigation: { nextEl: '.sports-swiper .swiper-button-next', prevEl: '.sports-swiper .swiper-button-prev' },
                pagination: { el: '.sports-swiper .swiper-pagination', clickable: true },
                breakpoints: { 680: { slidesPerView: 2 }, 980: { slidesPerView: 4 } }
            });
        }

        // Animate numeric values in the hero stats when the hero section or stat card is visible.
        const counters = document.querySelectorAll('.stat-number');
        const animatedCounters = new WeakSet();
        const animateCounter = (el) => {
            if (animatedCounters.has(el)) return;
            animatedCounters.add(el);
            const target = parseFloat(el.dataset.target);
            if (isNaN(target)) return;
            const suffix = el.dataset.suffix !== undefined ? el.dataset.suffix : (el.textContent.includes('%') ? '%' : (el.textContent.includes('+') ? '+' : ''));
            const decimals = el.dataset.decimals !== undefined ? parseInt(el.dataset.decimals, 10) : (Number.isInteger(target) ? 0 : 1);
            const useComma = target >= 1000;
            const duration = 1400;
            const startTime = performance.now();
            const formatNum = (num) => {
                if (useComma && decimals === 0) {
                    return Math.round(num).toLocaleString();
                }
                return num.toFixed(decimals);
            };
            const tick = (now) => {
                const progress = Math.min((now - startTime) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                const value = target * eased;
                el.textContent = `${formatNum(value)}${suffix}`;
                if (progress < 1) requestAnimationFrame(tick);
                else el.textContent = `${formatNum(target)}${suffix}`;
            };
            requestAnimationFrame(tick);
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    const innerCounters = entry.target.querySelectorAll('.stat-number');
                    if (innerCounters.length) {
                        innerCounters.forEach(animateCounter);
                    }
                    if (entry.target.classList.contains('hero')) {
                        counters.forEach(animateCounter);
                    }
                }
            });
        }, { threshold: 0.15 });

        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
        const pageHero = document.querySelector('.hero');
        if (pageHero) {
            observer.observe(pageHero);
        }

        document.querySelectorAll('.faq-question').forEach(button => {
            button.addEventListener('click', () => {
                const item = button.parentElement;
                item.classList.toggle('active');
            });
        });
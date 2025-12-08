document.addEventListener('DOMContentLoaded', () => {
    // --- Mobile Navigation ---
    // This also needs to run after the header is loaded.
    const initializeMobileNav = () => {
        const navToggle = document.getElementById('nav-toggle');
        const mainNav = document.getElementById('main-nav');
        const navOverlay = document.querySelector('.nav-overlay');

        if (!navToggle || !mainNav || !navOverlay) {
            // If elements aren't loaded yet, try again shortly.
            setTimeout(initializeMobileNav, 100);
            return;
        }

        const toggleMenu = () => {
            navToggle.classList.toggle('is-active');
            mainNav.classList.toggle('is-active');
            navOverlay.classList.toggle('is-active');
            document.body.style.overflow = mainNav.classList.contains('is-active') ? 'hidden' : '';
        };

        navToggle.addEventListener('click', toggleMenu);
        navOverlay.addEventListener('click', toggleMenu);
    };

    // --- Set active navigation link ---
    // This needs to run after the header is loaded, so we use a small delay.
    // A more robust solution might use MutationObserver or a callback.
    setTimeout(() => {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('#main-nav a');
        navLinks.forEach(link => {
            if (link.getAttribute('href') === currentPage) {
                link.classList.add('active');
            }
        });
    }, 200);

    // Initialize mobile navigation logic
    initializeMobileNav();
});
document.addEventListener('DOMContentLoaded', () => {
    const initializeNav = () => {
        const navToggle = document.getElementById('nav-toggle');
        const mainNav = document.getElementById('main-nav');
        const navOverlay = document.querySelector('.nav-overlay');

        // If header elements aren't loaded yet, try again shortly.
        if (!mainNav || !navToggle || !navOverlay) {
            setTimeout(initializeNav, 100); // Retry after 100ms
            return;
        }

        // Hamburger menu toggle functionality
        const toggleMenu = () => {
            navToggle.classList.toggle('is-active');
            mainNav.classList.toggle('nav-open');
            navOverlay.classList.toggle('is-active');
            document.body.classList.toggle('nav-active');
        };

        navToggle.addEventListener('click', toggleMenu);
        navOverlay.addEventListener('click', toggleMenu);

        // --- Existing Active Link Logic ---
        // Set active navigation link
        const currentPath = window.location.pathname.endsWith('/') ? window.location.pathname : window.location.pathname.replace(/\/$/, "");
        const navLinks = document.querySelectorAll('#main-nav a');

        navLinks.forEach(link => {
            const linkPath = link.getAttribute('href').replace(/\/$/, "");
            // Handle homepage (index.html or /)
            if ((currentPath === '/index.html' || currentPath === '') && (linkPath === 'index.html' || linkPath === '')) {
                link.classList.add('active');
            } else if (linkPath !== '' && linkPath !== 'index.html' && currentPath.endsWith(linkPath)) {
                link.classList.add('active');
            }
        }

        // Set active navigation link
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('#main-nav a');

        navLinks.forEach(link => {
            const linkPath = link.getAttribute('href');
            // Handle homepage (root path)
            if (currentPath === '/' && (linkPath === '/' || linkPath === '/index.html')) {
                link.classList.add('active');
            // Handle other pages
            } else if (linkPath && linkPath !== '/' && currentPath.startsWith(linkPath)) {
                link.classList.add('active');
            }
        });
    };

    // Start the initialization process
    initializeNav();
});
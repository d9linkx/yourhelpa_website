document.addEventListener('DOMContentLoaded', () => {
    const initializeNav = () => {
        const navToggle = document.getElementById('nav-toggle');
        const mainNav = document.getElementById('main-nav');

        // If header elements aren't loaded yet, try again shortly.
        if (!mainNav || !navToggle) {
            setTimeout(initializeNav, 100); // Retry after 100ms
            return;
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
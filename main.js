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
        const currentPath = window.location.pathname.split("/").pop();
        const navLinks = document.querySelectorAll('#main-nav a');

        navLinks.forEach(link => {
            const linkPath = link.getAttribute('href')?.split('/').pop();
            // Check for index.html, root path, or exact match
            if ((currentPath === '' || currentPath === 'index.html') && (linkPath === 'index.html' || linkPath === '')) {
                link.classList.add('active');
            } else if (linkPath && linkPath !== '' && currentPath === linkPath) {
                link.classList.add('active');
            }
        });
    };

    // Start the initialization process
    initializeNav();
});
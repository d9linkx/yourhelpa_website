document.addEventListener('DOMContentLoaded', () => {
    const initializeNav = () => {
        const navToggle = document.getElementById('nav-toggle');
        const mainNav = document.getElementById('main-nav');

        // If nav isn't loaded yet, try again shortly.
        if (!navToggle || !mainNav) {
            setTimeout(initializeNav, 100); // Retry after 100ms
            return;
        }

        // --- Hamburger Menu Toggle ---
        navToggle.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent event bubbling
            mainNav.classList.toggle('active');
        });

        // --- Close Menu on Link Click (for mobile) ---
        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (mainNav.classList.contains('active')) {
                    mainNav.classList.remove('active');
                }
            });
        });

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
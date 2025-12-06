document.addEventListener('DOMContentLoaded', () => {
    // Wait for templates to load before initializing
    // This ensures navToggle and mainNav exist
    const initializeNav = () => {
        const navToggle = document.getElementById('nav-toggle');
        const mainNav = document.getElementById('main-nav');

        if (navToggle && mainNav) {
            navToggle.addEventListener('click', () => {
                mainNav.classList.toggle('active');
            });
        }

        // Set active navigation link
        const currentPath = window.location.pathname.split("/").pop();
        const navLinks = document.querySelectorAll('#main-nav a');

        navLinks.forEach(link => {
            const linkPath = link.getAttribute('href').split('/').pop();
            if (currentPath === '' && (linkPath === 'index.html' || linkPath === '')) {
                link.classList.add('active');
            } else if (linkPath !== '' && currentPath === linkPath) {
                link.classList.add('active');
            }
        });
    };

    // Use a MutationObserver to wait for the header to be injected
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (headerPlaceholder) {
        const observer = new MutationObserver((mutationsList, observer) => {
            for(const mutation of mutationsList) {
                if (mutation.type === 'childList' && document.getElementById('main-nav')) {
                    initializeNav();
                    observer.disconnect(); // Stop observing once the nav is found
                    return;
                }
            }
        });
        observer.observe(headerPlaceholder, { childList: true });
    } else {
        // Fallback for pages without the placeholder
        initializeNav();
    }
});
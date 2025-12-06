document.addEventListener('DOMContentLoaded', () => {
    // Mobile navigation toggle
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
        const linkPath = link.getAttribute('href');
        // Handle root path for index.html
        if ((currentPath === '' || currentPath === 'index.html') && (linkPath === 'index.html' || linkPath === './')) {
            link.classList.add('active');
        } else if (linkPath === currentPath) {
            link.classList.add('active');
        }
    });
});
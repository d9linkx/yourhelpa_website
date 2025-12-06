document.addEventListener('DOMContentLoaded', () => {
    const loadComponent = (selector, url) => {
        const element = document.querySelector(selector);
        if (element) {
            fetch(url)
                .then(response => response.ok ? response.text() : Promise.reject('File not found.'))
                .then(data => {
                    element.innerHTML = data;
                })
                .catch(error => console.error(`Error loading ${url}:`, error));
        }
    };

    // Load header and footer
    loadComponent('#header-placeholder', '_header.html');
    loadComponent('#footer-placeholder', '_footer.html');

    // Set active navigation link
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
    }, 200); // Adjust delay if header loads slower
});
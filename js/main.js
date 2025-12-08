document.addEventListener('DOMContentLoaded', () => {
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
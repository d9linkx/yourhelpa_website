document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('hero-search-form');
    const searchInput = document.getElementById('search-input');

    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const query = searchInput.value.trim();
            window.location.href = `services.html?q=${encodeURIComponent(query)}`;
        });
    }
});
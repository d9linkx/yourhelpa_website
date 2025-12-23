document.addEventListener('DOMContentLoaded', () => {
    const loadHTML = async (selector, url) => {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to load ${url}: ${response.statusText}`);
            }
            const data = await response.text();
            const element = document.querySelector(selector);
            if (element) {
                element.innerHTML = data;
            }
        } catch (error) {
            console.error(error);
        }
    };

    const initializePage = async () => {
        // Load common components
        await Promise.all([
            loadHTML('#header-placeholder', '/_header.html'),
            loadHTML('#footer-placeholder', '/_footer.html')
        ]);
        
        // Check auth status and update nav accordingly
        if (typeof supabase !== 'undefined' && typeof window.updateNavBasedOnAuth === 'function') {
            const { data: { session } } = await supabase.auth.getSession();
            window.updateNavBasedOnAuth(session);
        }

        // After includes are loaded, initialize page-specific logic
        if (typeof initializeMain === 'function') {
            initializeMain();
        }
        if (typeof initializeLoginPage === 'function' && document.getElementById('login-form')) {
            initializeLoginPage();
        }
    };

    initializePage();
});
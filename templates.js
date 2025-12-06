document.addEventListener('DOMContentLoaded', () => {
    const loadTemplate = async (url, elementId) => {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to load template from ${url}`);
            }
            const text = await response.text();
            const element = document.getElementById(elementId);
            if (element) {
                element.innerHTML = text;
            }
        } catch (error) {
            console.error(error);
        }
    };

    const loadAllTemplates = async () => {
        // Load header and footer, then initialize the main script for nav functionality
        await Promise.all([
            loadTemplate('/templates/header.html', 'header-placeholder'),
            loadTemplate('/templates/footer.html', 'footer-placeholder')
        ]);
    };

    loadAllTemplates();
});
document.addEventListener('DOMContentLoaded', () => {
    const loadTemplate = async (url, elementId) => {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Failed to load template: ${url}`);
            const text = await response.text();
            const element = document.getElementById(elementId);
            if (element) element.innerHTML = text;
        } catch (error) {
            console.error(error);
        }
    };

    const loadAllAppTemplates = async () => {
        await loadTemplate('/templates/app-header.html', 'app-header-placeholder');
        await loadTemplate('/templates/app-footer.html', 'app-footer-placeholder');
    };

    loadAllAppTemplates();
});
document.addEventListener('DOMContentLoaded', () => {
    const loadHTML = (selector, url) => {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to load ${url}: ${response.statusText}`);
                }
                return response.text();
            })
            .then(data => {
                const element = document.querySelector(selector);
                if (element) {
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = data;

                    // Move all child nodes, including script tags, to the placeholder
                    while (tempDiv.firstChild) {
                        element.appendChild(tempDiv.firstChild);
                    }
                }
            })
            .catch(error => console.error(error));
    };

    // Load header and footer into their placeholders
    loadHTML('#header-placeholder', '_header.html');
    loadHTML('#footer-placeholder', '_footer.html');
});
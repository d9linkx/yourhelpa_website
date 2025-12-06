document.addEventListener('DOMContentLoaded', () => {
    // --- Theme Toggle ---
    const themeToggle = document.getElementById('theme-toggle');
    const sunIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path></svg>`;
    const moonIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg>`;

    const applyTheme = (theme) => {
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
            if (themeToggle) themeToggle.innerHTML = sunIcon;
        } else {
            document.body.classList.remove('dark-mode');
            if (themeToggle) themeToggle.innerHTML = moonIcon;
        }
    };

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isDarkMode = document.body.classList.contains('dark-mode');
            const newTheme = isDarkMode ? 'light' : 'dark';
            localStorage.setItem('theme', newTheme);
            applyTheme(newTheme);
        });
    }

    // Apply saved theme on load
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);


    // --- Testimonial Slider ---
    const testimonialContainer = document.getElementById('testimonial-container');
    const dotsContainer = document.getElementById('testimonial-dots');

    if (testimonialContainer && dotsContainer) {
        const testimonials = [
            {
                quote: "YourHelpa is a lifesaver! I found a reliable plumber in minutes and the whole process was handled on WhatsApp. So easy!",
                author: "Aisha B., Lagos"
            },
            {
                quote: "Finally, a platform I can trust for freelance gigs. I set my own rates and get paid securely. Highly recommended for artisans.",
                author: "David O., Abuja"
            },
            {
                quote: "I needed a cake for my son's birthday at the last minute. YourHelpa connected me with a local baker and it was delivered on time. Amazing service!",
                author: "Funke A., Port Harcourt"
            }
        ];

        let currentIndex = 0;

        const renderTestimonials = () => {
            testimonialContainer.innerHTML = testimonials.map(t => `
                <div class="testimonial-slide">
                    <div class="testimonial-card">
                        <p>"${t.quote}"</p>
                        <span class="testimonial-author">- ${t.author}</span>
                    </div>
                </div>
            `).join('');

            dotsContainer.innerHTML = testimonials.map((_, index) => 
                `<div class="testimonial-dot ${index === currentIndex ? 'active' : ''}" data-index="${index}"></div>`
            ).join('');
        };

        const showSlide = (index) => {
            testimonialContainer.style.transform = `translateX(-${index * 100}%)`;
            document.querySelectorAll('.testimonial-dot').forEach(dot => {
                dot.classList.remove('active');
                if (parseInt(dot.dataset.index) === index) {
                    dot.classList.add('active');
                }
            });
            currentIndex = index;
        };

        dotsContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('testimonial-dot')) {
                const index = parseInt(e.target.dataset.index);
                showSlide(index);
            }
        });

        const autoSlide = () => {
            let nextIndex = (currentIndex + 1) % testimonials.length;
            showSlide(nextIndex);
        };

        renderTestimonials();
        setInterval(autoSlide, 5000); // Change slide every 5 seconds
    }

    // --- Animated Stats Counter ---
    const statsSection = document.getElementById('stats-section');

    const animateCounters = () => {
        const counters = statsSection.querySelectorAll('[data-target]');
        const speed = 200; // Lower is faster

        counters.forEach(counter => {
            const updateCount = () => {
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText;

                const increment = target / speed;

                if (count < target) {
                    counter.innerText = Math.ceil(count + increment);
                    setTimeout(updateCount, 10);
                } else {
                    counter.innerText = target;
                }
            };
            updateCount();
        });
    };

    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    observer.unobserve(entry.target); // Animate only once
                }
            });
        }, { threshold: 0.5 }); // Trigger when 50% of the section is visible
        observer.observe(statsSection);
    }
});
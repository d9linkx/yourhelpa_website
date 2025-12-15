function initializeMain() {
    // This also needs to run after the header is loaded.
    const initializeMobileNav = () => {
        const navToggle = document.getElementById('nav-toggle');
        const mainNav = document.getElementById('main-nav');
        const navOverlay = document.querySelector('.nav-overlay');

        if (!navToggle || !mainNav || !navOverlay) {
            return;
        }

        const toggleMenu = () => {
            navToggle.classList.toggle('is-active');
            mainNav.classList.toggle('is-active');
            navOverlay.classList.toggle('is-active');
            document.body.style.overflow = mainNav.classList.contains('is-active') ? 'hidden' : '';
        };

        navToggle.addEventListener('click', toggleMenu);
        navOverlay.addEventListener('click', toggleMenu);
    };

    // --- Set active navigation link ---
    // This needs to run after the header is loaded, so we use a small delay.
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('#main-nav a');
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });

    // Initialize mobile navigation logic
    initializeMobileNav();

    // Add a style rule for the visible class
    const style = document.createElement('style');
    style.textContent = `
        .mobile-nav-login-btn.is-visible { display: inline-block !important; }
    `;
    document.head.appendChild(style);

    // --- Initialize Animations and Notifications ---
    initializeFomoNotification();
    initializeSwellAnimation();
    initializeScrollInAnimations();
}

function initializeFomoNotification() {
    const fomo = document.getElementById('fomo-notification');
    if (!fomo) return;

    const activities = [
        "Just In: A user in Lagos paid <strong>NGN 45,000</strong> for verified plumbing work.",
        "A new request for 'Home Cleaning' was just posted in Abuja.",
        "Success. A Helpa just completed a 'Graphic Design' task for <strong>NGN 75,000</strong>.",
        "Just In: A customer in Port Harcourt paid <strong>NGN 20,000</strong> for a rush cake delivery.",
        "A new request for 'Electrical Repair' was just posted in Ikeja.",
        "Success. A Helpa just finished a 'Lawn Mowing' job for <strong>NGN 15,000</strong>.",
        "Just In: A user in Lekki paid <strong>NGN 60,000</strong> for professional tutoring services.",
        "A new request for 'Event Planning' was just posted in Ibadan.",
        "Success. A Helpa just completed a 'Furniture Assembly' task for <strong>NGN 30,000</strong>.",
        "Just In: A customer in Kano paid <strong>NGN 10,000</strong> for a quick delivery service.",
        "A new request for 'AC Servicing' was just posted in your area.",
        "Success. A Helpa just earned <strong>NGN 55,000</strong> for a 'Website Update' job.",
        "Just In: A user in Enugu paid <strong>NGN 25,000</strong> for a 'Deep Cleaning' service.",
        "A new request for a 'Makeup Artist' was just posted for this weekend.",
        "Success. A Helpa just completed a 'Generator Repair' for <strong>NGN 18,000</strong>.",
        "Just In: A customer paid <strong>NGN 90,000</strong> for a small catering order.",
        "A new request for 'Apartment Painting' was just posted in Surulere.",
        "Success. A Helpa just completed a 'Website Development' project for <strong>NGN 250,000</strong>.",
        "Just In: A user in Benin City paid <strong>NGN 35,000</strong> for 'Tiling Services'.",
        "A new request for a 'Mobile Mechanic' was just posted in Garki, Abuja.",
        "Success. A Helpa just earned <strong>NGN 22,000</strong> for a 'Post-Construction Cleaning' job.",
        "Just In: A customer in Ibadan paid <strong>NGN 12,000</strong> for 'Washing Machine Repair'.",
        "A new request for a 'Private Chef' was just posted for an event next month.",
        "Success. A Helpa just completed a 'Custom Wardrobe' build for <strong>NGN 180,000</strong>.",
    ];

    let lastActivity = -1;

    const showRandomActivity = () => {
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * activities.length);
        } while (randomIndex === lastActivity);
        
        lastActivity = randomIndex;
        fomo.innerHTML = activities[randomIndex];
        fomo.classList.add('visible');

        setTimeout(() => {
            fomo.classList.remove('visible');
        }, 5000); // Hide after 5 seconds
    };

    // Show the first notification after a delay, then repeat
    setTimeout(() => {
        showRandomActivity();
        setInterval(showRandomActivity, 12000); // Show a new one every 12 seconds
    }, 7000); // Initial delay of 7 seconds
}

function initializeSwellAnimation() {
    const swellText = document.querySelector('.swell-text');
    if (!swellText) return;

    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (!swellText.classList.contains('swelling')) {
            swellText.classList.add('swelling');
        }
        
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            swellText.classList.remove('swelling');
        }, 500); // Reset after 500ms of no scrolling
    });
}

function initializeScrollInAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.value-block, .step-card, .testimonial-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
}
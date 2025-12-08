document.addEventListener('DOMContentLoaded', () => {


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

    // --- Supabase Authentication ---
    const initializeAuth = () => {
        // Wait for the supabase client to be initialized
        if (!window.supabaseClient) {
            setTimeout(initializeAuth, 50);
            return;
        }

        const supabase = window.supabaseClient;
        const signupForm = document.getElementById('signup-form');
        const loginForm = document.getElementById('login-form');

        // --- Signup Handler ---
        if (signupForm) {
            signupForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const email = signupForm.email.value;
                const password = signupForm.password.value;

                const { data, error } = await supabase.auth.signUp({
                    email: email,
                    password: password,
                });

                if (error) {
                    alert('Error signing up: ' + error.message);
                } else {
                    alert('Signup successful! Please check your email to verify your account.');
                    // Redirect to a confirmation page or login page
                    window.location.href = '/login.html';
                }
            });
        }

        // --- Login Handler ---
        if (loginForm) {
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const email = loginForm.email.value;
                const password = loginForm.password.value;

                const { data, error } = await supabase.auth.signInWithPassword({
                    email: email,
                    password: password,
                });

                if (error) {
                    alert('Error logging in: ' + error.message);
                } else {
                    // Redirect to the user's dashboard or home page
                    window.location.href = '/app/dashboard.html'; // Example redirect
                }
            });
        }
    };

    // Initialize authentication logic
    initializeAuth();
});
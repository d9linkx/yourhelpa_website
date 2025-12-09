document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const submitButton = loginForm.querySelector('button[type="submit"]');
    const errorMessage = document.getElementById('error-message');

    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Prevent default form submission

            // Clear previous errors
            errorMessage.style.display = 'none';
            errorMessage.textContent = '';

            const email = loginForm.email.value;
            const password = loginForm.password.value;

            // Provide user feedback
            submitButton.disabled = true;
            submitButton.textContent = 'Logging in...';

            // Use the Supabase client from supabase-client.js
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });

            if (error) {
                console.error('Login failed:', error.message);
                // Check for specific auth errors
                if (error.message.includes('Email not confirmed')) {
                    errorMessage.textContent = 'Your email has not been confirmed. Please check your inbox for a confirmation link.';
                } else {
                    errorMessage.textContent = 'That email and password combination is not correct. Please check your details and try again.';
                }
                errorMessage.style.display = 'block';
                // Re-enable the button
                submitButton.disabled = false;
                submitButton.textContent = 'Login';
            } else if (data.user) {
                // Login successful
                console.log('Login successful, redirecting...');
                
                // Redirect to the helpa dashboard.
                // A "successful login prompt" isn't great for user experience;
                // a direct redirect is smoother.
                window.location.href = '/helpa-dashboard.html'; 
            }
        });
    }
});
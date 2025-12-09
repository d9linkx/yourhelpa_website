document.addEventListener('DOMContentLoaded', () => {
    if (typeof supabase === 'undefined') {
        console.error('Supabase client is not loaded. Ensure supabase-client.js is included before login.js.');
        return;
    }

    const loginForm = document.getElementById('login-form');
    if (!loginForm) return; // Exit if the form is not on this page

    const errorMessageDiv = document.getElementById('error-message');
    const submitBtn = loginForm.querySelector('button[type="submit"]');
    const passwordInput = document.getElementById('password');
    const togglePassword = document.getElementById('toggle-password');

    // --- UI Helper Functions ---
    const show_error = (message) => {
        errorMessageDiv.textContent = message;
        errorMessageDiv.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const setLoadingState = (isLoading, message = 'Login') => {
        submitBtn.disabled = isLoading;
        submitBtn.textContent = message;
    };

    // --- Password Toggle Functionality ---
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);

            const eyeIcon = togglePassword.querySelector('.eye-icon');
            const eyeOffIcon = togglePassword.querySelector('.eye-off-icon');

            if (eyeIcon && eyeOffIcon) {
                eyeIcon.style.display = type === 'password' ? 'block' : 'none';
                eyeOffIcon.style.display = type === 'text' ? 'block' : 'none';
            }
        });
    }

    // --- Form Submission Handler ---
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorMessageDiv.style.display = 'none'; // Clear previous errors
        setLoadingState(true, 'Logging in...');

        const formData = new FormData(loginForm);
        const email = formData.get('email');
        const password = formData.get('password');

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });

            if (error) {
                handleAuthError(error);
                setLoadingState(false);
                return;
            }

            if (data.user) {
                // Redirect to dashboard or home page after successful login
                window.location.href = '/dashboard.html'; // Adjust this path as needed
            } else {
                // This case might occur if signInWithPassword returns no user but also no error
                show_error('Login failed. Please check your credentials.');
                setLoadingState(false);
            }

        } catch (error) {
            console.error('An unexpected error occurred during login:', error);
            show_error(error.message || 'An unexpected error occurred. Please try again.');
            setLoadingState(false);
        }
    });

    // --- Helper for Auth Errors ---
    function handleAuthError(error) {
        if (error.message.includes("Invalid login credentials")) {
            show_error("Invalid email or password. Please try again.");
        } else if (error.message.includes("Email not confirmed")) {
            show_error("Please confirm your email address before logging in.");
        } else {
            show_error(error.message);
        }
    }
});
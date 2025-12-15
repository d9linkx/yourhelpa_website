function initializeLoginPage() {
    const loginForm = document.getElementById('login-form');
    if (!loginForm) return; // Exit if the form is not on this page

    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const errorMessageDiv = document.getElementById('error-message');
    const submitBtn = loginForm.querySelector('button[type="submit"]');
    const togglePassword = document.getElementById('toggle-password');

    // --- UI Helper Functions ---
    const show_error = (message) => {
        errorMessageDiv.textContent = message;
        errorMessageDiv.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const setLoadingState = (isLoading, message = 'Login') => {
        if (submitBtn) {
            submitBtn.disabled = isLoading;
            submitBtn.textContent = message;
        }
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

        const email = emailInput.value;
        const password = passwordInput.value;

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });

            if (error) {
                handleAuthError(error);
                setLoadingState(false, 'Login');
                return;
            }

            if (data.user) {
                // On success, show a success message and then redirect.
                setLoadingState(true, 'Login Successful!'); // Keep button disabled, show success message
                setTimeout(() => {
                    window.location.href = 'helpa-dashboard.html'; // Redirect to the correct dashboard
                }, 1500); // Wait 1.5 seconds before redirecting
            } else {
                show_error('Login failed. Please check your credentials.');
                setLoadingState(false, 'Login');
            }

        } catch (error) {
            console.error('An unexpected error occurred during login:', error);
            show_error(error.message || 'An unexpected error occurred. Please try again.');
            setLoadingState(false, 'Login');
        }
    });

    // --- Helper for Auth Errors ---
    function handleAuthError(error) {
        if (error.message.includes("Invalid login credentials")) {
            show_error("Invalid email or password. Please try again.");
        } else {
            show_error(error.message);
        }
    }
}
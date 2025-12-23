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

    // If user already has an active session, redirect them to their dashboard
    const checkAndRedirectIfAuthenticated = async () => {
        try {
            if (typeof supabase === 'undefined') return false;
            const { data: { session } } = await supabase.auth.getSession();
            if (session && session.user) {
                // Try to lookup a profile role to route user appropriately. If that fails, fall back to a default dashboard.
                try {
                    const { data: profile, error: profileError } = await supabase.from('profiles').select('role').eq('id', session.user.id).single();
                    if (!profileError && profile && profile.role) {
                        if (profile.role === 'helpa') {
                            window.location.href = 'helpa-dashboard.html';
                            return true;
                        }
                        if (profile.role === 'user') {
                            window.location.href = 'dashboard-user.html';
                            return true;
                        }
                    }
                } catch (err) {
                    // ignore — we'll fall back to a reasonable default
                    console.warn('profile lookup failed', err);
                }

                // Default redirect if no role found
                window.location.href = 'helpa-dashboard.html';
                return true;
            }
        } catch (err) {
            console.warn('session check failed', err);
        }
        return false;
    };

    // Run session check before allowing the user to interact with the form
    checkAndRedirectIfAuthenticated();

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

            // v2 returns user and session in data
            const user = data?.user;
            const session = data?.session;

            if (user && session) {
                // On success, briefly show a success state then redirect.
                setLoadingState(true, 'Login Successful!');

                // Try to determine destination based on profile role, but don't block UX if lookup fails
                try {
                    const { data: profile, error: profileError } = await supabase.from('profiles').select('role').eq('id', user.id).single();
                    if (!profileError && profile && profile.role === 'user') {
                        setTimeout(() => window.location.href = 'dashboard-user.html', 900);
                        return;
                    }
                } catch (err) {
                    console.warn('profile lookup after login failed', err);
                }

                // default
                setTimeout(() => window.location.href = 'helpa-dashboard.html', 900);
                return;
            }

            show_error('Login failed. Please check your credentials.');
            setLoadingState(false, 'Login');

        } catch (error) {
            console.error('An unexpected error occurred during login:', error);
            show_error(error.message || 'An unexpected error occurred. Please try again.');
            setLoadingState(false, 'Login');
        }
    });

    // --- Helper for Auth Errors ---
    function handleAuthError(error) {
        // Supabase errors can come in different shapes. Normalize for user display.
        const msg = (error && (error.message || error.error_description || error.msg)) || String(error);
        if (msg && msg.toLowerCase().includes('invalid')) {
            show_error('Invalid email or password. Please try again.');
        } else {
            show_error(msg);
        }
    }
}
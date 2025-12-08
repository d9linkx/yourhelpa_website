document.addEventListener('DOMContentLoaded', () => {
    // Ensure we have a Supabase client available
    if (typeof supabase === 'undefined') {
        console.error('Supabase client is not loaded. Make sure supabase-client.js is included before auth.js.');
        return;
    }

    const loginForm = document.getElementById('login-form');
    const errorMessageDiv = document.getElementById('error-message');
    const logoutButton = document.getElementById('logout-btn');
    const helpaNameSpan = document.getElementById('helpa-name');

    // --- Helper Functions ---
    const show_error = (message) => {
        if (errorMessageDiv) {
            errorMessageDiv.textContent = message;
            errorMessageDiv.style.display = 'block';
        }
    };

    const clear_error = () => {
        if (errorMessageDiv) {
            errorMessageDiv.style.display = 'none';
        }
    };

    // --- Login Handler ---
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            clear_error();

            const submitBtn = loginForm.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Logging in...';

            const email = loginForm.email.value;
            const password = loginForm.password.value;

            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });

            if (error) {
                show_error(error.message);
                submitBtn.disabled = false;
                submitBtn.textContent = 'Login';
            } else {
                // On successful login, redirect to the dashboard
                window.location.href = '/app/dashboard.html';
            }
        });
    }

    // --- Dashboard Logic ---
    if (helpaNameSpan) {
        const checkSession = async () => {
            const { data: { session }, error } = await supabase.auth.getSession();
            if (!session || error) {
                // If no session, redirect to login
                window.location.href = '/login.html';
            } else {
                // If session exists, display user's name
                // The full_name is stored in user_metadata
                const userName = session.user.user_metadata.full_name || session.user.email;
                helpaNameSpan.textContent = userName;
            }
        };
        checkSession();
    }

    // --- Logout Handler ---
    if (logoutButton) {
        logoutButton.addEventListener('click', async (e) => {
            e.preventDefault();
            logoutButton.textContent = 'Logging out...';
            const { error } = await supabase.auth.signOut();
            if (error) {
                alert('Error logging out: ' + error.message);
            } else {
                window.location.href = '/login.html';
            }
        });
    }
});
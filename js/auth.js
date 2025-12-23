document.addEventListener('DOMContentLoaded', () => {
    // Ensure we have a Supabase client available
    const sb = window.supabase || (typeof supabase !== 'undefined' ? supabase : null);
    if (!sb) {
        console.error('Supabase client is not loaded. Make sure supabase-client.js is included before auth.js.');
        return;
    }

    // Handle logout for various button IDs used across pages
    const logoutButtons = document.querySelectorAll('#logout-btn, #logout-button, #logout-button-mobile, .logout-trigger');
    const helpaNameSpan = document.getElementById('helpa-name');
    const userNameSpan = document.getElementById('user-name');

    // --- Dashboard Logic ---
    if (helpaNameSpan || userNameSpan) {
        const checkSession = async () => {
            const { data: { session }, error } = await sb.auth.getSession();
            if (!session || error) {
                // If no session, redirect to login
                window.location.href = 'login.html';
            } else {
                // If session exists, display user's name
                // The full_name is stored in user_metadata
                const userName = session.user.user_metadata.full_name || session.user.email;
                if (helpaNameSpan) helpaNameSpan.textContent = userName;
                if (userNameSpan) userNameSpan.textContent = userName;
            }
        };
        checkSession();
    }

    // --- Logout Handler ---
    logoutButtons.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            const originalText = btn.textContent;
            btn.textContent = 'Logging out...';
            btn.disabled = true;
            const { error } = await sb.auth.signOut();
            if (error) {
                alert('Error logging out: ' + error.message);
                btn.textContent = originalText;
                btn.disabled = false;
            } else {
                window.location.href = 'login.html';
            }
        });
    });
});
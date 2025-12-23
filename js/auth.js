document.addEventListener('DOMContentLoaded', () => {
    // Ensure we have a Supabase client available
    if (typeof supabase === 'undefined') {
        console.error('Supabase client is not loaded. Make sure supabase-client.js is included before auth.js.');
        return;
    }

    const logoutButton = document.getElementById('logout-btn');
    const helpaNameSpan = document.getElementById('helpa-name');

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
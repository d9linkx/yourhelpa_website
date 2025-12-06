import { supabase } from './supabase-client.js';

const registerForm = document.getElementById('register-form');
const loginForm = document.getElementById('login-form');
const logoutButton = document.getElementById('logout-button');

/**
 * Handles user registration.
 */
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const form = e.target;
        const email = form.email.value;
        const password = form.password.value;
        const firstName = form.firstName.value;
        const phone = form.phone.value;

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    first_name: firstName,
                    phone: phone,
                    role: 'customer' // Default role
                }
            }
        });

        if (error) {
            alert(`Registration Error: ${error.message}`);
        } else {
            alert('Registration successful! Please check your email to verify your account.');
            window.location.href = 'login.html';
        }
    });
}

/**
 * Handles user login.
 */
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const form = e.target;
        const email = form.email.value;
        const password = form.password.value;

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            alert(`Login Error: ${error.message}`);
        } else {
            // Redirect based on role after login
            const { data: { user } } = await supabase.auth.getUser();
            const userRole = user?.user_metadata?.role;

            if (userRole === 'admin') {
                window.location.href = 'dashboard-admin.html';
            } else if (userRole === 'helpa') {
                window.location.href = 'dashboard-helpa.html';
            } else {
                window.location.href = 'dashboard-user.html';
            }
        }
    });
}

/**
 * Handles user logout.
 */
if (logoutButton) {
    logoutButton.addEventListener('click', async () => {
        await supabase.auth.signOut();
        window.location.href = 'login.html';
    });
}
import { supabase } from './supabase-client.js';

const profileForm = document.getElementById('profile-form');
const updateMessage = document.getElementById('update-message');

let currentUser = null;

/**
 * Gets the current logged-in user and redirects if not found.
 */
async function getUser() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error || !session) {
        window.location.href = 'login.html';
        return null;
    }
    return session.user;
}

/**
 * Fetches the user's profile from the 'profiles' table and populates the form.
 */
async function loadProfile() {
    currentUser = await getUser();
    if (!currentUser) return;

    // Populate the disabled email field
    document.getElementById('email').value = currentUser.email;

    // Fetch profile data from the 'profiles' table
    const { data: profile, error } = await supabase
        .from('profiles')
        .select('first_name, phone')
        .eq('id', currentUser.id)
        .single();

    if (error) {
        console.error('Error fetching profile:', error);
        updateMessage.textContent = 'Could not load your profile data.';
        updateMessage.className = 'error';
    } else if (profile) {
        document.getElementById('firstName').value = profile.first_name || '';
        document.getElementById('phone').value = profile.phone || '';
    }
}

/**
 * Handles the profile update form submission.
 */
if (profileForm) {
    profileForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        updateMessage.textContent = '';

        const newFirstName = document.getElementById('firstName').value;
        const newPhone = document.getElementById('phone').value;

        // 1. Update the user's metadata in auth.users
        const { error: userError } = await supabase.auth.updateUser({
            data: { first_name: newFirstName, phone: newPhone }
        });

        // 2. Update the public 'profiles' table
        const { error: profileError } = await supabase
            .from('profiles')
            .update({ first_name: newFirstName, phone: newPhone, updated_at: new Date() })
            .eq('id', currentUser.id);

        if (userError || profileError) {
            console.error('Error updating profile:', userError || profileError);
            updateMessage.textContent = 'Failed to update profile. Please try again.';
            updateMessage.className = 'error';
        } else {
            updateMessage.textContent = 'Profile updated successfully!';
            updateMessage.className = 'success';
        }
    });
}

document.addEventListener('DOMContentLoaded', loadProfile);
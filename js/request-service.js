import { supabase } from './supabase-client.js';

const requestForm = document.getElementById('request-form');
const requestMessage = document.getElementById('request-message');

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
 * Handles the service request form submission.
 */
if (requestForm) {
    requestForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        requestMessage.textContent = '';

        currentUser = await getUser();
        if (!currentUser) {
            requestMessage.textContent = 'You must be logged in to make a request.';
            requestMessage.className = 'error';
            return;
        }

        const description = document.getElementById('description').value;
        const amount = document.getElementById('amount').value || null; // Use null if empty

        const { data, error } = await supabase
            .from('transactions')
            .insert({
                user_id: currentUser.id,
                description: description,
                amount: amount,
                status: 'unassigned' // Initial status
            });

        if (error) {
            console.error('Error creating request:', error);
            requestMessage.textContent = 'Failed to submit your request. Please try again.';
            requestMessage.className = 'error';
        } else {
            alert('Your request has been submitted successfully!');
            window.location.href = 'dashboard-user.html';
        }
    });
}

document.addEventListener('DOMContentLoaded', getUser);
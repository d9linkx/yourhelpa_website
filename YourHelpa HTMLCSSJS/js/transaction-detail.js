import { supabase } from './supabase-client.js';

const detailsContainer = document.getElementById('transaction-details-container');
const updateSection = document.getElementById('update-status-section');
const updateForm = document.getElementById('update-status-form');
const updateMessage = document.getElementById('update-message');

/**
 * Gets the transaction ID from the URL query parameters.
 */
function getTransactionId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

/**
 * Fetches and displays the details for a single transaction.
 */
async function loadTransactionDetails() {
    const transactionId = getTransactionId();
    if (!transactionId) {
        detailsContainer.innerHTML = '<p class="error">No transaction ID provided.</p>';
        return;
    }

    const { data: transaction, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('id', transactionId)
        .single(); // Use .single() to get one record

    if (error || !transaction) {
        console.error('Error fetching transaction:', error);
        detailsContainer.innerHTML = '<p class="error">Could not find transaction.</p>';
        return;
    }

    // Display transaction details
    detailsContainer.innerHTML = `
        <p><strong>Description:</strong> ${transaction.description}</p>
        <p><strong>Amount:</strong> $${transaction.amount}</p>
        <p><strong>Current Status:</strong> ${transaction.status}</p>
        <p><strong>Created:</strong> ${new Date(transaction.created_at).toLocaleString()}</p>
    `;

    // Show the update form
    document.getElementById('transaction-id').value = transaction.id;
    document.getElementById('status').value = transaction.status;
    updateSection.style.display = 'block';
}

/**
 * Handles the form submission to update the transaction status.
 */
if (updateForm) {
    updateForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const transactionId = document.getElementById('transaction-id').value;
        const newStatus = document.getElementById('status').value;

        const { data, error } = await supabase
            .from('transactions')
            .update({ status: newStatus, updated_at: new Date() })
            .eq('id', transactionId)
            .select();

        if (error) {
            console.error('Error updating status:', error);
            updateMessage.textContent = 'Error updating status. Please try again.';
            updateMessage.className = 'error';
        } else {
            updateMessage.textContent = 'Status updated successfully!';
            updateMessage.className = 'success';
            // Refresh details to show the new status
            loadTransactionDetails();
        }
    });
}

document.addEventListener('DOMContentLoaded', loadTransactionDetails);
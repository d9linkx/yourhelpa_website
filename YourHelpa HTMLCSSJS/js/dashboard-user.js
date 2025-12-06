import { supabase } from './supabase-client.js'; // Correct path

// Add logout functionality to the dashboard
const logoutButton = document.getElementById('logout-button');
if (logoutButton) {
    logoutButton.addEventListener('click', async () => {
        await supabase.auth.signOut();
        window.location.href = 'login.html';
    });
}

async function getUser() {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
        console.error('Error getting session:', sessionError);
        window.location.href = 'login.html';
        return null;
    }
    if (!session) {
        window.location.href = 'login.html'; // Redirect to login if no session
        return null;
    }
    return session.user;
}

async function loadDashboard() {
    const user = await getUser();
    if (!user) return;

    document.getElementById('user-name').textContent = user.user_metadata?.first_name || user.email;

    // Fetch transactions for the current user
    // Assumes you have a 'transactions' table with a 'user_id' column.
    const { data: transactions, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id);

    if (error) {
        console.error('Error fetching transactions:', error);
        return;
    }

    const transactionsList = document.getElementById('transactions-list');
    if (transactions && transactions.length > 0) {
        transactionsList.innerHTML = transactions.map(tx => `<div>${tx.description} - $${tx.amount}</div>`).join('');
    } else {
        transactionsList.innerHTML = '<p>You have no transactions yet.</p>';
    }

}

// Load the dashboard data when the page is ready
document.addEventListener('DOMContentLoaded', loadDashboard);
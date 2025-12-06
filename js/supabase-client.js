import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// IMPORTANT: Replace with your actual Supabase project URL and anon key
const supabaseUrl = 'YOUR_SUPABASE_URL'; // Example: 'https://xyz.supabase.co'
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY'; // Example: 'ey...'

if (!supabaseUrl || supabaseUrl === 'YOUR_SUPABASE_URL' || !supabaseKey || supabaseKey === 'YOUR_SUPABASE_ANON_KEY') {
    console.error("Supabase URL and Key are not configured. Please update 'YourHelpa HTMLCSSJS/js/supabase-client.js'");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
const SUPABASE_URL = 'https://iujxrjqasrfcbdmrrirn.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1anhyanFhc3JmY2JkbXJyaXJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4NDMzMzQsImV4cCI6MjA4MDQxOTMzNH0.FMSG1PJRxQD0ZVXFAMsgK6hehAvLLIJBmMaC6dkhxLo';
// These variables will be populated by the js/config.js file,
// which is generated during the Vercel build process.
const { SUPABASE_URL, SUPABASE_ANON_KEY } = window;

// Create a single supabase client for interacting with your database
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Expose the client to the global scope so other scripts can use it
window.supabaseClient = supabase;

console.log('Supabase client initialized.');
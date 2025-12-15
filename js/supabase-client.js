// These variables will be populated by the js/config.js file,
// which is generated during the Vercel build process.
const { SUPABASE_URL, SUPABASE_ANON_KEY } = window;

// Create a single supabase client for interacting with your database
window.supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('Supabase client initialized.');
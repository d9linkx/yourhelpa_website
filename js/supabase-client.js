// These variables will be populated by the js/config.js file,
// which may be generated during the Vercel build process.
const { SUPABASE_URL, SUPABASE_ANON_KEY } = window;

// Debug: log whether config variables are present (avoid printing secret values)
console.log('Supabase config presence:', { SUPABASE_URL: !!SUPABASE_URL, SUPABASE_ANON_KEY: !!SUPABASE_ANON_KEY });

// Create a single supabase client for interacting with your database
window.supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('Supabase client initialized.');
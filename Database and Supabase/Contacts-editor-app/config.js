// Supabase Configuration
// Replace these with your Supabase credentials
const SUPABASE_URL = 'https://miwqiacuswrmbdnxxnuv.supabase.co';
const SUPABASE_KEY = 'sb_publishable_mhbh-kt3--d26mj3_dnHuw_rdTat01b';

// Check if credentials are set
function checkSupabaseConfig() {
    if (!SUPABASE_URL || !SUPABASE_KEY) {
        return false;
    }
    if (SUPABASE_URL === 'https://your-project.supabase.co' || 
        SUPABASE_KEY === 'your-anon-key') {
        return false;
    }
    return true;
}

// Initialize Supabase Client
async function initSupabaseClient() {
    if (!checkSupabaseConfig()) {
        console.error('Please configure Supabase credentials in config.js');
        return null;
    }

    // Using Supabase JavaScript client library
    // The script should be included in your HTML
    if (typeof supabase === 'undefined') {
        console.error('Supabase library not loaded. Add this to your HTML:');
        console.error('<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>');
        return null;
    }

    return supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
}

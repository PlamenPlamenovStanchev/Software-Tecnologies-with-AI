// Contact Book App - Verification Script
// Copy and paste this entire code into your browser console (F12 → Console tab)
// It will help diagnose what's wrong with your Supabase setup

(async function diagnoseSuperbase() {
    console.clear();
    console.log('%c=== Contact Book App Diagnostic Report ===', 'color: blue; font-size: 14px; font-weight: bold;');
    console.log(new Date().toLocaleString());
    console.log('');

    // Check 1: Supabase Library
    console.log('%cCheck 1: Supabase Library', 'color: green; font-weight: bold;');
    if (typeof supabase !== 'undefined') {
        console.log('✅ Supabase library is loaded');
    } else {
        console.log('❌ Supabase library is NOT loaded');
        console.log('   Fix: Add <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script> to index.html');
    }
    console.log('');

    // Check 2: Config Variables
    console.log('%cCheck 2: Configuration Variables', 'color: green; font-weight: bold;');
    if (typeof SUPABASE_URL !== 'undefined') {
        console.log('✅ SUPABASE_URL is defined');
        console.log('   Value:', SUPABASE_URL);
    } else {
        console.log('❌ SUPABASE_URL is NOT defined');
        console.log('   Fix: Check config.js file');
    }

    if (typeof SUPABASE_KEY !== 'undefined') {
        console.log('✅ SUPABASE_KEY is defined');
        console.log('   Value (first 20 chars):', SUPABASE_KEY.substring(0, 20) + '...');
    } else {
        console.log('❌ SUPABASE_KEY is NOT defined');
        console.log('   Fix: Check config.js file');
    }
    console.log('');

    // Check 3: Config Validation Function
    console.log('%cCheck 3: Config Validation', 'color: green; font-weight: bold;');
    if (typeof checkSupabaseConfig === 'function') {
        const isValid = checkSupabaseConfig();
        if (isValid) {
            console.log('✅ Config validation passed');
        } else {
            console.log('❌ Config validation failed');
            console.log('   Issue: Credentials are not properly configured');
            console.log('   Fix: Update SUPABASE_URL and SUPABASE_KEY in config.js');
        }
    } else {
        console.log('❌ checkSupabaseConfig function not found');
    }
    console.log('');

    // Check 4: Supabase Client
    console.log('%cCheck 4: Supabase Client', 'color: green; font-weight: bold;');
    if (typeof supabaseClient !== 'undefined' && supabaseClient !== null) {
        console.log('✅ Supabase client is initialized');
    } else {
        console.log('❌ Supabase client is NOT initialized');
        if (typeof supabase !== 'undefined' && typeof SUPABASE_URL !== 'undefined') {
            console.log('   Attempting to create client...');
            try {
                const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
                console.log('✅ Successfully created a test client');
            } catch (e) {
                console.log('❌ Failed to create client:', e.message);
            }
        }
    }
    console.log('');

    // Check 5: Database Connection
    console.log('%cCheck 5: Database Connection', 'color: green; font-weight: bold;');
    if (typeof supabaseClient !== 'undefined' && supabaseClient !== null) {
        try {
            const { data, error } = await supabaseClient
                .from('contacts')
                .select('count', { count: 'exact', head: true });

            if (error) {
                console.log('❌ Database error:', error.message);
                if (error.message.includes('does not exist')) {
                    console.log('   Fix: Create the "contacts" table in Supabase');
                    console.log('   Run the SQL from schema.sql file');
                } else if (error.message.includes('401') || error.message.includes('Unauthorized')) {
                    console.log('   Fix: Check your API key in config.js');
                }
            } else {
                console.log('✅ Successfully connected to database');
                console.log('   Contacts table exists');
            }
        } catch (e) {
            console.log('❌ Connection test failed:', e.message);
        }
    } else {
        console.log('⚠️  Cannot test database (client not initialized)');
    }
    console.log('');

    // Check 6: Network
    console.log('%cCheck 6: Network Status', 'color: green; font-weight: bold;');
    try {
        const response = await fetch('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2', {
            method: 'HEAD'
        });
        console.log('✅ Network is working');
    } catch (e) {
        console.log('❌ Network error:', e.message);
        console.log('   Fix: Check your internet connection');
    }
    console.log('');

    // Check 7: All Contacts Data
    console.log('%cCheck 7: Data Status', 'color: green; font-weight: bold;');
    if (typeof allContacts !== 'undefined') {
        console.log('✅ Contacts array exists');
        console.log('   Total contacts:', allContacts.length);
        if (allContacts.length > 0) {
            console.log('   First contact:', allContacts[0]);
        }
    } else {
        console.log('⚠️  Contacts array not accessible');
    }
    console.log('');

    // Summary
    console.log('%c=== Diagnostic Summary ===', 'color: blue; font-size: 14px; font-weight: bold;');
    console.log('If you see ✅ for most items, your app should be working.');
    console.log('If you see ❌, follow the suggested fixes above.');
    console.log('');
    console.log('Next steps:');
    console.log('1. Fix any ❌ issues shown above');
    console.log('2. Refresh the page (F5)');
    console.log('3. Run this diagnostic again');
    console.log('');
    console.log('Need help? Check TROUBLESHOOTING.md in your project folder');
    console.log('%c=============================', 'color: blue;');
})();

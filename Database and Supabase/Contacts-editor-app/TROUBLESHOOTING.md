# Contact Book App - Troubleshooting Guide

## ❌ "Failed to initialize Supabase" Error

This guide will help you fix Supabase initialization issues.

---

## 🔍 Step 1: Check Browser Console

1. Open your app in browser
2. Press **F12** to open Developer Tools
3. Go to **Console** tab
4. Look for error messages (red text)
5. Take note of the exact error message

---

## ✅ Common Issues & Solutions

### Issue 1: "Invalid Supabase credentials"

**Cause**: `SUPABASE_URL` or `SUPABASE_KEY` is missing or incorrect in `config.js`

**Solution**:
1. Open `config.js`
2. Check line 3-4:
   ```javascript
   const SUPABASE_URL = 'https://miwqiacuswrmbdnxxnuv.supabase.co';
   const SUPABASE_KEY = 'sb_publishable_mhbh-kt3--d26mj3_dnHuw_rdTat01b';
   ```
3. Both values should be non-empty and NOT placeholder text
4. If they look wrong, get fresh credentials from Supabase:
   - Go to [supabase.com](https://supabase.com)
   - Login to your project
   - Settings → API → Copy the exact values
5. Paste them into `config.js`

---

### Issue 2: "Supabase library not loaded"

**Cause**: The Supabase JavaScript library script is missing from HTML

**Solution**:
1. Open `index.html`
2. Look for this line near the bottom (before closing `</body>`):
   ```html
   <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
   ```
3. If missing, add this line **BEFORE** the `config.js` and `app.js` scripts:
   ```html
   <!-- Supabase Library -->
   <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
   
   <!-- Your Scripts -->
   <script src="config.js"></script>
   <script src="app.js"></script>
   ```

---

### Issue 3: "Network error: Cannot reach Supabase"

**Cause**: 
- Firewall/proxy blocking Supabase
- Internet connection issue
- Supabase service down

**Solution**:
1. Check your internet connection
2. Try pinging Supabase:
   - Open browser console
   - Type: `fetch('https://cdn.jsdelivr.net/').then(r => console.log('Online'))` and press Enter
   - If it works, you have internet
3. Try accessing Supabase directly:
   - Go to your Supabase URL directly in browser
   - Example: `https://miwqiacuswrmbdnxxnuv.supabase.co`
   - Should show Supabase page or error
4. Check firewall/VPN settings
5. Check if Supabase service is up at [status.supabase.com](https://status.supabase.com)

---

### Issue 4: "Database error: contacts table does not exist"

**Cause**: The `contacts` table wasn't created in Supabase

**Solution**:
1. Go to your Supabase project
2. Click **SQL Editor** in left menu
3. Click **New Query**
4. Copy and paste this SQL:
   ```sql
   CREATE TABLE IF NOT EXISTS contacts (
     id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
     name text NOT NULL,
     phone text NOT NULL,
     email text NOT NULL,
     town text,
     comments text,
     created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
     updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
   );
   
   CREATE INDEX IF NOT EXISTS contacts_name_idx ON contacts(name);
   CREATE INDEX IF NOT EXISTS contacts_email_idx ON contacts(email);
   ```
5. Click **Run** button
6. Refresh your Contact Book app

---

### Issue 5: "Authentication error: Invalid API key"

**Cause**: The API key in `config.js` is wrong or revoked

**Solution**:
1. Go to Supabase Dashboard
2. Go to **Settings → API**
3. Under **Project API keys**:
   - Copy the **Project URL** (under "Your Project URL")
   - Copy the **Anon Key** (under "service_role" section, there's an "anon" key)
4. Open `config.js`
5. Replace:
   ```javascript
   const SUPABASE_URL = 'https://your-project.supabase.co';
   const SUPABASE_KEY = 'your-anon-key';
   ```
6. With your actual values
7. Save and refresh the app

---

## 🧪 Step 2: Verify Your Setup

Use browser console to test (Press F12 → Console):

### Test 1: Check if Supabase library is loaded
```javascript
console.log(typeof supabase !== 'undefined' ? '✅ Loaded' : '❌ Not loaded')
```

### Test 2: Check if credentials are set
```javascript
console.log('URL:', SUPABASE_URL)
console.log('KEY:', SUPABASE_KEY ? 'SET' : 'MISSING')
```

### Test 3: Check config validation
```javascript
console.log('Config valid:', checkSupabaseConfig())
```

### Test 4: Try creating client
```javascript
const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
console.log('Client created:', client ? '✅' : '❌')
```

### Test 5: Try fetching contacts
```javascript
supabaseClient.from('contacts').select('*').then(res => {
  console.log('Result:', res);
});
```

---

## 📋 Debugging Checklist

- [ ] `index.html` has the Supabase library script
- [ ] `config.js` has correct `SUPABASE_URL` value
- [ ] `config.js` has correct `SUPABASE_KEY` value
- [ ] `contacts` table exists in Supabase
- [ ] `contacts` table has all required columns
- [ ] Browser console shows no errors (F12)
- [ ] Network is working (can access other websites)
- [ ] Supabase project is active (not paused)

---

## 🔧 Complete Setup Verification

Follow these steps to verify everything is correct:

### 1. Verify Files Exist
```
- index.html ✓
- config.js ✓
- app.js ✓
- styles.css ✓
```

### 2. Verify index.html
Open `index.html` and check:
- Line with `<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>` exists
- Line with `<script src="config.js"></script>` exists
- Line with `<script src="app.js"></script>` exists

### 3. Verify config.js
Open `config.js` and check:
```javascript
const SUPABASE_URL = 'https://YOUR-PROJECT.supabase.co'; // ✓ Has real value
const SUPABASE_KEY = 'sb_real_key_here'; // ✓ Has real value
```

### 4. Verify Supabase
In Supabase Dashboard:
- [ ] Can access your project
- [ ] `contacts` table exists
- [ ] Table has columns: id, name, phone, email, town, comments
- [ ] API keys are visible and correct

### 5. Test the App
- [ ] Open `index.html` in browser
- [ ] Open console (F12)
- [ ] Check for errors (red text)
- [ ] "Add Contact" button should be clickable
- [ ] Search box should work

---

## 🆘 Still Having Issues?

### Enable Debug Logging

Edit `config.js` and add this after the last line:
```javascript
// Debug logging
console.log('=== Contact Book App Debug Info ===');
console.log('SUPABASE_URL:', SUPABASE_URL);
console.log('SUPABASE_KEY exists:', !!SUPABASE_KEY);
console.log('Config valid:', checkSupabaseConfig());
console.log('====================================');
```

### Check Exact Error

1. Open browser console (F12)
2. Refresh page (F5)
3. Look for error messages
4. Copy the complete error text
5. Compare with solutions above

### Nuclear Option: Reset and Verify

1. Delete `config.js`
2. Copy this new content:
   ```javascript
   // Supabase Configuration
   const SUPABASE_URL = 'https://your-project.supabase.co';
   const SUPABASE_KEY = 'your-anon-key';

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

   async function initSupabaseClient() {
       if (!checkSupabaseConfig()) {
           console.error('Please configure Supabase credentials in config.js');
           return null;
       }

       if (typeof supabase === 'undefined') {
           console.error('Supabase library not loaded');
           return null;
       }

       return supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
   }
   ```
3. Fill in your real credentials
4. Save file
5. Refresh app in browser

---

## 📞 Still Stuck?

If you've checked everything above, try:

1. **Clear browser cache**: Press Ctrl+Shift+Delete and clear cache
2. **Use incognito/private browser**: Rules out extensions interfering
3. **Try different browser**: Chrome, Firefox, Safari to identify browser-specific issues
4. **Check Supabase status**: [status.supabase.com](https://status.supabase.com)
5. **Contact Supabase support**: [supabase.com/support](https://supabase.com/support)

---

**Good luck! You've got this! 🚀**

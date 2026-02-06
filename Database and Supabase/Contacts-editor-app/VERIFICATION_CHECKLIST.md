# ✅ Supabase Setup Verification Checklist

## Step-by-Step Setup & Verification

Follow these steps in order to ensure everything is configured correctly.

---

## 📋 Step 1: Verify Files Exist

In your project folder, you should have:

```
✓ index.html          - Main app file
✓ app.js              - Application logic
✓ styles.css          - Styling
✓ config.js           - Supabase configuration
✓ schema.sql          - Database setup
✓ README.md           - Documentation
✓ QUICKSTART.md       - Quick setup guide
✓ TROUBLESHOOTING.md  - Troubleshooting guide
✓ diagnostic.js       - Diagnostic tool
✓ FIX_NOTES.md        - What was fixed
✓ PROJECT.md          - Project details
```

**Status:** 
- [ ] All files present

---

## 🔑 Step 2: Get Supabase Credentials

1. Go to [supabase.com](https://supabase.com) and login
2. Select your project
3. Go to **Settings → API** (left sidebar)
4. Copy your **Project URL**:
   ```
   Example: https://abcdefgh.supabase.co
   ```
5. Copy your **Anon/Public Key**:
   ```
   Example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

**Status:**
- [ ] Project URL copied
- [ ] API Key copied
- [ ] Both values saved somewhere

---

## 🔧 Step 3: Update config.js

1. Open `config.js` in your editor
2. Find lines 3-4:
   ```javascript
   const SUPABASE_URL = 'https://miwqiacuswrmbdnxxnuv.supabase.co';
   const SUPABASE_KEY = 'sb_publishable_mhbh-kt3--d26mj3_dnHuw_rdTat01b';
   ```
3. Replace with YOUR credentials:
   ```javascript
   const SUPABASE_URL = 'https://YOUR-PROJECT.supabase.co';
   const SUPABASE_KEY = 'YOUR-API-KEY-HERE';
   ```
4. **Save the file**

**Verification:**
- [ ] SUPABASE_URL is updated
- [ ] SUPABASE_KEY is updated
- [ ] File is saved (Ctrl+S)

---

## 🗄️ Step 4: Create Database Table

### Option A: Using SQL (Recommended)

1. Go to Supabase Dashboard
2. Click **SQL Editor** (left sidebar)
3. Click **New Query**
4. Copy this SQL:
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
5. Paste into the editor
6. Click **Run** button
7. You should see "Success" message

### Option B: Using Supabase UI

1. Go to **Table Editor** (left sidebar)
2. Click **Create a new table**
3. Set table name: `contacts`
4. Add columns:
   - `id` (int8, Primary Key, Auto-increment)
   - `name` (text, Required)
   - `phone` (text, Required)
   - `email` (text, Required)
   - `town` (text, Optional)
   - `comments` (text, Optional)
5. Click **Save**

**Verification:**
- [ ] `contacts` table created
- [ ] Table has 6 columns (id, name, phone, email, town, comments)
- [ ] Columns are correct type
- [ ] Can see empty table in Supabase

---

## 🌐 Step 5: Verify index.html

1. Open `index.html` in your editor
2. Scroll to the very bottom (before closing `</body>`)
3. Find these lines:
   ```html
   <!-- Supabase Library -->
   <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

   <!-- Scripts -->
   <script src="config.js"></script>
   <script src="app.js"></script>
   ```
4. Make sure ALL THREE lines are present

**Verification:**
- [ ] Supabase library script present
- [ ] config.js script included
- [ ] app.js script included
- [ ] Scripts in correct order

---

## 🚀 Step 6: Run the App

### Option 1: Direct Open
1. Right-click `index.html`
2. Select "Open with" → Your browser
3. App opens in browser

### Option 2: Local Server (Better)

**Windows PowerShell:**
```powershell
cd "c:\Обучения\Software Tecnologies with AI\Database and Supabase\Contacts-editor-app"
python -m http.server 8000
```

Then open in browser: `http://localhost:8000`

**Status:**
- [ ] App opens in browser
- [ ] No blank page
- [ ] Header visible

---

## 🔍 Step 7: Check Console for Errors

1. Press **F12** to open Developer Tools
2. Go to **Console** tab
3. Look for red error messages
4. Look for green checkmarks ✅

**Expected Console Output:**
```
✅ Supabase library loaded successfully
✅ Supabase config is valid
✅ Supabase client initialized successfully
✅ Loading contacts from Supabase...
✅ Successfully loaded 0 contacts
```

**Status:**
- [ ] Console has no red errors
- [ ] Console shows success messages
- [ ] "Failed to initialize" message gone

---

## 🧪 Step 8: Test Functionality

### Test 1: Add a Contact
1. Click **+ Add Contact** button
2. Fill in the form:
   - Name: Test User
   - Phone: 123-456-7890
   - Email: test@example.com
   - Town: Test City
   - Comments: Test comment
3. Click **Save Contact**
4. Should see success message
5. Contact should appear in list

**Status:**
- [ ] Form opens without errors
- [ ] Save works
- [ ] Contact appears in app
- [ ] Success message shown

### Test 2: Check in Supabase
1. Go to Supabase Dashboard
2. Go to **Table Editor**
3. Click **contacts** table
4. Your new contact should appear!

**Status:**
- [ ] Contact visible in Supabase
- [ ] Data is correctly saved

### Test 3: Search
1. Type in the search box
2. Try searching by name, phone, or email
3. Results should filter in real-time

**Status:**
- [ ] Search works
- [ ] Results filter correctly

### Test 4: Edit
1. Click the ✏️ button on any contact
2. Change some information
3. Click **Save Contact**
4. Changes should be reflected in both app and Supabase

**Status:**
- [ ] Edit modal opens
- [ ] Changes save
- [ ] Updated in list and database

### Test 5: Delete
1. Click the 🗑️ button on any contact
2. Confirm deletion
3. Contact should disappear

**Status:**
- [ ] Delete confirmation appears
- [ ] Contact removed from app
- [ ] Removed from Supabase

---

## 🎉 Final Verification

If you have checkmarks on all these:

- [ ] All files exist
- [ ] config.js updated with credentials
- [ ] Supabase table created
- [ ] index.html has all scripts
- [ ] App opens in browser
- [ ] No console errors
- [ ] Add contact works
- [ ] Contact saved to Supabase
- [ ] Search works
- [ ] Edit works
- [ ] Delete works

**CONGRATULATIONS! Your Contact Book App is fully working! 🎊**

---

## ❌ If Something Doesn't Work

1. **Check console** (F12 → Console)
2. **Look for red errors**
3. **Read TROUBLESHOOTING.md**
4. **Run diagnostic.js** in console
5. **Verify each step** in this checklist

---

## 📞 Still Having Issues?

1. **Google the error message** - Often helps!
2. **Check browser version** - Must be modern (Chrome, Firefox, Safari)
3. **Try incognito mode** - Avoids browser cache issues
4. **Check internet connection**
5. **Verify Supabase project is active** (not paused)

---

**Good luck! You've got this! 🚀**

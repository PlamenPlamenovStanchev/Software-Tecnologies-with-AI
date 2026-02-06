# Contact Book App - Quick Setup Guide

## 🚀 Get Started in 5 Minutes

### 1. Supabase Setup

Go to [supabase.com](https://supabase.com) and sign in or create a free account.

**Create the Contacts Table:**

```sql
CREATE TABLE contacts (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  town text,
  comments text,
  created_at timestamp DEFAULT NOW(),
  updated_at timestamp DEFAULT NOW()
);
```

Or use the Supabase Dashboard:
1. Go to **SQL Editor** → **New Query**
2. Paste the SQL above and run it
3. Or manually create a table with these columns

### 2. Get Your Credentials

1. Open your Supabase project
2. Go to **Settings → API**
3. Copy the **Project URL** (looks like `https://xxxxx.supabase.co`)
4. Copy the **Anon Key** (under Public Key)

### 3. Update config.js

Replace these values in `config.js`:

```javascript
const SUPABASE_URL = 'YOUR_PROJECT_URL_HERE';
const SUPABASE_KEY = 'YOUR_ANON_KEY_HERE';
```

Example:
```javascript
const SUPABASE_URL = 'https://myproject.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

### 4. Run the App

**Option A: Direct Open**
- Double-click `index.html` to open in browser

**Option B: Local Server (Recommended)**

Windows PowerShell:
```powershell
python -m http.server 8000
```

Then open: http://localhost:8000

### 5. Test It Out!

1. Click **+ Add Contact**
2. Fill in Name, Phone, Email (required)
3. Add Town and Comments (optional)
4. Click **Save Contact**
5. Your contact appears in the list!

---

## 📝 Table Schema Reference

Your `contacts` table needs these columns:

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| `id` | bigint | Yes | Primary key, auto-increment |
| `name` | text | Yes | Contact name |
| `phone` | text | Yes | Phone number |
| `email` | text | Yes | Email address |
| `town` | text | No | Town/City |
| `comments` | text | No | Additional notes |

---

## ✅ Verify It's Working

1. Add a contact in the app
2. Go to Supabase Dashboard → **contacts** table
3. You should see your new contact in the table

If you don't see it, check:
- Are the credentials in `config.js` correct?
- Does the table exist in Supabase?
- Check browser console (F12) for error messages

---

## 🎨 Features Included

✅ Add/Edit/Delete contacts
✅ Search in real-time
✅ View full contact details
✅ Responsive design (mobile-friendly)
✅ Modern UI with animations
✅ Data validation
✅ Error handling
✅ Loading indicators

---

## 📱 The App Includes These Dialogs

1. **Add Contact** - Modal form with validation
2. **Edit Contact** - Pre-filled form to update
3. **View Details** - Full contact information
4. **Delete Confirmation** - Confirmation before deleting

---

**That's it! Your Contact Book is ready to use! 📇**

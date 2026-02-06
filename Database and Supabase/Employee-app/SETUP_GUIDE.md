# How to Create Tables in Supabase

Since the Supabase CLI requires specific installation, here's the easiest way to create your tables:

## Option 1: Using Supabase SQL Editor (Recommended) ⭐

1. **Go to your Supabase project dashboard**
   - Open https://supabase.com/dashboard
   - Select your project

2. **Open the SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New query"

3. **Copy and paste the SQL**
   - Open the file: `setup_tables.sql`
   - Copy ALL the contents
   - Paste into the SQL Editor

4. **Run the script**
   - Click "Run" or press `Ctrl+Enter`
   - You should see "Tables created successfully!" message

5. **Verify tables were created**
   - Go to "Table Editor" in the left sidebar
   - You should now see `departments` and `employees` tables

## Option 2: Install Supabase CLI via Scoop (For Local Development)

If you want to use the CLI for local development:

```powershell
# Install Scoop (if not installed)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
Invoke-RestMethod -Uri https://get.scoop.sh | Invoke-Expression

# Install Supabase CLI
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase

# Then run:
supabase init
supabase start
```

## Option 3: Use Migration Files Directly in Dashboard

1. Go to your Supabase Dashboard → Database → Migrations
2. Create a new migration
3. Copy contents from each file in `supabase/migrations/` in order:
   - `20260206000001_create_departments_table.sql`
   - `20260206000002_create_employees_table.sql`
   - `20260206000003_add_foreign_keys.sql`

## What You'll Get

After running the SQL, you'll have:

✅ **`departments` table** with columns:
   - id, name, description, manager_id, created_at, updated_at

✅ **`employees` table** with columns:
   - id, name, job_title, department_id, email, phone, manager_id, created_at, updated_at

✅ **Proper relationships** between tables
✅ **Indexes** for fast queries
✅ **Row Level Security** enabled (you'll need to add policies later)

## Next Steps

Once tables are created, you can:
- Insert sample data using the Table Editor
- Generate TypeScript types from the dashboard
- Build your frontend application
- Add RLS policies for authentication

---

**Note:** The easiest method is Option 1 (SQL Editor). It takes less than 1 minute!

# Employee App - Supabase Database

This project sets up a Supabase database for managing company employees and departments.

## Database Schema

### Tables

#### `departments`
Stores information about company departments.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `bigserial` | PRIMARY KEY | Unique department identifier |
| `name` | `text` | NOT NULL | Department name |
| `description` | `text` | - | Department description (optional) |
| `manager_id` | `bigint` | FK → employees(id) | Manager assigned to this department (optional) |
| `created_at` | `timestamp` | DEFAULT now() | Creation timestamp |
| `updated_at` | `timestamp` | DEFAULT now() | Last update timestamp |

**Indexes:**
- `departments_manager_id_idx` on `manager_id`

---

#### `employees`
Stores information about company employees.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `bigserial` | PRIMARY KEY | Unique employee identifier |
| `name` | `text` | NOT NULL | Employee full name |
| `job_title` | `text` | NOT NULL | Employee job title |
| `department_id` | `bigint` | FK → departments(id) | Department assignment (optional) |
| `email` | `text` | UNIQUE | Email address (optional) |
| `phone` | `text` | - | Phone number (optional) |
| `manager_id` | `bigint` | FK → employees(id) | Direct manager (optional, self-referential) |
| `created_at` | `timestamp` | DEFAULT now() | Creation timestamp |
| `updated_at` | `timestamp` | DEFAULT now() | Last update timestamp |

**Indexes:**
- `employees_department_id_idx` on `department_id`
- `employees_manager_id_idx` on `manager_id`
- `employees_email_idx` on `email`
- `employees_reports_to_idx` on `manager_id`

---

## Relationships

```
┌──────────────────┐         ┌─────────────────┐
│   departments    │         │   employees     │
├──────────────────┤         ├─────────────────┤
│ id (PK)          │◄────────│ id (PK)         │
│ name             │ 1:1     │ name            │
│ description      │         │ job_title       │
│ manager_id (FK)  │─┐       │ department_id   │
│ created_at       │ │       │ email (UNIQUE)  │
│ updated_at       │ └──────►│ phone           │
└──────────────────┘         │ manager_id (FK) │
                             │ created_at      │
                             │ updated_at      │
                             └─────────────────┘
```

### Key Relationships:
- **Employees → Departments**: Many employees belong to one department (optional)
- **Employees → Manager**: Many employees can report to one manager (optional, self-referential)
- **Departments → Manager**: One department has one manager (optional, must be an employee)

---

## Getting Started

### Prerequisites
- [Supabase CLI](https://supabase.com/docs/guides/local-development/cli/getting-started)
- Node.js 16+ (optional, for TypeScript types and client)
- PostgreSQL (for local emulator)

### Local Development with Supabase Emulator

#### 1. Initialize Supabase (if not already done)
```powershell
supabase init
```

#### 2. Start the local Supabase instance
```powershell
supabase start
```

This will:
- Start the local Postgres database
- Start the Supabase API
- Run all migrations in `supabase/migrations/`

#### 3. Verify tables were created
```powershell
supabase db push
```

Or connect via `psql`:
```powershell
psql -h localhost -U postgres -d postgres
# Then run: \dt public.*
```

### Connect to Remote Supabase Project

#### 1. Link to your Supabase project
```powershell
supabase link --project-ref your-project-ref
```

You'll be prompted for your database password.

#### 2. Push migrations to production
```powershell
supabase db push
```

#### 3. Pull the latest schema from remote
```powershell
supabase db pull
```

---

## Generating TypeScript Types

If you have a Node.js project, generate type-safe client types:

```powershell
supabase gen types typescript --linked > types/supabase.ts
```

Then use in your client:
```typescript
import { createClient } from '@supabase/supabase-js'
import type { Database } from './types/supabase'

const supabase = createClient<Database>(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
)

// Now you have full type safety:
const { data, error } = await supabase
  .from('employees')
  .select()
```

---

## Example Queries

### Insert a department
```sql
INSERT INTO public.departments (name, description)
VALUES ('Engineering', 'Software development team');
```

### Insert an employee
```sql
INSERT INTO public.employees (name, job_title, department_id, email, phone)
VALUES ('John Doe', 'Senior Engineer', 1, 'john@company.com', '555-0001');
```

### Assign a manager to department
```sql
UPDATE public.departments
SET manager_id = 1
WHERE id = 1;
```

### Assign a manager to employee
```sql
UPDATE public.employees
SET manager_id = 1
WHERE id = 2;
```

### Get all employees with their manager and department
```sql
SELECT
  e.id,
  e.name,
  e.job_title,
  d.name as department,
  m.name as manager
FROM public.employees e
LEFT JOIN public.departments d ON e.department_id = d.id
LEFT JOIN public.employees m ON e.manager_id = m.id;
```

### Get all reports for a manager
```sql
SELECT * FROM public.employees
WHERE manager_id = 1
ORDER BY name;
```

---

## Notes

- **RLS (Row Level Security)**: Both tables have RLS enabled but currently have no policies. Add authentication policies as needed.
- **Foreign Keys**: All foreign keys use `ON DELETE SET NULL` to maintain referential integrity without orphaning records.
- **Email Uniqueness**: Email is unique but optional; allow `NULL` for employees without an email.
- **Circular References**: You can have circular manager references (e.g., A manages B, B manages A). Implement business logic to prevent this if needed.

---

## Files

- `supabase/migrations/` - SQL migration files
- `supabase.toml` - Supabase project configuration
- `.gitignore` - Version control exclusions

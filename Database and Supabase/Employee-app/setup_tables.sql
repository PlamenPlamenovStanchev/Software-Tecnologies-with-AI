-- ============================================================================
-- Employee App Database Schema
-- Run this entire script in Supabase SQL Editor to create all tables
-- ============================================================================

-- 1. Create departments table
-- ============================================================================
create table if not exists public.departments (
  id bigserial primary key,
  name text not null,
  description text,
  manager_id bigint,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS (Row Level Security)
alter table public.departments enable row level security;

-- Create index for common queries
create index if not exists departments_manager_id_idx on public.departments(manager_id);

-- Add comments for documentation
comment on table public.departments is 'Company departments with optional manager assignment';
comment on column public.departments.name is 'Department name (required)';
comment on column public.departments.description is 'Department description (optional)';
comment on column public.departments.manager_id is 'Reference to employee who manages this department (optional)';


-- 2. Create employees table
-- ============================================================================
create table if not exists public.employees (
  id bigserial primary key,
  name text not null,
  job_title text not null,
  department_id bigint,
  email text,
  phone text,
  manager_id bigint,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS (Row Level Security)
alter table public.employees enable row level security;

-- Create indexes for common queries
create index if not exists employees_department_id_idx on public.employees(department_id);
create index if not exists employees_manager_id_idx on public.employees(manager_id);
create index if not exists employees_email_idx on public.employees(email);

-- Add unique constraint on email (optional, but recommended)
do $$ 
begin
  if not exists (
    select 1 from pg_constraint 
    where conname = 'employees_email_unique'
  ) then
    alter table public.employees add constraint employees_email_unique unique (email);
  end if;
end $$;

-- Add comments for documentation
comment on table public.employees is 'Company employees with optional department, manager, and contact assignments';
comment on column public.employees.name is 'Employee full name (required)';
comment on column public.employees.job_title is 'Employee job title (required)';
comment on column public.employees.department_id is 'Reference to department (optional)';
comment on column public.employees.email is 'Employee email address (optional)';
comment on column public.employees.phone is 'Employee phone number (optional)';
comment on column public.employees.manager_id is 'Reference to manager employee (optional, self-referential)';


-- 3. Add foreign key constraints
-- ============================================================================

-- Employees -> Departments
do $$ 
begin
  if not exists (
    select 1 from pg_constraint 
    where conname = 'employees_department_id_fk'
  ) then
    alter table public.employees
      add constraint employees_department_id_fk
      foreign key (department_id) references public.departments(id) on delete set null;
  end if;
end $$;

-- Employees -> Employees (manager self-reference)
do $$ 
begin
  if not exists (
    select 1 from pg_constraint 
    where conname = 'employees_manager_id_fk'
  ) then
    alter table public.employees
      add constraint employees_manager_id_fk
      foreign key (manager_id) references public.employees(id) on delete set null;
  end if;
end $$;

-- Departments -> Employees (manager)
do $$ 
begin
  if not exists (
    select 1 from pg_constraint 
    where conname = 'departments_manager_id_fk'
  ) then
    alter table public.departments
      add constraint departments_manager_id_fk
      foreign key (manager_id) references public.employees(id) on delete set null;
  end if;
end $$;

-- Create additional index for finding employees under a manager
create index if not exists employees_reports_to_idx on public.employees(manager_id);


-- 4. Create RLS policies (optional - allows public access for development)
-- ============================================================================
-- Uncomment these if you want to allow read/write access without authentication

-- create policy "Allow public read access to departments"
--   on public.departments for select
--   using (true);

-- create policy "Allow public write access to departments"
--   on public.departments for all
--   using (true);

-- create policy "Allow public read access to employees"
--   on public.employees for select
--   using (true);

-- create policy "Allow public write access to employees"
--   on public.employees for all
--   using (true);


-- 5. Verify tables were created
-- ============================================================================
select 'Tables created successfully!' as status;
select table_name, table_type 
from information_schema.tables 
where table_schema = 'public' 
  and table_name in ('departments', 'employees')
order by table_name;

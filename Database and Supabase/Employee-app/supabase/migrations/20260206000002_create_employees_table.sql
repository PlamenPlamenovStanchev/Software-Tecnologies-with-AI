-- Create employees table
create table public.employees (
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
create index employees_department_id_idx on public.employees(department_id);
create index employees_manager_id_idx on public.employees(manager_id);
create index employees_email_idx on public.employees(email);

-- Add unique constraint on email (optional, but recommended for user management)
alter table public.employees add constraint employees_email_unique unique (email) deferrable;

-- Add comment for documentation
comment on table public.employees is 'Company employees with optional department, manager, and contact assignments';
comment on column public.employees.name is 'Employee full name (required)';
comment on column public.employees.job_title is 'Employee job title (required)';
comment on column public.employees.department_id is 'Reference to department (optional)';
comment on column public.employees.email is 'Employee email address (optional)';
comment on column public.employees.phone is 'Employee phone number (optional)';
comment on column public.employees.manager_id is 'Reference to manager employee (optional, self-referential)';

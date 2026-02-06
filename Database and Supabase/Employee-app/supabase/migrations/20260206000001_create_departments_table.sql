-- Create departments table
create table public.departments (
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
create index departments_manager_id_idx on public.departments(manager_id);

-- Add comment for documentation
comment on table public.departments is 'Company departments with optional manager assignment';
comment on column public.departments.name is 'Department name (required)';
comment on column public.departments.description is 'Department description (optional)';
comment on column public.departments.manager_id is 'Reference to employee who manages this department (optional)';

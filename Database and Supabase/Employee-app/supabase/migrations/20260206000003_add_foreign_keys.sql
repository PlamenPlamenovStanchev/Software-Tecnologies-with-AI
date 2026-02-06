-- Add foreign key constraints

-- Employees -> Departments
alter table public.employees
  add constraint employees_department_id_fk
  foreign key (department_id) references public.departments(id) on delete set null;

-- Employees -> Employees (manager self-reference)
alter table public.employees
  add constraint employees_manager_id_fk
  foreign key (manager_id) references public.employees(id) on delete set null;

-- Departments -> Employees (manager)
alter table public.departments
  add constraint departments_manager_id_fk
  foreign key (manager_id) references public.employees(id) on delete set null;

-- Create index for finding employees under a manager
create index employees_reports_to_idx on public.employees(manager_id);

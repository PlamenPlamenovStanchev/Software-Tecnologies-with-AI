-- ============================================================================
-- Seed Data for Employee App
-- Run this script in Supabase SQL Editor to populate tables with sample data
-- ============================================================================

DO $$
DECLARE
    -- Dep IDs
    v_dept_mgmt_id bigint;
    v_dept_prod_id bigint;
    v_dept_mkt_id bigint;
    v_dept_supp_id bigint;
    v_dept_hr_id bigint;
    v_dept_fin_id bigint;

    -- Employee IDs
    v_emp_ceo_id bigint;
    v_emp_prod_dir_id bigint;
    v_emp_mkt_dir_id bigint;
    v_emp_supp_dir_id bigint;
    v_emp_hr_dir_id bigint;
    v_emp_fin_dir_id bigint;
BEGIN
    -- 1. Insert Departments first (manager_ids will be null initially)
    RAISE NOTICE 'Inserting Departments...';
    INSERT INTO public.departments (name, description) VALUES ('Management', 'Executive Leadership') RETURNING id INTO v_dept_mgmt_id;
    INSERT INTO public.departments (name, description) VALUES ('Product', 'Product Development & Engineering') RETURNING id INTO v_dept_prod_id;
    INSERT INTO public.departments (name, description) VALUES ('Marketing', 'Brand & Growth') RETURNING id INTO v_dept_mkt_id;
    INSERT INTO public.departments (name, description) VALUES ('Support', 'Customer Experience') RETURNING id INTO v_dept_supp_id;
    INSERT INTO public.departments (name, description) VALUES ('HR', 'Human Resources') RETURNING id INTO v_dept_hr_id;
    INSERT INTO public.departments (name, description) VALUES ('Finance', 'Accounting & Finance') RETURNING id INTO v_dept_fin_id;

    -- 2. Insert CEO (Management)
    -- CEO has no manager
    RAISE NOTICE 'Inserting CEO...';
    INSERT INTO public.employees (name, job_title, department_id, email, phone, manager_id)
    VALUES ('Alice Chief', 'CEO', v_dept_mgmt_id, 'alice@company.com', '555-0100', NULL)
    RETURNING id INTO v_emp_ceo_id;

    -- 3. Update Management Dept Manager
    UPDATE public.departments SET manager_id = v_emp_ceo_id WHERE id = v_dept_mgmt_id;

    -- 4. Insert Directors (reporting to CEO)
    RAISE NOTICE 'Inserting Directors...';
    
    -- Product Director
    INSERT INTO public.employees (name, job_title, department_id, email, phone, manager_id)
    VALUES ('Bob Product', 'Director of Product', v_dept_prod_id, 'bob@company.com', '555-0200', v_emp_ceo_id)
    RETURNING id INTO v_emp_prod_dir_id;
    UPDATE public.departments SET manager_id = v_emp_prod_dir_id WHERE id = v_dept_prod_id;

    -- Marketing Director
    INSERT INTO public.employees (name, job_title, department_id, email, phone, manager_id)
    VALUES ('Fiona Market', 'Director of Marketing', v_dept_mkt_id, 'fiona@company.com', '555-0300', v_emp_ceo_id)
    RETURNING id INTO v_emp_mkt_dir_id;
    UPDATE public.departments SET manager_id = v_emp_mkt_dir_id WHERE id = v_dept_mkt_id;

    -- Support Director
    INSERT INTO public.employees (name, job_title, department_id, email, phone, manager_id)
    VALUES ('Ian Support', 'Director of Support', v_dept_supp_id, 'ian@company.com', '555-0400', v_emp_ceo_id)
    RETURNING id INTO v_emp_supp_dir_id;
    UPDATE public.departments SET manager_id = v_emp_supp_dir_id WHERE id = v_dept_supp_id;

    -- HR Director
    INSERT INTO public.employees (name, job_title, department_id, email, phone, manager_id)
    VALUES ('Liam Human', 'Director of HR', v_dept_hr_id, 'liam@company.com', '555-0500', v_emp_ceo_id)
    RETURNING id INTO v_emp_hr_dir_id;
    UPDATE public.departments SET manager_id = v_emp_hr_dir_id WHERE id = v_dept_hr_id;

    -- Finance Director
    INSERT INTO public.employees (name, job_title, department_id, email, phone, manager_id)
    VALUES ('Noah Finance', 'Director of Finance', v_dept_fin_id, 'noah@company.com', '555-0600', v_emp_ceo_id)
    RETURNING id INTO v_emp_fin_dir_id;
    UPDATE public.departments SET manager_id = v_emp_fin_dir_id WHERE id = v_dept_fin_id;

    -- 5. Insert Regular Employees (reporting to Directors)
    RAISE NOTICE 'Inserting Regular Employees...';

    -- Product Team (reporting to Bob)
    INSERT INTO public.employees (name, job_title, department_id, email, phone, manager_id) VALUES
    ('Charlie Dev', 'Senior Developer', v_dept_prod_id, 'charlie@company.com', '555-0201', v_emp_prod_dir_id),
    ('Diana Design', 'UI/UX Designer', v_dept_prod_id, 'diana@company.com', '555-0202', v_emp_prod_dir_id),
    ('Evan PM', 'Product Manager', v_dept_prod_id, 'evan@company.com', '555-0203', v_emp_prod_dir_id),
    ('Zach Code', 'Junior Developer', v_dept_prod_id, 'zach@company.com', '555-0204', v_emp_prod_dir_id);

    -- Marketing Team (reporting to Fiona)
    INSERT INTO public.employees (name, job_title, department_id, email, phone, manager_id) VALUES
    ('George Ads', 'SEO Specialist', v_dept_mkt_id, 'george@company.com', '555-0301', v_emp_mkt_dir_id),
    ('Hannah Writer', 'Content Strategist', v_dept_mkt_id, 'hannah@company.com', '555-0302', v_emp_mkt_dir_id);

    -- Support Team (reporting to Ian)
    INSERT INTO public.employees (name, job_title, department_id, email, phone, manager_id) VALUES
    ('Jack Help', 'Support Agent', v_dept_supp_id, 'jack@company.com', '555-0401', v_emp_supp_dir_id),
    ('Kelly Desk', 'Technical Support', v_dept_supp_id, 'kelly@company.com', '555-0402', v_emp_supp_dir_id),
    ('Larry Calls', 'Customer Success', v_dept_supp_id, 'larry@company.com', '555-0403', v_emp_supp_dir_id);

    -- HR Team (reporting to Liam)
    INSERT INTO public.employees (name, job_title, department_id, email, phone, manager_id) VALUES
    ('Mia Talent', 'Recruiter', v_dept_hr_id, 'mia@company.com', '555-0501', v_emp_hr_dir_id),
    ('Nathan Benefits', 'Benefits Coordinator', v_dept_hr_id, 'nathan@company.com', '555-0502', v_emp_hr_dir_id);

     -- Finance Team (reporting to Noah)
    INSERT INTO public.employees (name, job_title, department_id, email, phone, manager_id) VALUES
    ('Olivia Analyst', 'Financial Analyst', v_dept_fin_id, 'olivia@company.com', '555-0601', v_emp_fin_dir_id),
    ('Paul Accountant', 'Accountant', v_dept_fin_id, 'paul@company.com', '555-0602', v_emp_fin_dir_id),
    ('Quinn Payroll', 'Payroll Specialist', v_dept_fin_id, 'quinn@company.com', '555-0603', v_emp_fin_dir_id);

    RAISE NOTICE 'Data insertion complete!';
END $$;

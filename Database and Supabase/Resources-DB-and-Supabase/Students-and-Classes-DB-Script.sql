-- Supabase Database Schema for Students, Classes, and Enrollments

-- Create Students table
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create Classes table
CREATE TABLE classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  start_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create Enrollments table (junction table for many-to-many relationship)
CREATE TABLE enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  enrollment_date DATE NOT NULL,
  price_paid DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(student_id, class_id) -- Prevent duplicate enrollments for same student in same class
);

-- Create indexes for better query performance
CREATE INDEX idx_enrollments_student_id ON enrollments(student_id);
CREATE INDEX idx_enrollments_class_id ON enrollments(class_id);
CREATE INDEX idx_students_email ON students(email);
CREATE INDEX idx_classes_start_date ON classes(start_date);

-- Enable Row Level Security (RLS) if needed
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;


-- Optional: Create views for common queries

-- View to get all student enrollments with class details
CREATE VIEW student_enrollments AS
SELECT 
  s.id as student_id,
  s.name as student_name,
  s.email,
  c.id as class_id,
  c.name as class_name,
  c.description,
  c.price as class_price,
  c.start_date,
  e.enrollment_date,
  e.price_paid,
  (c.price - e.price_paid) as discount_amount
FROM enrollments e
JOIN students s ON e.student_id = s.id
JOIN classes c ON e.class_id = c.id
ORDER BY s.name, c.start_date;

-- View to get class enrollment statistics
CREATE VIEW class_enrollment_stats AS
SELECT 
  c.id,
  c.name,
  c.price,
  c.start_date,
  COUNT(e.id) as total_enrollments,
  SUM(e.price_paid) as total_revenue,
  AVG(e.price_paid) as avg_price_paid
FROM classes c
LEFT JOIN enrollments e ON c.id = e.class_id
GROUP BY c.id, c.name, c.price, c.start_date;


-- Insert sample data into the DB tables

-- Insert sample students
INSERT INTO students (name, email) VALUES
('Alice Johnson', 'alice.johnson@example.com'),
('Bob Smith', 'bob.smith@example.com'),
('Carol Williams', 'carol.williams@example.com'),
('David Brown', 'david.brown@example.com'),
('Emma Davis', 'emma.davis@example.com'),
('Frank Miller', 'frank.miller@example.com'),
('Grace Wilson', 'grace.wilson@example.com'),
('Henry Moore', 'henry.moore@example.com');

-- Insert sample classes
INSERT INTO classes (name, description, price, start_date) VALUES
('Introduction to Python', 'Learn the basics of Python programming', 99.99, '2026-01-01'),
('Web Development with React', 'Build modern web applications using React', 149.99, '2026-02-15'),
('Data Science Fundamentals', 'Introduction to data science and analytics', 199.99, '2026-03-01'),
('Advanced JavaScript', 'Master advanced JavaScript concepts and patterns', 129.99, '2026-02-08'),
('SQL Database Design', 'Design and optimize SQL databases', 89.99, '2026-03-15'),
('Machine Learning Basics', 'Introduction to machine learning algorithms', 249.99, '2026-03-20'),
('Cloud Computing with AWS', 'Deploy applications on AWS', 179.99, '2026-04-01'),
('AI-First Development Basics', 'Build apps with Lovable', 219.99, '2026-06-26'),
('Mobile App Development', 'Create iOS and Android applications', 199.99, '2026-04-10');

-- Insert sample enrollments
INSERT INTO enrollments (student_id, class_id, enrollment_date, price_paid) VALUES
-- Alice enrollments
((SELECT id FROM students WHERE email = 'alice.johnson@example.com'), 
 (SELECT id FROM classes WHERE name = 'Introduction to Python'), 
 '2026-01-15', 89.99),
((SELECT id FROM students WHERE email = 'alice.johnson@example.com'), 
 (SELECT id FROM classes WHERE name = 'Web Development with React'), 
 '2026-01-20', 149.99),
 ((SELECT id FROM students WHERE email = 'alice.johnson@example.com'), 
 (SELECT id FROM classes WHERE name = 'AI-First Development Basics'), 
 '2026-04-02', 149.99),

-- Bob enrollments
((SELECT id FROM students WHERE email = 'bob.smith@example.com'), 
 (SELECT id FROM classes WHERE name = 'Data Science Fundamentals'), 
 '2026-01-10', 199.99),
((SELECT id FROM students WHERE email = 'bob.smith@example.com'), 
 (SELECT id FROM classes WHERE name = 'SQL Database Design'), 
 '2026-01-18', 79.99),

-- Carol enrollments
((SELECT id FROM students WHERE email = 'carol.williams@example.com'), 
 (SELECT id FROM classes WHERE name = 'Advanced JavaScript'), 
 '2026-01-12', 129.99),
((SELECT id FROM students WHERE email = 'carol.williams@example.com'), 
 (SELECT id FROM classes WHERE name = 'Web Development with React'), 
 '2026-01-22', 139.99),

-- David enrollments
((SELECT id FROM students WHERE email = 'david.brown@example.com'), 
 (SELECT id FROM classes WHERE name = 'Machine Learning Basics'), 
 '2026-02-08', 249.99),
 ((SELECT id FROM students WHERE email = 'david.brown@example.com'), 
 (SELECT id FROM classes WHERE name = 'AI-First Development Basics'), 
 '2026-04-11', 145.99),
 
-- Emma enrollments
((SELECT id FROM students WHERE email = 'emma.davis@example.com'), 
 (SELECT id FROM classes WHERE name = 'Introduction to Python'), 
 '2026-01-16', 99.99),
((SELECT id FROM students WHERE email = 'emma.davis@example.com'), 
 (SELECT id FROM classes WHERE name = 'Cloud Computing with AWS'), 
 '2026-03-25', 169.99),

-- Frank enrollments
((SELECT id FROM students WHERE email = 'frank.miller@example.com'), 
 (SELECT id FROM classes WHERE name = 'SQL Database Design'), 
 '2026-01-14', 89.99),
((SELECT id FROM students WHERE email = 'frank.miller@example.com'), 
 (SELECT id FROM classes WHERE name = 'Data Science Fundamentals'), 
 '2026-01-21', 189.99),

-- Grace enrollments
((SELECT id FROM students WHERE email = 'grace.wilson@example.com'), 
 (SELECT id FROM classes WHERE name = 'Mobile App Development'), 
 '2026-01-11', 199.99),

-- Henry enrollments
((SELECT id FROM students WHERE email = 'henry.moore@example.com'), 
 (SELECT id FROM classes WHERE name = 'Introduction to Python'), 
 '2026-01-17', 99.99),
((SELECT id FROM students WHERE email = 'henry.moore@example.com'), 
 (SELECT id FROM classes WHERE name = 'Advanced JavaScript'), 
 '2026-01-23', 119.99),
((SELECT id FROM students WHERE email = 'henry.moore@example.com'), 
 (SELECT id FROM classes WHERE name = 'Cloud Computing with AWS'), 
 '2026-04-26', 179.99);

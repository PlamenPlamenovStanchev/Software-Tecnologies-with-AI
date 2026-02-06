-- Select all contacts which mention "ski" (case-insensitive)

SELECT id, name, email, phone, town, comments, created_at
FROM contacts
WHERE LOWER(name) LIKE '%ski%' 
   OR LOWER(email) LIKE '%ski%' 
   OR LOWER(phone) LIKE '%ski%' 
   OR LOWER(town) LIKE '%ski%' 
   OR LOWER(comments) LIKE '%ski%'
ORDER BY name ASC;

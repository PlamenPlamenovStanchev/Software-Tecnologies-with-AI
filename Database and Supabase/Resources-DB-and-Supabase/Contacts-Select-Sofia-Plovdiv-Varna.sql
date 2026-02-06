-- Select all contacts from Sofia, Plovdiv, or Varna

SELECT id, name, email, phone, town, comments, created_at
FROM contacts
WHERE town IN ('Sofia', 'Plovdiv', 'Varna')
ORDER BY town ASC, name ASC;

-- Select all contacts from Varna

SELECT id, name, email, phone, town, comments, created_at
FROM contacts
WHERE town = 'Varna'
ORDER BY name ASC;

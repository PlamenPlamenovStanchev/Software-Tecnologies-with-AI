-- Select all contacts without a town and without an email

SELECT id, name, phone, town, comments, created_at
FROM contacts
WHERE town IS NULL AND email IS NULL
ORDER BY name ASC;

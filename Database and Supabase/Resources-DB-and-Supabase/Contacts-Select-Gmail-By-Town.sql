-- Select all contacts with Gmail accounts grouped by town

SELECT town, name, email, phone, comments
FROM contacts
WHERE email LIKE '%@gmail.com'
ORDER BY town ASC, name ASC;

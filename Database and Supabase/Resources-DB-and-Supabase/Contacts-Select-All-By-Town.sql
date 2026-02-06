-- Select all contacts ordered by town alphabetically

SELECT name, town, phone, email
FROM contacts
ORDER BY town ASC, name ASC;

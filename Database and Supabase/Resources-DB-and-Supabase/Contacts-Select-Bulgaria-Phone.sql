-- Select all contacts with Bulgarian phone numbers (+359)

SELECT id, name, email, phone, town, comments, created_at
FROM contacts
WHERE phone LIKE '+359%'
ORDER BY name ASC;

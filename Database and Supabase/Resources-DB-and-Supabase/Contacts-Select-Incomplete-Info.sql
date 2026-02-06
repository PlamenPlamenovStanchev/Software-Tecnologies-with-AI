-- List contacts with incomplete information (missing phone OR email)
-- Return name | phone | email | missing data

SELECT 
  name,
  phone,
  email,
  CASE 
    WHEN phone IS NULL AND email IS NULL THEN 'No contact info'
    WHEN phone IS NULL THEN 'Missing phone'
    WHEN email IS NULL THEN 'Missing email'
  END AS missing_data
FROM contacts
WHERE phone IS NULL OR email IS NULL
ORDER BY name ASC;

-- List all email domains with contacts
-- Return domain | contacts_count | contact_names

SELECT 
  SUBSTRING(email FROM POSITION('@' IN email) + 1) AS domain,
  COUNT(*) AS contacts_count,
  STRING_AGG(name, ', ' ORDER BY name) AS contact_names
FROM contacts
WHERE email IS NOT NULL
GROUP BY SUBSTRING(email FROM POSITION('@' IN email) + 1)
ORDER BY contacts_count DESC, domain ASC;

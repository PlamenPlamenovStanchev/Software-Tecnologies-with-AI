-- Find all contacts with the same first name
-- Display first name and comma-separated list of full names

SELECT 
  SPLIT_PART(name, ' ', 1) AS first_name,
  STRING_AGG(name, ', ' ORDER BY name) AS contacts,
  COUNT(*) AS count
FROM contacts
GROUP BY SPLIT_PART(name, ' ', 1)
HAVING COUNT(*) > 1
ORDER BY first_name ASC;

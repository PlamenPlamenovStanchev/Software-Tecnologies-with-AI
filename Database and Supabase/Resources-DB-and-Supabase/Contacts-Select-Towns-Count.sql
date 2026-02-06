-- List all towns and the number of contacts for each town
-- Include contacts with no town as "[Unknown]"

SELECT 
  COALESCE(town, '[Unknown]') AS town,
  COUNT(*) AS contact_count
FROM contacts
GROUP BY town
ORDER BY contact_count DESC, town ASC;

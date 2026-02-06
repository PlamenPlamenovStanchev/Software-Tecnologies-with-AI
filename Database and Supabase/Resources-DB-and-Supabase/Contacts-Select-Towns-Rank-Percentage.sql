-- Find contacts per town with rank and percentages
-- Return town | rank | percentage | count | contact list

WITH town_stats AS (
  SELECT 
    COALESCE(town, '[Unknown]') AS town,
    COUNT(*) AS count,
    STRING_AGG(name, ', ' ORDER BY name) AS contact_list
  FROM contacts
  GROUP BY town
),
total_count AS (
  SELECT SUM(count) AS total FROM town_stats
),
ranked_stats AS (
  SELECT 
    ts.town,
    ROW_NUMBER() OVER (ORDER BY ts.count DESC) AS rank,
    ROUND(100.0 * ts.count / tc.total, 2) AS percentage,
    ts.count,
    ts.contact_list
  FROM town_stats ts, total_count tc
)
SELECT 
  town,
  rank,
  percentage || '%' AS percentage,
  count,
  contact_list
FROM ranked_stats
ORDER BY rank ASC;

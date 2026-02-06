-- Remove phone number and email from Elena Georgieva

UPDATE contacts
SET phone = NULL, email = NULL
WHERE name = 'Elena Georgieva' AND town = 'Sofia';

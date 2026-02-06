-- Delete specific contacts

-- Delete Petar Nikolov
DELETE FROM contacts
WHERE name = 'Petar Nikolov' AND email = 'petar.nikolov@abv.bg';

-- Delete contact with email d.angelov@proton.me from Veliko Tarnovo
DELETE FROM contacts
WHERE email = 'd.angelov@proton.me' AND town = 'Veliko Tarnovo';

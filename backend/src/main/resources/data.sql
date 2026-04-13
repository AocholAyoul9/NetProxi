-- Create users for companies (email verified, enabled, with role)
INSERT INTO users (id, username, email, password, phone, address, enabled, active, company_id)
SELECT 
    'aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'CleanPro Lyon',
    'contact@cleanpro.ly',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7pFdldFzXW1gBFP8R4WAXLK',
    '0478000001',
    '12 Rue de la République, 69002 Lyon',
    true,
    true,
    '11111111-1111-1111-1111-111111111111'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'contact@cleanpro.ly');

INSERT INTO users (id, username, email, password, phone, address, enabled, active, company_id)
SELECT 
    'aaaaaaa2-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'HomeServices',
    'info@homeservices.fr',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7pFdldFzXW1gBFP8R4WAXLK',
    '0478000002',
    '25 Cours Gambetta, 69003 Lyon',
    true,
    true,
    '22222222-2222-2222-2222-222222222222'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'info@homeservices.fr');

INSERT INTO users (id, username, email, password, phone, address, enabled, active, company_id)
SELECT 
    'aaaaaaa3-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'EcoClean',
    'contact@ecoclean.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7pFdldFzXW1gBFP8R4WAXLK',
    '0478000003',
    '8 Place Bellecour, 69002 Lyon',
    true,
    true,
    '33333333-3333-3333-3333-333333333333'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'contact@ecoclean.com');

INSERT INTO users (id, username, email, password, phone, address, enabled, active, company_id)
SELECT 
    'aaaaaaa4-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'ProMenage',
    'contact@promenage.fr',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7pFdldFzXW1gBFP8R4WAXLK',
    '0478000004',
    '45 Avenue Jean Jaurès, 69007 Lyon',
    true,
    true,
    '44444444-4444-4444-4444-444444444444'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'contact@promenage.fr');

INSERT INTO users (id, username, email, password, phone, address, enabled, active, company_id)
SELECT 
    'aaaaaaa5-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'SparkleClean',
    'hello@sparkleclean.fr',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7pFdldFzXW1gBFP8R4WAXLK',
    '0478000005',
    '3 Place des Terreaux, 69001 Lyon',
    true,
    true,
    '55555555-5555-5555-5555-555555555555'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'hello@sparkleclean.fr');

-- Only add services if they don't exist (check by company_id and name)
INSERT INTO services (id, name, description, base_price, duration_in_minutes, company_id, active)
SELECT gen_random_uuid(), 'Nettoyage standard', 'Nettoyage complet de votre appartement', 35, 60, '11111111-1111-1111-1111-111111111111', true
WHERE NOT EXISTS (SELECT 1 FROM services WHERE company_id = '11111111-1111-1111-1111-111111111111' AND name = 'Nettoyage standard');

INSERT INTO services (id, name, description, base_price, duration_in_minutes, company_id, active)
SELECT gen_random_uuid(), 'Nettoyage profond', 'Nettoyage en profondeur incluant vitres et coins', 55, 90, '11111111-1111-1111-1111-111111111111', true
WHERE NOT EXISTS (SELECT 1 FROM services WHERE company_id = '11111111-1111-1111-1111-111111111111' AND name = 'Nettoyage profond');

INSERT INTO services (id, name, description, base_price, duration_in_minutes, company_id, active)
SELECT gen_random_uuid(), 'Mise en place', 'Organisation et rangement complet', 40, 75, '11111111-1111-1111-1111-111111111111', true
WHERE NOT EXISTS (SELECT 1 FROM services WHERE company_id = '11111111-1111-1111-1111-111111111111' AND name = 'Mise en place');

-- Services for HomeServices
INSERT INTO services (id, name, description, base_price, duration_in_minutes, company_id, active)
SELECT gen_random_uuid(), 'Entretien mensuel', 'Contrat d''entretien mensuel', 25, 45, '22222222-2222-2222-2222-222222222222', true
WHERE NOT EXISTS (SELECT 1 FROM services WHERE company_id = '22222222-2222-2222-2222-222222222222' AND name = 'Entretien mensuel');

INSERT INTO services (id, name, description, base_price, duration_in_minutes, company_id, active)
SELECT gen_random_uuid(), 'Petit bricolage', 'Réparations et petits travaux', 30, 60, '22222222-2222-2222-2222-222222222222', true
WHERE NOT EXISTS (SELECT 1 FROM services WHERE company_id = '22222222-2222-2222-2222-222222222222' AND name = 'Petit bricolage');

-- Services for EcoClean
INSERT INTO services (id, name, description, base_price, duration_in_minutes, company_id, active)
SELECT gen_random_uuid(), 'Eco cleaning', 'Nettoyage écologique sans produits chimiques', 40, 60, '33333333-3333-3333-3333-333333333333', true
WHERE NOT EXISTS (SELECT 1 FROM services WHERE company_id = '33333333-3333-3333-3333-333333333333' AND name = 'Eco cleaning');

INSERT INTO services (id, name, description, base_price, duration_in_minutes, company_id, active)
SELECT gen_random_uuid(), 'Nettoyage vert', 'Produits 100% naturels', 45, 75, '33333333-3333-3333-3333-333333333333', true
WHERE NOT EXISTS (SELECT 1 FROM services WHERE company_id = '33333333-3333-3333-3333-333333333333' AND name = 'Nettoyage vert');

-- Services for ProMenage
INSERT INTO services (id, name, description, base_price, duration_in_minutes, company_id, active)
SELECT gen_random_uuid(), 'Ménage regular', 'Ménage hebdomadaire ou bi-hebdomadaire', 28, 60, '44444444-4444-4444-4444-444444444444', true
WHERE NOT EXISTS (SELECT 1 FROM services WHERE company_id = '44444444-4444-4444-4444-444444444444' AND name = 'Ménage regular');

INSERT INTO services (id, name, description, base_price, duration_in_minutes, company_id, active)
SELECT gen_random_uuid(), 'Aide à domicile', 'Assistance quotidienne', 32, 120, '44444444-4444-4444-4444-444444444444', true
WHERE NOT EXISTS (SELECT 1 FROM services WHERE company_id = '44444444-4444-4444-4444-444444444444' AND name = 'Aide à domicile');

-- Services for SparkleClean
INSERT INTO services (id, name, description, base_price, duration_in_minutes, company_id, active)
SELECT gen_random_uuid(), 'Premium cleaning', 'Service haut de gamme', 50, 60, '55555555-5555-5555-5555-555555555555', true
WHERE NOT EXISTS (SELECT 1 FROM services WHERE company_id = '55555555-5555-5555-5555-555555555555' AND name = 'Premium cleaning');

INSERT INTO services (id, name, description, base_price, duration_in_minutes, company_id, active)
SELECT gen_random_uuid(), 'Grand nettoyage', 'Nettoyage complet avec produits premium', 70, 120, '55555555-5555-5555-5555-555555555555', true
WHERE NOT EXISTS (SELECT 1 FROM services WHERE company_id = '55555555-5555-5555-5555-555555555555' AND name = 'Grand nettoyage');

INSERT INTO services (id, name, description, base_price, duration_in_minutes, company_id, active)
SELECT gen_random_uuid(), 'Service VIP', 'Nettoyage personnalisé avec garantie', 90, 90, '55555555-5555-5555-5555-555555555555', true
WHERE NOT EXISTS (SELECT 1 FROM services WHERE company_id = '55555555-5555-5555-5555-555555555555' AND name = 'Service VIP');

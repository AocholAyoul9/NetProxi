INSERT INTO roles (id, name) VALUES (gen_random_uuid(), 'ROLE_SUPER_ADMIN') ON CONFLICT (name) DO NOTHING;
INSERT INTO roles (id, name) VALUES (gen_random_uuid(), 'ROLE_COMPANY') ON CONFLICT (name) DO NOTHING;
INSERT INTO roles (id, name) VALUES (gen_random_uuid(), 'ROLE_COMPANY_ADMIN') ON CONFLICT (name) DO NOTHING;
INSERT INTO roles (id, name) VALUES (gen_random_uuid(), 'ROLE_EMPLOYEE') ON CONFLICT (name) DO NOTHING;
INSERT INTO roles (id, name) VALUES (gen_random_uuid(), 'ROLE_CLIENT') ON CONFLICT (name) DO NOTHING;

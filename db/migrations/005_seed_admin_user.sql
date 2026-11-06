INSERT INTO admin_users (email, password_hash)
VALUES ('__ADMIN_EMAIL__', '__ADMIN_PASSWORD_HASH__')
ON CONFLICT (email) DO NOTHING;
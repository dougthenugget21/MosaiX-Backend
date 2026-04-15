TRUNCATE reputation_level  RESTART IDENTITY CASCADE;
TRUNCATE tags RESTART IDENTITY CASCADE;
TRUNCATE saved_posts RESTART IDENTITY CASCADE;
TRUNCATE post_comments RESTART IDENTITY CASCADE;
TRUNCATE post_tags RESTART IDENTITY CASCADE;
TRUNCATE user_postS RESTART IDENTITY CASCADE;
TRUNCATE profile_details RESTART IDENTITY CASCADE;
TRUNCATE user_details RESTART IDENTITY CASCADE;



-- ========================
-- USERS
-- ========================
INSERT INTO user_details (email, password) VALUES
('liam@test.com', 'hashed_pw'),
('emma@test.com', 'hashed_pw'),
('noah@test.com', 'hashed_pw'),
('olivia@test.com', 'hashed_pw');
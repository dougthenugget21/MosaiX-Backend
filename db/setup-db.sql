--
-- Deleting tables if they are already present to recreate
--
DROP TABLE IF EXISTS tags CASCADE;
DROP TABLE IF EXISTS reputation_level CASCADE;
DROP TABLE IF EXISTS profile_details CASCADE;
DROP TABLE IF EXISTS user_details CASCADE;
DROP TABLE IF EXISTS post_tags CASCADE;
DROP TABLE IF EXISTS post_comments CASCADE;
DROP TABLE IF EXISTS saved_posts CASCADE;
DROP TABLE IF EXISTS user_posts CASCADE;
DROP TABLE IF EXISTS reported_posts CASCADE;
DROP TABLE IF EXISTS liked_posts CASCADE;

--
-- Create Master table - Reputation Level
--

CREATE TABLE reputation_level (
    id SMALLINT GENERATED ALWAYS AS IDENTITY,
    reputation_badge VARCHAR(30) NOT NULL,
    from_count INT,
    to_count INT,
    PRIMARY KEY (id)
);

--
-- Create Master table - tags
--
CREATE TABLE tags (
    id SMALLINT GENERATED ALWAYS AS IDENTITY,
    tag_name VARCHAR(30) NOT NULL,
    PRIMARY KEY (id)
);

--
-- Create user details table
--

CREATE TABLE user_details (
    user_id SMALLINT GENERATED ALWAYS AS IDENTITY,
    email VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    PRIMARY KEY (user_id)
);

--
-- Create profile details table
--
CREATE TABLE profile_details (
    profile_id SMALLINT GENERATED ALWAYS AS IDENTITY,
    user_id SMALLINT NOT NULL,
    user_name VARCHAR(50) NOT NULL,
    is_private BOOLEAN NOT NULL DEFAULT true,
    bio VARCHAR(255),
    profilephoto_url VARCHAR(255),
    reputation_id SMALLINT,
    total_likes INT DEFAULT 0,
    PRIMARY KEY (profile_id),
    FOREIGN KEY (user_id) REFERENCES user_details,
    FOREIGN KEY (reputation_id) REFERENCES reputation_level
);

--
-- Create table for user posts
--

CREATE TABLE user_posts (
    id SMALLINT GENERATED ALWAYS AS IDENTITY,
    profile_id SMALLINT,
    photo_url VARCHAR(255) NOT NULL,
    longitude FLOAT NOT NULL,
    latitude FLOAT NOT NULL,
    post_title VARCHAR(255) NOT NULL,
    post_desc VARCHAR(255),
    like_count INT DEFAULT 0,
    created_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (profile_id) REFERENCES profile_details ON DELETE CASCADE
);

--
-- Create table for Post Tags
--

CREATE TABLE post_tags (
    id SMALLINT GENERATED ALWAYS AS IDENTITY,
    post_id SMALLINT,
    hash_tags SMALLINT,
    PRIMARY KEY (id),
    FOREIGN KEY (hash_tags) REFERENCES tags,
    FOREIGN KEY (post_id) REFERENCES user_posts ON DELETE CASCADE
);

--
-- Create table for Post Comments
--

CREATE TABLE post_comments (
    id SMALLINT GENERATED ALWAYS AS IDENTITY,
    post_id SMALLINT,
    comment VARCHAR(255) NOT NULL,
    by_profile_id SMALLINT,
    created_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (post_id) REFERENCES user_posts ON DELETE CASCADE,
    FOREIGN KEY (by_profile_id) REFERENCES profile_details ON DELETE CASCADE 
);

-- 
-- Create table for Saved Posts
--

CREATE TABLE saved_posts (
    id SMALLINT GENERATED ALWAYS AS IDENTITY,
    profile_id SMALLINT,
    post_id SMALLINT,
    PRIMARY KEY (id),
    FOREIGN KEY (profile_id) REFERENCES profile_details ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES user_posts ON DELETE CASCADE
);

CREATE TABLE liked_posts (
    id SMALLINT GENERATED ALWAYS AS IDENTITY,
    profile_id SMALLINT,
    post_id SMALLINT,
    PRIMARY KEY (id),
    FOREIGN KEY (profile_id) REFERENCES profile_details ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES user_posts ON DELETE CASCADE
);

CREATE TABLE reported_posts (
    id SMALLINT GENERATED ALWAYS AS IDENTITY,
    profile_id SMALLINT,
    post_id SMALLINT,
    report_desc VARCHAR(255) NOT NULL,
    reported_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (profile_id) REFERENCES profile_details ON DELETE CASCADE ,
    FOREIGN KEY (post_id) REFERENCES user_posts ON DELETE CASCADE
);
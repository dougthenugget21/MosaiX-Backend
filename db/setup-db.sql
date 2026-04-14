--
-- Deleting tables if they are already present to recreate
--

DROP TABLE IF EXISTS user_details;
DROP TABLE IF EXISTS profile_details;
DROP TABLE IF EXISTS user_posts;
DROP TABLE IF EXISTS post_tags;
DROP TABLE IF EXISTS post_comments;
DROP TABLE IF EXISTS reputation_level;
DROP TABLE IF EXISTS tags;

--
-- Create Master table - Reputation Level
--

CREATE TABLE reputation_level (
    id SMALLINT GENERATED ALWAYS AS IDENTITY,
    reputation_badge VARCHAR(30),
    from_count INT,
    to_count INT
    PRIMARY KEY (id)
);

--
-- Create Master table - tags
--
CREATE TABLE tags (
    id SMALLINT GENERATED ALWAYS AS IDENTITY,
    tag_name VARCHAR(30)
    PRIMARY KEY (id)
)

--
-- Create user details table
--

CREATE TABLE user_details (
    user_id SMALLINT GENERATED ALWAYS AS IDENTITY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
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
    user_name VARCHAR(50),
    is_private BOOLEAN,
    bio VARCHAR(255),
    reputation_id SMALLINT,
    total_likes INT,
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
    photo_url VARCHAR(255),
    longitude FLOAT,
    latitude FLOAT,
    post_desc VARCHAR(255),
    like_count INT,
    created_date DATE
    PRIMARY KEY (id),
    FOREIGN KEY (profile_id) REFERENCES profile_details
);

--
-- Create table for Post Tags
--

CREATE TABLE post_tags (
    id SMALLINT GENERATED ALWAYS AS IDENTITY,
    post_id SMALLINT,
    hash_tags SMALLINT,
    PRIMARY KEY (id),
    FOREIGN KEY (post_id) REFERENCES tags
);

--
-- Create table for Post Comments
--

CREATE TABLE post_comments (
    id SMALLINT GENERATED ALWAYS AS IDENTITY,
    post_id SMALLINT,
    comment VARCHAR(255),
    by_profile_id SMALLINT,
    created_date DATE,
    PRIMARY KEY (id),
    FOREIGN KEY (post_id) REFERENCES user_posts,
    FOREIGN KEY (by_profile_id) REFERENCES profile_details 
);
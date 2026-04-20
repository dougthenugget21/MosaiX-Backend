const db = require('../../db/connect');
const { response } = require('../app');

class Userprofile {
    constructor(data) {
        this.user_id = data.user_id;
        this.email = data.email;
        this.password = data.password;
        this.profile_id = data.profile_id;
        this.user_name = data.user_name;
        this.is_private = data.is_private;
        this.profilephoto_url = data.profilephoto_url;
        this.bio = data.bio;
        this.reputation_id = data.reputation_id;
        this.total_likes = data.total_likes;
        this.reputation_badge = data.reputation_badge;
    }

    // Get by User ID
    static async getUserDetailsbyID(userId) {
        const response = await db.query("SELECT u.*, p.*, r.reputation_badge FROM user_details u JOIN profile_details p ON u.user_id = p.user_id JOIN reputation_level r ON p.reputation_id = r.id  WHERE u.user_id = $1;", [userId]);

        if (response.rows.length !== 1) {
            throw new Error("Cannot find user details with the id.");
        }

        return new Userprofile(response.rows[0]);
    }

    // Get by Profile ID
    static async getUserDetailsbyProfileID(profileId) {
        const response = await db.query("SELECT u.*, p.*, r.reputation_badge FROM user_details u JOIN profile_details p ON u.user_id = p.user_id JOIN reputation_level r ON p.reputation_id = r.id WHERE p.profile_id = $1;", [profileId]);

        if (response.rows.length !== 1) {
            throw new Error("Cannot find user details with the profile id.");
        }

        return new Userprofile(response.rows[0]);
    }

    // Get by email
    static async getUserDetailsbyEmail(email) {
        const response = await db.query("SELECT u.*, p.*, r.reputation_badge FROM user_details u JOIN profile_details p ON u.user_id = p.user_id JOIN reputation_level r ON p.reputation_id = r.id WHERE u.email = $1;", [email]);

        if (response.rows.length !== 1) {
            throw new Error("Cannot find user details with email.");
        }

        return new Userprofile(response.rows[0]);
    }

    // Create user profile
    static async createUserProfile(userData) {
        const client = await db.connect();

        try {
            await client.query("BEGIN");

            const userRes = await client.query("INSERT INTO user_details (email, password) VALUES ($1, $2) RETURNING *;", [userData.email, userData.password]);

            const user = userRes.rows[0];

            const profileRes = await client.query("INSERT INTO profile_details (user_id, user_name, bio, reputation_id, total_likes, profilephoto_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;",
                [
                    user.user_id,
                    userData.user_name,
                    userData.bio || null,
                    userData.reputation_id || 1,
                    userData.total_likes || 0,
                    userData.profilephoto_url || null
                ]
            );

            await client.query("COMMIT");

            return new Userprofile({
                ...user,
                ...profileRes.rows[0]
            });

        } 
        catch (e) {
            await client.query("ROLLBACK");
            throw e;
        } 
        finally {
            client.release();
        }
    }

    // Update profile and password
    async updateUserProfile(data) {
        const client = await db.connect();

        try {
            await client.query("BEGIN");
            // Update user details
            if (data.email || data.password) {
                await client.query(`
                    UPDATE user_details 
                    SET email = COALESCE($1, email), 
                    password = COALESCE($2, password) 
                    WHERE user_id = $3;`,
                    [data.email, data.password, this.user_id]
                );
            }

            // Update profile table
            const response = await client.query(`
                UPDATE profile_details 
                    SET user_name = COALESCE($1, user_name), 
                    is_private = COALESCE($2, is_private), 
                    bio = COALESCE($3, bio), 
                    reputation_id = COALESCE($4, reputation_id),
                    total_likes = COALESCE($5, total_likes), 
                    profilephoto_url = COALESCE($6, profilephoto_url) 
                    WHERE user_id = $7 RETURNING *;`,
                [
                    data.user_name,
                    data.is_private,
                    data.bio,
                    data.reputation_id,
                    data.total_likes,
                    data.profilephoto_url,
                    this.user_id
                ]
            );

            await client.query("COMMIT");

            return new Userprofile({
                ...this,
                ...data
            });

        } 
        catch (e) {
            await client.query("ROLLBACK");
            throw e;
        } 
        finally {
            client.release();
        }
    }

    // Delete user + profile
    async deleteUser() {
        const client = await db.connect();

        try {
            await client.query("BEGIN");

            await client.query("DELETE FROM profile_details WHERE user_id = $1;",
                [this.user_id]
            );

            await client.query("DELETE FROM user_details WHERE user_id = $1;",
                [this.user_id]
            );

            await client.query("COMMIT");

            return { 
                message: "User deleted successfully" 
            };

        } 
        catch (err) {
            await client.query("ROLLBACK");
            throw err;
        } 
        finally {
            client.release();
        }
    }

    async getsavedPosts() {
        try{
            await db.query("SELECT INTO saved_posts () ")
        } catch(err){

        }
    }

    async savePost(post_id){
        try{
            let response = await db.query("INSERT INTO saved_posts (profile_id,post_id) VALUES ($1,$2) RETURNING *",[this.profile_id,post_id])
            return response.rows[0]
        } catch(err){
            throw err;
        }
    }
    async unSavePost(post_id) {
        try{
            let response = await db.query("DELETE FROM saved_posts WHERE profile_id = $1 AND post_id = $2 RETURNING *",[this.profile_id,post_id])
            return response.rows[0]
       } catch (err) {
            throw err;            
       }
    }
}

module.exports = Userprofile;
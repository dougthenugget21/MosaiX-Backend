const db = require('../../db/connect')

class Profiledetails {
    constructor ({profile_id, user_id, is_private, bio, reputation_id, total_likes}) {
        this.profile_id = profile_id,
        this.user_id = user_id,
        this.is_private = is_private,
        this.bio = bio,
        this.reputation_id = reputation_id,
        this.total_likes = total_likes 
    }

    static async getProfileDetailsbyUserID (userid) {
        const response = await db.query("SELECT * FROM profile_details WHERE user_id = $1;", [userid])
        if(response.rows.length != 1) {
            throw new Error("Cannot find Profile with the User id.")
        }
        return new Profiledetails(response.rows[0]);
    }

    static async getProfileDetailsbyProfileID(id) {
        const response = await db.query("SELECT * FROM user_details WHERE profile_id = $1;", [id])
        if(response.rows.length != 1) {
            throw new Error("Cannot find Profile with the id.")
        }
        return new Profiledetails(response.rows[0]);
    }

    static async createProfile (profileData) {
        const {user_id, user_name, is_private, bio, reputation_id, total_likes} = profileData;
        if (!profileData.username & !profileData.user_id) 
        {
            throw new Error ("User Details are missing");
        }
        const response = await db.query ("INSERT INTO profile_details (user_id, user_name, is_private, bio, reputation_id, total_likes) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;",
            [user_id, user_name, is_private, bio, reputation_id, total_likes]);
        const newProfile = response.rows[0];
        return newProfile;
    }
}

module.exports = Userdetails;
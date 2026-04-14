const db = require('../../db/connect')

class Userdetails {
    constructor ({user_id, first_name, last_name, email, password}) {
        this.user_id = user_id,
        this.first_name = first_name,
        this.last_name = last_name,
        this.email = email,
        this.password = password
    }

    static async getUserDetailsbyID (id) {
        const response = await db.query("SELECT * FROM user_details WHERE user_id = $1;", [id])
        if(response.rows.length != 1) {
            throw new Error("Cannot find user details with the id.")
        }
        return new Userdetails(response.rows[0]);
    }

    static async getUserDetailsbyEmail(email) {
        const response = await db.query("SELECT * FROM user_details WHERE email = $1;", [email])
        if(response.rows.length != 1) {
            throw new Error("Cannot find user details with email.")
        }
        return new Studentdetails(response.rows[0]);
    }

    static async createUser (userData) {
        const {email, password} = userData;
        if (!userData.email) 
        {
            throw new Error ("Email address is missing");
        }
        const response = await db.query ("INSERT INTO user_details (email, password) VALUES ($1, $2) RETURNING *;",
            [email, password]);
        const newUser = response.rows[0];
        return newUser;
    }
}

module.exports = Userdetails;
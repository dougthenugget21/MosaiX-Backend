const db = require('../../db/connect');

class Postcomments {
    constructor(data) {
        this.id = data.id;
        this.post_id = data.post_id;
        this.comment = data.comment;
        this.by_profile_id = data.by_profile_id;
        this.user_name = data.user_name;
        this.created_date = data.created_date;
        this.profilephoto_url = data.profilephoto_url;
    }

    // Get all comments for Post
    static async getCommentsbyPostID(postid) {
        const response = await db.query("SELECT c.*, p.user_name, p.profilephoto_url from post_comments c JOIN profile_details p ON c.by_profile_id = p.profile_id where post_id = $1;", [postid]);
        if (response.rows.length == 0) {
            throw new Error("No comments for this post");
        }

        //return new Postcomments(response.rows);
        return response.rows.map(p => new Postcomments(p))
    }
    
    //Get comment details by ID
    static async getCommentbyID(postid) {
        const response = await db.query("SELECT c.*, p.user_name, p.profilephoto_url from post_comments c JOIN profile_details p ON c.by_profile_id = p.profile_id where id = $1;", [postid]);

        if (response.rows.length == 0) {
            throw new Error("No comments for this commentID");
        }
        //return new Postcomments(response.rows);
        return new Postcomments(response.rows[0])
    }

    // Add comment
    static async createComment (data) {
        const {post_id, comment, by_profile_id} = data;
        if (!data.comment & !data.by_profile_id) 
        {
            throw new Error ("Comment details are missing");
        }
        const response = await db.query ("INSERT INTO post_comments (post_id, comment, by_profile_id) VALUES ($1, $2, $3) RETURNING *;",
            [post_id, comment, by_profile_id]);
        const newComment = response.rows[0];
        return newComment;
    }

    // Update comment
    async updateComment(data) {
        const response = await db.query("UPDATE post_comments SET comment = $1 WHERE id = $2 RETURNING *;",
            [ data.comment, this.id]);
        if (response.rows.length != 1) {
            throw new Error("Unable to update comment.")
        }
        return new Postcomments(response.rows[0]);
    }

    // Delete Comment
    async deleteComment() {
        const response = await db.query("DELETE FROM post_comments WHERE id= $1 RETURNING *;", [this.id]);
        return new Postcomments(response.rows[0]);
    }

}

module.exports = Postcomments;
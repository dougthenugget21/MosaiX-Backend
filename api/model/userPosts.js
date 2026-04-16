const db = require('../../db/connect')
class Posts {
    
    constructor(data){
        this.id = data.id 
        this.profile_id = data.profile_id
        this.photo_url = data.photo_url
        this.longitude = data.longitude
        this.latitude = data.latitude  
        this.post_desc = data.post_desc
        this.like_count = data.like_count ?? 0;
        this.created_date = data.created_date
    }
    // Get posts based on latitude and longitude and radius inputted 


    //editing the number of likes on a post when someone adds a like
    async increaseLikeCount(){
        const response = await db.query("UPDATE user_posts SET like_count = like_count + 1 WHERE id = $1 RETURNING *",[this.id])
        if(response.rows.length === 0){
            throw new Error('no posts available by this id')
        }
        const post = new Posts(response.rows[0])
        return post 
    }

    //getting all posts from the table
    static async getAllPosts(){
        const response = await db.query("SELECT * FROM user_posts")

        if(response.rows.length ===0) {
            throw new Error("No posts available")
        }
        return response.rows.map(p => new Posts(p))
    }

    //getting a specific post
    static async getByPostId(postId){
        console.log(postId);
        const response = await db.query("SELECT * from user_posts WHERE id = $1",[postId])
        if(response.rows.length===0){
            throw new Error('This post cannot be found')
        }
        const post = new Posts(response.rows[0])
        return post
    }

    // getting all the posts from one specific profile
    static async getAllByProfileId(profileId){
        const response = await db.query("SELECT * from user_posts WHERE profile_id = $1",[profileId])
        if(response.rows.length===0){
            throw new Error('This profile cannot be found')
        }
        return response.rows.map(p => new Posts(p))
    }
    
    



    //Creating a new post
    static async createPost(post_data){
        const {profile_id,photo_url,longitude,latitude,post_desc} = post_data
        if(!profile_id){throw new Error ('profile id is missing')}
        if(!photo_url){throw new Error('photo url is is missing')}
        
        if(longitude === undefined||latitude === undefined){
            throw new Error('longitude or latitude is missing')
        }
        const response = await db.query(
            `INSERT INTO user_posts (profile_id,photo_url,longitude,latitude,post_desc,created_date) VALUES ($1,$2,$3,$4,$5) RETURNING *;`, [profile_id,photo_url,longitude,latitude,post_desc]
        )
        return new Posts(response.rows[0])
    }
}
module.exports = Posts
const db = require('../../db/connect')
const { post } = require('../routes/userPosts')
class Posts {
    
    constructor(data){
        this.id = data.id 
        this.profile_id = data.profile_id
        this.photo_url = data.photo_url
        this.longitude = data.longitude
        this.latitude = data.latitude  
        this.post_title = data.post_title
        this.post_desc = data.post_desc
        this.like_count = data.like_count ?? 0
        this.created_date = data.created_date
        this.tags = data.tags
        this.profilephoto_url = data.profilephoto_url
        this.reputation_badge = data.reputation_badge
        this.user_name = data.user_name
        this.is_liked = data.is_liked
        this.is_saved = data.is_saved
    }

    //getting a specific post
    static async getByPostId(postId){
        const response = await db.query(`SELECT user_posts.id,profile_id,photo_url,longitude,latitude,post_title,post_desc,like_count,created_date,     STRING_AGG(tag_name,',') as tags
                                        FROM user_posts
                                        JOIN post_tags
                                        ON post_tags.post_id = user_posts.id
                                        JOIN tags
                                        ON post_tags.hash_tags = tags.id
                                        WHERE user_posts.id = $1
                                        GROUP BY user_posts.id
                                        `,[postId])
        if(response.rows.length===0){
            throw new Error('This post cannot be found')
        }
        const post_data = response.rows[0]
        //return an array of tags but the tags have to be retrieved from post_tags and then tags table 
        let tagArray = post_data.tags.split(",")       
        post_data.tags = tagArray
        //sql query to profile table to return profile user name, profile photo  reputation and isprive

        const profileResponse = await db.query(`
            SELECT profilephoto_url,reputation_badge,
            CASE 
            WHEN is_private = true THEN 'Anonymous' 
            ELSE user_name
            END AS user_name
            FROM profile_details
            JOIN reputation_level
            ON reputation_level.id = profile_details.reputation_id
            WHERE profile_details.user_id = $1
            `,[post_data.profile_id])
        post_data.profilephoto_url = profileResponse.rows[0].profilephoto_url
        post_data.user_name = profileResponse.rows[0].user_name
        post_data.reputation_badge = profileResponse.rows[0].reputation_badge
        return new Posts(post_data)
    }

    // getting all the posts from one specific profileb for their profile
    static async getAllByProfileId(profileId){
        const response = await db.query(`SELECT user_posts.id,profile_id,photo_url,longitude,latitude,post_title,post_desc,like_count,created_date,     STRING_AGG(tag_name,',') as tags
                                        FROM user_posts
                                        JOIN post_tags
                                        ON post_tags.post_id = user_posts.id
                                        JOIN tags
                                        ON post_tags.hash_tags = tags.id
                                        WHERE profile_id = $1
                                        GROUP BY user_posts.id
                                        `,[profileId])
        const post_data = response.rows
        
        if(response.rows.length===0){
            throw new Error('This post cannot be found')
        }
        //sql query to profile table to return profile user name, profile photo  reputation and isprive
        const profileResponse = await db.query(`
            SELECT profilephoto_url,reputation_badge, user_name
            FROM profile_details
            JOIN reputation_level
            ON reputation_level.id = profile_details.reputation_id
            WHERE profile_details.user_id = $1
            `,[post_data[0].profile_id])
        
        post_data.forEach((record) => {
            let tagArray = record.tags.split(",")       
            record.tags = tagArray
            record.profilephoto_url = profileResponse.rows[0].profilephoto_url
            record.user_name = profileResponse.rows[0].user_name
            record.reputation_badge = profileResponse.rows[0].reputation_badge
        })
        // if isprivate then change profile user name to Anonymous 
        return post_data.map(p => new Posts(p))
    }

    // Get posts based on latitude and longitude and radius inputted 
    static async getNearbyPosts(lat,long,dist,profileId){
        console.log(profileId);
        const response = await db.query(`
        SELECT posts.id,posts.profile_id,photo_url,longitude,latitude,post_title,post_desc,like_count,created_date, STRING_AGG(tag_name,',') as tags,profilephoto_url,reputation_badge,
        CASE 
        WHEN profile_details.is_private = true
        THEN 'Anonymous'
        ELSE user_name
        END as user_name,
        EXISTS (
            SELECT id
            FROM liked_posts as lp
            WHERE lp.post_id = posts.id
            AND lp.profile_id = $4
            ) AS is_liked,
        EXISTS (
            SELECT id
            FROM saved_posts as sp
            WHERE sp.post_id = posts.id
            AND sp.profile_id = $4
            ) AS is_saved

        FROM (
            SELECT *,
                (
                    6371 * acos(
                        LEAST(1, GREATEST(-1,
                            cos(radians($1)) *
                            cos(radians(latitude)) *
                            cos(radians(longitude) - radians($2)) +
                            sin(radians($1)) *
                            sin(radians(latitude))
                        ))
                    )
                ) AS distance_km
            FROM user_posts
        ) AS posts

        JOIN post_tags
        ON post_tags.post_id = posts.id
        JOIN tags
        ON post_tags.hash_tags = tags.id
        JOIN profile_details
        ON posts.profile_id = profile_details.profile_id
        JOIN reputation_level
        ON reputation_level.id = profile_details.reputation_id
        WHERE distance_km < $3
        GROUP BY posts.id,posts.profile_id,photo_url,longitude,latitude,post_title,post_desc,like_count,created_date, distance_km,profile_details.profilephoto_url,reputation_level.reputation_badge,profile_details.is_private,profile_details.user_name
        ORDER BY distance_km ASC`,
        [lat, long, dist,profileId]
        )  
        let post_data = response.rows
        post_data.forEach((record) => {
            let tagArray = record.tags.split(",")
            record.tags = tagArray
        })
        console.log(post_data);
        return post_data.map(p => new Posts(p))
    }
    //deleting a post by it's id

    async deletePost(){
        const response = await db.query("DELETE FROM user_posts where id = $1 RETURNING *",[this.id])
        return response.rows[0]
    }

    //editing the number of likes on a post when someone adds a like
    async increaseLikeCount(likingProfileId){
        const client = await db.connect();
        try{
            await client.query("BEGIN");
            //update like count on main user posts table
            const response = await client.query("UPDATE user_posts SET like_count = like_count + 1 WHERE id = $1 RETURNING *",[this.id])
            // insert into liked posts table 
            const likeResponse = await client.query("INSERT INTO liked_posts (profile_id, post_id) VALUES ($1,$2)",[likingProfileId,this.id])
            //increase total likes of the profile who posted the original post
            const totalLike = await client.query("UPDATE profile_details SET total_likes = total_likes + 1 WHERE profile_id = $1",[this.profile_id])
            const updateBadge = await client.query(`
                UPDATE profile_details
                SET reputation_id = (
                    SELECT rl.id
                    FROM reputation_level rl
                    WHERE profile_details.total_likes >= rl.from_count
                    AND (
                        rl.to_count IS NULL
                        OR profile_details.total_likes <= rl.to_count
                    )
                    LIMIT 1
                )
                WHERE profile_id = $1
                RETURNING profile_id, reputation_id, total_likes;
                `,[this.profile_id])          
            const post = new Posts(response.rows[0])
            await client.query("COMMIT")
            return post
        }catch(err){
            await client.query("ROLLBACK")
            throw err
        }finally {
            client.release();
        }
    }
    async decreaseLikeCount(unlikeProfileId){
        const client = await db.connect()
        try{
            await client.query("BEGIN");
            //update like count on main user posts table
            const response = await client.query("UPDATE user_posts SET like_count = like_count - 1 WHERE id = $1 RETURNING *",[this.id])
            // insert into liked posts table 
            const likeResponse = await client.query("DELETE FROM liked_posts WHERE profile_id = $1 AND post_id = $2",[unlikeProfileId,this.id])
            const totalLike = await client.query("UPDATE profile_details SET total_likes = total_likes - 1 WHERE profile_id = $1",[this.profile_id])
            const updateBadge = await client.query(`
                UPDATE profile_details
                SET reputation_id = (
                    SELECT rl.id
                    FROM reputation_level rl
                    WHERE profile_details.total_likes >= rl.from_count
                    AND (
                        rl.to_count IS NULL
                        OR profile_details.total_likes <= rl.to_count
                    )
                    LIMIT 1
                )
                WHERE profile_id = $1
                RETURNING profile_id, reputation_id, total_likes;
                `,[this.profile_id])
            console.log(updateBadge.rows[0]);
            await client.query("COMMIT")
            const post = new Posts(response.rows[0])
            return post 
        } catch(err){
            await client.query("ROLLBACK")
            throw err
        }finally {
            client.release();
        }
    }
    async reportPost(reporingProfile,report_desc){
        try{
            const response = await db.query("INSERT INTO reported_posts (profile_id,post_id,report_desc) VALUES ($1,$2,$3) RETURNING *",[reporingProfile,this.id,report_desc])
            return response.rows[0]
        } catch (err) {
            throw err
        }
    }
    //getting all posts from the table
/*     static async getAllPosts(){
        const response = await db.query("SELECT * FROM user_posts")

        if(response.rows.length ===0) {
            throw new Error("No posts available")
        }
        return response.rows.map(p => new Posts(p))
    } */

    //Creating a new post
    static async createPost(post_data){
        const {profile_id,photo_url,longitude,latitude,post_title,post_desc,tags} = post_data

        if(!profile_id){throw new Error ('profile id is missing')}
        if(!photo_url){throw new Error('photo url is is missing')}
        if(longitude=== undefined||latitude == undefined){throw new Error('location fields are missing')}
        if(!post_title){throw new Error('title is missing')}
        if(!post_desc){throw new Error('description of post is missing')}
        if(!tags){throw new Error('there needs to be at least one tag')} 
    

        let client = await db.connect();

        try{
            await client.query("BEGIN");
            const response = await client.query(
                `INSERT INTO user_posts (profile_id,photo_url,longitude,latitude,post_title, post_desc) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *;`, 
                [profile_id,photo_url,longitude,latitude,post_title,post_desc]
            )
            const newPost = response.rows[0];
            let tagArray = tags.split(",")   
            for (let i = 0 ; i<tagArray.length; i++) {
                let tag_id;
                let resp_tag = await client.query(
                    `SELECT * from tags where tag_name = $1;`, [tagArray[i]]
                )
                console.log(resp_tag.rows[0])
                if (resp_tag.rows[0] == undefined) {
                    let resp_createtag = await client.query(
                        `INSERT INTO tags (tag_name) VALUES ($1) RETURNING *;`, [tagArray[i]]
                    )
                    tag_id = resp_createtag.rows[0].id;
                } 
                else {
                    console.log(resp_tag.rows[0].id)
                    tag_id = resp_tag.rows[0].id;
                }
                
                let resp_add = await client.query(
                    `INSERT INTO post_tags (post_id, hash_tags) VALUES ($1, $2) RETURNING *;`, [newPost.id, tag_id]
                )

            }
            await client.query("COMMIT")
            return newPost;
        } catch(err){
            throw new Error(err +'Unable to insert')
        } 
    }
    //reporting a post

    

}
module.exports = Posts
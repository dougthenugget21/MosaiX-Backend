const { parse } = require('dotenv')
const Posts = require('../model/userPosts')

async function allPosts(req,res){
    try{
        const posts = await Posts.getAllPosts()
        res.status(200).json(posts)
    }
    catch(err){
        res.status(500).json({'error':err.message})
    }
}
async function getNearbyPosts(req,res){
    try{
        const long = parseFloat(req.query.long)
        const lat = parseFloat(req.query.lat)
        const dist = parseFloat(req.query.dist)
        const profile_id = parseInt(req.query.profileId)
        const posts = await Posts.getNearbyPosts(lat,long,dist,profile_id)
        res.status(200).json(posts)
    } catch(err) {
        res.status(500).json({'error':err.message})
    }
}
async function increaseLikes(req,res){
    try{
        const likePostId = req.query.postId
        const likingProfileId = req.query.profileId
        const likedPost = await Posts.getByPostId(likePostId)
        const updatedPost = await likedPost.increaseLikeCount(likingProfileId)
        res.status(200).json(updatedPost)
    } catch(err){
        res.status(500).json({'error':err.message})
    }
}
async function decreaseLikes(req,res){
    try{
        const unlikePostId = req.query.postId
        const unlikeProfileId = req.query.profileId
        const unlikedPost = await Posts.getByPostId(unlikePostId)
        const updatedPost = await unlikedPost.decreaseLikeCount(unlikeProfileId)
        res.status(200).json(updatedPost)
    } catch(err){
        res.status(500).json({'error':err.message})
    }
}



async function getByPostId(req,res){
    try{
        const posts = await Posts.getByPostId(req.params.id)
        res.status(200).json(posts)
    } catch (err) {
        res.status(500).json({'error':err.message})
    }
}
async function getByProfileId(req,res){
    try{
        const posts = await Posts.getAllByProfileId(req.params.id)
        res.status(200).json(posts)
    } catch (err) {
        res.status(500).json({'error' : err.message})
    }
}

async function createPost(req,res){
    try{
        const data = req.body
        const newPost = await Posts.createPost(data)
        res.status(201).send({data: newPost})
    } 
    catch(err){
        res.status(400).send({error: err.message})
    }
}
async function deletePost(req,res){
    try{
        const postToDelete = await Posts.getByPostId(req.params.id)
        const result = await postToDelete.deletePost()
        res.status(200).send({data: result})
    } catch (err) {
        res.status(400).json(err.message)
    }
}

async function reportPost(req,res){
    try{
        reportPostId = req.body.postId
        reportingProfileId = req.body.profileId
        report_desc = req.body.report_desc
        const postToReport = await Posts.getByPostId(reportPostId)
        const result = await postToReport.reportPost(reportingProfileId,report_desc)
        res.status(200).send({data: result})
    } catch (err){
        throw err
    }
}


module.exports = {allPosts, createPost,getByProfileId,getByPostId,increaseLikes,getNearbyPosts,deletePost,decreaseLikes,reportPost}
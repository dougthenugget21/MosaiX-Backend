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
        long = parseFloat(req.query.long)
        lat = parseFloat(req.query.lat)
        dist = parseFloat(req.query.dist)
        const posts = await Posts.getNearbyPosts(lat,long,dist)
        res.status(200).json(posts)
    } catch(err) {
        res.status(500).json({'error':err.message})
    }
}
async function increaseLikes(req,res){
    try{
        const likedPost = await Posts.getByPostId(req.params.id)
        const updatedPost = await likedPost.increaseLikeCount()
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


module.exports = {allPosts, createPost,getByProfileId,getByPostId,increaseLikes,getNearbyPosts}
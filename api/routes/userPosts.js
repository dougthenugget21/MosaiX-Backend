const {Router} = require('express')
const postRouter = Router()
const postController = require('../controller/userPosts')

postRouter.get('/all', postController.allPosts)
postRouter.get('/id/:id',postController.getByPostId)
postRouter.get('/profile/:id',postController.getByProfileId)
postRouter.patch('/:id',postController.increaseLikes)
postRouter.post('/new', postController.createPost)

module.exports =  postRouter
const {Router} = require('express')
const postRouter = Router()
const postController = require('../controller/userPosts')

postRouter.get('/all', postController.allPosts)
postRouter.get('/id/:id',postController.getByPostId)
postRouter.get('/profile/:id',postController.getByProfileId)
postRouter.get('/nearby',postController.getNearbyPosts)
postRouter.patch('/addLike',postController.increaseLikes)
postRouter.patch('/unLike',postController.decreaseLikes)
postRouter.post('/new', postController.createPost)
postRouter.post('/report',postController.reportPost)
postRouter.delete('/delete/:id',postController.deletePost)


module.exports =  postRouter
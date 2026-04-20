const express = require('express');
const cors = require('cors');

const userDetailsRouter = require('./routes/userdetails');
const profileDetailsRouter = require('./routes/profiledetails');
const userProfileRouter = require('./routes/userprofile');
const postRouter = require('./routes/userPosts')
const commentRouter = require('./routes/postcomments')

const api = express();

api.use(cors());
api.use(express.json());


api.use("/userData", userDetailsRouter);
api.use("/profileData", profileDetailsRouter);
api.use("/userProfile", userProfileRouter)
api.use("/posts", postRouter)
api.use("/comment",commentRouter)


api.get('/', (req, res) => {
  res.json({
    message: 'Welcome to MosaiX!',
    version: '1.0.0',
    
    userProfile: {
      baseUrl: '/userProfile',
      endpoints: [
        {
          method: 'GET',
          url: '/userProfile/userid/:id',
          description: 'Get user details by user ID'
        },
        {
          method: 'GET',
          url: '/userProfile/profileid/:id',
          description: 'Get user details by profile ID'
        },
        {
          method: 'POST',
          url: '/userProfile/login',
          description: 'Login user using email'
        },
        {
          method: 'POST',
          url: '/userProfile/create',
          description: 'Create new user profile'
        },
        {
          method: 'PATCH',
          url: '/userProfile/:id',
          description: 'Update user profile'
        },
        {
          method: 'DELETE',
          url: '/userProfile/:id',
          description: 'Delete user profile'
        }
      ]
    },

    posts: {
      baseUrl: '/posts',
      endpoints: [
        {
          method: 'GET',
          url: '/posts/id/:id',
          description: 'Get post by post ID'
        },
        {
          method: 'GET',
          url: '/posts/profile/:id',
          description: 'Get posts by profile ID'
        },
        {
          method: 'GET',
          url: '/posts/nearby',
          description: 'Get nearby posts based on location'
        },
        {
          method: 'POST',
          url: '/posts/new',
          description: 'Create a new post'
        },
        {
          method: 'DELETE',
          url: '/posts/delete/:id',
          description: 'Delete a post'
        }
      ]
    },

    comments: {
      baseUrl: '/comment',
      endpoints: [
        {
          method: 'GET',
          url: '/comment/allcomments/:id',
          description: 'Get all comments for a post'
        },
        {
          method: 'GET',
          url: '/comment/:id',
          description: 'Get comment by ID'
        },
        {
          method: 'POST',
          url: '/comment/add',
          description: 'Add a new comment'
        },
        {
          method: 'PATCH',
          url: '/comment/:id',
          description: 'Update a comment'
        },
        {
          method: 'DELETE',
          url: '/comment/:id',
          description: 'Delete a comment'
        }
      ]
    }
  });
});

module.exports = api;
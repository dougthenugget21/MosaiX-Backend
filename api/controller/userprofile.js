const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const Userprofile = require('../model/Userprofile');

// Get user details by User Id
async function getUserDetailsbyID(req, res) {
    try {
        let user_id = req.params.id;
        const userprofile = await Userprofile.getUserDetailsbyID(user_id);
        res.status(200).json(userprofile);
    }
    catch(e) {
        res.status(500).json({error: e.message})
    }
}

// Get user details by Profile ID
async function getUserDetailsbyProfileID(req, res) {
try{
        let profile_id = req.params.id; 
        const userprofile = await Userprofile.getUserDetailsbyProfileID(profile_id);
        res.status(200).json(userprofile);
    }
    catch(e) {
        res.status(500).json({error: e.message})
    }
}

// Check login authentication
async function getUserDetailsbyEmail (req, res) {
    try {
        const data = req.body;
        const userprofile = await Userprofile.getUserDetailsbyEmail(data.email);
        if(!userprofile) {
            return res.status(404).json({
                success: false,
                message: "No account with this email. Please sign up.",
            });
        }
        const match = await bcrypt.compare(data.password, userprofile.password);
        
        if (!match) {
            return res.status(401).json({
                success: false,
                message: "Incorrect password. Please try again.",
            });
        }

        const payload = {username: userprofile.email}
        const sendToken = (err, token) => {
            if(err) {
                throw new Error ("Error in token generation")
            }
            res.status(200).json({
                success:true,
                token:token,
                email:userprofile.email,
                user_id: userprofile.user_id,
                profile_id: userprofile.profile_id,
                user_name: userprofile.user_name
            });
        }
        jwt.sign(payload, process.env.SECRET_TOKEN, {expiresIn: 3600}, sendToken);
    }
    catch(e) {
        return res.status(500).json({
            success: false,
            message: e.message || "Something went wrong",
        });    
    }
}

async function createUserProfile(req, res) {
    try {
        const data = req.body;
        //Generate a salt
        const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT_ROUNDS));
        //Hash the password
        data["password"] = await bcrypt.hash(data.password, salt);
        const result = await Userprofile.createUserProfile(data);

        const payload = {
            email: result.email,
            user_id: result.user_id,
            profile_id: result.profile_id
        };

        jwt.sign(
            payload,
                process.env.SECRET_TOKEN, { expiresIn: 3600 },
                (err, token) => {
                if (err) {
                    throw new Error("Error in token generation");
                }

                res.status(201).json({
                    success:true,
                    token:token,
                    message:"Account created successfully!",
                    user: {
                        user_id: result.user_id,
                        email: result.email,
                        user_name: result.user_name,
                        profile_id: result.profile_id,
                    }
                });
            }
        );

    } catch (e) {
        res.status(e.status || 500).json({ 
            success:false,
            message: e.message || "Something went wrong" });
    }
}

async function updateUserProfile (req, res) {
    try {
        const user_id = req.params.id;
        const data = req.body;
        if (data.password !== undefined) {
             //Generate a salt
            const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT_ROUNDS));
            //Hash the password
            data["password"] = await bcrypt.hash(data.password, salt);
        }
       
        const userprofile = await Userprofile.getUserDetailsbyID(user_id);
        const result = await userprofile.updateUserProfile(data);
        res.status(200).json(result);
    } 
    catch (e) {
        res.status(404).json({error: e.message})
    }
}

async function savePosts(req,res){
    try{
        let profileId = parseInt(req.query.profileId)
        let savingPostId = parseInt(req.query.postId)
        const userProfile = await Userprofile.getUserDetailsbyProfileID(profileId)
        const response = await userProfile.savePost(savingPostId)
        return res.status(200).json(response)
    } catch(err) {
        res.status(404).json({error: err.message})
    }
}

async function unSavePosts(req,res){
    try{
        console.log("params",req.params);
        console.log("query",req.query);
        console.log("body",req.body);
        let profileId = parseInt(req.query.profileId)
        let unSavingPostId = parseInt(req.query.postId)
        console.log(`profile id is ${profileId} and unsavingpostid is ${unSavingPostId}`);
        const userProfile = await Userprofile.getUserDetailsbyProfileID(profileId)
        console.log(userProfile);
        const response = await userProfile.unSavePost(unSavingPostId)
        return res.status(200).json(response)
    } catch(err) {
        res.status(404).json({error: err.message})
    }
}

async function deleteUser (req, res) {
    try {
        const user_id = req.params.id;
        const userprofile = await Userprofile.getUserDetailsbyID(user_id);
        const result = await userprofile.deleteUser();
        res.status(204).json(result);
    } catch (err) {
        res.status(404).json({error: err.message})
    }
};


module.exports = {getUserDetailsbyID, getUserDetailsbyProfileID, getUserDetailsbyEmail, createUserProfile, deleteUser, updateUserProfile,savePosts,unSavePosts}
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const Userdetails = require('../model/Userdetails');

async function getUserDetailsbyEmail (req, res) {
    try {
        const data = req.body;
        const user = await Userdetails.getUserDetailsbyEmail(data.email);
        if(!user) {
            throw new Error ("No user with that email available")
        }
        const match = await bcrypt.compare(data.password, user.password);
        
        if(match) {
            const payload = {username: user.email}
            const sendToken = (err, token) => {
                if(err) {
                    throw new Error ("Error in token generation")
                }
                res.status(200).json({
                    success:true,
                    token:token,
                    email:user.email,
                    user_id: user.user_id
                });
            }
            jwt.sign(payload, process.env.SECRET_TOKEN, {expiresIn: 3600}, sendToken);
        }
        else {
            throw new Error("User could not be authenticated")
        }
    }
    catch(e) {
        res.status(401).json({error: e.message});
    }
}

async function createUser(req, res) {
    try {
        const data = req.body;
        //Generate a salt
        const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT_ROUNDS));
        //Hash the password
        data["password"] = await bcrypt.hash(data.password, salt);
        const result = await Userdetails.createUser(data);

        const payload = {
            email: result.email
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
                    email: result.email,
                    user_id: result.user_id
                });
            }
        );
    }
    catch(e) {
        res.status(401).json({error: e.message}); 
    }
}

module.exports = {
    getUserDetailsbyEmail,
    createUser
}
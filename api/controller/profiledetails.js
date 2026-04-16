const Profiledetails = require('../model/Profiledetails');

async function getProfileDetailsbyUserID(req, res) {
    try {
        let user_id = req.params.id;
        const profile = await Profiledetails.getProfileDetailsbyUserID(user_id);
        res.status(200).json(profile);
    }
    catch(e) {
        res.status(500).json({error: e.message})
    }
}

async function getProfileDetailsbyProfileID(req, res) {
    try{
        let profile_id = req.params.id; 
        const profile = await Profiledetails.getProfileDetailsbyProfileID(profile_id);
        res.status(200).json(profile);
    }
    catch(e) {
        res.status(500).json({error: e.message})
    }
}

async function createProfile(req, res) {
    try{
        const profiledata = req.body;
        const newProfile = await Profiledetails.createProfile(profiledata);
        res.status(200).json(newProfile);
    }
    catch(e) {
        res.status(400).json({error: e.message})
    }
}


async function updateProfile (req, res) {
    try {
        const profile_id = req.params.profile_id;
        const data = req.body;
        const profile = await Profiledetails.getProfileDetailsbyProfileID(profile_id);
        const result = await profile.updateProfile(data);
        res.status(200).json(result);
    } 
    catch (e) {
        res.status(404).json({error: e.message})
    }
}

async function deleteProfile (req, res) {
    try {
        const profile_id = req.params.id;
        const profile = await Profiledetails.getProfileDetailsbyProfileID(profile_id);
        const result = await profile.deleteProfile();
        res.status(204).json(result);
    } catch (err) {
        res.status(404).json({error: err.message})
    }
};

module.exports = {getProfileDetailsbyProfileID, getProfileDetailsbyUserID, createProfile, updateProfile, deleteProfile}
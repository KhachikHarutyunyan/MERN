const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const {check, validationResult} = require('express-validator');
const request = require('request');
const config = require('config');

const Profile = require('../../models/Profile');
const User = require('../../models/User');
const Post = require('../../models/Post');

// route GET api/profile/me
// get current users profile
// access Private
router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar']);

        if (!profile) {
            return res.status(400).json({msg: 'There is no profile for this user'});
        }

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// route POST api/profile
// create or update user profile
// access Private
router.post('/', [ auth, [
    check('status', 'Status is required').not().isEmpty(),
    check('skills', 'Skills is required').not().isEmpty()
] ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array()});
    }

    const {
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        facebook,
        twitter,
        instagram,
        linkedin
    } = req.body;

    // build profile object
    const profileFileds = {};
    profileFileds.user = req.user.id;
    if (company) profileFileds.company = company;
    if (website) profileFileds.website = website;
    if (location) profileFileds.location = location;
    if (bio) profileFileds.bio = bio;
    if (status) profileFileds.status = status;
    if (githubusername) profileFileds.githubusername = githubusername;

    if (skills) {
        profileFileds.skills = skills.split(',').map(skill => skill.trim());
    }

    // build social object
    profileFileds.social = {};
    if (youtube) profileFileds.social.youtube = youtube;
    if (twitter) profileFileds.social.twitter = twitter;
    if (facebook) profileFileds.social.facebook = facebook;
    if (linkedin) profileFileds.social.linkedin = linkedin;
    if (instagram) profileFileds.social.instagram = instagram;

    try {
        let profile = await Profile.findOne({user: req.user.id});
        if (profile) {
            // update
            profile = await Profile.findOneAndUpdate({user: req.user.id}, {$set: profileFileds}, {new: true});
            return res.json(profile);
        }

        // Create
        profile = new Profile(profileFileds);

        await profile.save();
        res.json(profile);

    } catch (err) {
        console.error(rr.message);
        res.status(500).send('Server Error');
    }

});

// route GET api/profile
// Get all profiles
// access Public
router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar']);
        res.json(profiles);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// route GET api/profile/user/:user_id
// Get profile by user ID
// access Public
router.get('/user/:user_id', async (req, res) => {
    try {
        const profile = await Profile.findOne({user: req.params.user_id}).populate('user', ['name', 'avatar']);

        if (!profile) return res.status(400).json({ msg: 'Profile not Found '});
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        if(err.kind === 'ObjectId') {
            return res.status(400).json({ msg: 'Profile not Found' });
        }
        res.status(500).send('Server Error');
    }
});

// route DELETE api/profile
// Delete profile  user and posts
// access Private
router.delete('/', auth, async (req, res) => {
    try {
        // remove user posts

        await Post.deleteMany({ user: req.user.id });

        // Remove profile
        await Profile.findOneAndRemove({user: req.user.id});

        // Remove user
        await User.findOneAndRemove({_id: req.user.id});
        
        res.json({msg: 'User deleted!'});
    } catch (err) {
        console.error(err.message);
        if(err.kind === 'ObjectId') {
            return res.status(400).json({ msg: 'Profile not Found' });
        }
        res.status(500).send('Server Error');
    }
});

// route PUT api/profile/experience
// Add profile experiance
// access Private
router.put('/experience', [auth, [
    check('title', 'Title is required').not().isEmpty(),
    check('company', 'Company is required').not().isEmpty(),
    check('from', 'From date is required').not().isEmpty(),
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    } = req.body;

    const newExp = {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    };

    try {
        const profile = await Profile.findOne({user: req.user.id});

        profile.experience.unshift(newExp);

        await profile.save();

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }

});

// route DELETE api/profile/experience/:exp_id
// Delete experiance from profile
// access Private
router.delete('/experience/:exp_id', auth,  async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });

        // Get remove index
        const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);

        profile.experience.splice(removeIndex, 1);
        
        await profile.save()

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// route PUT api/profile/education
// Add profile education
// access Private
router.put('/education', [auth, [
    check('school', 'School is required').not().isEmpty(),
    check('degree', 'Degree is required').not().isEmpty(),
    check('fieldofstudy', 'Field is required').not().isEmpty(),
    check('from', 'From date is required').not().isEmpty(),
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    } = req.body;

    const newEdu = {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    };

    try {
        const profile = await Profile.findOne({user: req.user.id});

        profile.educations.unshift(newEdu);

        await profile.save();

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }

});

// route DELETE api/profile/education/:exp_id
// Delete education from profile
// access Private
router.delete('/education/:edu_id', auth,  async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });

        // Get remove index
        const removeIndex = profile.educations.map(item => item.id).indexOf(req.params.edu_id);

        profile.educations.splice(removeIndex, 1);
        
        await profile.save()

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// route GET api/profile/education/:exp_id
// Get user repos from Github
// access Public
router.get('/github/:username', async (req, res) => {
    try {
        const options = {
            uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:
                    asc&client_id=${config.get('githubClientId')}&client_secret=${config.get('githubSecret')}`,
            method: 'GET',
            headers: {'user-agent': 'node.js'}
        };

        request(options, (error, response, body) => {
            if (error) console.error(error);
            
            if (response.statusCode !== 200) {
                return res.status(404).json({msg: 'No GitHub profile found'});
            }

            res.json(JSON.parse(body));
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


module.exports = router;
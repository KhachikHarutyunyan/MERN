const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator/check');

// route GET api/auth
// Register User
// access Public
router.get('/',(req, res) => {
    res.send('Auth route');
});

module.exports = router;
const express = require('express');
const router = express.Router();

const dotenv = require('dotenv').config();
const jwt = require('jsonwebtoken');
const logged = require('../../middleware/login')
const User = require("../../models/user")
const Role = require("../../models/role")

router.post('/mybets', logged, async (req, res) => {
    try {
        console.log('betsData', req.body);
        // const user = await User.findOneAndUpdate(
        //     { userName: req.body.userName },
        //     { lang: req.body.lang },
        //     { new: true, upsert: true, returnOriginal: false },
        // );
        // if (!user) {
        //     return res.status(404).json({ message: 'User not found.' });
        // }
        // const token = jwt.sign(
        //     {
        //         userName: user.userName,
        //         name: user.name,
        //         role: user.userRole,
        //         lang: user.lang,
        //         balance: user.balance,
        //         createdAt: user.createdAt,
        //     },
        //     dotenv.parsed.SECRET_KEY,
        //     { expiresIn: '3h' }
        // );
        return res.status(200).json({ message: 'success' });
    } catch (err) {
        return res.status(500).json({ message: err });
    }
});

module.exports = router
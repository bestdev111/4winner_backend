const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { restart } = require('nodemon');

const jwt = require('jsonwebtoken');
const User = require("../../models/user")
const validateLogin = require('../../validation/validateLogin');
const dotenv = require('dotenv').config();

router.post('/login', async (req, res) => {
    const { errors, isValid } = validateLogin(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }
    try {
        const user = await User.findOne({ name: req.body.name }).exec();
        if (!user) {
            return res.status(401).json({
                name: 'Could not find user.'
            });
        }
        if (user.userrole !== 'user') {
            return res.status(401).json({
                name: 'Auth failed.'
            });
        }
        return bcrypt.compare(req.body.password, user.password, (err, result) => {
            if (err) {
                return res.status(401).json({
                    message: 'Auth failed.'
                });
            }
            if (result) {
                const token = jwt.sign(
                    {
                        userId: user._id,
                        createdAt: user.createdAt,
                        name: user.name,
                        role: user.userrole,
                        lang: user.lang,
                        balance: user.balance,
                    },
                    dotenv.parsed.SECRET_KEY,
                    {
                        expiresIn: '3h'
                    }
                );
                return res.status(200).json({
                    message: 'Auth successful.',
                    token
                });
            }
            return res.status(401).json({
                password: 'Wrong password. Try again.'
            });
        });
    } catch (err) {
        return res.status(500).json({ message: err });
    }
});
router.post('/update', async (req, res) => {
    try {
        const user = await User.findOneAndUpdate(
            { _id: req.body.userId },
            { lang: req.body.lang },
            { new: true, upsert: true, returnOriginal: false },
        );
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        const token = jwt.sign(
            {
                userId: user._id,
                createdAt: user.createdAt,
                name: user.name,
                role: user.userrole,
                lang: user.lang,
                balance: user.balance,
            },
            dotenv.parsed.SECRET_KEY,
            { expiresIn: '3h' }
        );
        return res.json({ user, token });
    } catch (err) {
        return res.status(500).json({ message: err });
    }
});
module.exports = router

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const dotenv = require('dotenv').config();
const jwt = require('jsonwebtoken');
const logged = require('../../middleware/login')
const validateLogin = require('../../validation/validateLogin');
const validatePassChange = require('../../validation/validatePassChange');
const User = require("../../models/user")
const Role = require("../../models/role")
router.post('/login', async (req, res) => {
    const { errors, isValid } = validateLogin(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }
    try {
        const user = await User.findOne({ userName: req.body.userName }).exec();
        // const userRoleId = await Role.findOne({ role: 'user' })
        if (!user) {
            return res.status(401).json({
                message: 'Could not find user.'
            });
        }
        const roleData = await Role.findOne({ _id: user.userRole })
        if (roleData.role !== 'user') {
            return res.status(401).json({
                message: 'Permission denied.'
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
                        userName: user.userName,
                        name: user.name,
                        role: user.userRole,
                        lang: user.lang,
                        balance: user.balance,
                        createdAt: user.createdAt,
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
router.post('/changepass', logged, async (req, res) => {
    const { errors, isValid } = validatePassChange(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }
    try {
        const user = await User.findOne({ userName: req.body.userName }).exec();
        return await bcrypt.compare(req.body.currentPass, user.password, (err, result) => {
            if (err) {
                return res.status(401).json({
                    message: 'Wrong password. Try again.'
                });
            }
            if (result) {
                bcrypt.hash(req.body.newPass, 10, async (error, hash) => {
                    if (error) {
                        return res.status(500).json({ error });
                    }
                    const newPass = await User.findOneAndUpdate(
                        { userName: req.body.userName },
                        { password: hash },
                        { new: true, upsert: true, returnOriginal: false },
                    );
                    if (!newPass) {
                        return res.status(404).json({ message: 'Password change error.' });
                    }
                    return res.status(200).json({ message: 'success' });
                });
            }
        });
    } catch (err) {
        return res.status(500).json({ message: err });
    }
});
router.post('/update', async (req, res) => {
    try {
        const user = await User.findOneAndUpdate(
            { userName: req.body.userName },
            { lang: req.body.lang },
            { new: true, upsert: true, returnOriginal: false },
        );
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        const token = jwt.sign(
            {
                userName: user.userName,
                name: user.name,
                role: user.userRole,
                lang: user.lang,
                balance: user.balance,
                createdAt: user.createdAt,
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

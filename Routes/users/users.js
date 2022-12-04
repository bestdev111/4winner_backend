const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { restart } = require('nodemon');

const jwt = require('jsonwebtoken');
const logged = require('../../middleware/login')
const User = require("../../models/user")
const Role = require("../../models/role")
const validateRegister = require('../../validation/validateRegister');
const validateLogin = require('../../validation/validateLogin');
const dotenv = require('dotenv').config();
router.get('/', async (req, res) => {
    const userInfo = req.query;
    await User.find(function (err, users) {
        if (!err) {
            let arr = new Array();
            let index = 1;
            for (const user of users) {
                let obj = new Object();
                if (userInfo.role === 'admin') {
                    obj = {
                        id: index,
                        _id: user._id,
                        name: user.name,
                        role: user.userrole,
                        lang: user.lang,
                        balance: user.balance
                    }
                    arr.push(obj)
                    index++
                }
                if (userInfo.role === 'agent' && user.userrole === 'distributor') {
                    obj = {
                        id: index,
                        _id: user._id,
                        name: user.name,
                        role: user.userrole,
                        lang: user.lang,
                        balance: user.balance
                    }
                    arr.push(obj)
                    index++
                }
                if (userInfo.role === 'distributor' && user.userrole === 'cashier') {
                    obj = {
                        id: index,
                        _id: user._id,
                        name: user.name,
                        role: user.userrole,
                        lang: user.lang,
                        balance: user.balance
                    }
                    arr.push(obj)
                    index++
                }
                if (userInfo.role === 'cashier' && user.userrole === 'user') {
                    obj = {
                        id: index,
                        _id: user._id,
                        name: user.name,
                        role: user.userrole,
                        lang: user.lang,
                        balance: user.balance
                    }
                    arr.push(obj)
                    index++
                }
            }
            return res.status(200).json(arr);
        } else {
            res.sendStatus(500);
            return;
        }
    }).clone().catch(function (err) { console.log(err) })
});
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
router.post('/register', logged, async (req, res) => {
    const { errors, isValid } = validateRegister(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }
    try {
        const user = await User.find({ name: req.body.name }).exec();
        if (user.length > 0) {
            return res.status(409).json({ error: 'Name already exists.' });
        }
        return bcrypt.hash(req.body.password, 10, (error, hash) => {
            if (error) {
                return res.status(500).json({ error });
            }
            const newUser = new User({
                name: req.body.name,
                userrole: req.body.role,
                password: hash,
                createdAt: new Date().getTime(),
            });
            return newUser
                .save()
                .then((result) => {
                    return res.status(200).json({ result });
                })
                .catch((err) => {
                    return res.status(500).json({ error: err });
                });
        });
    } catch (err) {
        return res.status(500).json({ err });
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
router.post('/updateuser', logged, async (req, res) => {
    try {
        const user = await User.findOneAndUpdate(
            { _id: req.body._id },
            {
                name: req.body.name,
                userrole: req.body.role,
            },
            { new: false, upsert: true, returnOriginal: false },
        );
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        return res.json({ success: true });
    } catch (err) {
        return res.status(500).json({ message: err });
    }
});
router.post('/deleteuser', logged, async (req, res) => {
    try {
        console.log('name:', req.body.name);
        await User.deleteOne({ name: req.body.name }).exec();
        return res.status(200).json({ message: 'Successfully deleted user.' });
    } catch (err) {
        return res.status(500).json({ message: err });
    }
});
module.exports = router
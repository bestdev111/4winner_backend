const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { restart } = require('nodemon');

const jwtSecret = 'VerySecretString123$'
const jwt = require('jsonwebtoken');
const login = require('../../middleware/login')
const User = require("../../models/user")
const validateRegister = require('../../validation/validateRegister');
const validateLogin = require('../../validation/validateLogin');

router.get('/', async (req, res) => {
    User.find(function (err, users) {
        if (err) {
        } else {
            res.status(200).json(users);
        }
    });
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
                        balance: user.balance,
                    },
                    jwtSecret,
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
router.post('/register', async (req, res) => {
    const { errors, isValid } = validateRegister(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }
    login(req, res);
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
                email: req.body.email,
                name: req.body.name,
                password: hash,
                userrole: req.body.userrole,
                balance: req.body.balance,
                createdAt: new Date().getTime(),
            });
            return newUser
                .save()
                .then((result) => {
                    res.status(200).json({ result });
                })
                .catch((err) => {
                    res.status(500).json({ error: err });
                });
        });
    } catch (err) {
        return res.status(500).json({ err });
    }
});

module.exports = router
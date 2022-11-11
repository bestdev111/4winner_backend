const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const { restart } = require('nodemon');
const path = require("path");
const fs = require("fs");
const jwt = require('jsonwebtoken');
const dataDir = path.join(__dirname, "../data/");
// const login = require('../middleware/login')
const User = require("../models/user")
const SportType = require("../models/sportType")
const validateRegister = require('../validation/validateRegister');
const validateLogin = require('../validation/validateLogin');

router.get('/', async (req, res) => {
    User.find(function (err, users) {
        if (err) {
            console.log(err);
        } else {
            res.status(200).json(users);
        }
    });
});
router.get('/getAllMatches', async (req, res) => {
    try {
        await fs.readFile(`${dataDir}getAllMatches.json`, 'utf8', (err, stringData) => {
            if (err) {
                console.error(err);
                res.status(500).json({ err });
                return;
            }
            const data = JSON.parse(stringData);
            console.log('data', data.totalOutrightsCount);
            res.status(200).json({ data });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ err });
    }
});
router.get('/getMatches', async (req, res) => {
    try {
        await fs.readFile(`${dataDir}getMatches.json`, 'utf8', (err, stringData) => {
            if (err) {
                console.error(err);
                res.status(500).json({ err });
                return;
            }
            const data = JSON.parse(stringData);
            res.status(200).json({ data });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ err });
    }
});
router.post('/register', async (req, res) => {
    const { errors, isValid } = validateRegister(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    try {
        const user = await User.find({ email: req.body.email }).exec();
        if (user.length > 0) {
            return res.status(409).json({ error: 'Email already exists.' });
        }
        return bcrypt.hash(req.body.password, 10, (error, hash) => {
            if (error) {
                console.log('pass');
                return res.status(500).json({ error });
            }
            console.log('data', req.data, hash);
            const newUser = new User({
                email: req.body.email,
                name: req.body.name,
                password: hash,
                role: req.body.role,
                balance: req.body.balance,
                createdAt: new Date().getTime(),
            });
            console.log('newUser', newUser);
            return newUser
                .save()
                .then((result) => {
                    console.log('success');
                    res.status(200).json({ result });
                })
                .catch((err) => {
                    console.log('fail');
                    res.status(500).json({ error: err });
                });
        });
    } catch (err) {
        return res.status(500).json({ err });
    }
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
                        role: user.role,
                        balance: user.balance,
                    },
                    user.name,
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

module.exports = router
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const { restart } = require('nodemon');
const path = require("path");
const fs = require("fs");
const dataDir = path.join(__dirname, "../data/");
// const login = require('../middleware/login')
const User = require("../models/user")
const SportType = require("../models/sportType")
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
router.post('/add', async (req, res) => {
    // const { errors, isValid } = validateSignup(req.body);
    
    // if (!isValid) {
        //     return res.status(400).json(errors);
        // }
        
        try {
            const user = await User.find({ email: req.body.email }).exec();
            if (user.length > 0) {
                return res.status(409).json({ error: 'Email already exists.' });
            }
            return bcrypt.hash(req.body.password, 10, (error, hash) => {
                // if (error) {
                //     console.log('pass');
                //     return res.status(500).json({ error });
                // }
                console.log('data',req.data, hash);
                const newUser = new User({
                    email: req.body.email,
                    name: req.body.name,
                    role: req.body.role,
                    password: hash,
                    passwordConfirm: hash,
                });
                console.log('newUser',newUser);
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
router.post('/add', async (req, res) => {
    // const { errors, isValid } = validateSignup(req.body);
    
    // if (!isValid) {
        //     return res.status(400).json(errors);
        // }
        
        try {
            const user = await User.find({ email: req.body.email }).exec();
            if (user.length > 0) {
                return res.status(409).json({ error: 'Email already exists.' });
            }
            return bcrypt.hash(req.body.password, 10, (error, hash) => {
                // if (error) {
                //     console.log('pass');
                //     return res.status(500).json({ error });
                // }
                console.log('data',req.data, hash);
                const newUser = new User({
                    email: req.body.email,
                    name: req.body.name,
                    password: hash,
                    passwordConfirm: hash,
                });
                console.log('newUser',newUser);
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
module.exports = router
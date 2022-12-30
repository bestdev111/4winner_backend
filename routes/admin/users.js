const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
const logged = require("../../middleware/login");
const User = require("../../models/user");
const Role = require("../../models/role");
const validateRegister = require("../../validation/validateRegister");
const validateLogin = require("../../validation/validateLogin");
const dotenv = require("dotenv").config();
// get User
router.get("/", async (req, res) => {
    const userInfo = req.query;
    await User.find(function (err, users) {
        if (!err) {
            let arr = new Array();
            let index = 1;
            for (const user of users) {
                let obj = new Object();
                if (userInfo.role === "admin") {
                    obj = {
                        id: index,
                        _id: user._id,
                        name: user.name,
                        role: user.userRole,
                        lang: user.lang,
                        balance: user.balance,
                        shop: user.shop,
                    };
                    arr.push(obj);
                    index++;
                }
                if (
                    userInfo.role === "agent" &&
                    user.userRole === "distributor"
                ) {
                    obj = {
                        id: index,
                        _id: user._id,
                        name: user.name,
                        role: user.userRole,
                        lang: user.lang,
                        balance: user.balance,
                    };
                    arr.push(obj);
                    index++;
                }
                if (
                    userInfo.role === "distributor" &&
                    user.userRole === "cashier"
                ) {
                    obj = {
                        id: index,
                        _id: user._id,
                        name: user.name,
                        role: user.userRole,
                        lang: user.lang,
                        balance: user.balance,
                        shop: user.shop,
                    };
                    arr.push(obj);
                    index++;
                }
                if (userInfo.role === "cashier" && user.userRole === "user") {
                    obj = {
                        id: index,
                        _id: user._id,
                        name: user.name,
                        role: user.userRole,
                        lang: user.lang,
                        balance: user.balance,
                    };
                    arr.push(obj);
                    index++;
                }
            }
            return res.status(200).json(arr);
        } else {
            res.sendStatus(500);
            return;
        }
    })
        .clone()
        .catch(function (err) {
            console.log(err);
        });
});
router.post("/login", async (req, res) => {
    const { errors, isValid } = validateLogin(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }
    try {
        const user = await User.findOne({ userName: req.body.userName })
            .populate("userRole")
            .exec();
        if (!user) {
            return res.status(401).json({
                name: "Could not find user.",
            });
        }
        return bcrypt.compare(
            req.body.password,
            user.password,
            async (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: "Auth failed.",
                    });
                }
                if (result) {
                    // sign jwt token
                    const token = jwt.sign(
                        {
                            userId: user._id,
                            createdAt: user.createdAt,
                            userName: user.userName,
                            userRole: user.userRole.role,
                            lang: user.lang,
                            balance: user.balance,
                            shop: user.shop,
                        },
                        dotenv.parsed.SECRET_KEY,
                        {
                            expiresIn: "3h",
                        }
                    );
                    return res.status(200).json({
                        message: "Auth successful.",
                        token,
                    });
                }
                return res.status(401).json({
                    password: "Wrong password. Try again.",
                });
            }
        );
    } catch (err) {
        return res.status(500).json({ message: err });
    }
});
// @Route   /admin/register
// @Summary register a user
router.post("/register", async (req, res) => {
    const { errors, isValid } = validateRegister(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }
    try {
        const user = await User.find({ userName: req.body.userName }).exec();
        if (user.length > 0) {
            return res.status(409).json({ message: "Name already exists." });
        }
        return bcrypt.hash(req.body.password, 10, async (error, hash) => {
            if (error) {
                return res.status(500).json({ error });
            }
            // find the object id of the requested role to refer
            try {
                role = await Role.find({ role: req.body.role }).exec();
                console.log(
                    "fetched " + req.body.role + " role is ",
                    role[0]._id
                );
            } catch (error) {
                return res
                    .status(500)
                    .json({ error: "That role does not exist" });
            }
            const newUser = new User({
                userName: req.body.userName,
                name: req.body.name,
                userRole: role[0]._id,
                password: hash,
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
router.post("/update", async (req, res) => {
    try {
        const user = await User.findOneAndUpdate(
            { _id: req.body.userId },
            { lang: req.body.lang },
            { new: true, upsert: true, returnOriginal: false }
        ).populate("userRole");
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        const token = jwt.sign(
            {
                userId: user._id,
                createdAt: user.createdAt,
                userName: user.userName,
                userRole: user.userRole.role,
                lang: user.lang,
                balance: user.balance,
                shop: user.shop,
            },
            dotenv.parsed.SECRET_KEY,
            { expiresIn: "3h" }
        );
        return res.json({ user, token });
    } catch (err) {
        return res.status(500).json({ message: err });
    }
});
router.post("/reset-pass", logged, async (req, res) => {
    if (bcrypt.compare(req.body.old, req.user.password)) {
        try {
            console.log(
                "🚀 ~ file: users.js:204 ~ router.post ~ req.user._id",
                req.user.name
            );
            const hash = bcrypt.hash(req.body.new, 10);
            // something wrong with bellow code
            const user = await User.findOneAndUpdate(
                { name: req.user.name },
                { password: hash },
                { new: true }
            );
            //
            console.log("🚀 ~ file: users.js:207 ~ router.post ~ user", user);
            if (!user) {
                return res.status(404).json({ message: "User not found." });
            }

            return res.json({ user });
        } catch (err) {
            return res.status(500).json({ message: err });
        }
    } else {
        console.log("Your password is not correct");
        return res
            .status(500)
            .json({ message: "Your password is not correct" });
    }
});
router.post("/updateuser", logged, async (req, res) => {
    try {
        const user = await User.findOneAndUpdate(
            { _id: req.body._id },
            {
                name: req.body.name,
                userRole: req.body.role,
            },
            { new: false, upsert: true, returnOriginal: false }
        );
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        return res.json({ success: true });
    } catch (err) {
        return res.status(500).json({ message: err });
    }
});
router.post("/deleteuser", logged, async (req, res) => {
    try {
        console.log("name:", req.body.name);
        await User.deleteOne({ name: req.body.name }).exec();
        return res.status(200).json({ message: "Successfully deleted user." });
    } catch (err) {
        return res.status(500).json({ message: err });
    }
});
module.exports = router;

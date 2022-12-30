const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();

const User = require("../../models/user");
const CasinoType = require("../../models/casinoType");
const SportType = require("../../models/sportType");
const Role = require("../../models/role");
const logged = require("../../middleware/login");
const validateRegister = require("../../validation/validateRegister");
const defaultValues = require("../../utils/defaultValue");
const { getCustomers } = require("../../Services/userService");

// @Route /admin/customer/create
// @Summary an agent (or a cashier) is creating a user
router.post("/create", logged, async (req, res) => {
    if (req.user.userRole.role != "cashier")
        res.status(401).json({
            message: "You're not allowed to perform operation",
        });

    req.body.password = defaultValues.defaultPassword;
    const { errors, isValid } = validateRegister(req.body, 1);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    try {
        // If there is a user whose userName is the same as the requested userName return name-already-exist error message
        const user = await User.find({ userName: req.body.userName }).exec();
        if (user.length > 0) {
            return res.status(409).json({ error: "Name already exists." });
        }
        // Create a user whose parentId is the agent who is requesting this user creation
        return bcrypt.hash(req.body.password, 10, async (error, hash) => {
            if (error) {
                return res.status(500).json({ error });
            }
            // find the object id of the requested role to refer
            try {
                role = await Role.find({ role: "user" }).exec();
            } catch (error) {
                return res
                    .status(404)
                    .json({ error: "This role does not exist" });
            }
            // now set up a new user
            const newUser = new User({
                userName: req.body.userName,
                name: req.body.name,
                maximumStakeLimit: req.body.maximumStakeLimit,
                totalOddsLimit: req.body.totalOddsLimit,
                isCashoutEnabled: req.body.isCashoutEnabled,
                userRole: role[0]._id,
                parent: req.user._id,
                password: hash,
                shop: req.user.shop
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

// @Route put /admin/customer/update
// @Summary an agent (or a cashier) is creating a user
router.put("/update", logged, async (req, res) => {
    if (req.user.userRole.role != "cashier")
        return res
            .status(401)
            .json({ message: "You're not allowed to perform operation" });

    try {
        // If there is a user whose userName is the same as the requested userName return name-already-exist error message
        user = await User.findOne({ userName: req.body.userName }).exec();
        if (!user) {
            return res.status(409).json({ error: "User not found" });
        }
        // now set up a new user
        user = await User.findOneAndUpdate(
            {
                userName: req.body.userName,
            },
            {
                name: req.body.name,
                maximumStakeLimit: req.body.maximumStakeLimit,
                totalOddsLimit: req.body.totalOddsLimit,
                isCashoutEnabled: req.body.isCashoutEnabled,
            }
        );
        return res.status(200).json({
            message: "User " + user.userName + " updated successufuly",
        });
    } catch (err) {
        console.log(err);
        return res
            .status(500)
            .json({ message: "Temporary Error while updating customer" });
    }
});

// @Route /admin/customer/getusers
// @Summary get users whose parent is that cashier
router.get("/getusers", logged, async (req, res) => {
    if (req.user.userRole.role != "cashier")
        res.status(401).json({
            message: "You're not allowed to perform operation",
        });
    users = await getCustomers(req.user);
    res.status(200).json({ users: users });
});

// @Route /admin/customer/getuser  req.body -> userName
// @Summary get user
router.post("/getuser", logged, async (req, res) => {
    if (req.user.userRole.role != "cashier")
        res.status(401).json({
            message: "You're not allowed to perform operation",
        });
    User.findOne({ userName: req.body.userName })
        .populate("parent", "userName")
        .then((user) => {
            if (user.parent.userName !== req.user.userName) throw err;
            else {
                res.status(200).json(user);
            }
        })
        .catch((err) =>
            res.status(500).json({
                message: " User not exist",
            })
        );
});

// @Route /admin/customer/changestatus
// @Summary block or active the customer
router.post("/changestatus", logged, async (req, res) => {
    if (req.user.userRole.role != "cashier")
        res.status(401).json({
            message: "You're not allowed to perform operation",
        });
    try {
        const user = await User.findOneAndUpdate(
            {
                userName: req.body.userName,
            },
            {
                active: req.body.blockStatus,
            }
        );
        user.active = req.body.blockStatus;
        return res.status(200).json({ user: user });
    } catch (err) {
        console.log("err while blocking/activating statuas", err);
        return res
            .status(500)
            .json({ message: "Error while blocking/activating customer" });
    }
});

// @Route /admin/customer/changepass
// @Summary block or active the customer
router.post("/changepass", logged, async (req, res) => {
    if (req.user.userRole.role != "cashier")
        res.status(401).json({
            message: "You're not allowed to perform operation",
        });
    bcrypt.compare(
        req.body.loginPass,
        req.user.password,
        async (err, result) => {
            if (err) return res.status(401).json({ message: "Auth failed" });
            else if (result) {
                bcrypt.hash(req.body.newPass, 10, async (err, hash) => {
                    try {
                        user = await User.findOne({
                            userName: req.body.userName,
                        });
                    } catch (err) {
                        console.log(err);
                        return res
                            .status(404)
                            .json({ message: "User not found" });
                    }
                    user.password = hash;
                    user.save()
                        .then((result) => {
                            return res.status(200).json({
                                message:
                                    user.userName + "'s password is updated",
                            });
                        })
                        .catch((err) => {
                            console.log(err);
                            return res.status(500).json({
                                message:
                                    "Server error while updating customer password",
                            });
                        });
                });
            } else return res.status(401).json({ message: "Wrong password" });
        }
    );
});

module.exports = router;

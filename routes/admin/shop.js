const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const logged = require("../../middleware/login");
const User = require("../../models/user");
const Role = require("../../models/role");
const Shop = require("../../models/shop");
const Transaction = require("../../models/transaction");

const shopService = require("../../Services/shopServices");

// @Route /admin/shop/
// @Summary an admin (or a distributor) is getting the list of shops
router.get("/", logged, async (req, res) => {
    if (req.user.userRole.priority > 3) {
        console.log("userRole", req.user.userRole);
        res.status(401).json({
            message: "You're not allowed to perform the operation",
        });
    }
    try {
        let shops = await shopService.getShops(req.user);
        res.status(200).json({ shops: shops });
    } catch (err) {
        console.log(err);
        res.status(500).json({ err: err });
    }
});

// @Route /admin/shop/
// @Summary an admin (or a distributor) is creating a shop
router.post("/", logged, async (req, res) => {
    if (req.user.userRole.priority > 3) {
        console.log("userRole", req.user.userRole);
        res.status(401).json({
            message: "You're not allowed to perform the operation",
        });
    }

    if (req.user.userRole.priority == 2) {
        console.log("userRole", req.user.userRole);
        res.status(401).json({ message: "Agent can't create a shop" });
    }

    // if the admin is creating the shop
    if (req.user.userRole.priority == 1) {
        // admin has to input agent, distributor and cashier
        if (req.body.agentName === null || req.body.agentName === undefined)
            res.status(500).json({ message: "Agent is needed" });
        if (
            req.body.distributorName === null ||
            req.body.distributorName === undefined
        )
            res.status(500).json({ message: "Distributor is needed" });
        if (req.body.cashierName === null || req.body.cashierName === undefined)
            res.status(500).json({ message: "Cashier is needed" });
        // validate the input
        if (
            req.body.shopTitle == "" ||
            req.body.shopTitle === null ||
            req.body.shopTitle === undefined
        )
            res.status(500).json({ message: "Shop title is required" });

        try {
            // create agent
            bcrypt.hash(req.body.agentPassword, 10, async (error, hash) => {
                if (error) {
                    return res.status(500).json({ error });
                }
                // If there is a user whose userName is the same as the requested userName return name-already-exist error message
                let user = await User.find({
                    userName: req.body.agentName,
                }).exec();
                if (user.length > 0) {
                    return res
                        .status(409)
                        .json({ message: "Agent's Name already exists." });
                }
                // find the object id of the requested role to refer
                try {
                    role = await Role.find({ role: "agent" }).exec();
                } catch (error) {
                    throw error;
                }
                // If there is a user whose userName is the same as the requested userName return name-already-exist error message
                user = await User.find({
                    userName: req.body.distributorName,
                }).exec();
                if (user.length > 0) {
                    return res
                        .status(409)
                        .json({
                            message: "Distributor's Name already exists.",
                        });
                }
                // If there is a user whose userName is the same as the requested userName return name-already-exist error message
                user = await User.find({
                    userName: req.body.cashierName,
                }).exec();
                if (user.length > 0) {
                    return res
                        .status(409)
                        .json({ message: "Cashier's Name already exists." });
                }
                // If there is a user whose userName is the same as the requested userName return name-already-exist error message
                let shop = await Shop.find({ name: req.body.shopTitle }).exec();
                if (shop.length > 0) {
                    return res
                        .status(409)
                        .json({ message: "Shop name already exists." });
                }
                const newAgent = new User({
                    userName: req.body.agentName,
                    name: req.body.agentName,
                    balance: req.body.agentBalance,
                    userRole: role[0]._id,
                    parent: req.user._id,
                    password: hash,
                });
                newAgent
                    .save()
                    .then((createdAgent) => {
                        // create distributor
                        bcrypt.hash(
                            req.body.distributorPassword,
                            10,
                            async (error, hash) => {
                                if (error) {
                                    createdAgent.delete();
                                    return res.status(500).json({ error });
                                }
                                // find the object id of the requested role to refer
                                try {
                                    role = await Role.find({
                                        role: "distributor",
                                    }).exec();
                                } catch (error) {
                                    throw error;
                                }
                                const newDistributor = new User({
                                    userName: req.body.distributorName,
                                    name: req.body.distributorName,
                                    balance: req.body.distributorBalance,
                                    userRole: role[0]._id,
                                    parent: createdAgent._id,
                                    password: hash,
                                });
                                newDistributor
                                    .save()
                                    .then((createdDistributor) => {
                                        // create new cashier
                                        bcrypt.hash(
                                            req.body.cashierPassword,
                                            10,
                                            async (error, hash) => {
                                                if (error) {
                                                    createdDistributor.delete();
                                                    return res
                                                        .status(500)
                                                        .json({ error });
                                                }
                                                // find the object id of the requested role to refer
                                                try {
                                                    role = await Role.find({
                                                        role: "cashier",
                                                    }).exec();
                                                } catch (error) {
                                                    throw error;
                                                }
                                                const newCashier = new User({
                                                    userName:
                                                        req.body.cashierName,
                                                    name: req.body.cashierName,
                                                    userRole: role[0]._id,
                                                    parent: createdDistributor._id,
                                                    password: hash,
                                                });
                                                newCashier
                                                    .save()
                                                    .then(
                                                        async (
                                                            createdCashier
                                                        ) => {
                                                            newShop = new Shop({
                                                                name: req.body
                                                                    .shopTitle,
                                                                currency:
                                                                    req.body
                                                                        .shopCurrency,
                                                                access: req.body
                                                                    .shopAccess,
                                                                operator:
                                                                    createdDistributor._id,
                                                                allowedSportTypes:
                                                                    req.body
                                                                        .allowedSportType,
                                                                isCasinoEnabled:
                                                                    req.body
                                                                        .isCasinoEnabled,
                                                                totalOddsLimit: req.body.totalOddsLimit,
                                                                maximumStakeLimit: req.body.maximumStakeLimit,
                                                                isSlotEnabled: req.body.isSlotEnabled,
                                                                refund: req.body.refund
                                                            });
                                                            newShop
                                                                .save()
                                                                .then(
                                                                    (
                                                                        createdShop
                                                                    ) => {
                                                                        createdCashier.shop =
                                                                            createdShop._id;
                                                                        createdCashier
                                                                            .save()
                                                                            .then(
                                                                                (
                                                                                    updatedCashier
                                                                                ) => {
                                                                                    // create transactions here
                                                                                    transactionAdminAgent =
                                                                                        new Transaction(
                                                                                            {
                                                                                                admin: req
                                                                                                    .user
                                                                                                    ._id,
                                                                                                agent: createdAgent._id,
                                                                                                amount: req
                                                                                                    .body
                                                                                                    .agentBalance,
                                                                                                type: 12,
                                                                                            }
                                                                                        );
                                                                                    transactionAgentDistributor =
                                                                                        new Transaction(
                                                                                            {
                                                                                                agent: createdAgent._id,
                                                                                                distributor:
                                                                                                    createdDistributor._id,
                                                                                                amount: req
                                                                                                    .body
                                                                                                    .distributorBalance,
                                                                                                type: 23,
                                                                                            }
                                                                                        );
                                                                                    transactionAdminAgent
                                                                                        .save()
                                                                                        .then(
                                                                                            (
                                                                                                result
                                                                                            ) => {
                                                                                                transactionAgentDistributor
                                                                                                    .save()
                                                                                                    .then(
                                                                                                        (
                                                                                                            result
                                                                                                        ) => {
                                                                                                            return res
                                                                                                                .status(
                                                                                                                    200
                                                                                                                )
                                                                                                                .json(
                                                                                                                    {
                                                                                                                        message:
                                                                                                                            "Shop is created successufuly",
                                                                                                                    }
                                                                                                                );
                                                                                                        }
                                                                                                    )
                                                                                                    .catch(
                                                                                                        (
                                                                                                            err
                                                                                                        ) => {
                                                                                                            transactionAdminAgent.delete();
                                                                                                            throw err;
                                                                                                        }
                                                                                                    );
                                                                                            }
                                                                                        )
                                                                                        .catch(
                                                                                            (
                                                                                                err
                                                                                            ) => {
                                                                                                throw err;
                                                                                            }
                                                                                        );
                                                                                }
                                                                            )
                                                                            .catch(
                                                                                (
                                                                                    err
                                                                                ) => {
                                                                                    createdShop.delete();
                                                                                    throw err;
                                                                                }
                                                                            );
                                                                    }
                                                                )
                                                                .catch(
                                                                    (err) => {
                                                                        createdCashier.delete();
                                                                        throw err;
                                                                    }
                                                                );
                                                        }
                                                    )
                                                    .catch((err) => {
                                                        createdDistributor.delete();
                                                        throw err;
                                                    });
                                            }
                                        );
                                    })
                                    .catch((err) => {
                                        createdAgent.delete();
                                        throw err;
                                    });
                            }
                        );
                    })
                    .catch((err) => {
                        throw err;
                    });
            });
        } catch (err) {
            console.log("err", err);
            return res.status(500).json({ error });
        }
    }

    // if the distributor is creating the shop
    else if (req.user.userRole.priority == 3) {
        // validate the input
        if (
            req.body.shopTitle == "" ||
            req.body.shopTitle === null ||
            req.body.shopTitle === undefined
        )
            res.status(500).json({ message: "Shop title is required" });
        // If there is a user whose userName is the same as the requested userName return name-already-exist error message
        let shop = await Shop.find({ name: req.body.shopTitle }).exec();
        if (shop.length > 0) {
            return res
                .status(409)
                .json({ message: "Shop name already exists." });
        }
        newShop = new Shop({
            name: req.body.shopTitle,
            currency: req.body.shopCurrency,
            access: req.body.shopAccess,
            operator: req.user._id,
            allowedSportTypes: req.body.allowedSportType,
            isCasinoEnabled: req.body.isCasinoEnabled,
            totalOddsLimit: req.body.totalOddsLimit,
            maximumStakeLimit: req.body.maximumStakeLimit,
            isSlotEnabled: req.body.isSlotEnabled,
            refund: req.body.refund
        });
        newShop
            .save()
            .then((createdShop) => {
                return res
                    .status(200)
                    .json({ message: "Shop is created successufuly" });
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json({ err: err });
            });
    }
});

// @Route /admin/shop
// @Summary an admin (or a distributor) is editing a shop
router.put("/", logged, async (req, res) => {
    if (req.user.userRole.priority > 3) {
        console.log("userRole", req.user.userRole);
        res.status(401).json({
            message: "You're not allowed to perform the operation",
        });
    }

    if (req.user.userRole.priority == 2) {
        console.log("userRole", req.user.userRole);
        res.status(401).json({ message: "Agent can't edit a shop" });
    }

    // validate the input
    if (
        req.body.shopTitle == "" ||
        req.body.shopTitle === null ||
        req.body.shopTitle === undefined
    )
        res.status(500).json({ message: "Shop title is required" });
    // If there is a user whose userName is the same as the requested userName return name-already-exist error message
    let shop = await Shop.find({ name: req.body.shopTitle }).exec();
    if (shop.length > 0) {
        return res.status(409).json({ message: "Shop name already exists." });
    }
    try {
        shop = await Shop.findOneAndUpdate(
            {
                _id: req.body.shopId,
            },
            {
                name: req.body.shopTitle,
                currency: req.body.shopCurrency,
                maxWin: req.body.shopMaxWin,
                shopLimit: req.body.shopLimit,
                access: req.body.shopAccess,
                allowedSportTypes: req.body.allowedSportType,
                isCasinoEnabled: req.body.isCasinoEnabled,
            }
        );
    } catch (err) {
        console.log(err);
        return res.status(500).json({ err: err });
    }
});

// @Route /admin/shop
// @Summary delete a shop
router.delete("/", logged, async (req, res) => {
    try {
        shop = await Shop.findOne({ _id: req.body.shopId });
        if (!req.user._id.equals(shop.operator))
            return res.status(401).json({
                message: "You don't have permission to do this operation",
            });

        cashierRole = await Role.findOne({ priority: 4 });
        cashier = await User.findOne({
            userRole: cashierRole._id,
            shop: req.body.shopId,
        });

        playerRole = await Role.findOne({ priority: 5 });
        users = await User.find({
            shop: req.body.shopId,
            userRole: playerRole._id,
        });

        await users.forEach(async (element) => {
            if (element.balance > 0) {
                shop.balance += element.balance;
                transaction1 = new Transaction({
                    cashier: cashier._id,
                    customer: element._id,
                    type: 45,
                    amount: -1 * element.balance,
                });
                await transaction1.save();
            }
            await element.delete();
        });
        await shop.save();

        if (shop.balance > 0) {
            req.user.balance += shop.balance;
            await req.user.save();
            transaction1 = new Transaction({
                distributor: req.user._id,
                shop: req.body.shopId,
                type: 34,
                amount: -1 * shop.balance,
            });
            await transaction1.save();
        }

        await cashier.delete();
        await shop.delete();

        return res.status(200).json({ message: "Shop is deleted" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ err: err });
    }
});

// @Route /admin/shop/getshop
router.post("/getshop", logged, async (req, res) => {
    try {
        if (
            req.body.shop === undefined ||
            req.body.shop === null ||
            req.body.shop === ""
        )
            return res.status(200).json({ shop: null });
        else {
            shop = await Shop.findOne({
                _id: req.body.shop,
            });
            return res.status(200).json({ shop: shop });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ err: err });
    }
});

module.exports = router;

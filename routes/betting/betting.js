const express = require('express');
const router = express.Router();

const dotenv = require('dotenv').config();
const jwt = require('jsonwebtoken');
const logged = require('../../middleware/login')
const User = require("../../models/user")
const Role = require("../../models/role")
const Bet = require("../../models/bet")

router.post('/mybets', logged, async (req, res) => {
    try {
        console.log('betsData', req.body, req.user);
        let betsData = req.body.betsData;
        let betState = req.body.betState;
        let userData = req.user;
        let newBet = null;
        betsData.forEach(item=> {
            newBet = new Bet({
                customer: userData._id,
                initialStake: betState.initialStake,
                tax: betState.tax,
                stakeBet: betState.stakeBet,
                maxWinning: betState.maxWinning,
                matchId: item.matchId,
                homeTeam: item.homeTeam,
                awayTeam: item.awayTeam,
                homeTeamScore: item.homeScore,
                awayTeamScore: item.awayScorse,
                betType: item.betType,
                odds: item.odds,
                selectedOdds: item.selectedOdds
        })
        });
        return newBet
            .save()
            .then((result) => {
                return res.status(200).json({ result });
            })
            .catch((err) => {
                return res.status(500).json({ error: err });
            });
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
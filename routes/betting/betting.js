const express = require('express');
const router = express.Router();

const dotenv = require('dotenv').config();
const jwt = require('jsonwebtoken');
const logged = require('../../middleware/login')
const User = require("../../models/user")
const Role = require("../../models/role")
const Bet = require("../../models/bet")

router.get('/getmybet', logged, async (req, res)=> {
    try{
        const user = await User.findOne({ _id: req.user._id }).populate('userRole').exec();
        if (!user) {
            return res.status(401).json({
                name: "Could not find user.",
            });
        }
        const betData = await Bet.find({ customer: req.user._id }).populate('matchId').exec();
        res.status(200).json({ betData })
    }catch(err){
        return res.status(500).json({ message: err });
    }
})

router.post('/newbet', logged, async (req, res) => {
    try {
        let betsData = req.body.betsData;
        let betState = req.body.betState;
        let userData = req.user;
        let newBet = null;
        let tempArr = [];
        betsData.forEach(item=> {
            newBet = new Bet({
                customer: userData._id,
                initialStake: betState.initialStake,
                tax: betState.tax,
                stakePerBet: betState.stakeBet,
                maxWinning: betState.maxWinning,
                betSystem: item.betSystem,
                matchId: item.matchId,
                homeTeam: item.homeTeam,
                awayTeam: item.awayTeam,
                homeTeamScore: item.homeScore,
                awayTeamScore: item.awayScore,
                betType: item.betType,
                // odds: item.odds,
                selectedOdds: item.selectedOdds
            })
            tempArr.push(newBet)
        });
        Bet.insertMany(tempArr).then(result => 
            res.status(200).json({ result })
        )
    } catch (err) {
        return res.status(500).json({ message: err });
    }
});

module.exports = router
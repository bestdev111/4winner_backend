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
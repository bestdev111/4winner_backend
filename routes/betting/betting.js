const express = require('express');
const router = express.Router();
const logged = require('../../middleware/login')
const User = require("../../models/user")
const Bet = require("../../models/bet")
const Barcode = require("../../models/barcode");

const dotenv = require('dotenv').config();
const Role = require("../../models/role")
const jwt = require('jsonwebtoken');

const generateBarcode = require('../../Services/barcodeService');

router.get('/getmybet', logged, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user._id }).populate('userRole').exec();
        if (!user) {
            return res.status(401).json({
                name: "Could not find user.",
            });
        }
        const betData = await Bet.find({ customer: req.user._id }).populate('date').exec();
        res.status(200).json({ betData })
    } catch (err) {
        console.log('err', err);
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
        let bettingEvents = {};
        let today = new Date()
        betsData.forEach(item => {
            const odd = item.odds[0][item.selectedOdds] / 100;
            const matchDate = item.matchDate === 'Today' ? today.getDate() + "."+  (today.getMonth() + 1) : item.matchDate === 'Tomorrow' ? (today.getDate() + 1) + (today.getMonth() + 1) : item.matchDate
            console.log('here', matchDate)
            bettingEvents = {
                sportTypeId: item.sportTypeId,
                matchId: item.matchId,
                matchDate: matchDate + ' ' + item.matchTime,
                homeTeam: item.homeTeam,
                awayTeam: item.awayTeam,
                homeTeamScore: item.homeScore,
                awayTeamScore: item.awayScore,
                betType: item.betType,
                odd: odd.toFixed(2),
                selectedOdds: item.selectedOdds
            }
            tempArr.push(bettingEvents)
        });
        newBet = new Bet({
            customer: userData._id,
            betSystem: betState.betSystem,
            initialStake: betState.initialStake,
            tax: betState.tax,
            numBet: betState.numBet,
            stakePerBet: betState.stakeBet,
            maxWinning: betState.maxWinning,
            bettingEvents: tempArr,
        })
        newBet.save().then(result =>
            res.status(200).json({ result })
        )
    } catch (err) {
        return res.status(500).json({ message: err });
    }
});

router.post('/removebet', logged, async (req, res) => {
    try{
        const user = await User.findOne({ _id: req.user._id }).populate('userRole').exec();
        if (!user) {
            return res.status(401).json({
                name: "Could not find user.",
            });
        }
        Bet.deleteMany({ customer: req.user._id })
        .then((result) => {
            res.status(200).json({ result })
        })
    }catch{
        console.log('error');
    }
})

// @Route /betting/barcode
// @Method post
router.post('/barcode', logged, async (req, res) => {
    let timestamp = Date.now();
    let userId = req.user._id;

    let barcode = await generateBarcode(timestamp, userId);
    let newBarcode = new Barcode({
        barcode: barcode,
        barcodeJsonString: req.body.barcodeJsonString
    })

    newBarcode.save()
        .then(result => {
            return res.status(200).json({ barcode: result.barcode });
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({ err: err })
        })
});

module.exports = router
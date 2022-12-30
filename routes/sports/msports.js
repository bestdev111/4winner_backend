const express = require('express');
const router = express.Router();
const path = require("path");
const fs = require("fs");
const axios = require("axios");
const dataDir = path.join(__dirname, "../../data/");
// @Crossorigin
router.get('/getAllMatches', async (req, res) => {
    try {
        await fs.readFile(`${dataDir}m_getAllMatches.json`, 'utf8', (err, stringData) => {
            if (err) {
                res.status(500).json({ err });
                return;
            }
            const data = JSON.parse(stringData);
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.status(200).json({ data });
        });
    } catch (err) {
        res.status(500).json({ err });
    }
});
// @Crossorigin
router.post('/getMatches', async (req, res) => {
    try {
        let sportTypeId = req.body.sportTypeId;
        let betradarCategoryId = req.body.betradarCategoryId;
        let leagueName = req.body.leagueName !== undefined ? req.body.leagueName : '';
        let matchState = req.body.matchState;
        let startIndex = req.body.startIndex;
        let orderByLeague = req.body.orderByLeague;
        const url = `https://m.4winners.bet/Home/GetMatches?` +
            `sportTypeId=${sportTypeId}&` +
            `betradarCategoryId=${betradarCategoryId}&` +
            `leagueName=${leagueName}&` +
            `matchState=${matchState}&` +
            `startIndex=${startIndex}&` +
            `orderByLeague=${orderByLeague}`;
        const { data } = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Mobile Safari/537.36' } });
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.status(200).json({ data });
    } catch (err) {
        res.status(500).json({ err });
    }
});
// @Crossorigin
router.get('/getTopLeagues', async (req, res) => {
    try {
        await fs.readFile(`${dataDir}m_getTopLeagues.json`, 'utf8', (err, stringData) => {
            if (err) {
                res.status(500).json({ err });
                return;
            }
            const data = JSON.parse(stringData);
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.status(200).json({ data });
        });
    } catch (err) {
        res.status(500).json({ err });
    }
});
// @Crossorigin
router.get('/getLeagueSorts', async (req, res) => {
    try {
        await fs.readFile(`${dataDir}m_getLeagueSorts.json`, 'utf8', (err, stringData) => {
            if (err) {
                res.status(500).json({ err });
                return;
            }
            const data = JSON.parse(stringData);
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.status(200).json({ data });
        });
    } catch (err) {
        res.status(500).json({ err });
    }
});
// @Crossorigin
router.post('/getResult', async (req, res) => {
    try {
        let date = req.body.date;
        let betradarSportType = req.body.betradarSportType;
        const url = `https://m.4winners.bet/Home/GetFinishedMatches?` +
            `betradarSportType=${betradarSportType}&` +
            `date=${date}`;
        const { data } = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Mobile Safari/537.36' } });
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.status(200).json({ data });
    } catch (err) {
        res.status(500).json({ err });
    }
});
router.post('/getNormalTable', async (req, res) => {
    try {
        let sportId = req.body.sportId;
        let categoryId = req.body.categoryId;
        let tournamentId = req.body.tournamentId;

        const url = `https://m.4winners.bet/Home/GetNormalTable?` +
            `sportId=${sportId}&` +
            `categoryId=${categoryId}&` +
            `tournamentId=${tournamentId}`;
            console.log('url=>', url);
        const { data } = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Mobile Safari/537.36' } });
        res.status(200).json({ data });
    } catch (err) {
        res.status(500).json({ err });
    }
});

module.exports = router

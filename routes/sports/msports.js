const express = require('express');
const router = express.Router();
const path = require("path");
const fs = require("fs");
const axios = require("axios");
const dataDir = path.join(__dirname, "../../data/");

router.post('/getAllMatches', async (req, res) => {
    try {
        const url = `https://m.4winners.bet/Home/GetMatches?sportTypeId=1&betradarCategoryId=0&leagueName=&matchState=home&startIndex=0&orderByLeague=false`
        const { data } = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Mobile Safari/537.36' } });
        res.status(200).json({ data });
    } catch (err) {
        res.status(500).json({ err });
    }
});
router.post('/getMatches', async (req, res) => {
    try {
        let sportTypeId = req.body.sportTypeId;
        // let betradarCategoryId = req.body.betradarCategoryId;
        // let leagueName = req.body.leagueName !== undefined ? req.body.leagueName : '';
            let betradarCategoryId = 1;
            let leagueName = 'Premier%20League';
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
            console.log('===>',data);
        const { data } = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Mobile Safari/537.36' } });
        res.status(200).json({ data });
    } catch (err) {
        res.status(500).json({ err });
    }
});
router.post('/getTopLeagues', async (req, res) => {
    try {
        const url = `https://m.4winners.bet/Home/GetTopLeages`
        const { data } = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Mobile Safari/537.36' } });
        res.status(200).json({ data });
    } catch (err) {
        res.status(500).json({ err });
    }
});
router.post('/getLeagueSorts', async (req, res) => {
    try {
        const url = `https://m.4winners.bet/Home/GetLeagueSorts`
        const { data } = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Mobile Safari/537.36' } });
        res.status(200).json({ data });
    } catch (err) {
        res.status(500).json({ err });
    }
});
router.post('/getResult', async (req, res) => {
    try {
        let date = req.body.date;
        let betradarSportType = req.body.betradarSportType;
        const url = `https://m.4winners.bet/Home/GetFinishedMatches?` +
        `betradarSportType=${betradarSportType}&` +
        `date=${date}`;
        const { data } = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Mobile Safari/537.36' } });
        res.status(200).json({ data });
    } catch (err) {
        res.status(500).json({ err });
    }
});

module.exports = router
// router.get('/getAllMatches', async (req, res) => {
//     try {
//         await fs.readFile(`${dataDir}m_getAllMatches.json`, 'utf8', (err, stringData) => {
//             if (err) {
//                 res.status(500).json({ err });
//                 return;
//             }
//             const data = JSON.parse(stringData);
//             res.status(200).json({ data });
//         });
//     } catch (err) {
//         res.status(500).json({ err });
//     }
// });
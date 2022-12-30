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
const headers = {
    'Content-Type': 'application/json',
    'user-agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Mobile Safari/537.36',
    "x-xsrf-token": "CfDJ8AenrtBH_l9FgN45Fs2thd3xfIhtYaYp-4OQN13PesroJJ-_QINZfTCr2yiQYgcUBQW3SBW91mqWne4X4g54HVp1IFLZWzaiZFi6p1whC3JXRxI0wcc9PziaOUmjv-BbmNjkK9J4OrBwt6Tr1hNIaaA",
    "cookie": ".AspNetCore.Antiforgery.9TtSrW0hzOs=CfDJ8AenrtBH_l9FgN45Fs2thd1qeIjcWoJvxfa23XcLw5uG_Fqe1FIBoDGbGI96skO3aZ4KH0fu8cXa43vu85dL6TeCHXaKZk4e7D8DEW2ZdETNcC7yxzyyzoT-pXV5jEDfH8qF2Kmrr1Dr62FHxMXMmus; .SBMobile.Session=CfDJ8AenrtBH%2Fl9FgN45Fs2thd0oHqFCO9oFYRynB%2Fktfq55cKUmMZF4yPPUavMK8GCFPvkW%2ByzdPnd2tc9wM4QjJItkCTaXRbOL5YiGZOhnr6GoToA2vk0glqa61m1g7b28Lpx%2BU9SSylFqRMod8PgqgbQZgOq0qmxs05HHaRF%2BW98d; nbpselectedlang=en_US; XSRF-TOKEN=CfDJ8AenrtBH_l9FgN45Fs2thd3HpoJfwUFmuINSDFqiV-nG_nPs7zT7a6pxld-CjloPobwnnGfVD5WsGCrPr3iRxzQfxXZvBl8cR1E0731CMuuDoZys7aPMs6giZPjACsSEe_0gLiKTDEp3h_8Hyde9kBg",
}
router.post('/getNormalTable', async (req, res) => {
    try {
        let sportId = req.body.sportId;
        let categoryId = req.body.categoryId;
        let tournamentId = req.body.tournamentId;
        let obj = {
            sportId: req.body.sportId,
            categoryId: req.body.categoryId,
            tournamentId: req.body.tournamentId
        }
        const url = `https://m.4winners.bet/Home/GetNormalTable?` +
            `sportId=${sportId}&` +
            `categoryId=${categoryId}&` +
            `tournamentId=${tournamentId}`;

        const { data } = await axios.post(url, obj, { headers: headers });
        res.status(200).json({ data });
    } catch (err) {
        res.status(500).json({ err });
    }
});
router.post('/getFormTable', async (req, res) => {
    try {
        let sportId = req.body.sportId;
        let categoryId = req.body.categoryId;
        let tournamentId = req.body.tournamentId;
        let obj = {
            sportId: req.body.sportId,
            categoryId: req.body.categoryId,
            tournamentId: req.body.tournamentId
        }
        const url = `https://m.4winners.bet/Home/GetFormTable?` +
            `sportId=${sportId}&` +
            `categoryId=${categoryId}&` +
            `tournamentId=${tournamentId}`;

        const { data } = await axios.post(url, obj, { headers: headers });
        res.status(200).json({ data });
    } catch (err) {
        res.status(500).json({ err });
    }
});

module.exports = router

const express = require('express');
const router = express.Router();
const path = require("path");
const fs = require("fs");
const axios = require("axios");
const dataDir = path.join(__dirname, "../../data/");

router.get('/getAllMatches', async (req, res) => {
    try {
        await fs.readFile(`${dataDir}m_getAllMatches.json`, 'utf8', (err, stringData) => {
            if (err) {
                res.status(500).json({ err });
                return;
            }
            const data = JSON.parse(stringData);
            res.status(200).json({ data });
        });
    } catch (err) {
        res.status(500).json({ err });
    }
});
router.get('/getMatches', async (req, res) => {
    try {
        await fs.readFile(`${dataDir}m_getMatches.json`, 'utf8', (err, stringData) => {
            if (err) {
                res.status(500).json({ err });
                return;
            }
            const data = JSON.parse(stringData);
            res.status(200).json({ data });
        });
    } catch (err) {
        res.status(500).json({ err });
    }
});
router.get('/getTopLeagues', async (req, res) => {
    try {
        await fs.readFile(`${dataDir}m_getTopLeagues.json`, 'utf8', (err, stringData) => {
            if (err) {
                res.status(500).json({ err });
                return;
            }
            const data = JSON.parse(stringData);
            res.status(200).json({ data });
        });
    } catch (err) {
        res.status(500).json({ err });
    }
});
router.get('/getLeagueSorts', async (req, res) => {
    try {
        await fs.readFile(`${dataDir}m_getLeagueSorts.json`, 'utf8', (err, stringData) => {
            if (err) {
                res.status(500).json({ err });
                return;
            }
            const data = JSON.parse(stringData);
            res.status(200).json({ data });
        });
    } catch (err) {
        res.status(500).json({ err });
    }
});
router.get('/getResult', async (req, res) => {
    try {
        console.log("hello:", req.body);
        let date = '2022-12-19';
        let betradarSportType = 1;
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
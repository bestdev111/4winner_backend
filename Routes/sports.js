const express = require('express');
const router = express.Router();
const path = require("path");
const fs = require("fs");
const dataDir = path.join(__dirname, "../data/");
// const login = require('../middleware/login')

router.get('/getAllMatches', async (req, res) => {
    try {
        await fs.readFile(`${dataDir}getAllMatches.json`, 'utf8', (err, stringData) => {
            if (err) {
                console.error(err);
                res.status(500).json({ err });
                return;
            }
            const data = JSON.parse(stringData);
            console.log('data', data.totalOutrightsCount);
            res.status(200).json({ data });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ err });
    }
});
router.get('/getMatches', async (req, res) => {
    try {
        await fs.readFile(`${dataDir}getMatches.json`, 'utf8', (err, stringData) => {
            if (err) {
                console.error(err);
                res.status(500).json({ err });
                return;
            }
            const data = JSON.parse(stringData);
            res.status(200).json({ data });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ err });
    }
});
module.exports = router
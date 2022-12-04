const express = require('express');
const router = express.Router();
const path = require("path");
const fs = require("fs");
const axios = require("axios");
const dataDir = path.join(__dirname, "../data/");
const url =
    "https://4winners.bet/Home/GetMatches?sportTypeId=1&betradarCategoryId=0&leagueName=&matchState=firstpage&startIndex=0&orderByLeague=false";
router.get('/getAllMatches', async (req, res) => {
    try {
        await fs.readFile(`${dataDir}getAllMatches.json`, 'utf8', (err, stringData) => {
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
        await fs.readFile(`${dataDir}getMatches.json`, 'utf8', (err, stringData) => {
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
// router.get('/getMatches',

//     async (req, res) => {
//         try {
//             const { data } = await axios.get(url, 
//                 {headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36' }}
//             );
//             await res.status(200).json({ data });
//         } catch (err) {
//             console.log("error", err);
//         }
//     });

module.exports = router

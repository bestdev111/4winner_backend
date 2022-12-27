const fs = require("fs");
const path = require("path");
const axios = require("axios");
const dataDir = path.join(__dirname, "../data/");

// URL of the page we want to scrape
const url =
  "https://m.4winners.bet/Home/GetAllMatches";

const getAllMatches = async () => {
  try {
    const { data } = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36' } });
    processData(data);
  } catch (err) {
    // console.log("error", err);
  }
};

async function processData(data) {
  let items = [];
  items = data;
// console.log('here',items);
  await fs.writeFile(
    `${dataDir}getAllMatches.json`,
    JSON.stringify(items, null, 2),
    (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log("Successfully written data-> GetAllMatches");
    }
  );
}

module.exports = getAllMatches;

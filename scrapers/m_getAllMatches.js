const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");
const pretty = require("pretty");
const axios = require("axios");
const { contains } = require("cheerio");

const dataDir = path.join(__dirname, "../data/");

// URL of the page we want to scrape
const url = "https://m.4winners.bet/Home/GetAllMatches";
   
const m_getAllMatches = async () => {
  try {
    const { data } = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Mobile Safari/537.36' } });
    processData(data);
  } catch (err) {
    // console.log("error", err);
  }
};

async function processData(data) {
  let items = [];
  items = data;
  
  await fs.writeFile(
    `${dataDir}m_getAllMatches.json`,
    JSON.stringify(items),
    (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log("Successfully written data -> m_getAllMatches");
    }
  );
}

module.exports = m_getAllMatches;

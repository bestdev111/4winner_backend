const fs = require("fs");
const path = require("path");
const axios = require("axios");
const dataDir = path.join(__dirname, "../data/");

// URL of the page we want to scrape
const url = "https://m.4winners.bet/Home/GetLeagueSorts";
   
const m_getLeagueSorts = async () => {
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
    `${dataDir}m_getLeagueSorts.json`,
    JSON.stringify(items),
    (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log("Successfully written data -> m_getLeagueSorts");
    }
  );
}

module.exports = m_getLeagueSorts;

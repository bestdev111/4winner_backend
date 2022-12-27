const fs = require("fs");
const path = require("path");
const axios = require("axios");
const dataDir = path.join(__dirname, "../data/");

// URL of the page we want to scrape
const url =
  "https://4winners.bet/Home/GetMatches?sportTypeId=1&betradarCategoryId=0&leagueName=&matchState=firstpage&startIndex=0&orderByLeague=false";
   
const getMatches = async () => {
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
  
  await fs.writeFile(
    `${dataDir}getMatches.json`,
    JSON.stringify(items),
    (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log("Successfully written data -> GetMatches");
    }
  );
}

module.exports = getMatches;

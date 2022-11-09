const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");
const pretty = require("pretty");
const axios = require("axios");
const { contains } = require("cheerio");

const dataDir = path.join(__dirname, "../data/");

// URL of the page we want to scrape
const url =
  "https://4winners.bet/Home/GetMatches?sportTypeId=1&betradarCategoryId=0&leagueName=&matchState=home&startIndex=0&orderByLeague=true";
const getMatches = async () => {
  try {
    const { data } = await axios.get(url);
    processData(data);
  } catch (err) {
    console.log("error", err);
  }
};

async function processData(data) {
  // console.log('Processing Data:', data);
  let items = [];
  items = data;
  
  await fs.writeFile(
    `${dataDir}getMatches.json`,
    JSON.stringify(items, null, 2),
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

const express = require('express');
require('dotenv').config();
const app = express();
const cors = require("cors");
app.use(cors());
const mongoose = require('mongoose')
const scrapeStaticWebpage = require("./scrapers/staticSiteScraper");

mongoose.connect('mongodb://127.0.0.1:27017/SportData', { useNewUrlParser: true });

require('./models/user');
scrapeStaticWebpage();
setInterval(() => {
    scrapeStaticWebpage();
}, 5000);

// using middlewares

app.use(express.json())
app.use(require('./Routes/auth'))
app.use(require('./Routes/user'))

// listenig to port
const port = 5000
app.listen(port, () => {
    console.log('server is running on: ' + port);
})
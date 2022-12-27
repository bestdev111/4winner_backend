const bodyParser = require('body-parser');
const express = require('express');
const dotenv = require('dotenv').config();
const app = express();
// cors prevent
const cors = require("cors");
app.use(cors());

const user = require('./routes/users/users');
const adminUser = require('./routes/admin/users');
const adminBalance = require('./routes/admin/balance');
const adminCustomer = require('./routes/admin/customer');
const adminSeed = require('./routes/admin/seed');
const adminTransaction = require('./routes/admin/transaction');
const adminShop = require('./routes/admin/shop');
const adminSubAdmin = require('./routes/admin/subadmin')
const sports = require('./routes/sports/sports');
const m_sports = require('./routes/sports/msports');
const betting = require('./routes/betting/betting');

const getAllMatches = require("./scrapers/getAllMatches");
const m_getAllMatches = require("./scrapers/m_getAllMatches");
const m_getTopLeagues = require("./scrapers/m_getTopLeagues");
const m_getLeagueSorts = require("./scrapers/m_getLeagueSorts");
// const getMatches = require("./scrapers/getMatches");
// const m_getMatches = require("./scrapers/m_getMatches");

const betService = require("./Services/betService");

//db connect
const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/sportBet', { useNewUrlParser: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log('Failed to connect to MongoDB', err));

setInterval(() => {
    getAllMatches();
    m_getTopLeagues();
    m_getAllMatches();
    m_getLeagueSorts();
}, 2000);

setInterval(() => {
    betService()
}, 10000);

// using middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json())
app.use('/user', user);
app.use('/admin', adminUser);
app.use('/admin/balance', adminBalance);
app.use('/admin/customer', adminCustomer);
app.use('/admin/seed', adminSeed);
app.use('/admin/transactions', adminTransaction);
app.use('/admin/shop', adminShop);
app.use('/admin/subadmin', adminSubAdmin);
app.use('/sports', sports);
app.use('/betting', betting);
app.use('/m_sports', m_sports);

// listenig to port
const port = 5000
app.listen(port, () => {
    console.log('server is running on: ' + port);
})
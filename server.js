const bodyParser = require('body-parser');
const express = require('express');
const path = require('path')
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
const sports = require('./routes/sports');
const getMatches = require("./scrapers/getMatches");
const getAllMatches = require("./scrapers/getAllMatches");

//db connect
const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/sportBet', { useNewUrlParser: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log('Failed to connect to MongoDB', err));

setInterval(() => {
    // getMatches();
    // getAllMatches();
}, 30000);

// using middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json())
app.use('/user', user);
app.use('/admin', adminUser);
app.use('/admin/balance', adminBalance);
app.use('/admin/customer', adminCustomer);
app.use('/admin/seed', adminSeed);
app.use('/sports', sports);

// listenig to port
const port = 5000
app.listen(port, () => {
    console.log('server is running on: ' + port);
})
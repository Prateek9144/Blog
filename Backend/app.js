const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')

const feedRoutes = require('./routes/feed');

const app = express();

// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

mongoose.connect(
  "mongodb+srv://Prateek:Prateek9144@cluster0.bo9ad.mongodb.net/feed"
);

app.use('/feed', feedRoutes);

app.listen(8080);
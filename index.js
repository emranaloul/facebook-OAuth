'use strict';

const express = require('express')
const {app, start} = require('./src/server.js')
require('dotenv').config();

// app.use(express.static('./public'))

// Start up DB Server
const mongoose = require('mongoose');
const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
};
mongoose.connect(process.env.MANGOOSE_URI, options);

// Start the web server
start(`${process.env.PORT}`);

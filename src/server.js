'use strict';

// 3rd Party Resources
const path = require('path')
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const facebook = require('passport-facebook').Strategy
const oAuth = require('./auth/oauth')


// Esoteric Resources
const errorHandler = require('./error-handlers/500.js');
const notFound = require('./error-handlers/404.js');
const authRoutes = require('./auth/routes.js');
const v1Routes = require('./auth/v1');

const logger = require('./auth/middleware/logger');
const passport = require('passport-facebook');

// Prepare the express app
const app = express();

// App Level MW
app.use(cors());
app.use(morgan('dev'));
app.use(logger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/public')))

// Routes
app.use('/', authRoutes);
app.use('/api/v1', v1Routes);
// app.use('/api/v2', authRoutes);

// app.get('/oauth', oAuth, (req,res)=>{
//   res.json({token: req.token, user:req.user})
// })


// Catchalls
app.use(notFound);
app.use(errorHandler);

module.exports = {
  app: app,
  start: (port) => {
    app.listen(port, () => {
      console.log(`Server Up on ${port}`);
    });
  },
};

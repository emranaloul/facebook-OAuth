'use strict';

const express = require('express');
const authRouter = express.Router();

const User = require('./models/users.js');
const basicAuth = require('./middleware/basic.js')
const bearerAuth = require('./middleware/bearer.js')
const permissions = require('./middleware/acl.js')
const multer = require('multer');
const upload = multer();

authRouter.post('/signup',upload.none(), async (req, res, next) => {
  try {
    let user = new User(req.body);
    const userRecord = await user.save();
    const output = {
      user: userRecord,
      token: userRecord.token
    };
    res.status(201).json(output);
  } catch (e) {
    next(e.message)
  }
});

authRouter.post('/signin', basicAuth, (req, res, next) => {
  const user = {
    user: req.user,
    token: req.user.token
  };
  res.status(200).json(user);
});

authRouter.get('/users', bearerAuth, permissions('delete'), async (req, res, next) => {
  const users = await User.find({});
  const list = users.map(user => user.username);
  res.status(200).json(list);
});

authRouter.get('/secret', bearerAuth, async (req, res, next) => {
  res.status(200).send('Welcome to the secret area')
});

authRouter.get('/user', bearerAuth, permissions('read'), (req, res) => {
  res.json({ user: req.user });
});

// create
authRouter.post('/create', bearerAuth, permissions('create'), (req, res) => {
  res.send('You can create something!!');
});

// update
authRouter.put('/update', bearerAuth, permissions('update'), (req, res) => {
  res.send('You can update something!!');
});

authRouter.patch('/update', bearerAuth, permissions('update'), (req, res) => {
  res.send('You can partially update something!!');
});

// delete
authRouter.delete('/delete', bearerAuth ,  permissions('delete'), (req, res) => {
  res.send('You can delete something!!');
});

module.exports = authRouter;

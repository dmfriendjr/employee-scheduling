const express = require('express');
const router = express.Router();

const db = require('../models');
const bcrypt = require('bcrypt-nodejs');
const mailer = require('./mail_controller');
const randomstring = require('randomstring');


router.get('/verify/:username/:token', (req, res) => {
  db.users.findOne({where: {username: req.params.username, verificationToken: req.params.token}}).then( data => {
    if (data) {
      data.updateAttributes({verified: true});
      req.flash('loginMessage', 'Email verified. Please login.');
      res.redirect('/login');
    } else {
      req.flash('loginMessage', 'Invalid verification token. Please contact support.');
      res.redirect('/login');
    }
  });
});

router.get('/resetRequest', (req, res) => {
  res.render('resetRequest', {message: req.flash('resetMessage')});
});

router.post('/resetRequest', (req, res) => {
  db.users.findOne({where: {username: req.body.username}}).then(data => {
    if (data) {
      let token = randomstring.generate(16);
      mailer.sendResetPasswordEmail(data.dataValues.email, data.dataValues.username, token);
      data.updateAttributes({verificationToken: token});
      req.flash('resetMessage', 'Password reset email sent.');
    } else {
      req.flash('resetMessage', 'Username does not match our records');
    }

    res.redirect('/resetRequest');
  });
});

router.get('/reset/:username/:token', (req, res) => {
  db.users.findOne({where: {username: req.params.username, verificationToken: req.params.token}}).then(data =>{
    if (data) {
      res.render('resetForm');
    } else {
      req.flash('loginMessage', 'Invalid password reset token. Please contact support.');
      res.redirect('/login');
    }
  });
});

router.post('/reset/:username/:token', (req, res) => {
  console.log('posted to this');
  db.users.findOne({where: {username: req.params.username, verificationToken: req.params.token}}).then(data =>{
    if (data) {
      data.updateAttributes({
        password: bcrypt.hashSync(req.body.password, null, null),
        verificationToken: randomstring.generate(16)
      });
      req.flash('loginMessage', 'Password reset succesful. Please login with new password.');
      res.redirect('/login');
    } else {
      req.flash('loginMessage', 'Invalid password reset token. Please contact support.');
      res.redirect('/login');
    }
  });
});

module.exports = router;
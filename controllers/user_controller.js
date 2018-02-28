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
      res.redirect('/');
    } else {
      req.flash('loginMessage', 'Invalid verification token. Please contact support.');
      res.redirect('/');
    }
  });
});

router.get('/resetRequest', (req, res) => {
  res.render('home', {message: req.flash('resetMessage'), showResetForm: true});
});

router.post('/resetRequest', (req, res) => {
  db.users.findOne({where: {username: req.body.username}}).then(data => {
    if (data) {
      if (data.dataValues.verified) {
        let token = randomstring.generate(16);
        mailer.sendResetPasswordEmail(data.dataValues.email, data.dataValues.username, token);
        data.updateAttributes({verificationToken: token});
        req.flash('resetMessage', 'Password reset email sent.');
      } else {
        //User account is not verified, can't reset password
        req.flash('resetMessage', 
          `Account is not verified. Please verify email before reseting password.
          <a href="/resendVerification/${data.dataValues.username}>Resend Verification</a>`);
      }
    } else {
      req.flash('resetMessage', 'Username does not match our records');
    }

    res.redirect('/');
  });
});

router.get('/resendVerification/:username', (req, res) => {
  db.users.findOne({where: {username: req.params.username}}).then(user => {
    let verificationToken = randomstring.generate(16);
    mailer.sendVerificationEmail(user.dataValues.email, 
      user.dataValues.username, verificationToken);
    user.updateAttributes({verificationToken: verificationToken});
    req.flash('loginMessage', 'Verification email sent to email on file for account.');
    res.redirect('/');
  });
});

router.get('/reset/:username/:token', (req, res) => {
  db.users.findOne({where: {username: req.params.username, verificationToken: req.params.token}}).then(data =>{
    if (data) {
      res.render('resetForm');
    } else {
      req.flash('loginMessage', 'Invalid password reset token. Please contact support.');
      res.redirect('/');
    }
  });
});

router.post('/reset/:username/:token', (req, res) => {
  db.users.findOne({where: {username: req.params.username, verificationToken: req.params.token}}).then(data =>{
    if (data) {
      data.updateAttributes({
        password: bcrypt.hashSync(req.body.password, null, null),
        verificationToken: randomstring.generate(16)
      });
      req.flash('loginMessage', 'Password reset succesful. Please login with new password.');
      res.redirect('/');
    } else {
      req.flash('loginMessage', 'Invalid password reset token. Please contact support.');
      res.redirect('/');
    }
  });
});

module.exports = router;
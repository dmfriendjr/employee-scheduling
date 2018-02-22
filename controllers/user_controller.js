const express = require('express');
const db = require('../models');

const router = express.Router();

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

module.exports = router;
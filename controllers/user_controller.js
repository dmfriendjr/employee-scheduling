const express = require('express');
const db = require('../models');

const router = express.Router();

router.get('/verify/:username/:token', (req, res) => {
  db.users.findOne({where: {username: req.params.username, verificationToken: req.params.token}}).then( data => {
    data.updateAttributes({verified: true});
    req.flash('loginMessage', 'Email verified. Please login.');
    res.redirect('/login');
  });
});

module.exports = router;
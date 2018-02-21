const express = require('express');
const db = require('../models');

const router = express.Router();
db.employees.belongsTo(db.users);

router.get('/employees', isLoggedIn, function(req, res) {
  db.employees.findAll({where: {userId: req.user.id}}).then(employees => {
    res.send(employees);
  })
});

router.post('/employees', isLoggedIn, function(req, res) {
  db.employees.create({name: req.body.name, phone_number: req.body.phone_number}).then(employee => {
    db.users.findOne({where: {id: req.user.id}}).then(employer => {
      if (employer) {
        employee.setUser(employer);
      }
    });
  });
});

// route middleware to make sure
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}

module.exports = router;

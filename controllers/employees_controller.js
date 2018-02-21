const express = require('express');
const db = require('../models');

const router = express.Router();
db.employees.belongsTo(db.users);

router.get('/api/employees/:uid', function(req, res) {
  db.employees.findAll({where: {userId: req.params.uid}}).then(employees => {
    res.send(employees);
  })
});

router.post('/api/employees', function(req, res) {
  db.employees.create({name: req.body.name, phone_number: req.body.phone_number}).then(employee => {
    db.users.findOne({where: {id: req.body.employer_id}}).then(employer => {
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

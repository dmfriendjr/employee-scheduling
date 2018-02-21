const express = require('express');
const db = require('../models');

const router = express.Router();
db.users.hasMany(db.employees, {foreignKey: 'employer_id', constraints: false, as: 'employees'});
db.employees.belongsTo(db.users, {foreignKey: 'employer_id', constraints: false, as: 'employer'});

router.get('/api/employees', isLoggedIn, function(req, res) {

});

router.post('/api/employees/:uid', function(req, res) {
  
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

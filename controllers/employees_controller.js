const express = require('express');
const db = require('../models');

const router = express.Router();
db.employees.belongsTo(db.users);
db.employees.hasMany(db.shifts);

router.get('/manageEmployees', isLoggedIn, function(req, res) {
  db.employees.findAll({where: {userId: req.user.id}}).then(employees => {
    let parsedEmployees = employees.map(employee => employee.dataValues);
    res.render('manageEmployees', 
      {
        user: req.user,
        employees: parsedEmployees, 
        message: req.flash('entryError'),
        employeeName: req.flash('employeeName'),
        employeePhone: req.flash('employeePhone'),
        employeeEmail: req.flash('employeeEmail')
      });
  });
});

router.get('/scheduling', isLoggedIn, function(req, res) {
  db.employees.findAll({where: {userId: req.user.id}}).then(employees => {
    let parsedEmployees = employees.map(employee => employee.dataValues);
    res.render('scheduling', 
      {
        user: req.user,
        employees: parsedEmployees, 
        message: req.flash('entryError'),
        employeeName: req.flash('employeeName'),
        employeePhone: req.flash('employeePhone'),
        employeeEmail: req.flash('employeeEmail')
      });
  }); 
});

router.get('/employees', isLoggedIn, function(req, res) {
  db.employees.findAll({where: {userId: req.user.id}}).then(employees => {
    res.send(employees);
  });
});

router.post('/employees', isLoggedIn, function(req, res) {
  db.employees.create({name: req.body.name, phone_number: req.body.phone_number, email: req.body.email}).then(employee => {
    db.users.findOne({where: {id: req.user.id}}).then(employer => {
      if (employer) {
        employee.setUser(employer);
      }
      res.redirect('/manageEmployees'); 
    });
  }).catch(err => {
    req.flash('employeeName', req.body.name);
    req.flash('employeePhone', req.body.phone_number);
    req.flash('employeeEmail', req.body.email);

    if(err.errors[0].path === 'phone_number') {
      req.flash('entryError', 'Phone number is an invalid format. Please use 555-555-5555');
    } else if (err.errors[0].path === 'email') {
      req.flash('entryError', 'Email is an invalid format. Please enter valid email.');
    }

    res.redirect('/manageEmployees');
  });
});

router.delete('/employees', isLoggedIn, function(req, res) {
  db.employees.destroy({where: {id: req.body.id, userId: req.user.id}}).then(() => {
    res.end();
  });
});

function isLoggedIn(req, res, next) {

  // if user is authenticated in the session, carry on
  if (req.isAuthenticated())
    return next();

  // if they aren't redirect them to the home page
  res.redirect('/');
}

module.exports = router;

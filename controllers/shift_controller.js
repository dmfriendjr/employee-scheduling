const express = require('express');
const router = express.Router();
const db = require('../models');


router.get('/shifts/:month/:day/:year', isLoggedIn, function(req, res) {
  db.employees.findAll({where: {userId: req.user.id}}).then((employees) => {
    let employeesShiftPromises = employees.map(employee => {
      return employee.getShifts();
    });
    let requestedDate = new Date(parseInt(req.params.year), parseInt(req.params.month), parseInt(req.params.day));
    Promise.all(employeesShiftPromises).then(shifts => {
      let shiftData = [];
      
      shifts.forEach(shiftArr => {
        shiftArr.map(shift => {
          let shiftDate = new Date(shift.start_date);
          if (shiftDate.toDateString() === requestedDate.toDateString()) {
            shiftData.push(shift);
          }
        });
      });
      res.send(shiftData);
    });
  });
}); 

router.post('/shifts', isLoggedIn, (req, res) =>{
  db.employees.findOne({where: {id: req.body.employee}}).then(employee => {
    db.shifts.create({
      start_date: new Date(req.body.start_date).toUTCString(), 
      end_date: new Date(req.body.end_date).toUTCString(),
      shift_title: req.body.shift_title
    }).then(shift => {
      if (employee) {
        employee.addShift(shift);
        res.redirect('/manageEmployees');
      }
    });
  });
});

router.put('/shifts', isLoggedIn, (req, res) => {
  db.shifts.findOne({where: {id : req.body.id}}).then(shift => {
    if (shift) {
      shift.updateAttributes(req.body);
      res.end();
    }
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
const express = require('express');
const db = require('../models');

const router = express.Router();

db.employees.belongsTo(db.users);

router.get('/api/employees', function(req, res) {

});

module.exports = router;

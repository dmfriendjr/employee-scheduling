// config/database.js
require ('dotenv').config();

module.exports = {
  'connection': {
      'host': 'localhost',
      'user': 'root',
      'password': process.env.DB_PASS
  },
'database': 'scheduling_db',
  'users_table': 'users'
};
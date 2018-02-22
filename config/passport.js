var LocalStrategy   = require('passport-local').Strategy;

var bcrypt = require('bcrypt-nodejs');
const db = require('../models');

module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        db.users.findOne({where: {id: id}}).then(data => {
          done(null, data.dataValues);
        }).catch(error => {
          done(error, null);
        });
    });

    passport.use(
        'local-signup',
        new LocalStrategy({
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {
          // we are checking to see if the user trying to login already exists
          db.users.findOne({where: {username: username}}).then(data => {
            if (data) {
              //Username already exists
              return done(null, false, req.flash('signupMessage', 'Username is unavailable.'));
            } else {
              //Username is free to be used
              let newUser = {
                username: username,
                password: bcrypt.hashSync(password, null, null),
                email: req.body.email,
                company: req.body.companyName
              };
              
              db.users.create(newUser).then((data) =>{
                newUser.id = data.dataValues.id;
                return done(null, newUser);
              })
            }
          }).catch(error => {
            return done(error);
          });
        })
    );

    passport.use(
        'local-login',
        new LocalStrategy({
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) { 
          db.users.findOne({where: {username: username}}).then(data => {
            if (!data) {
              //No user was found
              return done(null, false, req.flash('loginMessage', 'Username or password was invalid.'));
            }

            if (!bcrypt.compareSync(password, data.dataValues.password)) {
              //Password was incorrect
              return done(null, false, req.flash('loginMessage', 'Username or password was invalid.'));
            }

            return done(null, data.dataValues);
          }).catch(error => {
            return done(err);
          });
        })
    );
};

var LocalStrategy   = require('passport-local').Strategy;

var bcrypt = require('bcrypt-nodejs');
const db = require('../models');
const mailer = require('../controllers/mail_controller');
const randomstring = require('randomstring');
const passwordRegex = /(?=^.{8,}$)(?=.*\d)(?=.*[!@#$%^&*]+)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;

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
          req.flash('username', req.body.username);
          req.flash('companyName', req.body.companyName);
          req.flash('email', req.body.email);
          return done(null, false, req.flash('signupMessage','<p class="error-message text-center">Username is unavailable.</p>'));
        } else {
          if (!password.match(passwordRegex)) {
            req.flash('username', req.body.username);
            req.flash('companyName', req.body.companyName);
            req.flash('email', req.body.email);
            return done(null, false, req.flash('signupMessage',
              `<p class="error-message text-center">Password must be at least 8 characters long and contain 
              uppercase letter, lowercase letter, a number, and one special character.</p>`));
          }

          //Username is free to be used
          let newUser = {
            username: username,
            password: bcrypt.hashSync(password, null, null),
            email: req.body.email,
            company: req.body.companyName,
            verificationToken: randomstring.generate(16) 
          };
          
          db.users.create(newUser).then((data) =>{
            newUser.id = data.dataValues.id;
            mailer.sendVerificationEmail(newUser.email, newUser.username, newUser.verificationToken);
            return done(null, false, req.flash('signupMessage', '<p class="success-message text-center">Signup successful. Please verify your email before logging in.</p>'));
          }).catch(err => {
            req.flash('username', req.body.username);
            req.flash('companyName', req.body.companyName);
            req.flash('email', req.body.email);

            if (err.errors[0].path === 'email') {
              return done(null, false, req.flash('signupMessage', 
                `<p class="error-message text-center">Please enter a valid email address.</p>`));
            } 
          });
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
          return done(null, false, req.flash('loginMessage', '<p class="error-message text-center">Username or password was invalid.</p>'));
        }

        if (!bcrypt.compareSync(password, data.dataValues.password)) {
          //Password was incorrect
          return done(null, false, req.flash('loginMessage', '<p class="error-message text-center">Username or password was invalid.</p>'));
        }

        if(!data.dataValues.verified) {
          //User not has verified their email
          return done(null, false, req.flash('loginMessage', 
            `<p class="error-message text-center">Please verify your email before logging in.
            <a href="/resendVerification/${data.dataValues.username}">Resend Verification Email</a></p>`));
        }

        return done(null, data.dataValues);
      }).catch(error => {
        return done(error);
      });
    })
  );
};

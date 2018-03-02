// app/routes.js

module.exports = function(app, passport) {

  app.get('/', function(req, res) {
    // render the page and pass in any flash data if it exists
    if (req.user) {
      res.redirect('/manageEmployees');
    } else {
      res.render('home', { message: req.flash('loginMessage') + req.flash('signupMessage')});
    }
  });

  app.post('/login', passport.authenticate('local-login', {
    successRedirect : '/manageEmployees', 
    failureRedirect : '/', 
    failureFlash : true 
  }),
  function(req, res) {
    if (req.body.remember) {
      req.session.cookie.maxAge = 1000 * 60 * 3;
    } else {
      req.session.cookie.expires = false;
    }
    res.redirect('/');
  });

  app.get('/signup', function(req, res) {
    res.render('home', { message: req.flash('signupMessage'),
      username: req.flash('username'),
      companyName: req.flash('companyName'),
      email: req.flash('email'),
      showSignupScreen: true });
  });

  // process the signup form
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/', 
    failureRedirect : '/', 
    failureFlash : true 
  }));

  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });
};
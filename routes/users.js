var passport = require("passport");
var model = require("../models/Photos");
var User = model.User;

// Go to registration page
exports.register = function(req, res) {
  res.render('register', {title: 'register', user : req.user,  page_name: 'register' });
};

// Post registration
exports.doRegister = function(req, res) {
  User.register(new User({ username : req.body.username, name: req.body.name }), req.body.password, function(err, user) {
    if (err) {
      return res.render('register', { 
        title: 'register',
        errorMsg: 'Error happened, user name might be in use', 
        page_name: 'register', 
        user : user });
    }
    passport.authenticate('local')(req, res, function () {
      res.redirect('/');
    });
  });
};

// Go to login page
exports.login = function(req, res) {
  res.render('login', {title: 'login',  user : req.user,  page_name: 'login'});
};

// Post login
exports.doLogin = function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err || !user) { 
      res.render('login', {
        title: 'login',  
        user : req.user,
        errorMsg: 'Login failed, please verify that user exists and password match',
        page_name: 'login'});
    }
    req.logIn(user, function(err) {
      if (err) { 
        res.render('login', {
          title: 'login',  
          user : req.user,
          errorMsg: 'Login failed, please verify that user exists and password match',
          page_name: 'login'});
      }
      return res.redirect('/');
    });
  })(req, res, next);
  // (req, res, function () {
  //   res.redirect('/');
  // });
};

// logout
exports.logout = function(req, res) {
  req.logout();
  res.redirect('/');
};


var passport = require('passport');
var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');

// Display login form
exports.login_get = function(req, res){
  res.render('login_form');
};

// Handle login POST data
exports.login_post = function(req, res, next){
  passport.authenticate('local', (err, user, info) => {
    context = {user: req.user, message: null};
    if (info){
      context.message = info.message;
    }
    if (err){
      return next(err);
    }
    if (!user){
      console.log("inside login_post !user context = ", context);
      return res.render('login_form', context);

    }
    req.login(user, (err) => {
      if (err){
        return next(err);
      }
      return res.redirect('/');
    });

  })(req, res, next);
};

// Display signup form
exports.signup_get = function(req, res, next){
  res.render('signup_form', {user: req.user});
};

// Handle signup POST data
exports.signup_post = function(req, res, next){
  User.findOne({userId: req.body.email}).then((user) => {
    // user = user[0];
    if (user){
      return res.render('signup_form', {message: "user already exists. Please login", user: req.user});
    }
    let salt = bcrypt.genSaltSync(10);
    // res.send(bcrypt.hashSync(req.body.password, salt));
    let newUser = new User({
      name: req.body.name,
      userId: req.body.email,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, salt)
    });
    newUser.save((err) => {
      if (err) {return next(err);}
      exports.login_post(req, res, next);
    });

  });
};

// Handle logout request
exports.logout = function(req, res, next){
  req.logout();
  res.redirect('/');
}

// Impose admin authorization for restricted routes
exports.admin_authorize = function(req, res, next){
  if (req.user && req.user.userType == 'admin'){
    next();
  }
  else {
    req.logout();
    return res.redirect('/auth/login');
  }
};

// Impose user authorization for relevant routes
exports.user_authorize = function(req, res, next){
  if (req.user){
    next();
  }
  else {
    return res.redirect('/auth/login');
  }
};

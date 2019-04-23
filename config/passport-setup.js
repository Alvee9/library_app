var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
var bcrypt = require('bcrypt-nodejs');
// console.log("inside passport-setup");

passport.serializeUser((user, done) => {
    done(null, user.userId);
});

passport.deserializeUser((userId, done) => {
    User.find({userId: userId}).then((user) => {
        done(null, user);
    });
});

passport.use(new LocalStrategy(
  {usernameField: 'email'},
  (email, password, done) => {
    User.find({userId: email}).then((user) => {
      if (!user){
        return done(null, false, { message: 'User not found.\n' });
      }
      if (!bcrypt.compareSync(password, user.password)) {
        return done(null, false, { message: 'Invalid credentials.\n' });
      }
      return done(null, user);
    }).catch((err) => {
      done(err, false);
    });
  }
));

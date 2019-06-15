var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
var bcrypt = require('bcrypt-nodejs');
// console.log("inside passport-setup");

passport.serializeUser((user, done) => {
    done(null, user.userId);
});

passport.deserializeUser((userId, done) => {
    User.findOne({userId: userId}).then((user) => {
        done(null, user);
    });
});

passport.use(new LocalStrategy(
  {usernameField: 'email'},
  (email, password, done) => {
    console.log("inside local strategy callback", email, password);
    User.findOne({userId: email}).then((user) => {
      console.log("then user ", user);
      // user = user[0];
      if (!user){
         console.log("if !user ", user);
        return done(null, false, { message: 'User not found.\n' });
      }
      if (!bcrypt.compareSync(password, user.password)) {
        return done(null, false, { message: 'password didn\'t match.\n' });
      }
      return done(null, user);
    }).catch((err) => {
      done(err, false);
    });
  }
));

// load all the things we need
var LocalStrategy    = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy  = require('passport-twitter').Strategy;
var GoogleStrategy   = require('passport-google-oauth').OAuth2Strategy;

// load up the user model
var Account = require('../app/models/account');
var User       = require('../app/models/user');

// load the auth variables
// var configAuth = require('./auth'); // use this one for testing

module.exports = function(passport) {
  passport.serializeUser(function(user, done) {
    done(null, user._id);
  });
  passport.deserializeUser(function(id, done) {
    Account.findById(id, function(err,user){
      done(err, user);
    });
  });

  // =========================================================
  // LOCAL LOGIN =============================================
  // =========================================================
  passport.use('local-login', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with email
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
  }, function(req, email, password, done) {
    // asynchronous
    process.nextTick(function() {
      /*
      if( email === 'Natthawat_a' ){
        return done(null, Account);
      }
      else{
        return done(null, false, req.flash('loginMessage', 'No user found.'));
      }
      */

      var opts = {
        uid: email,
        email: email,
        password: password
      }

      Account.test(opts, function(err,user){
        console.log('@passport_local file');
        console.log(user.email);
        console.log(user.password);

        if( err instanceof Error ){
          console.log('Error');
          return done(null, false, req.flash('loginMessage', 'No user found.'));
        }
        else{
          console.log('Success');
          var AC = require('../app/models/account');
          AC._id = user._id;
          AC.email = user.email;
          AC.password = user.password;
          return done(null, AC);
        }
      });

      /*
      Account.findOne({'email' : email}, function(err,user){
        console.log('findOne');
        if(err instanceof Error){
          return done(null, false, req.flash('loginMessage', 'No user found.'));
        }
        else{
          return done(null, user);
        }
      });
      */
    });
  }));
};

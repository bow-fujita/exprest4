/*!
 * exprest4
 * Copyright (c) 2016 Hiromitsu Fujita <bow.fujita@gmail.com>
 * MIT License
 */

'use strict';

var passport = require('passport')
  , BasicStrategy = require('passport-http').BasicStrategy
  , LocalStrategy = require('passport-local')
  , authenticator = function(user, pass, done) {
      if (user != 'admin') {
        return done(null, false);
      }
      return done(null, { username: user });
    }
;

passport.use(new BasicStrategy(authenticator));
passport.use(new LocalStrategy(authenticator));

passport.serializeUser(function(user, done) {
  done(null, user.username);
});

passport.deserializeUser(function(username, done) {
  if (username != 'admin') {
    return done(null, false);
  }
  done(null, { username: username });
});

module.exports = passport;

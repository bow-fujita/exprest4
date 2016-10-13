/*!
 * exprest4
 * Copyright (c) 2016 Hiromitsu Fujita <bow.fujita@gmail.com>
 * MIT License
 */

'use strict';

const passport = require('passport')
    , BasicStrategy = require('passport-http').BasicStrategy
    , LocalStrategy = require('passport-local')
    , authenticator = (username, password, done) => {
        done(null, username != 'admin' ? false : { username: username });
      }
;

passport.use(new BasicStrategy(authenticator));
passport.use(new LocalStrategy(authenticator));

passport.serializeUser((user, done) => {
  done(null, user.username);
});

passport.deserializeUser((username, done) => {
  done(null, username != 'admin' ? false : { username: username });
});

module.exports = passport;

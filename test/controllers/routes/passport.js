/*!
 * exprest4
 * Copyright (c) 2016 Hiromitsu Fujita <bow.fujita@gmail.com>
 * MIT License
 */

'use strict';

var passport = require('passport')
;

module.exports = {
  __exprest: {
    routes: [{
      action: 'login'
    , path: 'basic'
    , middleware: passport.authenticate('basic', { session: false })
    }, {
      action: 'login'
    , path: 'local'
    , method: 'post'
    , middleware: passport.authenticate('local')
    }]
  }

, login: function(req, res) {
    res.status(200).json({ loginAs: req.user.username });
  }

};
 

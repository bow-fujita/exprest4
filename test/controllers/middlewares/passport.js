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
    , middleware: passport.authenticate('basic', { session: false })
    }]
  }

, login: function(req, res) {
    res.status(200).json({ loginAs: req.user.username });
  }

};
 

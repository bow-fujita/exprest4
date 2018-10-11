/*!
 * exprest4
 * Copyright (c) 2016-2018 Hiro Fujita <bow.fujita@gmail.com>
 * MIT License
 */

'use strict';

const passport = require('passport');

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

, login: (req, res) => {
    res.json({ loginAs: req.user.username });
  }

};

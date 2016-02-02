/*!
 * exprest4
 * Copyright (c) 2016 Hiromitsu Fujita <bow.fujita@gmail.com>
 * MIT License
 */

'use strict';

var multer = require('multer')
  , passport = require('passport')
  , upload = multer()
;

module.exports = {
  __exprest: {
    routes: [{
      action: 'echo'
    , method: 'post'
    , middleware: [
        passport.authenticate('basic', { session: false })
      , upload.single('now')
      ]
    }]
  }

, echo: function(req, res) {
    res.status(200).json({
      loginAs: req.user.username
    , now: req.file.buffer.toString()
    });
  }

};
 

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
    preset: {
      middleware: passport.authenticate('basic', { session: false })
    }
  , routes: [{
      action: 'login'
    } ,{
      action: 'echo'
    , method: 'post'
    , middleware: upload.single('now')
    }]
  }

, login: function(req, res) {
    res.status(200).json({ loginAs: req.user.username });
  }

, echo: function(req, res) {
    res.status(200).json({
      loginAs: req.user.username
    , now: req.file.buffer.toString()
    });
  }

};
 

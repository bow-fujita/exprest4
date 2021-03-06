/*!
 * exprest4
 * Copyright (c) 2016-2018 Hiro Fujita <bow.fujita@gmail.com>
 * MIT License
 */

'use strict';

const multer = require('multer')
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

, login: (req, res) => {
    res.json({ loginAs: req.user.username });
  }

, echo: (req, res) => {
    res.json({
      loginAs: req.user.username
    , now: req.file.buffer.toString()
    });
  }

};

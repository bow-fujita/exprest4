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
    routes: [{
      action: 'echo'
    , method: 'post'
    , middleware: [
        passport.authenticate('basic', { session: false })
      , upload.single('now')
      , 'silently-discard-non-function'
      ]
    }]
  }

, echo: (req, res) => {
    res.json({
      loginAs: req.user.username
    , now: req.file.buffer.toString()
    });
  }

};

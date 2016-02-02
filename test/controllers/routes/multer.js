/*!
 * exprest4
 * Copyright (c) 2016 Hiromitsu Fujita <bow.fujita@gmail.com>
 * MIT License
 */

'use strict';

var multer = require('multer')
  , upload = multer()
;

module.exports = {
  __exprest: {
    routes: [{
      action: 'echo'
    , method: 'post'
    , middleware: upload.single('now')
    }]
  }

, echo: function(req, res) {
    res.status(200).json({ now: req.file.buffer.toString() });
  }

};
 

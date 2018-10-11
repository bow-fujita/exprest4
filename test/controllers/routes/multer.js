/*!
 * exprest4
 * Copyright (c) 2016-2018 Hiro Fujita <bow.fujita@gmail.com>
 * MIT License
 */

'use strict';

const multer = require('multer')
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

, echo: (req, res) => {
    res.json({ now: req.file.buffer.toString() });
  }

};

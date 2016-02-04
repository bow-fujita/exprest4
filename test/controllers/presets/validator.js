/*!
 * exprest4
 * Copyright (c) 2016 Hiromitsu Fujita <bow.fujita@gmail.com>
 * MIT License
 */

'use strict';

var validator = require('validator')
;

module.exports = {
  __exprest: {
    preset: {
      validator: {
        id: validator.isNumeric
      }
    }
  , routes: [{
      action: 'validate'
    , path: ':id'
    }, {
      action: 'validate'
    , path: 'overwrite/:id'
    , validator: {
        id: validator.isAlpha
      }
    }]
  }

, validate: function(req, res) {
    res.status(200).json({ id: req.params.id });
  }

};

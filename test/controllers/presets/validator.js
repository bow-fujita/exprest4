/*!
 * exprest4
 * Copyright (c) 2016 Hiromitsu Fujita <bow.fujita@gmail.com>
 * MIT License
 */

'use strict';

const validator = require('validator');

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

, validate: (req, res) => {
    res.json({ id: req.params.id });
  }

};

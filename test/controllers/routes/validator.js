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
      action: 'email'
    , path: 'email/:email'
    , validator: {
        email: validator.isEmail
      }
    }, {
      action: 'regexp'
    , path: 'regexp/:name'
    , validator: {
        name: /^[A-Z]+$/i
      }
    }, {
      action: 'preset'
    , path: 'preset/:id'
    }, {
      action: 'preset'
    , path: 'overwrite/:id'
    , validator: {
        id: validator.isAlpha
      }
    }]
  }

, email: function(req, res) {
    res.status(200).json({ email: req.params.email });
  }
, regexp: function(req, res) {
    res.status(200).json({ name: req.params.name });
  }
, preset: function(req, res) {
    res.status(200).json({ id: req.params.id });
  }

};

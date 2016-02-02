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
    routes: [{
      action: 'id'
    , path: 'id/:id'
    , validator: {
        id: validator.isNumeric
      }
    }, {
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
    }]
  }

, id: function(req, res) {
    res.status(200).json({ id: req.params.id });
  }
, email: function(req, res) {
    res.status(200).json({ email: req.params.email });
  }
, regexp: function(req, res) {
    res.status(200).json({ name: req.params.name });
  }
};

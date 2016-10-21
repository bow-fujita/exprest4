/*!
 * exprest4
 * Copyright (c) 2016 Hiromitsu Fujita <bow.fujita@gmail.com>
 * MIT License
 */

'use strict';

const validator = require('validator');

module.exports = {
  __exprest: {
    routes: [{
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
      action: 'multi'
    , path: 'multi/:id/:flag'
    , validator: {
        id: validator.isInt
      , flag: validator.isBoolean
      }
    }, {
      // To improve coverage
      action: 'dummy'
    , path: 'dummy/:key'
    , validator: {
        null: validator.isNull
      , key: true
      }
    }]
  }

, email: (req, res) => {
    res.json({ email: req.params.email });
  }
, regexp: (req, res) => {
    res.json({ name: req.params.name });
  }
, multi: (req, res) => {
    res.json({
      id: req.params.id
    , flag: req.params.flag
    });
  }
, dummy: (req, res) => {
    res.end();
  }

};

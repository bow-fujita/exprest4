/*!
 * exprest4
 * Copyright (c) 2016 Hiromitsu Fujita <bow.fujita@gmail.com>
 * MIT License
 */

'use strict';

module.exports = {
  __exprest: {
    preset: {
      authorized: false
    }
  , routes: [{
      action: 'authorize'
    , path: 'private'
    , authorized: true
    }, {
      action: 'authorize'
    , path: 'public'
    }]
  }

, authorize: (req, res) => {
    res.json({ loginAs: (req.user || {}).username });
  }

};

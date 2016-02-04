/*!
 * exprest4
 * Copyright (c) 2016 Hiromitsu Fujita <bow.fujita@gmail.com>
 * MIT License
 */

'use strict';

module.exports = {
  __exprest: {
    routes: [{
      action: 'authorize'
    }, {
      action: 'authorize'
    , path: 'public'
    , authorized: false
    }]
  }

, authorize: function(req, res, next) {
    res.status(200).json({ loginAs: (req.user || {}).username });
  }

};

/*!
 * exprest4
 * Copyright (c) 2016-2018 Hiro Fujita <bow.fujita@gmail.com>
 * MIT License
 */

'use strict';

module.exports = {
  __exprest: {
    routes: [{
      action: 'authorize'
    , path: 'private'
    }, {
      action: 'authorize'
    , path: 'public'
    , authorized: false
    }]
  }

, authorize: (req, res, next) => {
    res.json({ loginAs: (req.user || {}).username });
  }

};

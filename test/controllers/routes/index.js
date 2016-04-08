/*!
 * exprest4
 * Copyright (c) 2016 Hiromitsu Fujita <bow.fujita@gmail.com>
 * MIT License
 */

'use strict';

module.exports = {
  __exprest: {
    routes: [{
      action: 'top'
    }, {
      action: 'dashboard'
    , path: 'dashboard'
    }]
  }

, top: function(req, res) {
    res.status(200).json({ action: 'top' });
  }
, dashboard: function(req, res) {
    res.status(200).json({ action: 'dashboard' });
  }
};

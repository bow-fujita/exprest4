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

, top: (req, res) => {
    res.json({ action: 'top' });
  }
, dashboard: (req, res) => {
    res.json({ action: 'dashboard' });
  }
};

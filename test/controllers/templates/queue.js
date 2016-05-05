/*!
 * exprest4
 * Copyright (c) 2016 Hiromitsu Fujita <bow.fujita@gmail.com>
 * MIT License
 */

'use strict';

var queue = [];

module.exports = {
  __exprest: {
    preset: {
      template: 'queue'
    }
  }

, dump: function(req, res) {
    res.status(200).json({ action: 'dump', queue: queue });
  }
, push: function(req, res) {
    queue.push(req.params.elem);
    res.status(200).json({ action: 'push', queue: queue });
  }
, pop: function(req, res) {
    queue.pop();
    res.status(200).json({ action: 'pop', queue: queue });
  }
};

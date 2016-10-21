/*!
 * exprest4
 * Copyright (c) 2016 Hiromitsu Fujita <bow.fujita@gmail.com>
 * MIT License
 */

'use strict';

let queue = [];

module.exports = {
  __exprest: {
    preset: {
      template: 'queue'
    }
  }

, dump: (req, res) => {
    res.json({ action: 'dump', queue: queue });
  }
, push: (req, res) => {
    queue.push(req.params.elem);
    res.json({ action: 'push', queue: queue });
  }
, pop: (req, res) => {
    queue.pop();
    res.json({ action: 'pop', queue: queue });
  }
};

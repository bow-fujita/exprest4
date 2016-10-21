/*!
 * exprest4
 * Copyright (c) 2016 Hiromitsu Fujita <bow.fujita@gmail.com>
 * MIT License
 */

'use strict';

module.exports = {
  __exprest: {
    routes: [{
      action: 'list'
    }, {
      action: 'view'
    , path: ':id'
    }, {
      action: 'create'
    , method: 'post'
    }, {
      action: 'update'
    , path: ':id'
    , method: 'put'
    }, {
      action: 'remove'
    , path: ':id'
    , method: 'delete'
    }]
  }

, list: (req, res) => {
    res.json({ action: 'list' });
  }
, view: (req, res) => {
    res.json({ action: 'view', id: req.params.id });
  }
, create: (req, res) => {
    res.json({ action: 'create' });
  }
, update: (req, res) => {
    res.json({ action: 'update', id: req.params.id });
  }
, remove: (req, res) => {
    res.json({ action: 'remove', id: req.params.id });
  }
};

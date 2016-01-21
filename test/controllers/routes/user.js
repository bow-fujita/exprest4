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

, list: function(req, res) {
    res.status(200).json({ action: 'list' });
  }
, view: function(req, res) {
    res.status(200).json({ action: 'view', id: req.params.id });
  }
, create: function(req, res) {
    res.status(200).json({ action: 'create' });
  }
, update: function(req, res) {
    res.status(200).json({ action: 'update', id: req.params.id });
  }
, remove: function(req, res) {
    res.status(200).json({ action: 'remove', id: req.params.id });
  }
};

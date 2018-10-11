/*!
 * exprest4
 * Copyright (c) 2016-2018 Hiro Fujita <bow.fujita@gmail.com>
 * MIT License
 */

'use strict';

module.exports = {
  __exprest: {
    preset: {
      template: 'crud'
    }
  , routes: [{
      action: 'clear'
    , method: 'delete'
    }, {
      action: 'show'
    , path: ':id'
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
, clear: (req, res) => {
    res.json({ action: 'clear' });
  }
, show: (req, res) => {
    res.json({ action: 'show', id: req.params.id });
  }
};

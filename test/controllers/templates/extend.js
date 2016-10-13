/*!
 * exprest4
 * Copyright (c) 2016 Hiromitsu Fujita <bow.fujita@gmail.com>
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
    res.status(200).json({ action: 'list' });
  }
, view: (req, res) => {
    res.status(200).json({ action: 'view', id: req.params.id });
  }
, create: (req, res) => {
    res.status(200).json({ action: 'create' });
  }
, update: (req, res) => {
    res.status(200).json({ action: 'update', id: req.params.id });
  }
, remove: (req, res) => {
    res.status(200).json({ action: 'remove', id: req.params.id });
  }
, clear: (req, res) => {
    res.status(200).json({ action: 'clear' });
  }
, show: (req, res) => {
    res.status(200).json({ action: 'show', id: req.params.id });
  }
};

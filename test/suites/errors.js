/*!
 * exprest4
 * Copyright (c) 2016 Hiromitsu Fujita <bow.fujita@gmail.com>
 * MIT License
 */

'use strict';

var exprest = require(process.env.APP_ROOT)
  , express = require('express')
  , path = require('path')
  , ctrl_dir = path.join(__dirname, '..', 'controllers', 'errors')
  , app = express()
;

describe('config error', function() {

  it('no controllers dir', function(done) {
    exprest.route(app, { controllers: path.join(ctrl_dir, 'no_ctrl_dir') })
    .should.be.rejectedWith(/ENOENT/)
    .then(function() { done(); }, done);
  });

  it('no __exprest', function(done) {
    exprest.route(app, { controllers: path.join(ctrl_dir, 'no_exprest') })
    .should.be.rejectedWith(/No __exprest defined/)
    .then(function() { done(); }, done);
  });

  it('invalid __exprest', function(done) {
    exprest.route(app, { controllers: path.join(ctrl_dir, 'invalid_exprest') })
    .should.be.rejectedWith(/Invalid __exprest/)
    .then(function() { done(); }, done);
  });

  it('no routes', function(done) {
    exprest.route(app, { controllers: path.join(ctrl_dir, 'no_routes') })
    .should.be.rejectedWith(/No __exprest\.routes defined/)
    .then(function() { done(); }, done);
  });

  it('invalid routes', function(done) {
    exprest.route(app, { controllers: path.join(ctrl_dir, 'invalid_routes') })
    .should.be.rejectedWith(/Invalid __exprest\.routes/)
    .then(function() { done(); }, done);
  });

  it('unknown method', function(done) {
    exprest.route(app, { controllers: path.join(ctrl_dir, 'unknown_method') })
    .should.be.rejectedWith(/Unknown method \"test\" in __exprest\.routes\[0\]\.method/)
    .then(function() { done(); }, done);
  });

  it('no action defined', function(done) {
    exprest.route(app, { controllers: path.join(ctrl_dir, 'no_action_def') })
    .should.be.rejectedWith(/No __exprest\.routes\[0\]\.action defined/)
    .then(function() { done(); }, done);
  });

  it('no action implemented', function(done) {
    exprest.route(app, { controllers: path.join(ctrl_dir, 'no_action_imp') })
    .should.be.rejectedWith(/No view\(\) implemented/)
    .then(function() { done(); }, done);
  });

});


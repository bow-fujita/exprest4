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

  it('no __exprest', function(done) {
    (function() {
      exprest.route(app, { controllers: path.join(ctrl_dir, 'no_exprest') });
    }).should.throw(/No __exprest defined/);
    done();
  });

  it('invalid __exprest', function(done) {
    (function() {
      exprest.route(app, { controllers: path.join(ctrl_dir, 'invalid_exprest') });
    }).should.throw(/Invalid __exprest/);
    done();
  });

  it('no routes', function(done) {
    (function() {
      exprest.route(app, { controllers: path.join(ctrl_dir, 'no_routes') });
    }).should.throw(/No __exprest\.routes defined/);
    done();
  });

  it('invalid routes', function(done) {
    (function() {
      exprest.route(app, { controllers: path.join(ctrl_dir, 'invalid_routes') });
    }).should.throw(/Invalid __exprest\.routes/);
    done();
  });

  it('unknown method', function(done) {
    (function() {
      exprest.route(app, { controllers: path.join(ctrl_dir, 'unknown_method') });
    }).should.throw(/Unknown method \"test\" in __exprest\.routes\[0\]\.method/);
    done();
  });

  it('no action defined', function(done) {
    (function() {
      exprest.route(app, { controllers: path.join(ctrl_dir, 'no_action_def') });
    }).should.throw(/No __exprest\.routes\[0\]\.action defined/);
    done();
  });

  it('no action implemented', function(done) {
    (function() {
      exprest.route(app, { controllers: path.join(ctrl_dir, 'no_action_imp') });
    }).should.throw(/No view\(\) implemented/);
    done();
  });

});


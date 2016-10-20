/*!
 * exprest4
 * Copyright (c) 2016 Hiromitsu Fujita <bow.fujita@gmail.com>
 * MIT License
 */

'use strict';

const exprest = require(process.env.APP_ROOT)
    , express = require('express')
    , path = require('path')
    , fs = require('fs')
    , app = express()
;

describe('error', () => {

  describe('route', () => {
    const ctrl_dir = path.join(__dirname, '..', 'controllers', 'errors');

    it('no controllers dir', (done) => {
      exprest.route(app)
      .should.be.rejectedWith(/ENOENT/)
      .then(() => { done(); }, done);
    });

    it('no __exprest', (done) => {
      exprest.route(app, {
        controllers: path.join(ctrl_dir, 'no_exprest')
      })
      .should.be.rejectedWith(/No __exprest defined/)
      .then(() => { done(); }, done);
    });

    it('invalid __exprest', (done) => {
      exprest.route(app, {
        controllers: path.join(ctrl_dir, 'invalid_exprest')
      })
      .should.be.rejectedWith(/Invalid __exprest/)
      .then(() => { done(); }, done);
    });

    it('unknown_template', (done) => {
      exprest.route(app, {
        controllers: path.join(ctrl_dir, 'unknown_template')
      })
      .should.be.rejectedWith(/Unknown template/)
      .then(() => { done(); }, done);
    });

    it('invalid_template', (done) => {
      exprest.route(app, {
        controllers: path.join(ctrl_dir, 'invalid_template')
      , templates: {
          invalid: {}
        }
      })
      .should.be.rejectedWith(/Invalid template/)
      .then(() => { done(); }, done);
    });

    it('no routes', (done) => {
      exprest.route(app, {
        controllers: path.join(ctrl_dir, 'no_routes')
      })
      .should.be.rejectedWith(/No __exprest\.routes defined/)
      .then(() => { done(); }, done);
    });

    it('invalid routes', (done) => {
      exprest.route(app, {
        controllers: path.join(ctrl_dir, 'invalid_routes')
      })
      .should.be.rejectedWith(/Invalid __exprest\.routes/)
      .then(() => { done(); }, done);
    });

    it('unknown method', (done) => {
      exprest.route(app, {
        controllers: path.join(ctrl_dir, 'unknown_method')
      })
      .should.be.rejectedWith(/Unknown method \"test\" in __exprest\.routes\[0\]\.method/)
      .then(() => { done(); }, done);
    });

    it('no action defined', (done) => {
      exprest.route(app, {
        controllers: path.join(ctrl_dir, 'no_action_def')
      })
      .should.be.rejectedWith(/No __exprest\.routes\[0\]\.action defined/)
      .then(() => { done(); }, done);
    });

    it('no action implemented', (done) => {
      exprest.route(app, {
        controllers: path.join(ctrl_dir, 'no_action_imp')
      })
      .should.be.rejectedWith(/No view\(\) implemented/)
      .then(() => { done(); }, done);
    });

  }); // route

  describe('model', () => {

    it('no dsn', (done) => {
      exprest.model({ models: path.join(__dirname, '..', 'models') })
      .should.be.rejectedWith(/ER_ACCESS_DENIED_ERROR/)
      .then(() => { done(); }, done);
    });

    it('no models dir', (done) => {
      exprest.model({ uri: 'sqlite:' })
      .should.be.rejectedWith(/ENOENT/)
      .then(() => { done(); }, done);
    });

  }); // model
});

/*!
 * exprest4
 * Copyright (c) 2016 Hiromitsu Fujita <bow.fujita@gmail.com>
 * MIT License
 */

'use strict';

var exprest = require(process.env.APP_ROOT)
  , express = require('express')
  , request = require('supertest')
  , _ = require('underscore')
  , methods = require('methods')
  , path = require('path')
  , ctrl_dir = path.join(__dirname, '..', 'controllers', 'routes')
  , app = express()
;

describe('validators', function() {

  before(function(done) {
    exprest.route(app, { controllers: ctrl_dir });
    done();
  });

  describe('GET /validator/id', function() {
    it('valid', function(done) {
      request(app).get('/validator/id/123')
        .expect(200, {
          id: 123
        }, done);
    });

    it('invalid', function(done) {
      request(app).get('/validator/id/abc').expect(404, done);
    });
  }); // GET /validator/:id

  describe('GET /validator/email', function() {
    it('valid', function(done) {
      request(app).get('/validator/email/user@exprest4.local')
        .expect(200, {
          email: 'user@exprest4.local'
        }, done);
    });

    it('invalid', function(done) {
      request(app).get('/validator/email/user').expect(404, done);
    });
  }); // GET /validator/email

  describe('GET /validator/regexp', function() {
    it('valid', function(done) {
      request(app).get('/validator/regexp/AtoZ')
        .expect(200, {
          name: 'AtoZ'
        }, done);
    });

    it('invalid', function(done) {
      request(app).get('/validator/regexp/Ato9').expect(404, done);
    });
  }); // GET /validator/regexp


});

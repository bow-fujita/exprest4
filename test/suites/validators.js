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
    exprest.route(app, { controllers: ctrl_dir })
    .then(function() { done(); }, done);
  });

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

  describe('GET /validator/multi', function() {
    it('valid', function(done) {
      request(app).get('/validator/multi/1/true')
        .expect(200, {
          id: '1'
        , flag: 'true'
        }, done);
    });

    it('invalid id', function(done) {
      request(app).get('/validator/multi/x/true').expect(404, done);
    });
    it('invalid flag', function(done) {
      request(app).get('/validator/multi/1/x').expect(404, done);
    });
  }); // GET /validator/regexp

  it('GET /validator/dummy', function(done) {
    request(app).get('/validator/dummy/key').expect(200, done);
  });

});

/*!
 * exprest4
 * Copyright (c) 2016 Hiromitsu Fujita <bow.fujita@gmail.com>
 * MIT License
 */

'use strict';

var exprest = require(process.env.APP_ROOT)
  , express = require('express')
  , request = require('supertest')
  , bodyParser = require('body-parser')
  , fs = require('fs')
  , path = require('path')
  , passport = require('../utils/passport')
  , ctrl_dir = path.join(__dirname, '..', 'controllers', 'presets')
;

describe('presets', function() {

  describe('middleware', function() {

    var app = express()
      , now_file = 'now.txt'
      , now_time = (new Date).toString()
    ;

    before(function(done) {
      app.use(bodyParser.urlencoded({ extended: true }));
      app.use(passport.initialize());
      exprest.route(app, { controllers: ctrl_dir });
      fs.writeFile(now_file, now_time, done);
    });

    after(function(done) {
      fs.unlink(now_file, done);
    });

    it('GET /middleware no user', function(done) {
      request(app).get('/middleware')
        .expect(401, done);
    });

    it('GET /middleware invalid user', function(done) {
      request(app).get('/middleware')
        .auth('user', 'x')
        .expect(401, done);
    });

    it('GET /middleware valid user', function(done) {
      request(app).get('/middleware')
        .auth('admin', 'x')
        .expect(200, {
          loginAs: 'admin'
        }, done);
    });

    it('POST /middleware no user', function(done) {
      request(app).post('/middleware')
        .attach('now', now_file)
        .expect(401, done);
    });

    it('POST /middleware invalid user', function(done) {
      request(app).post('/middleware')
        .attach('now', now_file)
        .auth('user', 'x')
        .expect(401, done);
    });

    it('POST /middleware valid user', function(done) {
      request(app).post('/middleware')
        .attach('now', now_file)
        .auth('admin', 'x')
        .expect(200, {
          loginAs: 'admin'
        , now: now_time
        }, done);
    });

  }); // middleware

  describe('validator', function() {

    var app = express();

    before(function(done) {
      exprest.route(app, { controllers: ctrl_dir });
      done();
    });

    describe('GET /validator', function() {
      it('valid', function(done) {
        request(app).get('/validator/123')
          .expect(200, {
            id: 123
          }, done);
      });

      it('invalid', function(done) {
        request(app).get('/validator/abc').expect(404, done);
      });
    }); // GET /validator

    describe('GET /validator/overwrite', function() {
      it('valid', function(done) {
        request(app).get('/validator/overwrite/abc')
          .expect(200, {
            id: 'abc'
          }, done);
      });

      it('invalid', function(done) {
        request(app).get('/validator/overwrite/123').expect(404, done);
      });
    }); // GET /validator/overwrite

  }); // validator

  describe('authorizer', function() {

    var app = express();

    before(function(done) {
      app.use(passport.initialize());
      exprest.route(app, {
        controllers: ctrl_dir
      , authorizer: passport.authenticate('basic', { session: false })
      });
      done();
    });

    it('GET /authorizer/private no user', function(done) {
      request(app).get('/authorizer/private')
        .expect(401, done);
    });

    it('GET /authorizer/private invalid user', function(done) {
      request(app).get('/authorizer/private')
        .auth('user', 'x')
        .expect(401, done);
    });

    it('GET /authorizer/private valid user', function(done) {
      request(app).get('/authorizer/private')
        .auth('admin', 'x')
        .expect(200, {
          loginAs: 'admin'
        }, done);
    });

    it('GET /authorizer/public no user', function(done) {
      request(app).get('/authorizer/public')
        .expect(200, {}, done);
    });

    it('GET /authorizer invalid user', function(done) {
      request(app).get('/authorizer/public')
        .auth('user', 'x')
        .expect(200, {}, done);
    });

    it('GET /authorizer valid user', function(done) {
      request(app).get('/authorizer/public')
        .auth('admin', 'x')
        .expect(200, {}, done);
    });

  }); // authorizer

});

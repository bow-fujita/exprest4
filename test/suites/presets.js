/*!
 * exprest4
 * Copyright (c) 2016 Hiromitsu Fujita <bow.fujita@gmail.com>
 * MIT License
 */

'use strict';

var exprest = require(process.env.APP_ROOT)
  , express = require('express')
  , request = require('supertest')
  , passport = require('passport')
  , fs = require('fs')
  , path = require('path')
  , ctrl_dir = path.join(__dirname, '..', 'controllers', 'presets')
  , app = express()
;

describe('presets', function() {

  describe('middleware', function() {

    var now_file = 'now.txt'
      , now_time = (new Date).toString()
    ;

    before(function(done) {
      // Setting up for passport-http
      var BasicStrategy = require('passport-http').BasicStrategy;
      app.use(passport.initialize());
      passport.use(new BasicStrategy(function(user, pass, callback) {
        if (user != 'admin') {
          return callback(null, false);
        }
        return callback(null, { username: user });
      }));

      exprest.route(app, { controllers: ctrl_dir });

      // For file upload
      fs.writeFile(now_file, now_time, done);
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

    after(function(done) {
      fs.unlink(now_file, done);
    });

  }); // middleware

  describe('validator', function() {

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

});

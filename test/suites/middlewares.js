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
  , ctrl_dir = path.join(__dirname, '..', 'controllers', 'routes')
  , app = express()
;

describe('middlewares', function() {

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

  }); // before

  describe('multer', function() {

    it('POST /multer', function(done) {
      request(app).post('/multer')
        .attach('now', now_file)
        .expect(200, {
          now: now_time
        }, done);
    });

  }); // multer

  describe('passport', function() {

    it('GET /passport no user', function(done) {
      request(app).get('/passport')
        .expect(401, done);
    });

    it('GET /passport invalid user', function(done) {
      request(app).get('/passport')
        .auth('user', 'x')
        .expect(401, done);
    });

    it('GET /passport valid user', function(done) {
      request(app).get('/passport')
        .auth('admin', 'x')
        .expect(200, {
          loginAs: 'admin'
        }, done);
    });

  }); // passport

  describe('multi-middlewares', function() {

    it('POST /multi-middlewares no user', function(done) {
      request(app).post('/multi-middlewares')
        .attach('now', now_file)
        .expect(401, done);
    });

    it('POST /multi-middlewares invalid user', function(done) {
      request(app).post('/multi-middlewares')
        .attach('now', now_file)
        .auth('user', 'x')
        .expect(401, done);
    });

    it('POST /multi-middlewares valid user', function(done) {
      request(app).post('/multi-middlewares')
        .attach('now', now_file)
        .auth('admin', 'x')
        .expect(200, {
          loginAs: 'admin'
        , now: now_time
        }, done);
    });

  }); // multi-middlewares

  describe('preset', function() {

    it('GET /preset no user', function(done) {
      request(app).get('/preset')
        .expect(401, done);
    });

    it('GET /preset invalid user', function(done) {
      request(app).get('/preset')
        .auth('user', 'x')
        .expect(401, done);
    });

    it('GET /preset valid user', function(done) {
      request(app).get('/preset')
        .auth('admin', 'x')
        .expect(200, {
          loginAs: 'admin'
        }, done);
    });

    it('POST /preset no user', function(done) {
      request(app).post('/preset')
        .attach('now', now_file)
        .expect(401, done);
    });

    it('POST /preset invalid user', function(done) {
      request(app).post('/preset')
        .attach('now', now_file)
        .auth('user', 'x')
        .expect(401, done);
    });

    it('POST /preset valid user', function(done) {
      request(app).post('/preset')
        .attach('now', now_file)
        .auth('admin', 'x')
        .expect(200, {
          loginAs: 'admin'
        , now: now_time
        }, done);
    });

  });

  after(function(done) {
    fs.unlink(now_file, done);
  });

});

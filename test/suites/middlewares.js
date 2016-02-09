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
  , bodyParser = require('body-parser')
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
    // Setting up for passport
    var authenticator = function(user, pass, callback) {
          if (user != 'admin') {
            return callback(null, false);
          }
          return callback(null, { username: user });
        }
      , BasicStrategy = require('passport-http').BasicStrategy
      , LocalStrategy = require('passport-local')
    ;

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(passport.initialize());
    passport.use(new BasicStrategy(authenticator));
    passport.use(new LocalStrategy(authenticator));
    passport.serializeUser(function(user, callback) {
      callback(null, user);
    });
    passport.deserializeUser(function(user, callback) {
      callback(null, user);
    });

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

    it('GET /passport/basic no user', function(done) {
      request(app).get('/passport/basic')
        .expect(401, done);
    });

    it('GET /passport/basic invalid user', function(done) {
      request(app).get('/passport/basic')
        .auth('user', 'x')
        .expect(401, done);
    });

    it('GET /passport/basic valid user', function(done) {
      request(app).get('/passport/basic')
        .auth('admin', 'x')
        .expect(200, {
          loginAs: 'admin'
        }, done);
    });

    it('POST /passport/local no user', function(done) {
      request(app).post('/passport/local')
        .type('form')
        .send({ password: 'x' })
        .expect(400, done);
    });

    it('POST /passport/local invalid user', function(done) {
      request(app).post('/passport/local')
        .type('form')
        .send({ username: 'user', password: 'x' })
        .expect(401, done);
    });

    it('POST /passport/local valid user', function(done) {
      request(app).post('/passport/local')
        .type('form')
        .send({ username: 'admin', password: 'x' })
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

  after(function(done) {
    fs.unlink(now_file, done);
  });

});

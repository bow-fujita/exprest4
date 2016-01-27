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
  , ctrl_dir = path.join(__dirname, '..', 'controllers', 'middlewares')
  , app = express()
;

describe('middlewares', function() {

  before(function(done) {
    // Setting up for passport-http
    var BasicStrategy = require('passport-http').BasicStrategy;
    app.use(passport.initialize());
    passport.use(new BasicStrategy(function(user, pass, callback) {
      console.log('User: '+user);
      if (user != 'admin') {
        return callback(null, false);
      }
      return callback(null, { username: user });
    }));

    exprest.route(app, { controllers: ctrl_dir });
    done();
  });

  describe('multer', function() {

    var now_file = 'now.txt'
      , now_time = (new Date).toString()
    ;

    before(function(done) {
      fs.writeFile(now_file, now_time, done);
    });

    it('POST /multer', function(done) {
      request(app).post('/multer')
        .attach('now', now_file)
        .expect(200, {
          now: now_time
        }, done);
    });

    after(function(done) {
      fs.unlink(now_file, done);
    });

  });

  describe('passport', function() {

    it('GET /passport no user => 401 Unauthorized', function(done) {
      request(app).get('/passport')
        .expect(401, done);
    });

    it('GET /passport invalid user => 401 Unauthorized', function(done) {
      request(app).get('/passport')
        .auth('user', 'x')
        .expect(401, done);
    });

    it('GET /passport valid user => 200 OK', function(done) {
      request(app).get('/passport')
        .auth('admin', 'x')
        .expect(200, {
          loginAs: 'admin'
        }, done);
    });

  });

});

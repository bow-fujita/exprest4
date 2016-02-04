/*!
 * exprest4
 * Copyright (c) 2016 Hiromitsu Fujita <bow.fujita@gmail.com>
 * MIT License
 */

'use strict';

var exprest = require(process.env.APP_ROOT)
  , express = require('express')
  , request = require('supertest')
  , path = require('path')
  , ctrl_dir = path.join(__dirname, '..', 'controllers', 'routes')
; 

describe('options', function() {

  it('logger', function(done) {
    var app = express()
      , expected_logs = [
          '[exprest4] app.get("/user") loaded.'
        , '[exprest4] app.get("/user/:id") loaded.'
        , '[exprest4] app.post("/user") loaded.'
        , '[exprest4] app.put("/user/:id") loaded.'
        , '[exprest4] app.delete("/user/:id") loaded.'
        ]
      , actual_logs = []
    ;

    exprest.route(app, {
      controllers: ctrl_dir
    , logger: function(msg) {
        actual_logs.push(msg);
      }
    });

    var count = 0;
    expected_logs.forEach(function(expected) {
      expected.should.be.equalOneOf(actual_logs);
    });
    done();
  }); // logger

  describe('authorizer', function() {
    var app = express();

    before(function(done) {
      var passport = require('passport')
        , BasicStrategy = require('passport-http').BasicStrategy
      ;

      app.use(passport.initialize());
      passport.use(new BasicStrategy(function(user, pass, callback) {
        if (user != 'admin') {
          return callback(null, false);
        }
        return callback(null, { username: user });
      }));

      exprest.route(app, {
        controllers: ctrl_dir
      , authorizer: passport.authenticate('basic', { session: false })
      });
      done();
    });

    it('GET /authorizer no user', function(done) {
      request(app).get('/authorizer')
        .expect(401, done);
    });

    it('GET /authorizer invalid user', function(done) {
      request(app).get('/authorizer')
        .auth('user', 'x')
        .expect(401, done);
    });

    it('GET /authorizer valid user', function(done) {
      request(app).get('/authorizer')
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

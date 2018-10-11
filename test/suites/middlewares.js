/*!
 * exprest4
 * Copyright (c) 2016-2018 Hiro Fujita <bow.fujita@gmail.com>
 * MIT License
 */

'use strict';

const exprest = require(process.env.APP_ROOT)
    , express = require('express')
    , request = require('supertest')
    , bodyParser = require('body-parser')
    , fs = require('fs')
    , path = require('path')
    , passport = require('../utils/passport')
    , ctrl_dir = path.join(__dirname, '..', 'controllers', 'routes')
    , app = express()
;

describe('middlewares', () => {

  const now_file = 'now.txt'
      , now_time = (new Date).toString()
  ;

  before((done) => {
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(passport.initialize());
    exprest.route(app, { controllers: ctrl_dir })
    .then(() => {
      fs.writeFile(now_file, now_time, done);
    }, done);
  });

  after((done) => {
    fs.unlink(now_file, done);
  });

  describe('multer', () => {

    it('POST /multer', (done) => {
      request(app).post('/multer')
        .attach('now', now_file)
        .expect(200, {
          now: now_time
        }, done);
    });

  }); // multer

  describe('passport', () => {

    it('GET /passport/basic no user', (done) => {
      request(app).get('/passport/basic')
        .expect(401, done);
    });

    it('GET /passport/basic invalid user', (done) => {
      request(app).get('/passport/basic')
        .auth('user', 'x')
        .expect(401, done);
    });

    it('GET /passport/basic valid user', (done) => {
      request(app).get('/passport/basic')
        .auth('admin', 'x')
        .expect(200, {
          loginAs: 'admin'
        }, done);
    });

    it('POST /passport/local no user', (done) => {
      request(app).post('/passport/local')
        .type('form')
        .send({ password: 'x' })
        .expect(400, done);
    });

    it('POST /passport/local invalid user', (done) => {
      request(app).post('/passport/local')
        .type('form')
        .send({ username: 'user', password: 'x' })
        .expect(401, done);
    });

    it('POST /passport/local valid user', (done) => {
      request(app).post('/passport/local')
        .type('form')
        .send({ username: 'admin', password: 'x' })
        .expect(200, {
          loginAs: 'admin'
        }, done);
    });

  }); // passport

  describe('multi-middlewares', () => {

    it('POST /multi-middlewares no user', (done) => {
      request(app).post('/multi-middlewares')
        .attach('now', now_file)
        .expect(401, done);
    });

    it('POST /multi-middlewares invalid user', (done) => {
      request(app).post('/multi-middlewares')
        .attach('now', now_file)
        .auth('user', 'x')
        .expect(401, done);
    });

    it('POST /multi-middlewares valid user', (done) => {
      request(app).post('/multi-middlewares')
        .attach('now', now_file)
        .auth('admin', 'x')
        .expect(200, {
          loginAs: 'admin'
        , now: now_time
        }, done);
    });

  }); // multi-middlewares

});

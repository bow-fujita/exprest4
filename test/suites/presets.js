/*!
 * exprest4
 * Copyright (c) 2016 Hiromitsu Fujita <bow.fujita@gmail.com>
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
    , ctrl_dir = path.join(__dirname, '..', 'controllers', 'presets')
;

describe('presets', () => {

  describe('middleware', () => {

    const app = express()
        , now_file = 'now.txt'
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

    it('GET /middleware no user', (done) => {
      request(app).get('/middleware')
        .expect(401, done);
    });

    it('GET /middleware invalid user', (done) => {
      request(app).get('/middleware')
        .auth('user', 'x')
        .expect(401, done);
    });

    it('GET /middleware valid user', (done) => {
      request(app).get('/middleware')
        .auth('admin', 'x')
        .expect(200, {
          loginAs: 'admin'
        }, done);
    });

    it('POST /middleware no user', (done) => {
      request(app).post('/middleware')
        .attach('now', now_file)
        .expect(401, done);
    });

    it('POST /middleware invalid user', (done) => {
      request(app).post('/middleware')
        .attach('now', now_file)
        .auth('user', 'x')
        .expect(401, done);
    });

    it('POST /middleware valid user', (done) => {
      request(app).post('/middleware')
        .attach('now', now_file)
        .auth('admin', 'x')
        .expect(200, {
          loginAs: 'admin'
        , now: now_time
        }, done);
    });

  }); // middleware

  describe('validator', () => {

    const app = express();

    before((done) => {
      exprest.route(app, { controllers: ctrl_dir })
      .then(() => { done(); }, done);
    });

    describe('GET /validator', () => {
      it('valid', (done) => {
        request(app).get('/validator/123')
          .expect(200, {
            id: 123
          }, done);
      });

      it('invalid', (done) => {
        request(app).get('/validator/abc').expect(404, done);
      });
    }); // GET /validator

    describe('GET /validator/overwrite', () => {
      it('valid', (done) => {
        request(app).get('/validator/overwrite/abc')
          .expect(200, {
            id: 'abc'
          }, done);
      });

      it('invalid', (done) => {
        request(app).get('/validator/overwrite/123').expect(404, done);
      });
    }); // GET /validator/overwrite

  }); // validator

  describe('authorizer', () => {

    const app = express();

    before((done) => {
      app.use(passport.initialize());
      exprest.route(app, {
        controllers: ctrl_dir
      , authorizer: passport.authenticate('basic', { session: false })
      })
      .then(() => { done(); }, done);
    });

    it('GET /authorizer/private no user', (done) => {
      request(app).get('/authorizer/private')
        .expect(401, done);
    });

    it('GET /authorizer/private invalid user', (done) => {
      request(app).get('/authorizer/private')
        .auth('user', 'x')
        .expect(401, done);
    });

    it('GET /authorizer/private valid user', (done) => {
      request(app).get('/authorizer/private')
        .auth('admin', 'x')
        .expect(200, {
          loginAs: 'admin'
        }, done);
    });

    it('GET /authorizer/public no user', (done) => {
      request(app).get('/authorizer/public')
        .expect(200, {}, done);
    });

    it('GET /authorizer invalid user', (done) => {
      request(app).get('/authorizer/public')
        .auth('user', 'x')
        .expect(200, {}, done);
    });

    it('GET /authorizer valid user', (done) => {
      request(app).get('/authorizer/public')
        .auth('admin', 'x')
        .expect(200, {}, done);
    });

  }); // authorizer

});

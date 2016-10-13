/*!
 * exprest4
 * Copyright (c) 2016 Hiromitsu Fujita <bow.fujita@gmail.com>
 * MIT License
 */

'use strict';

const exprest = require(process.env.APP_ROOT)
    , express = require('express')
    , request = require('supertest')
    , path = require('path')
    , passport = require('../utils/passport')
    , ctrl_dir = path.join(__dirname, '..', 'controllers', 'routes')
;

describe('options', () => {

  it('logger', (done) => {
    const app = express()
        , expected_logs = [
            '[exprest4] app.get("/user") loaded.'
          , '[exprest4] app.get("/user/:id") loaded.'
          , '[exprest4] app.post("/user") loaded.'
          , '[exprest4] app.put("/user/:id") loaded.'
          , '[exprest4] app.delete("/user/:id") loaded.'
          , '[exprest4] Invoking list() upon app.get("/user").'
          ]
        , actual_logs = []
    ;

    exprest.route(app, {
      controllers: ctrl_dir
    , logger: (msg) => {
        actual_logs.push(msg);
      }
    })
    .should.be.fulfilled()
    .then(() => {
      request(app).get('/user')
        .expect(200, () => {
          expected_logs.forEach((expected) => {
            expected.should.be.equalOneOf(actual_logs);
          });
          done();
        });
    });

  }); // logger

  describe('index', () => {
    const app = express();

    before((done) => {
      exprest.route(app, {
        controllers: ctrl_dir
      , index: 'user'
      })
      .then(() => { done(); }, done);
    });

    // Check if user controller mapped onto /
    it('GET /', (done) => {
      request(app).get('/')
        .expect(200, {
          action: 'list'
        }, done);
    });

    // Check if index controller mapped onto /index
    it('GET /index', (done) => {
      request(app).get('/index')
        .expect(200, {
          action: 'top'
        }, done);
    });

  }); // index

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

    it('GET /authorizer/public invalid user', (done) => {
      request(app).get('/authorizer/public')
        .auth('user', 'x')
        .expect(200, {}, done);
    });

    it('GET /authorizer/public valid user', (done) => {
      request(app).get('/authorizer/public')
        .auth('admin', 'x')
        .expect(200, {}, done);
    });

  }); // authorizer

});

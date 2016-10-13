/*!
 * exprest4
 * Copyright (c) 2016 Hiromitsu Fujita <bow.fujita@gmail.com>
 * MIT License
 */

'use strict';

const exprest = require(process.env.APP_ROOT)
    , express = require('express')
    , request = require('supertest')
    , _ = require('underscore')
    , methods = require('methods')
    , path = require('path')
    , ctrl_dir = path.join(__dirname, '..', 'controllers', 'routes')
    , app = express()
;

describe('routes', () => {

  describe('default url', () => {

    before((done) => {
      exprest.route(app, { controllers: ctrl_dir })
      .then(() => { done(); }, done);
    });

    // Check if index controller routed properly
    it('GET /', (done) => {
      request(app).get('/')
        .expect(200, {
          action: 'top'
        }, done);
    });

    it('GET /dashboard', (done) => {
      request(app).get('/dashboard')
        .expect(200, {
          action: 'dashboard'
        }, done);
    });

    // Check if user controller routed properly
    it('GET /user', (done) => {
      request(app).get('/user')
        .expect(200, {
          action: 'list'
        }, done);
    });

    it('GET /user/:id', (done) => {
      request(app).get('/user/1')
        .expect(200, {
          action: 'view'
        , id: 1
        }, done);
    });

    it('POST /user', (done) => {
      request(app).post('/user')
        .expect(200, {
          action: 'create'
        }, done);
    });

    it('PUT /user/:id', (done) => {
      request(app).put('/user/1')
        .expect(200, {
          action: 'update'
        , id: 1
        }, done);
    });

    it('DELETE /user/:id', (done) => {
      request(app).delete('/user/1')
        .expect(200, {
          action: 'remove'
        , id: 1
        }, done);
    });

    // Check if 404 error returned upon any other methods than routed
    it('PUT /user', (done) => {
      request(app).put('/user').expect(404, done);
    });
    it('DELETE /user', (done) => {
      request(app).delete('/user').expect(404, done);
    });
    it('POST /user/:id', (done) => {
      request(app).post('/user/1').expect(404, done);
    });

    // Check if 404 error returned upon unmatched url
    it('GET /user/:id/show', (done) => {
      request(app).get('/user/1/show').expect(404, done);
    });

    // Check if 404 error returned before routing /api
    it('GET /api/user', (done) => {
      request(app).get('/api/user').expect(404, done);
    });
  }); // default url

  describe('custom url', () => {

    before((done) => {
      exprest.route(app, { controllers: ctrl_dir, url: '/api' })
      .then(() => { done(); }, done);
    });

    // Check if index controller routed properly
    it('GET /api', (done) => {
      request(app).get('/api')
        .expect(200, {
          action: 'top'
        }, done);
    });

    it('GET /api/dashboard', (done) => {
      request(app).get('/api/dashboard')
        .expect(200, {
          action: 'dashboard'
        }, done);
    });

     // Check if user controller routed properly
    it('GET /api/user', (done) => {
      request(app).get('/api/user')
        .expect(200, {
          action: 'list'
        }, done);
    });

    it('GET /api/user/:id', (done) => {
      request(app).get('/api/user/1')
        .expect(200, {
          action: 'view'
        , id: 1
        }, done);
    });

    it('POST /api/user', (done) => {
      request(app).post('/api/user')
        .expect(200, {
          action: 'create'
        }, done);
    });

    it('PUT /api/user/:id', (done) => {
      request(app).put('/api/user/1')
        .expect(200, {
          action: 'update'
        , id: 1
        }, done);
    });

    it('DELETE /api/user/:id', (done) => {
      request(app).delete('/api/user/1')
        .expect(200, {
          action: 'remove'
        , id: 1
        }, done);
    });

    // Check if 404 error returned upon unmatched url
    it('GET /api/user/:id/show', (done) => {
      request(app).get('/api/user/1/show').expect(404, done);
    });

    // Check if 404 error returned for any other methods than routed
    it('PUT /api/user', (done) => {
      request(app).put('/api/user').expect(404, done);
    });
    it('DELETE /api/user', (done) => {
      request(app).delete('/user').expect(404, done);
    });
    it('POST /api/user/:id', (done) => {
      request(app).post('/api/user/1').expect(404, done);
    });

  }); // custom url

});

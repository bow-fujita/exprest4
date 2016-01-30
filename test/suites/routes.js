/*!
 * exprest4
 * Copyright (c) 2016 Hiromitsu Fujita <bow.fujita@gmail.com>
 * MIT License
 */

'use strict';

var exprest = require(process.env.APP_ROOT)
  , express = require('express')
  , request = require('supertest')
  , _ = require('underscore')
  , methods = require('methods')
  , path = require('path')
  , ctrl_dir = path.join(__dirname, '..', 'controllers', 'routes')
  , app = express()
;

describe('routes', function() {

  describe('default url', function() {

    before(function(done) {
      exprest.route(app, { controllers: ctrl_dir });
      done();
    });

    // Check if routed properly
    it('GET /user', function(done) {
      request(app).get('/user')
        .expect(200, {
          action: 'list'
        }, done);
    });

    it('GET /user/:id', function(done) {
      request(app).get('/user/1')
        .expect(200, {
          action: 'view'
        , id: 1
        }, done);
    });

    it('POST /user', function(done) {
      request(app).post('/user')
        .expect(200, {
          action: 'create'
        }, done);
    });

    it('PUT /user/:id', function(done) {
      request(app).put('/user/1')
        .expect(200, {
          action: 'update'
        , id: 1
        }, done);
    });

    it('DELETE /user/:id', function(done) {
      request(app).delete('/user/1')
        .expect(200, {
          action: 'remove'
        , id: 1
        }, done);
    });

    // Check if 404 error returned upon any other methods than routed
    it('PUT /user', function(done) {
      request(app).put('/user').expect(404, done);
    });
    it('DELETE /user', function(done) {
      request(app).delete('/user').expect(404, done);
    });
    it('POST /user/:id', function(done) {
      request(app).post('/user/1').expect(404, done);
    });

    // Check if 404 error returned upon unmatched url
    it('GET /user/:id/show', function(done) {
      request(app).get('/user/1/show').expect(404, done);
    });

    // Check if 404 error returned before routing /api
    it('GET /api/user', function(done) {
      request(app).get('/api/user').expect(404, done);
    });
  });

  describe('custom url', function() {

    before(function(done) {
      exprest.route(app, { controllers: ctrl_dir, url: '/api' });
      done();
    });

    // Check if routed properly
    it('GET /api/user', function(done) {
      request(app).get('/api/user')
        .expect(200, {
          action: 'list'
        }, done);
    });

    it('GET /api/user/:id', function(done) {
      request(app).get('/api/user/1')
        .expect(200, {
          action: 'view'
        , id: 1
        }, done);
    });

    it('POST /api/user', function(done) {
      request(app).post('/api/user')
        .expect(200, {
          action: 'create'
        }, done);
    });

    it('PUT /api/user/:id', function(done) {
      request(app).put('/api/user/1')
        .expect(200, {
          action: 'update'
        , id: 1
        }, done);
    });

    it('DELETE /api/user/:id', function(done) {
      request(app).delete('/api/user/1')
        .expect(200, {
          action: 'remove'
        , id: 1
        }, done);
    });

    // Check if 404 error returned upon unmatched url
    it('GET /api/user/:id/show', function(done) {
      request(app).get('/api/user/1/show').expect(404, done);
    });

    // Check if 404 error returned for any other methods than routed
    it('PUT /api/user', function(done) {
      request(app).put('/api/user').expect(404, done);
    });
    it('DELETE /api/user', function(done) {
      request(app).delete('/user').expect(404, done);
    });
    it('POST /api/user/:id', function(done) {
      request(app).post('/api/user/1').expect(404, done);
    });

  });

});

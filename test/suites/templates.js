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
  , ctrl_dir = path.join(__dirname, '..', 'controllers', 'templates')
  , app = express()
;

describe('templates', function() {

  before(function(done) {
    var templates = {
          queue: [{
            action: 'dump'
          }, {
            action: 'push'
          , method: 'post'
          , path: ':elem'
          }, {
            action: 'pop'
          , method: 'delete'
          }]
        }
    ;

    exprest.route(app, { controllers: ctrl_dir, templates: templates })
    .then(function() { done(); }, done);
  });

  describe('crud', function() {

     // Check if crud controller routed properly
    it('GET /crud', function(done) {
      request(app).get('/crud')
        .expect(200, {
          action: 'list'
        }, done);
    });

    it('GET /crud/:id', function(done) {
      request(app).get('/crud/1')
        .expect(200, {
          action: 'view'
        , id: 1
        }, done);
    });

    it('POST /crud', function(done) {
      request(app).post('/crud')
        .expect(200, {
          action: 'create'
        }, done);
    });

    it('PUT /crud/:id', function(done) {
      request(app).put('/crud/1')
        .expect(200, {
          action: 'update'
        , id: 1
        }, done);
    });

    it('DELETE /crud/:id', function(done) {
      request(app).delete('/crud/1')
        .expect(200, {
          action: 'remove'
        , id: 1
        }, done);
    });

    // Check if 404 error returned upon any other methods than routed
    it('PUT /crud', function(done) {
      request(app).put('/crud').expect(404, done);
    });
    it('DELETE /crud', function(done) {
      request(app).delete('/crud').expect(404, done);
    });
    it('POST /crud/:id', function(done) {
      request(app).post('/crud/1').expect(404, done);
    });

    // Check if 404 error returned upon unmatched url
    it('GET /crud/:id/show', function(done) {
      request(app).get('/crud/1/show').expect(404, done);
    });

  });

  describe('custom', function() {

     // Check if queue controller routed properly
    it('GET /queue', function(done) {
      request(app).get('/queue')
        .expect(200, {
          action: 'dump'
        , queue: []
        }, done);
    });

    it('POST /queue/:elem', function(done) {
      request(app).post('/queue/first')
        .expect(200, {
          action: 'push'
        , queue: ['first']
        }, done);
    });

    it('DELETE /queue', function(done) {
      request(app).delete('/queue')
        .expect(200, {
          action: 'pop'
        , queue: []
        }, done);
    });

    // Check if 404 error returned upon unmatched url
    it('GET /queue/show', function(done) {
      request(app).get('/queue/show').expect(404, done);
    });

    // Check if 404 error returned for any other methods than routed
    it('PUT /queue', function(done) {
      request(app).put('/queue').expect(404, done);
    });

  });

});

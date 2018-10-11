/*!
 * exprest4
 * Copyright (c) 2016-2018 Hiro Fujita <bow.fujita@gmail.com>
 * MIT License
 */

'use strict';

const exprest = require(process.env.APP_ROOT)
    , express = require('express')
    , request = require('supertest')
    , _ = require('underscore')
    , methods = require('methods')
    , path = require('path')
    , ctrl_dir = path.join(__dirname, '..', 'controllers', 'templates')
    , app = express()
;

describe('templates', () => {

  before((done) => {
    const templates = {
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
    .then(() => { done(); }, done);
  });

  describe('crud', () => {

     // Check if crud controller routed properly
    it('GET /crud', (done) => {
      request(app).get('/crud')
        .expect(200, {
          action: 'list'
        }, done);
    });

    it('GET /crud/:id', (done) => {
      request(app).get('/crud/1')
        .expect(200, {
          action: 'view'
        , id: '1'
        }, done);
    });

    it('POST /crud', (done) => {
      request(app).post('/crud')
        .expect(200, {
          action: 'create'
        }, done);
    });

    it('PUT /crud/:id', (done) => {
      request(app).put('/crud/1')
        .expect(200, {
          action: 'update'
        , id: '1'
        }, done);
    });

    it('DELETE /crud/:id', (done) => {
      request(app).delete('/crud/1')
        .expect(200, {
          action: 'remove'
        , id: '1'
        }, done);
    });

    // Check if 404 error returned upon any other methods than routed
    it('PUT /crud', (done) => {
      request(app).put('/crud').expect(404, done);
    });
    it('DELETE /crud', (done) => {
      request(app).delete('/crud').expect(404, done);
    });
    it('POST /crud/:id', (done) => {
      request(app).post('/crud/1').expect(404, done);
    });

    // Check if 404 error returned upon unmatched url
    it('GET /crud/:id/show', (done) => {
      request(app).get('/crud/1/show').expect(404, done);
    });

  }); // crud

  describe('extend', () => {

     // Check if crud controller routed properly
    it('GET /extend', (done) => {
      request(app).get('/extend')
        .expect(200, {
          action: 'list'
        }, done);
    });

    it('POST /extend', (done) => {
      request(app).post('/extend')
        .expect(200, {
          action: 'create'
        }, done);
    });

    it('PUT /extend/:id', (done) => {
      request(app).put('/extend/1')
        .expect(200, {
          action: 'update'
        , id: '1'
        }, done);
    });

    it('DELETE /extend/:id', (done) => {
      request(app).delete('/extend/1')
        .expect(200, {
          action: 'remove'
        , id: '1'
        }, done);
    });

    // Check if additional action routed properly
    it('DELETE /extend', (done) => {
      request(app).delete('/extend')
        .expect(200, {
          action: 'clear'
        }, done);
    });

    // Check if overwritten action routed properly
    it('GET /extend/:id', (done) => {
      request(app).get('/extend/1')
        .expect(200, {
          action: 'show'
        , id: '1'
        }, done);
    });

    // Check if 404 error returned upon any other methods than routed
    it('PUT /extend', (done) => {
      request(app).put('/extend').expect(404, done);
    });
    it('POST /extend/:id', (done) => {
      request(app).post('/extend/1').expect(404, done);
    });

    // Check if 404 error returned upon unmatched url
    it('GET /extend/:id/show', (done) => {
      request(app).get('/extend/1/show').expect(404, done);
    });

  }); // extend

  describe('custom', () => {

     // Check if queue controller routed properly
    it('GET /queue', (done) => {
      request(app).get('/queue')
        .expect(200, {
          action: 'dump'
        , queue: []
        }, done);
    });

    it('POST /queue/:elem', (done) => {
      request(app).post('/queue/first')
        .expect(200, {
          action: 'push'
        , queue: ['first']
        }, done);
    });

    it('DELETE /queue', (done) => {
      request(app).delete('/queue')
        .expect(200, {
          action: 'pop'
        , queue: []
        }, done);
    });

    // Check if 404 error returned upon unmatched url
    it('GET /queue/show', (done) => {
      request(app).get('/queue/show').expect(404, done);
    });

    // Check if 404 error returned for any other methods than routed
    it('PUT /queue', (done) => {
      request(app).put('/queue').expect(404, done);
    });

  }); // custom

});

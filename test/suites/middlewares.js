/*!
 * exprest4
 * Copyright (c) 2016 Hiromitsu Fujita <bow.fujita@gmail.com>
 * MIT License
 */

'use strict';

var exprest = require(process.env.APP_ROOT)
  , express = require('express')
  , request = require('supertest')
  , fs = require('fs')
  , path = require('path')
  , ctrl_dir = path.join(__dirname, '..', 'controllers', 'middlewares')
  , app = express()
;

describe('middlewares', function() {

  before(function(done) {
    exprest.route(app, { path: ctrl_dir });
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

});

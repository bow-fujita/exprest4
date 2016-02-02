/*!
 * exprest4
 * Copyright (c) 2016 Hiromitsu Fujita <bow.fujita@gmail.com>
 * MIT License
 */

'use strict';

var exprest = require(process.env.APP_ROOT)
  , express = require('express')
  , path = require('path')
  , _ = require('underscore')
  , ctrl_dir = path.join(__dirname, '..', 'controllers', 'routes')
  , app = express()
; 

describe('logger', function() {

  it('custom', function(done) {
    var expected_logs = [
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
  });

});

/*!
 * exprest4
 * Copyright (c) 2016 Hiromitsu Fujita <bow.fujita@gmail.com>
 * MIT License
 */

'use strict';

var exprest = require(process.env.APP_ROOT)
  , express = require('express')
  , path = require('path')
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
      path: ctrl_dir
    , logger: function(msg) {
        actual_logs.push(msg);
      }
    });

    actual_logs.should.deepEqual(expected_logs);
    done();
  });

});

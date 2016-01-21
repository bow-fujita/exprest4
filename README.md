# exprest4

Yet another RESTful API framework for Express 4.x.

## Install

```sh
$ npm install exprest4
```

Note that you have to `npm install express` as well because `exprest4` doesn't install Express 4.x by itself.


## Example

Define a controller module which has the special propety `__exprest` as follow:

```javascript
// controllers/example.js

module.exports = {
  __exprest: {
    routes: [{
      action: 'list'
    }, {
      action: 'view'
    , path: ':id'
    }, {
      action: 'create'
    , method: 'post'
    }, {
      action: 'update'
    , path: ':id'
    , method: 'put'
    }, {
      action: 'remove'
    , path: ':id'
    , method: 'delete'
    }]
  }

, list: function(req, res) {
    ...
  }
, view: function(req, res) {
    ...
  }
, create: function(req, res) {
    ...
  }
, update: function(req, res) {
    ...
  }
, remove: function(req, res) {
    ...
  }
};
```

```javascript
// app.js

var express = require('express')
  , exprest = require('exprest4')
  , app = express()
;

exprest.route(app, { url: '/api' } );

app.listen();
```

The code implemented in `controllers/example.js` is equivalent to the following Express calls:

```javascript
var example = require('./controllers/example');

app.get('/api/example', example.list);
app.get('/api/example/:id', example.view);
app.post('/api/example', example.create);
app.put('/api/example/:id', example.update);
app.delete('/api/example/:id', example.remove);
```

`exprest4` regards each file/directory under the `controllers` directory as a controller module in terms of MVC, and routes everything upon `route()` call.


## License

**The MIT License (MIT)**

Copyright (c) 2016 Hiromitsu Fujita <bow.fujita@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


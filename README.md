# exprest4

[![NPM Version][npm-version-image]][npm-url]
[![NPM Downloads][npm-downloads-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Coverage Status][coveralls-image]][coveralls-url]
![License][npm-license-image]

Yet another RESTful API framework for [Express](http://expressjs.com/) 4.x.


## Getting started

```sh
$ npm install exprest4
```

Note that you have to `npm install express` as well because `exprest4` doesn't install Express 4.x by itself.

Make `controllers` directory and code your Express application.

```sh
$ mkdir controllers
$ vim app.js
```

```javascript
// app.js

var express = require('express')
  , exprest = require('exprest4')
  , app = express()
;

exprest.route(app, { url: '/api' });

app.listen();
```

`exprest4` regards each file/directory under the `controllers` directory as a controller module in terms of MVC, and routes everything upon `route()` call.
Each controller module must have the special property `__exprest` as follow:

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
    res.status(200).json({ action: 'list' });
  }
, view: function(req, res) {
    res.status(200).json({ action: 'view', id: req.params.id });
  }
, create: function(req, res) {
    res.status(200).json({ action: 'create' });
  }
, update: function(req, res) {
    res.status(200).json({ action: 'update', id: req.params.id });
  }
, remove: function(req, res) {
    res.status(200).json({ action: 'remove', id: req.params.id });
  }
};
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


## Methods

### `route(app[, opts])`

`exprest` routes controller modules for `app` which must be an Express instance.
Each controller module implemented in `opts.controllers` directory will be mapped onto `opts.url`.
You don't have to code for routing by yourself.
Just maintain APIs structure as physical directory structure.

If `opts` is omitted, the following options are applied:
```javascript
opts = {
  controllers: path.join(process.cwd(), 'controllers')
, url: '/'
}
```

If you call `route()` once, which means you have only one controller directory, REST API is going to be flat like `/api/<controllers>`.

You can also call `route()` more than once to provide structured REST API.
For example, if you want to seperate APIs by version like `/api/v1/<controllers>` and `/api/v2/<controllers>`, create two controller directories `controllers/v1` and `controllers/v2`, then call `route()` as follow:

```javascript
// app.js

var path = require('path')
  , api_versions = [1, 2]
  , controllers_dir = path.join(process.cwd(), 'controllers')
;

api_versions.forEach(function(version) {
    exprest.route(app, {
      url: '/api/v'+version
    , controllers: path.join(controllers_dir, 'v'+version)
    });
});
```

## `__exprest` Property

### `routes` : Array

Each element is an object which has the following properties:

+ **`action`: String [Required]**<br>
  Function name to be routed.

+ **`method`: String [Default: `'get'`]**<br>
  Request method to be routed.

+ **`path`: String [Default: `''`]**<br>
  Virtual path for this `action`.

+ **`middleware`: {Function|Function[]} [Default: `undefined`]**<br>
  Middleware(s) to be passed to Express.


`middleware` is typically used for APIs accept file uploading.
The following example uses [Multer](https://github.com/expressjs/multer) as `middleware`:

```javascript
var multer = require('multer')
  , upload = multer(/* memory storage */)
;

module.exports = {
  __exprest: {
    routes: [{
      action: 'echo'
    , method: 'post'
    , middleware: upload.single('message')
    }]
  }

, echo: function(req, res) {
    res.status(200).json({ echo: req.file.buffer.toString() });
  }
};
 ```

Another use case is authentication.
The following example uses [Passport](https://github.com/jaredhanson/passport) as `middleware':

```javascript
var passport = require('passport')
;

module.exports = {
  __exprest: {
    routes: [{
      action: 'login'
    , middleware: passport.authenticate('basic', { session: false })
    }]
  }

, login: function(req, res) {
    res.status(200).json({ loginAs: req.user.username });
  }

};
 ```


## License

**The MIT License (MIT)**

Copyright (c) 2016 Hiromitsu Fujita <bow.fujita@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

[npm-version-image]: https://img.shields.io/npm/v/exprest4.svg
[npm-downloads-image]: https://img.shields.io/npm/dm/exprest4.svg
[npm-license-image]: https://img.shields.io/npm/l/exprest4.svg
[npm-url]: https://npmjs.org/package/exprest4
[travis-image]: https://img.shields.io/travis/bow-fujita/exprest4/master.svg
[travis-url]: https://travis-ci.org/bow-fujita/exprest4
[coveralls-image]: https://img.shields.io/coveralls/bow-fujita/exprest4/master.svg
[coveralls-url]: https://coveralls.io/github/bow-fujita/exprest4?branch=master

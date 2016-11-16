# exprest4

[![NPM Version][npm-version-image]][npm-url]
[![NPM Downloads][npm-downloads-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Coverage Status][coveralls-image]][coveralls-url]
[![Dependency Status][david-image]][david-url]
![License][npm-license-image]

Yet another RESTful API framework for [Express](http://expressjs.com/) 4.x.


## Install

```sh
$ npm install exprest4
```

Note that you have to `npm install express` as well because `exprest4` doesn't install Express 4.x by itself.


## Getting started

### Controllers

Make `controllers` directory and code your Express application.

```sh
$ mkdir controllers
$ vim app.js
```

```javascript
// app.js

'use strict';

const express = require('express')
    , exprest = require('exprest4')
    , app = express()
;

exprest.route(app, { url: '/api' })
.then(() => {
  app.listen();
});
```

`exprest4` regards each file/directory under the `controllers` directory as a controller module in terms of MVC, and routes everything upon `route()` call.
Each controller module must have the special property `__exprest` as follow:

```javascript
// controllers/example.js

'use strict';

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

, list: (req, res) => {
    res.json({ action: 'list' });
  }

, view: (req, res) => {
    res.json({ action: 'view', id: req.params.id });
  }

, create: (req, res) => {
    res.json({ action: 'create' });
  }

, update: (req, res) => {
    res.json({ action: 'update', id: req.params.id });
  }

, remove: (req, res) => {
    res.json({ action: 'remove', id: req.params.id });
  }
};
```

The code implemented in `controllers/example.js` is equivalent to the following Express calls:

```javascript
'use strict';

const example = require('./controllers/example');

app.get('/api/example', example.list);
app.get('/api/example/:id', example.view);
app.post('/api/example', example.create);
app.put('/api/example/:id', example.update);
app.delete('/api/example/:id', example.remove);
```

### Models

If your application works with a database, `exprest4` also allows you to define models by using [Sequelize](http://sequelizejs.com).
Make `models` directory and add to call `model()` as follows:

```sh
$ mkdir models
$ vim app.js
```

`exprest4` regards each file/directory under the `models` directory as a model module [in manner of Sequelize](http://docs.sequelizejs.com/en/v3/docs/models-definition/#import), and loads all models into a Sequelize instance upon `model()` call.

```javascript
// models/project.js

'use strict';

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('project', {
    title: DataTypes.STRING
  , description: DataTypes.TEXT
  });
};


// app.js

'use strict';

const express = require('express')
    , exprest = require('exprest4')
    , app = express()
;

exprest.route(app, { url: '/api' })
.then(() => exprest.model({ dialect: 'sqlite' })) // Use SQLite with memory storage
.then((sequelize) => {
  app.locals.models = sequelize.models; // Save the models for controllers
  return sequelize.sync();
})
.then(() => {
  app.listen();
});
```

`model()` returns `Promise` with a Sequelize instance.

It's a good idea to save the models as `app.locals.models` as above code in `app.js`, so that each controller can access to the models through `req.app.locals.models` as the following code:

```javascript
// controllers/project.js

'use strict';

function project(req)
{
  return req.app.locals.models.project;
}

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

, list: (req, res, next) => {
    project().findAll()
    .then((rows) => { res.json(rows); })
    .catch(next);
  }

, view: (req, res, next) => {
    project().findById(req.params.id)
    .then((row) => { row ? res.json(row) : res.status(404); })
    .catch(next);
  }

, create: (req, res, next) => {
    project().create({
      title: req.body.title
    , description: req.body.description
    })
    .then((row) => { res.json(row); })
    .catch(next);
  }

, update: (req, res, next) => {
    project().findById(req.params.id)
    .then((row) => {
      if (!row) {
        res.status(404);
        return Promise.resolve();
      }
      return row.update({
        title: req.body.title
      , description: req.body.description
      });
    })
    .then(() => { res.end(); });
    .catch(next);
  }

, remove: (req, res, next) => {
    project().findById(req.params.id)
    .then((row) => row ? row.destroy() : Promise.resolve())
    .then(() => { res.end(); });
    .catch(next);
  }
};
```


## Methods

### `route(app[, opts]) -> Promise`

Routes controller modules for `app` which must be an Express instance.

`opts` is an object which may have the following properties:

+ **`controllers`: String [Default: `path.join(process.cwd(), 'controllers')`]<br>**
  Physical path to where controllers are implemented.

+ **`url`: String [Default: `'/'`]**<br>
  Virtual path prefix for the `controllers`.

+ **`index`: String [Default: `'index'`]**<br>
  Controller's name which will be mapped directly onto `url`.

+ **`authorizer`: Function [Default: `undefined`]**<br>
  Middleware for user authorization.

+ **`templates`: Object [Default: `{ crud: [...] }`]**<br>
  Templates for routes.

Each controller module implemented in `opts.controllers` directory will be mapped onto `opts.url`.
You don't have to code for routing by yourself.
Just maintain APIs structure as physical directory structure.

If you call `route()` once, which means you have only one controller directory, REST API is going to be flat like `/api/<controllers>`.

You can also call `route()` more than once to provide structured REST API.
For example, if you want to seperate APIs by version like `/api/v1/<controllers>` and `/api/v2/<controllers>`, create two controller directories `controllers/v1` and `controllers/v2`, then call `route()` as follow:

```javascript
// app.js

'use strict';

const path = require('path')
    , express = require('express')
    , exprest = require('exprest4')
    , app = express()
    , api_versions = [1, 2]
    , controllers_dir = path.join(process.cwd(), 'controllers')
;

Promise.all(
  api_versions.map((version) => {
    return exprest.route(app, {
             url: '/api/v'+version
           , controllers: path.join(controllers_dir, 'v'+version)
           });
  })
)
.then(() => {
  app.listen();
});
```

If your REST APIs require users to be authenticated and/or to be authorized, `opts.authorizer` is the right place to implement user authentication/authorization feature.
You can specifiy a middleware as `opt.authorizer` to verify a user session, then it will be called at first for every controller.
The following example uses [connect-ensure-login](https://github.com/jaredhanson/connect-ensure-login) as `opt.authorizer`:

```javascript
// app.js

'use strict';

const path = require('path')
    , express = require('express')
    , exprest = require('exprest4')
    , app = express()
    , ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn
;

exprest.route(app, {
    url: '/api'
  , authorizer: ensureLoggedIn('/login')
})
.then(() => {
  app.listen();
});
```


### `model([opts]) -> Promise`

Imports models into a Sequelize instance.

`opts` is an object which may have the following properties:

+ **`models`: String [Default: `path.join(process.cwd(), 'models')`]<br>**
  Physical path to where models are implemented.

+ **`database`: String [Default: `undefined`]**<br>
  Database name.

+ **`username`: String [Default: `undefined`]**<br>
  Username for database authentication.

+ **`password`: String [Default: `undefined`]**<br>
  Password for database authentication.

Each model module implemented in `opts.models` directory will be imported into a Sequelize instance after connection to a database is established.
The Sequelize instance will be returned with `Promise` upon success.

`opts.database`, `opts.username` and `opts.password` are passed to [Sequelize's constructor](http://docs.sequelizejs.com/en/v3/api/sequelize/#class-sequelize).
Other options are also passed through to `options`, the 4th arugment of Sequelize's constructor.


### `model.connect([opts]) -> Promise`

Connects to a database through Sequelize by calling [`Sequelize.authenticate()`](http://docs.sequelizejs.com/en/v3/api/sequelize/#authenticate-promise).

`opts` is an object which may have the following properties:

+ **`database`: String [Default: `undefined`]**<br>
  Database name.

+ **`username`: String [Default: `undefined`]**<br>
  Username for database authentication.

+ **`password`: String [Default: `undefined`]**<br>
  Password for database authentication.

The Sequelize instance will be returned with `Promise` upon success.

Each property of `opts` is passed to [Sequelize's constructor](http://docs.sequelizejs.com/en/v3/api/sequelize/#class-sequelize).
Other options are also passed through to `options`, the 4th arugment of Sequelize's constructor.


### `model.sync([opts]) -> Promise`

Synchronizes all defined models to a database.

`opts` is an object which may have the following properties:

+ **`models`: String [Default: `path.join(process.cwd(), 'models')`]<br>**
  Physical path to where models are implemented.

+ **`database`: String [Default: `undefined`]**<br>
  Database name.

+ **`schema`: String [Default: `undefined`]**<br>
  Schema name.

+ **`username`: String [Default: `undefined`]**<br>
  Username for database authentication.

+ **`password`: String [Default: `undefined`]**<br>
  Password for database authentication.

The Sequelize instance will be returned with `Promise` upon success.

`opts.database`, `opts.username` and `opts.password` are passed to [Sequelize's constructor](http://docs.sequelizejs.com/en/v3/api/sequelize/#class-sequelize).
Other options are also passed through to `options` of both Sequelize's constructor and [`Sequelize.sync()`](http://docs.sequelizejs.com/en/v3/api/sequelize/#syncoptions-promise).

Note that this function is equivalent to `Sequelize.sync()` unless Sequelize connects to PostgreSQL database.
There is an issue in `Sequelize.sync()` for PostgreSQL, even if `options.schema` is specified, no schema is prepended to table names while executing `dropTable()`.
So that the tables under the `public` schema with the same names as your models might be dropped unintentionally by `Sequelize.sync()`.
This function provides workaround for the issue.

`opts.schema` is passed to each model module implemented in `opts.models` directory as the third argument.
The model modules have to pass the `schema` as `options.schema` to [`Sequelize.define()`](http://docs.sequelizejs.com/en/v3/api/sequelize/#definemodelname-attributes-options-model) as the following example:

```javascript
// models/project.js

'use strict';

module.exports = (sequelize, DataTypes, schema) => {
  return sequelize.define('project', {
    title: DataTypes.STRING
  , description: DataTypes.TEXT
  }, {
    schema: schema
  });
};
```


## `__exprest` Property

### `routes` : Array [Required]

Each element is an object which has the following properties:

+ **`action`: String [Required]**<br>
  Function name to be routed.

+ **`method`: String [Default: `'get'`]**<br>
  Request method to be routed.

+ **`path`: String [Default: `''`]**<br>
  Virtual path for the `action`.

+ **`authorized`: Boolean [Default: `true`]**<br>
  Authorization is required or not for the `action`.

+ **`validator`: Object [Default: `undefined`]**<br>
  [Validator(s)](#validator) for placeholders in `path`.

+ **`middleware`: {Function|Function[]} [Default: `undefined`]**<br>
  [Middleware(s)](#middleware) to be passed to Express.


### `preset` : Object [Default: `undefined`]

The following properties will be applied to each element in `routes`:

+ **`authorized`: Boolean [Default: `true`]**<br>
  Authorization is required or not.
  This can be overwritten by `routes[].authorized`.

+ **`validator`: Object [Default: `undefined`]**<br>
  [Validator(s)](#validator) for placeholders in each `path`.

+ **`middleware`: {Function|Function[]} [Default: `undefined`]**<br>
  [Middleware(s)](#middleware) to be passed to Express.

+ **`template`: String [Default: `undefined`]**<br>
  One of [templates](#template) to be used as `routes`.


### Validator

If `routes[].path` contains any placeholders to receive parameters from [`req.params`](http://expressjs.com/en/4x/api.html#req.params) object, `validator` will be helpful to validate parameters before calling `routes[].action`.
The following example uses [validator.js](https://github.com/chriso/validator.js) as `validator`:

```javascript
const validator = require('validator');

'use strict';

module.exports = {
  __exprest: {
    routes: [{
      action: 'view'
    , path: ':id'
    , validator: {
        id: validator.isNumeric
      }
    }]
  }

, view: (req, res) => {
    // `req.params.id` must a number.
    res.json({ id: req.params.id });
  }
```

You can also use a `RegExp` object instead of a function as follow:

```javascript
'use strict';

module.exports = {
  __exprest: {
    routes: [{
      action: 'view'
    , path: ':id'
    , validator: {
        id: /^[1-9][0-9]*/
      }
    }]
  }

, view: (req, res) => {
    // `req.params.id` must a number.
    res.json({ id: req.params.id });
  }
```

If you have a placeholder commonly used in a controller, you can use `preset.validator` as follow:

```javascript
'use strict';

const validator = require('validator');

module.exports = {
  __exprest: {
    preset: {
      validator: {
        id: validator.isNumeric
      }
    }
  , routes: [
      action: 'view'
    , path: ':id'
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

, view: (req, res) => {
    res.json({ action: 'view', id: req.params.id });
  }

, update: (req, res) => {
    res.json({ action: 'update', id: req.params.id });
  }

, remove: (req, res) => {
    res.json({ action: 'remove', id: req.params.id });
  }
};
```

### Middleware

`middleware` is typically used for APIs accept file uploading.
The following example uses [Multer](https://github.com/expressjs/multer) as `middleware`:

```javascript
'use strict';

const multer = require('multer')
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

, echo: (req, res) => {
    res.json({ echo: req.file.buffer.toString() });
  }
};
 ```

Another use case is authentication.
The following example uses [Passport](https://github.com/jaredhanson/passport) as `middleware`:

```javascript
'use strict';

const passport = require('passport');

module.exports = {
  __exprest: {
    routes: [{
      action: 'login'
    , middleware: passport.authenticate('basic', { session: false })
    }]
  }

, login: (req, res) => {
    res.json({ loginAs: req.user.username });
  }
};
 ```

If you want to authenticate users for every action in a controller, you can use `preset.middleware` as follow:

```javascript
'use strict';

const passport = require('passport')
    , multer = require('multer')
    , upload = multer(/* memory storage */)
;

module.exports = {
  __exprest: {
    preset: {
      middleware: passport.authenticate('basic', { session: false })
    }
  , routes: [{
      action: 'login'
    }, {
      action: 'echo'
    , method: 'post'
    , middleware: upload.single('message')
    }]
  }

, login: (req, res) => {
    res.json({ loginAs: req.user.username });
  }

, echo: (req, res) => {
    res.json({ echo: req.file.buffer.toString() });
  }
};
```

### Template

`template` is an option to avoid defining the same `routes` in multiple controllers.
Once you define routes which might be used often in several controllers, then feed them to `route()` with `opts.templates`, each controller can refer one of the templates through `preset.template` property.
The following example shows how to use template:

```javascript
// app.js

'use strict';

const express = require('express')
    , exprest = require('exprest4')
    , app = express()
    , templates = {
        queue: [{
          action: 'push'
        , path:   ':elem'
        , method: 'post'
        }, {
          action: 'pop'
        , method: 'delete'
        }]
      }
;

exprest.route(app, { templates: templates })
```

```javascript
// controllers/seat.js

'use strict';

let waiting_list = [];

module.exports = {
  __exprest: {
    preset: {
      template: 'queue'
    }
    // No routes required here.
  }

, push: (req, res) => {
    waiting_list.push(req.params.elem);
    res.json(waiting_list);
  }

, pop: (req, res) => {
    waiting_list.pop();
    res.json(waiting_list);
  }
};
```

`exprest4` provides the following template `crud` by default which might be useful for CRUD-based REST APIs:

```javascript
[{
    action: 'list'
}, {
    action: 'view'
  , path:   ':id'
}, {
    action: 'create'
  , method: 'post'
}, {
    action: 'update'
  , path:   ':id'
  , method: 'put'
}, {
    action: 'remove'
  , path:   ':id'
  , method: 'delete'
}]
```

If you define `routes` along with `preset.template`, each route in `routes` will be appended to the template routes as a result.
In addition, `routes` which has exactly the same `method` and `path` overwrites corresponding routes in the template.


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
[david-image]: https://david-dm.org/bow-fujita/exprest4.svg
[david-url]: https://david-dm.org/bow-fujita/exprest4

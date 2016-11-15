/*!
 * exprest4
 * Copyright (c) 2016 Hiromitsu Fujita <bow.fujita@gmail.com>
 * MIT License
 */

'use strict';

const fs = require('fs')
    , path = require('path')
    , util = require('util')
    , methods = require('methods')
    , _ = require('underscore')
    , pathToRegExp = require('path-to-regexp')
;

function paramKeys(vpath)
{
  let keys = [];
  pathToRegExp(vpath, keys);
  return _.map(keys, (key) => key.name);
}

function buildVPath(root, action)
{
  let vpath = root;

  if (action) {
    if (!/\/$/.test(vpath)) {
      vpath += '/';
    }
    vpath += action;
  }
  return vpath;
}

function buildLogger(logging, action, method, vpath)
{
  if (!_.isFunction(logging)) {
    return undefined;
  }

  return (req, res, next) => {
    logging(`[exprest4] Invoking ${action}() upon app.${method}("${vpath}").`);
    next();
  };
}

function buildValidatorChain(vpath, handler)
{
  const keys = paramKeys(vpath);
  if (!keys.length) {
    return handler;
  }

  let validators = {};
  _.toArray(arguments).slice(2).forEach((validator) => {
    if (_.isObject(validator)) {
      _.extend(validators, validator);
    }
  });

  const chain = _.map(validators, (validator, key) => {
                  let check;
                  if (~_.indexOf(keys, key)) {
                    if (_.isRegExp(validator)) {
                      check = (value) => validator.test(value);
                    }
                    else if (_.isFunction(validator)) {
                      check = validator;
                    }
                  }

                  return check ? { key: key, check: check } : null;
                }).filter((validator) => validator !== null)
  ;

  if (!chain.length) {
    return handler;
  }

  return (req, res, next) => {
    const ok = _.reduce(chain, (valid, validator) => {
                 if (valid) {
                   valid = validator.check(req.params[validator.key]);
                 }
                 return valid;
               }, true)
    ;

    ok ? handler(req, res, next) : next();
  };
}

function buildMiddlewareChain()
{
  let handlers = [];

  _.toArray(arguments).forEach((middlewares) => {
    if (_.isFunction(middlewares)) {
      handlers.push(middlewares);
    }
    else if (_.isArray(middlewares)) {
      middlewares.forEach((middleware) => {
        if (_.isFunction(middleware)) {
          handlers.push(middleware);
        }
      });
    }
  });

  return handlers;
}

function buildOptions(opts)
{
  opts = _.defaults(opts || {}, {
           controllers: path.join(process.cwd(), 'controllers')
         , url: '/'
         , index: 'index'
         });

  const crud = [{
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
  ;

  opts.templates = _.defaults(opts.templates || {}, { crud: crud });
  return opts;
}

function isSameRoute(lhs, rhs)
{
  return ((lhs.method || 'get').toLowerCase() == (rhs.method || 'get').toLowerCase()) &&
         (buildVPath('/', lhs.path) == buildVPath('/', rhs.path));
}

function loadOneController(app, opts, file)
{
  const basename = path.basename(file, '.js')
      , vpath_root = [
          opts.url.replace(/^\/+/, '/').replace(/\/+$/, '')
        , basename == opts.index ? '' : basename
        ].join('/')
      , fullpath = path.join(opts.controllers, file)
      , controller = require(fullpath)
      , config = controller.__exprest
      , error = (msg) => new Error(`${vpath_root} controller: ${msg} in ${fullpath}`)
  ;

  if (!config) {
    throw error('No __exprest defined');
  }
  if (!_.isObject(config)) {
    throw error('Invalid __exprest');
  }

  let routes;
  const preset = config.preset || {}
      , template = preset.template
  ;

  if (_.isString(template) && template.length) {
    routes = opts.templates[template];
    if (!routes) {
      throw error(`Unknown template "${template}"`);
    }
    if (!_.isArray(routes) || !routes.length) {
      throw error(`Invalid template "${template}"`);
    }

    if (_.isArray(config.routes) && config.routes.length) {
      routes = routes.filter((route) => {
                 return !config.routes.filter((extra) => isSameRoute(route, extra)).length;
               })
               .concat(config.routes);
    }
  }
  else {
    routes = config.routes;
    if (!routes) {
      throw error('No __exprest.routes defined');
    }
    if (!_.isArray(routes)) {
      throw error('Invalid __exprest.routes');
    }
  }

  routes.forEach((route, idx) => {
    const method = (route.method || 'get').toLowerCase();
    if (!_.find(methods, (verb) => verb === method)) {
      throw error(`Unknown method "${method}" in __exprest.routes[${idx}].method`);
    }

    const action = route.action
    if (!action) {
      throw error(`No __exprest.routes[${idx}].action defined`);
    }

    const handler = controller[action];
    if (!_.isFunction(handler)) {
      throw error(`No ${action}() implemented`);
    }

    const vpath = buildVPath(vpath_root, route.path)
        , logger = buildLogger(opts.logging, action, method, vpath)
        , authorized = (!_.isUndefined(route.authorized) ? route : preset).authorized !== false
        , authorizer = authorized ? opts.authorizer : undefined
        , validators = buildValidatorChain(vpath, handler, preset.validator, route.validator)
        , middlewares = buildMiddlewareChain(logger, authorizer, preset.middleware, route.middleware, validators)
    ;

    app[method](vpath, middlewares);

    if (_.isFunction(opts.logging)) {
      opts.logging(`[exprest4] app.${method}("${vpath}") loaded.`);
    }
  });
}

function loadControllers(app, opts, files)
{
  return Promise.all(
    _.map(files, (file) => {
      return new Promise((resolve, reject) => {
        try {
          loadOneController(app, opts, file);
          resolve();
        }
        catch (err) {
          reject(err);
        }
      });
    })
  );
}

module.exports = (app, opts) => {
  opts = buildOptions(opts);
  return new Promise((resolve, reject) => {
    fs.readdir(opts.controllers, (err, files) => {
      err ?
        reject(err) :
        loadControllers(app, opts, files).then(resolve, reject);
    });
  });
};

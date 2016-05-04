/*!
 * exprest4
 * Copyright (c) 2016 Hiromitsu Fujita <bow.fujita@gmail.com>
 * MIT License
 */

'use strict';

var fs = require('fs')
  , path = require('path')
  , util = require('util')
  , methods = require('methods')
  , _ = require('underscore')
  , pathToRegExp = require('path-to-regexp')
;

function paramKeys(vpath)
{
  var keys = [];
  pathToRegExp(vpath, keys);
  return _.map(keys, function(key) { return key.name; });
}

function buildVPath(root, action)
{
  var vpath = root
  if (action) {
    if (!/\/$/.test(vpath)) {
      vpath += '/';
    }
    vpath += action;
  }
  return vpath;
}

function buildLogger(logger, action, method, vpath)
{
  if (!_.isFunction(logger)) {
    return undefined;
  }

  return function(req, res, next) {
    logger(util.format('[exprest4] Invoking %s() upon app.%s("%s").', action, method, vpath));
    next();
  };
}

function buildValidatorChain(vpath, handler)
{
  var keys = paramKeys(vpath);
  if (!keys.length) {
    return handler;
  }

  var validators = {};
  _.toArray(arguments).slice(2).forEach(function(validator) {
    if (_.isObject(validator)) {
      _.extend(validators, validator);
    }
  });

  var chain = _.map(validators, function(validator, key) {
                var check;
                if (~_.indexOf(keys, key)) {
                  if (_.isRegExp(validator)) {
                    check = function(value) {
                      return validator.test(value);
                    };
                  }
                  else if (_.isFunction(validator)) {
                    check = validator;
                  }
                }

                return check ? { key: key, check: check } : null;
              }).filter(function(validator) {
                return validator !== null;
              })
  ;

  if (!chain.length) {
    return handler;
  }

  return function(req, res, next) {
    var ok = _.reduce(chain, function(valid, validator) {
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
  var handlers = [];

  _.toArray(arguments).forEach(function(middlewares) {
    if (_.isFunction(middlewares)) {
      handlers.push(middlewares);
    }
    else if (_.isArray(middlewares)) {
      middlewares.forEach(function(middleware) {
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

  var crud = [{
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

function loadOneController(app, opts, file)
{
  var basename = path.basename(file, '.js')
    , vpath_root = [
        opts.url.replace(/^\/+/, '/').replace(/\/+$/, '')
      , basename == opts.index ? '' : basename
      ].join('/')
    , fullpath = path.join(opts.controllers, file)
    , controller = require(fullpath)
    , config = controller.__exprest
    , error = function() {
        return new Error(vpath_root+' controller: '+util.format.apply(util, arguments)+' in '+fullpath);
      }
  ;

  if (!config) {
    throw error('No __exprest defined');
  }
  if (!_.isObject(config)) {
    throw error('Invalid __exprest');
  }

  var routes = config.routes
    , preset = config.preset || {}
    , template = preset.template
  ;

  if (_.isString(template) && template.length) {
    routes = opts.templates[template];
    if (!routes) {
      throw error('Unknown template "%s"', template);
    }
    if (!_.isArray(routes)) {
      throw error('Invalid template "%s"', template);
    }
  }
  else {
    if (!routes) {
      throw error('No __exprest.routes defined');
    }
    if (!_.isArray(routes)) {
      throw error('Invalid __exprest.routes');
    }
  }

  routes.forEach(function(route, idx) {
    var method = (route.method || 'get').toLowerCase();
    if (!_.find(methods, function(verb) { return verb === method })) {
      throw error('Unknown method "%s" in __exprest.routes[%d].method', method, idx);
    }

    var action = route.action
    if (!action) {
      throw error('No __exprest.routes[%d].action defined', idx);
    }

    var handler = controller[action];
    if (!_.isFunction(handler)) {
      throw error('No %s() implemented', action);
    }

    var vpath = buildVPath(vpath_root, route.path)
      , logger = buildLogger(opts.logger, action, method, vpath)
      , authorized = (!_.isUndefined(route.authorized) ? route : preset).authorized !== false
      , authorizer = authorized ? opts.authorizer : undefined
      , validators = buildValidatorChain(vpath, handler, preset.validator, route.validator)
      , middlewares = buildMiddlewareChain(logger, authorizer, preset.middleware, route.middleware, validators)
    ;

    app[method](vpath, middlewares);

    if (_.isFunction(opts.logger)) {
      opts.logger(util.format('[exprest4] app.%s("%s") loaded.', method, vpath));
    }
  });
}

function loadControllers(app, opts, files)
{
  return Promise.all(
    _.map(files, function(file) {
      return new Promise(function(resolved, rejected) {
        try {
          loadOneController(app, opts, file);
          resolved();
        }
        catch (err) {
          rejected(err);
        }
      });
    })
  );
}

module.exports.route = function(app, opts) {
  opts = buildOptions(opts);
  return new Promise(function(resolved, rejected) {
    fs.readdir(opts.controllers, function(err, files) {
      err ?
        rejected(err) :
        loadControllers(app, opts, files).then(resolved, rejected);
    });
  });
}
